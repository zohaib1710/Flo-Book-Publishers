<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailerException;
use PHPMailer\PHPMailer\PHPMailer;

const MAX_REQUEST_BYTES = 65536;
const MIN_COMPLETION_SECONDS = 3;
const MAX_FORM_AGE_SECONDS = 86400;
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 900;
const SMS_CONSENT_TEXT = 'By providing a telephone number and submitting this form, I consent to receive SMS text messages from FLO Book Publishers.';

function respond(int $status, bool $success, string $message): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    if ($status === 405) {
        header('Allow: POST');
    }
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    exit;
}

function escape_html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function string_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function normalize_host(string $host): string
{
    $host = strtolower(trim($host));
    if ($host === '') {
        return '';
    }

    $parsed = parse_url(str_contains($host, '://') ? $host : 'http://' . $host, PHP_URL_HOST);
    return is_string($parsed) ? strtolower(rtrim($parsed, '.')) : '';
}

function request_url_matches_host(string $url, string $requestHost): bool
{
    $host = parse_url($url, PHP_URL_HOST);
    return is_string($host) && strtolower(rtrim($host, '.')) === $requestHost;
}

function consume_rate_limit(string $directory, string $clientIp, int $limit, int $windowSeconds): bool
{
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Rate-limit directory could not be created.');
    }
    if (!is_writable($directory)) {
        throw new RuntimeException('Rate-limit directory is not writable.');
    }

    $file = $directory . DIRECTORY_SEPARATOR . hash('sha256', $clientIp) . '.json';
    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Rate-limit record could not be opened.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Rate-limit record could not be locked.');
        }

        rewind($handle);
        $contents = stream_get_contents($handle);
        $decoded = is_string($contents) && $contents !== '' ? json_decode($contents, true) : [];
        if (!is_array($decoded)) {
            $decoded = [];
        }

        $now = time();
        $cutoff = $now - $windowSeconds;
        $attempts = array_values(array_filter($decoded, static function ($timestamp) use ($cutoff): bool {
            return is_int($timestamp) && $timestamp >= $cutoff;
        }));

        if (count($attempts) >= $limit) {
            flock($handle, LOCK_UN);
            return false;
        }

        $attempts[] = $now;
        $encoded = json_encode($attempts);
        $written = is_string($encoded) && ftruncate($handle, 0) && rewind($handle)
            ? fwrite($handle, $encoded)
            : false;
        if (!is_string($encoded) || $written !== strlen($encoded) || !fflush($handle)) {
            throw new RuntimeException('Rate-limit record could not be saved.');
        }
        @chmod($file, 0600);
        flock($handle, LOCK_UN);
        return true;
    } finally {
        fclose($handle);
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false, 'This endpoint accepts form submissions only.');
}

$contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
if ($contentLength > MAX_REQUEST_BYTES) {
    respond(413, false, 'The form submission is too large. Please shorten your message and try again.');
}

$scalarFields = [
    'name', 'phone', 'email', 'message', 'manuscript_ready', 'published_before',
    'book_type', 'service', 'sms_consent', 'form_source', 'source_page',
    'form_started_at', 'website',
];
foreach ($scalarFields as $field) {
    if (isset($_POST[$field]) && !is_string($_POST[$field])) {
        respond(422, false, 'Please check the form fields and try again.');
    }
}

$unexpectedFields = array_diff(array_keys($_POST), $scalarFields);
if ($unexpectedFields !== []) {
    respond(422, false, 'Please check the form fields and try again.');
}

$honeypot = trim((string) ($_POST['website'] ?? ''));
if ($honeypot !== '') {
    respond(200, true, 'Thank you. Your message has been sent successfully.');
}

$configOverride = getenv('FORM_SMTP_CONFIG');
$configPath = is_string($configOverride) && trim($configOverride) !== ''
    ? trim($configOverride)
    : dirname(__DIR__) . DIRECTORY_SEPARATOR . 'site-private' . DIRECTORY_SEPARATOR . 'smtp-config.php';

if (!is_file($configPath)) {
    error_log('Website form SMTP configuration file is missing.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

$config = require $configPath;
if (!is_array($config)) {
    error_log('Website form SMTP configuration is invalid.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

$requiredConfig = [
    'smtp_host', 'smtp_port', 'smtp_encryption', 'smtp_username', 'smtp_password',
    'smtp_from_email', 'smtp_to_email', 'allowed_hosts',
];
if (array_keys($config) !== $requiredConfig) {
    error_log('Website form SMTP configuration keys are invalid.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

foreach (array_slice($requiredConfig, 0, 7) as $key) {
    if ((!is_string($config[$key]) && !is_int($config[$key])) || trim((string) $config[$key]) === '') {
        error_log('Website form SMTP configuration is incomplete.');
        respond(500, false, "Sorry, we couldn't send your message. Please try again.");
    }
}

if ((string) $config['smtp_password'] === 'YOUR_HOSTINGER_EMAIL_PASSWORD_HERE' ||
    strtolower((string) $config['smtp_host']) !== 'smtp.hostinger.com' ||
    (int) $config['smtp_port'] !== 465 ||
    strtolower((string) $config['smtp_encryption']) !== 'smtps' ||
    filter_var($config['smtp_username'], FILTER_VALIDATE_EMAIL) === false ||
    filter_var($config['smtp_from_email'], FILTER_VALIDATE_EMAIL) === false ||
    filter_var($config['smtp_to_email'], FILTER_VALIDATE_EMAIL) === false ||
    strcasecmp((string) $config['smtp_username'], (string) $config['smtp_from_email']) !== 0 ||
    !is_array($config['allowed_hosts']) ||
    $config['allowed_hosts'] === []) {
    error_log('Website form SMTP configuration values are invalid.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

$allowedHosts = [];
foreach ($config['allowed_hosts'] as $allowedHost) {
    if (!is_string($allowedHost)) {
        error_log('Website form allowed-host configuration is invalid.');
        respond(500, false, "Sorry, we couldn't send your message. Please try again.");
    }
    $normalizedHost = normalize_host($allowedHost);
    if ($normalizedHost !== '') {
        $allowedHosts[] = $normalizedHost;
    }
}
$allowedHosts = array_values(array_unique($allowedHosts));
if ($allowedHosts === []) {
    error_log('Website form allowed-host configuration is empty.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

$requestHost = normalize_host((string) ($_SERVER['HTTP_HOST'] ?? ''));
$origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
$referer = trim((string) ($_SERVER['HTTP_REFERER'] ?? ''));
if ($requestHost === '' || !in_array($requestHost, $allowedHosts, true) ||
    ($origin !== '' && !request_url_matches_host($origin, $requestHost)) ||
    ($origin === '' && $referer !== '' && !request_url_matches_host($referer, $requestHost))) {
    respond(422, false, 'This form submission could not be verified. Please refresh the page and try again.');
}

$pageLabels = [
    'home' => 'Home',
    'about-us' => 'About Us',
    'audio-book-services' => 'Audiobook Services',
    'author-website-services' => 'Author Website Services',
    'book-cover-design-services' => 'Book Cover Design Services',
    'book-editing-services' => 'Book Editing Services',
    'book-marketing-services' => 'Book Marketing Services',
    'contact-us' => 'Contact Us',
    'ebook-publishing-services' => 'eBook Publishing Services',
    'ghostwriting-services' => 'Ghostwriting Services',
    'illustration-design-services' => 'Illustration Design Services',
    'portfolio' => 'Portfolio',
    'privacy-policy' => 'Privacy Policy',
    'reviews' => 'Reviews',
    'terms-and-conditions' => 'Terms and Conditions',
];
$sourceLabels = [
    'publishing_enquiry' => 'Publishing Enquiry',
    'contact_message' => 'Contact Message',
    'publishing_popup' => 'Publishing Journey Popup',
];
$allowedSourcePages = [
    'publishing_enquiry' => [
        'home', 'audio-book-services', 'author-website-services', 'book-cover-design-services',
        'book-editing-services', 'book-marketing-services', 'contact-us',
        'ebook-publishing-services', 'ghostwriting-services',
        'illustration-design-services', 'portfolio',
    ],
    'contact_message' => [
        'home', 'about-us', 'audio-book-services', 'author-website-services',
        'book-cover-design-services', 'book-editing-services', 'book-marketing-services',
        'ebook-publishing-services', 'ghostwriting-services', 'illustration-design-services',
    ],
    'publishing_popup' => array_keys($pageLabels),
];

$formSource = trim((string) ($_POST['form_source'] ?? ''));
$sourcePage = trim((string) ($_POST['source_page'] ?? ''));
if (!isset($sourceLabels[$formSource], $pageLabels[$sourcePage]) ||
    !in_array($sourcePage, $allowedSourcePages[$formSource] ?? [], true)) {
    respond(422, false, 'This form submission could not be verified. Please refresh the page and try again.');
}

$startedRaw = trim((string) ($_POST['form_started_at'] ?? ''));
if ($startedRaw === '' || preg_match('/^\d+$/', $startedRaw) !== 1) {
    respond(422, false, 'This form submission could not be verified. Please refresh the page and try again.');
}
$elapsed = time() - (int) $startedRaw;
if ($elapsed < MIN_COMPLETION_SECONDS || $elapsed > MAX_FORM_AGE_SECONDS) {
    respond(422, false, 'Please take a moment to review the form, then submit it again.');
}

$clientIp = trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
if (filter_var($clientIp, FILTER_VALIDATE_IP) === false) {
    error_log('Website form client address is unavailable.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

try {
    $rateLimitDirectory = dirname($configPath) . DIRECTORY_SEPARATOR . 'rate-limits';
    if (!consume_rate_limit($rateLimitDirectory, $clientIp, RATE_LIMIT_ATTEMPTS, RATE_LIMIT_WINDOW_SECONDS)) {
        respond(429, false, 'Too many submissions were received. Please wait a few minutes and try again.');
    }
} catch (Throwable $exception) {
    error_log('Website form rate limiting failed.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

$baseAllowedFields = [
    'name', 'phone', 'email', 'sms_consent', 'form_source', 'source_page',
    'form_started_at', 'website',
];
$schemaFields = $formSource === 'contact_message'
    ? array_merge($baseAllowedFields, ['message'])
    : array_merge($baseAllowedFields, ['manuscript_ready', 'published_before', 'book_type', 'service']);
foreach ($scalarFields as $field) {
    if (!in_array($field, $schemaFields, true) && isset($_POST[$field]) && trim((string) $_POST[$field]) !== '') {
        respond(422, false, 'Please check the form fields and try again.');
    }
}

$name = preg_replace('/\s+/u', ' ', trim((string) ($_POST['name'] ?? '')));
$phone = trim((string) ($_POST['phone'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$smsConsent = trim((string) ($_POST['sms_consent'] ?? ''));
if (!is_string($name) || string_length($name) < 2 || string_length($name) > 120 ||
    preg_match('/[\p{L}\p{N}]/u', $name) !== 1 || preg_match('/[\x00-\x1F\x7F]/u', $name) === 1) {
    respond(422, false, 'Please enter a valid name.');
}

$phoneDigits = preg_replace('/\D+/', '', $phone);
if (!is_string($phoneDigits) || strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15 ||
    preg_match('/^\+?[0-9().\s-]{10,30}$/', $phone) !== 1) {
    respond(422, false, 'Please enter a valid phone number.');
}
if (string_length($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false || preg_match('/[\r\n]/', $email) === 1) {
    respond(422, false, 'Please enter a valid email address.');
}
if (!hash_equals(SMS_CONSENT_TEXT, $smsConsent)) {
    respond(422, false, 'Please confirm the SMS consent option.');
}

$fieldRows = [
    'Name' => $name,
    'Phone' => $phone,
    'Email' => $email,
];
if ($formSource === 'contact_message') {
    $message = trim((string) ($_POST['message'] ?? ''));
    if ($message === '' || string_length($message) > 5000 || preg_match('//u', $message) !== 1 ||
        preg_match('/[\x00\x08\x0B\x0C\x0E-\x1F\x7F]/', $message) === 1) {
        respond(422, false, 'Please enter a valid message of 5000 characters or fewer.');
    }
    $fieldRows['Message'] = $message;
} else {
    $enumFields = [
        'manuscript_ready' => ['label' => 'Manuscript Ready', 'values' => ['Yes', 'No', 'In Progress']],
        'published_before' => ['label' => 'Published Before', 'values' => ['Yes', 'No', 'In Progress']],
        'book_type' => ['label' => 'Book Type', 'values' => ['Fiction', 'Non-Fiction', 'Academic', 'Other']],
        'service' => ['label' => 'Requested Service', 'values' => [
            'Self Publishing', 'Proofreading', 'Cover Design', 'Book Marketing',
            'Audiobook', 'Editing', 'Formatting', 'Illustrations', 'Book Printing',
        ]],
    ];
    foreach ($enumFields as $field => $definition) {
        $value = trim((string) ($_POST[$field] ?? ''));
        if (!in_array($value, $definition['values'], true)) {
            respond(422, false, 'Please complete all publishing details using the available options.');
        }
        $fieldRows[$definition['label']] = $value;
    }
}
$fieldRows['SMS Consent'] = 'Confirmed';
$fieldRows['Form Type'] = $sourceLabels[$formSource];
$fieldRows['Source Page'] = $pageLabels[$sourcePage];
$submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';
$fieldRows['Submitted At'] = $submittedAt;

$plainLines = [
    'New FLO Book Publishers website enquiry',
    str_repeat('=', 39),
    '',
];
$htmlRows = '';
foreach ($fieldRows as $label => $value) {
    $plainValue = str_replace(["\r\n", "\r"], "\n", $value);
    $plainLines[] = $label . ': ' . $plainValue;
    $htmlValue = $label === 'Message'
        ? nl2br(escape_html($value), false)
        : escape_html($value);
    $htmlRows .= '<tr><td style="width:34%;padding:12px 16px;border-bottom:1px solid #dce7ed;color:#52636f;font-weight:700;vertical-align:top;">'
        . escape_html($label)
        . '</td><td style="padding:12px 16px;border-bottom:1px solid #dce7ed;color:#061e38;vertical-align:top;">'
        . $htmlValue . '</td></tr>';
}
$plainLines[] = '';
$plainLines[] = 'Reply to this email to respond directly to ' . $name . '.';
$plainBody = implode("\r\n", $plainLines);

$htmlBody = '<!doctype html><html><body style="margin:0;padding:0;background:#eef4f6;font-family:Arial,Helvetica,sans-serif;">'
    . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef4f6;padding:24px 12px;"><tr><td align="center">'
    . '<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 24px rgba(6,30,56,.12);">'
    . '<tr><td style="background:#061e38;padding:28px 32px;border-top:6px solid #50bac2;"><div style="color:#50bac2;font-size:13px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;">FLO Book Publishers</div>'
    . '<h1 style="margin:8px 0 0;color:#ffffff;font-size:25px;line-height:1.3;">New ' . escape_html($sourceLabels[$formSource]) . '</h1></td></tr>'
    . '<tr><td style="padding:28px 32px 18px;color:#334b5b;font-size:15px;line-height:1.6;">A new enquiry was submitted from the ' . escape_html($pageLabels[$sourcePage]) . ' page.</td></tr>'
    . '<tr><td style="padding:0 32px 30px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #dce7ed;border-radius:8px;border-collapse:separate;overflow:hidden;">'
    . $htmlRows . '</table></td></tr>'
    . '<tr><td style="padding:0 32px 32px;"><div style="background:#eaf8f9;border-left:4px solid #50bac2;border-radius:7px;padding:14px 16px;color:#244554;font-size:14px;line-height:1.5;">Reply to this email to respond directly to <strong>' . escape_html($name) . '</strong>.</div></td></tr>'
    . '</table></td></tr></table></body></html>';

require_once __DIR__ . '/assets/phpmailer/src/Exception.php';
require_once __DIR__ . '/assets/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/assets/phpmailer/src/SMTP.php';

try {
    $mailer = new PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = (string) $config['smtp_host'];
    $mailer->SMTPAuth = true;
    $mailer->Timeout = 15;
    $mailer->Username = (string) $config['smtp_username'];
    $mailer->Password = (string) $config['smtp_password'];
    $mailer->Port = (int) $config['smtp_port'];
    $mailer->SMTPSecure = strtolower((string) $config['smtp_encryption']) === 'smtps'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->CharSet = PHPMailer::CHARSET_UTF8;
    $mailer->setFrom((string) $config['smtp_from_email'], 'FLO Book Publishers Website');
    $mailer->addAddress((string) $config['smtp_to_email']);
    $mailer->addReplyTo($email, $name);
    $mailer->Subject = '[FLO Book Publishers] ' . $sourceLabels[$formSource] . ' - ' . $name;
    $mailer->isHTML(true);
    $mailer->Body = $htmlBody;
    $mailer->AltBody = $plainBody;
    $mailer->send();
} catch (MailerException $exception) {
    error_log('Website form delivery failed.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
} catch (Throwable $exception) {
    error_log('Website form processing failed.');
    respond(500, false, "Sorry, we couldn't send your message. Please try again.");
}

respond(200, true, 'Thank you. Your message has been sent successfully.');
