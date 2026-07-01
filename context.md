# FLO Book Publishers Project Context

## What this project is

This repository is a static marketing website for FLO Book Publishers. It is not an application with a build step, framework, package manager, or backend code. The site is made of standalone HTML pages that all share a common asset library in `assets/`.

The codebase appears to be an HTTrack mirror of the public site:

- Multiple files contain `Mirrored from flobookpublishers.com/... by HTTrack Website Copier`
- Mirrored timestamps in the HTML indicate capture around `Wed, 20 May 2026`
- Some third-party script URLs still use mirrored/localized paths rather than clean vendor URLs

In practical terms, this project is best understood as a root-served static website that was copied from production and then manually edited afterward.

## High-level architecture

The site has:

- 14 top-level HTML pages in the repo root
- 1 nested service page at `book-editing-services/index.html`
- Shared CSS in `assets/css/`
- Shared JS in `assets/js/`
- Shared fonts in `assets/fonts/`
- Large media libraries in `assets/images/`, `assets/service-animations/`, and hero videos in `assets/*.mp4`

There is no source-vs-build distinction. The HTML files in the repo are the pages that are served.

## Main page map

### Core marketing pages

- `index.html` - home page
- `about-us.html` - about page
- `contact-us.html` - contact page
- `portfolio.html` - portfolio/gallery page
- `reviews.html` - testimonials/reviews page

### Service pages

- `ghostwriting-services.html`
- `book-cover-design-services.html`
- `ebook-publishing-services.html`
- `audio-book-services.html`
- `book-marketing-services.html`
- `illustration-design-services.html`
- `author-website-services.html`
- `book-editing-services/index.html`

### Legal pages

- `privacy-policy.html`
- `terms-and-conditions.html`

## Body-class based page families

The site uses body classes to drive large styling differences.

- `body.home-page` - home page
- `body.about-page` - about page
- `body.ghostwriting-page` - shared service-page styling, used by most service pages including pages that are not ghostwriting
- `body.contact-page` - contact page overrides
- `body.portfolio-page` - portfolio page
- `body.reviews-page` - reviews page
- `body.legal-page` - legal page overrides, used with `home-page`

Important note:

- Almost all service pages use `body class="ghostwriting-page"`, even when they are audiobook, marketing, illustration, author website, cover design, ebook publishing, or book editing pages. That means "ghostwriting-page" is really the generic service-page skin.

## Project structure

### Root HTML files

- Each main page is a separate HTML document
- Navigation is duplicated directly in each page
- Footer/contact sections are also duplicated directly in each page
- Modal markup is embedded per page rather than shared via includes

### `assets/css/`

Important CSS files:

- `style.css`
  - Main theme and component styling
  - Global colors, typography, general page sections
  - Loader styles
  - Sidebar styles, sections, cards, forms, and many reusable components
- `layout.css`
  - Legacy base layer
  - Font Awesome 4.7 `@font-face`
  - CSS reset and utility classes
- `header.css`
  - Unified fixed top bar and fixed header
  - Scroll-state header behavior
  - Dropdown menu styling
  - Header CTA styling
  - Hero/header spacing offsets
- `buttons.css`
  - Unified button treatment across non-header buttons
  - Hover lift and color normalization
- `new-service.css`
  - Shared styling for service-page sections and content blocks
  - Reusable service hero, writer/process, and CTA section styles
- `portfolio-style.css`
  - Legacy/alternate styles used by `portfolio.html`, `reviews.html`, and `contact-us.html`
- Vendor CSS:
  - `bootstrap.min.css`
  - `swiper.min.css`
  - `slick-slider.css`

### `assets/js/`

Important JS files:

- `custom.js`
  - Most of the global interactive behavior
  - LiveChat/Zendesk opening helper
  - Global click interception for chat buttons/links
  - AJAX Formspree submission for forms with `.flo-formspree-ajax-form`
  - Submit button success/error state handling
  - Mobile menu open/close
  - Sticky/scrolled header class toggle
  - Counter animation for `.about-counter`
  - Auto-wired scroll reveal animations
  - Hero logo Slick carousel
  - Testimonial Slick carousel
  - Popup textarea character counters
- `loader.js`
  - Removes the fullscreen loader after page load with a 1 second delay
- Vendor JS:
  - `jquery.min.js`
  - `bootstrap.min.js`
  - `slick-slider.min.js`
  - `swiper.min.js`

### Media assets

- `assets/images/`
  - Brand logos, icons, books, backgrounds, portfolio images, popup assets, service imagery
- `assets/service-animations/`
  - Short MP4 loops used for animated service cards and some about/home sections
- Hero/background videos in `assets/`
  - `home_hero_video.mp4`
  - `about_hero_video.mp4`
  - `ghostwriting_hero_video.mp4`
  - `book_editing_services_hero_video.mp4`
  - `book_cover_design_hero_video.mp4`
  - `ebook_hero_video.mp4`
  - `audio_book_hero_video.mp4`
  - `author_website_hero_video.mp4`
  - `illustration_hero_video.mp4`
  - `marketing_hero_video.mp4`

### Other files

- `assets/webinar.json`
  - Lottie/animation JSON file
  - I did not find active usage of this file in the HTML/JS that matters for the page rendering
- `context.md`
  - This documentation file

## Reusable page composition patterns

### Shared shell on most pages

Most pages include:

- GTM snippet in `<head>` plus `<noscript>` iframe
- Fixed left-side contact/social sidebar
- Fixed top bar
- Fixed header with logo, nav, services dropdown, and CTA buttons
- Main hero/banner section
- At least one lead form
- Repeated contact/footer-style CTA section
- Popup modal `#exampleModalCenter`
- Third-party chat integrations

### Service page pattern

Most service pages follow this rough shape:

1. Hero with background video, service-specific copy, and lead form
2. Mid-page service explanation / process sections
3. Several repeated CTA blocks
4. Testimonials
5. Contact form section
6. Address/contact/footer section
7. Popup modal form

The exact section class names differ, but `ghostwriting-services.html` and `book-editing-services/index.html` are good representative templates.

### Home page pattern

`index.html` is the richest template and includes:

- Video hero with lead form
- Sliding partner/logo band
- Intro/discovery sections
- Service cards with looping MP4 icon animations
- Portfolio Swiper
- Bestseller / process / testimonial content
- Contact and footer-style conversion sections
- Popup modal

### About page pattern

`about-us.html` is more editorial and includes:

- Video hero
- Mission/value split sections
- "Who we are" cards
- Vision/mission content
- FAQ accordion
- Contact/footer section
- Popup modal

### Contact page pattern

`contact-us.html` is simpler:

- Contact details block
- Main contact form
- CTA band
- Footer-style address/contact section
- Popup modal

### Portfolio and reviews pages

- `portfolio.html`
  - Uses `portfolio-style.css`
  - Showcases work samples and portfolio imagery
- `reviews.html`
  - Also uses `portfolio-style.css`
  - Contains testimonial cards and review-oriented styling

### Legal pages

- `privacy-policy.html`
- `terms-and-conditions.html`

These pages are lighter:

- They use the regular header/sidebar shell
- They contain legal copy in content sections
- They still include the popup modal and chat integrations
- They do not use the fullscreen page loader markup the way home/about/service/portfolio/reviews do

## Forms and conversion flow

Forms are central to the entire site. There are two main submission destinations.

### Formspree endpoints

Primary endpoint:

- `https://formspree.io/f/meewwrad`

Used for:

- Home hero form
- Service hero forms
- Contact page form
- Portfolio page form
- Popup redesign modal form

Secondary endpoint:

- `https://formspree.io/f/xnjyylqw`

Used for:

- Footer/contact-us style consultation forms on home/about/service pages

### Form behavior

Forms with class `.flo-formspree-ajax-form` are intercepted by `assets/js/custom.js` and submitted with `fetch()` as AJAX instead of a normal page reload.

Behavior includes:

- Prevent default submit
- Disable the submit button during submission
- Require reCAPTCHA response if present
- Show success state on the button
- Reset form after success
- Reset Google reCAPTCHA widget after success
- Show inline error message on failure

Some pages also still contain older jQuery submit handlers that only check reCAPTCHA and disable submit buttons. Those coexist with the newer global AJAX form handler.

### reCAPTCHA

The same reCAPTCHA site key is reused across pages:

- `6LcFs88pAAAAAKEmnNDQYaYlN3LIdIjPS-n4lym-`

### Popup modal

Many pages include a Bootstrap modal with id:

- `#exampleModalCenter`

It acts as a major lead capture surface.

Common behavior:

- Auto-opens after 20 seconds
- Does not auto-open if the current URL contains `"pay"`
- Contains the more detailed "popup redesign" form posting to `meewwrad`

## Navigation and routing assumptions

This site assumes root-based serving, not direct file browsing.

Evidence:

- Many internal links use absolute root-style paths such as `/ghostwriting-services.html`
- Some assets/scripts use absolute `/assets/...` references

Implication:

- If pages are opened directly from the filesystem, some links and assets may fail
- The site should be served from a web root for reliable behavior

## Third-party and tracking integrations

### Google Tag Manager

All pages include:

- GTM container `GTM-55Z5TZWK`

### AdRoll

Only the home page (`index.html`) includes AdRoll:

- `adroll_adv_id = "XFKY5PI3QRBMVFDBSVHW2N"`
- `adroll_pix_id = "E7MFKJLXH5DJVOIGIEHL6V"`

### Organization schema

Only the home page has JSON-LD organization schema.

It includes:

- Organization name
- URL
- Logo
- Email
- Mailing address
- Phone
- Social links

### Google site verification

Found on the home page and service pages:

- `-AqMld23HX5O-9LVlM1hO0ANvp5CtjhDVNQZ_qgGVh8`

### Facebook domain verification

Present broadly across pages:

- `qdd79j1oknwkl2zdfgdauevqmvyw8n`

### Live chat

There are two chat systems represented in the codebase:

1. LiveChat
   - license `19778423`
   - loaded near page bottom
   - `custom.js` can directly maximize it

2. Zendesk Web Widget
   - snippet id `ze-snippet`
   - key `2978a679-0e45-490f-9209-935b85e4ca55`
   - some pages register unread-message behavior that opens the widget

`custom.js` is written to support either system:

- Prefer `LiveChatWidget.call("maximize")`
- Fall back to `zE("webWidget", "open")`

This means many buttons labeled "Chat", "Live Chat", or similar are intended to open one of these widgets instead of navigating.

## Contact/business information repeated through the site

The repo consistently repeats the same business details:

- Phone: `+1 (407) 789-2593`
- Email: `info@flobookpublishers.com`
- Mailing address: `2630 W Broward Blvd Suit 204 #1134, Fort Lauderdale, FL 33312`
- WhatsApp: `https://wa.me/18623667271`
- Instagram: `https://www.instagram.com/flobookpublishers?igsh=MWlpZmJuNTVudnVsOA==`
- Facebook: `https://www.facebook.com/share/1CySjmcm8G/`

These values are duplicated in many pages rather than centralized.

## CSS ownership and responsibilities

This is the cleanest mental model for future edits.

### Use `header.css` for:

- Fixed top bar
- Header placement
- Scroll-state header behavior
- Dropdown menu behavior/look
- Header spacing offsets against heroes

### Use `buttons.css` for:

- Cross-site button color normalization
- Hover lift/animation
- Shared CTA button behavior outside the header

### Use `style.css` for:

- Global theme colors and typography
- Shared sections
- Loader visuals
- Shared forms and cards
- Miscellaneous marketing components

### Use `new-service.css` for:

- Shared service-page section patterns
- Service-specific content blocks
- Writer/process/story sections

### Use page-inline `<style>` blocks for:

- Page-specific hero video treatments
- Local overrides
- One-off layout tweaks per page

There are many page-local style blocks, especially in:

- `index.html`
- `about-us.html`
- `ghostwriting-services.html`
- `contact-us.html`
- `reviews.html`
- legal pages

## JavaScript behavior summary

### `assets/js/custom.js`

This is the main behavioral hub. It currently handles:

- Unified chat-button interception
- Global AJAX form handling for `.flo-formspree-ajax-form`
- Mobile menu toggling via `.menu-Bar` and `.menuWrap`
- Header scroll state (`header.is-scrolled`)
- Counter animation for `.about-counter`
- Auto-generated scroll reveal classes and observer-based entrance effects
- Popup redesign textarea character counters
- Slick initialization for `.hero-logo-slider`
- Slick initialization for `.testimonial-slider`

### Page-local inline JS

Many pages also add inline JS for:

- Swiper initialization
- Modal auto-open timing
- Accordion expand/collapse
- ReCAPTCHA pre-submit checks
- Page-specific sliders or tab interactions

There is meaningful duplication across pages.

## Home page details

`index.html` is the most customized page in the site.

Key distinctions:

- Only page with AdRoll
- Only page with organization schema
- Uses `home_hero_video.mp4`
- Uses animated service-card MP4 loops from `assets/service-animations/`
- Includes a partner/logo carousel, portfolio Swiper, testimonials, multiple CTA bands, and several forms

Main section classes:

- `banner-color home-hero-sec`
- `hero-logo-sec`
- `global-section`
- `hero-section`
- `services-sec`
- `home-discover-section`
- `portfolio`
- `ready-section`
- `bestseller-section`
- `contact-sec-new`
- `testimonial-sec`
- `contact_us_sec`

## About page details

`about-us.html` uses:

- `about_hero_video.mp4`
- Custom accordion styling
- About-specific content sections such as mission, vision, values, FAQ
- Some service-animation MP4 usage inside the page

Main section classes:

- `about-hero-sec`
- `about-split-section`
- `elevate-section`
- `who-we-are`
- `about-struggle-section`
- `about-vision-mission`
- `faq-section`
- `contact_us_sec`

## Service page details

Representative service pages:

- `ghostwriting-services.html`
- `book-editing-services/index.html`
- `book-cover-design-services.html`
- `ebook-publishing-services.html`
- `audio-book-services.html`
- `book-marketing-services.html`
- `illustration-design-services.html`
- `author-website-services.html`

Shared characteristics:

- Most use a hero video background
- Most use the `ghostwriting-page` body class
- Most include:
  - a hero lead form posting to `meewwrad`
  - a footer/contact form posting to `xnjyylqw`
  - testimonial section
  - popup modal posting to `meewwrad`

Common section classes on the newer service templates:

- `banner-color home-hero-sec`
- `book-writing`
- `story-writer story-writer-dark-buttons`
- `twosectionmixed`
- `testimonial-sec`
- `contact_us_sec`
- `contact-sec-new`

## Portfolio page details

`portfolio.html`:

- Uses `portfolio-style.css`
- Uses `portfolio-page` body class
- Contains portfolio/work showcase content and a lead form
- Includes modal and repeated footer contact block

## Reviews page details

`reviews.html`:

- Uses `portfolio-style.css`
- Uses `reviews-page` body class
- Contains styled testimonial cards and review-focused content
- Has custom inline testimonial styling
- Includes popup modal and footer contact block

## Legal page details

`privacy-policy.html` and `terms-and-conditions.html`:

- Use `home-page legal-page`
- Reuse the normal site shell
- Contain long-form legal text
- Include popup modal and chat integrations
- Do not appear to include the fullscreen loader markup

## Important maintenance quirks and risks

### 1. No shared templates

Header, footer, nav, modal, and contact sections are duplicated across pages.

Impact:

- Small global edits require touching many files
- Copy changes can drift out of sync
- Navigation bugs can be introduced page by page

### 2. Mixed old and new styling layers

The site uses:

- legacy layout/base styles
- newer unified header/button files
- page-local inline CSS
- page-specific CSS files

Impact:

- A visual change may require checking several CSS files plus page inline styles
- Specificity and load order matter a lot

### 3. Root-relative links and assets

Many pages rely on `/...` paths.

Impact:

- Direct file-open preview may not behave correctly
- A local static server is the safest way to preview changes

### 4. Mirrored third-party URLs

Some third-party script references are mirror-style paths, for example:

- GTM path references like `../www.googletagmanager.com/...`
- reCAPTCHA path references like `../www.google.com/recaptcha/api.js`

Impact:

- Some integrations may not behave exactly like the live production site when served locally

### 5. Duplicate form logic

There is both:

- newer AJAX handling in `custom.js`
- older page-level jQuery submit handlers

Impact:

- Form changes should be tested carefully
- It is easy to miss one layer when debugging submission behavior

### 6. Service pages are only partially normalized

They share a common structure, but each still embeds a lot of page-local HTML/CSS/JS.

Impact:

- Editing one service page does not automatically update the others

### 7. `book-editing-services/index.html` has extra path fragility

This file stands out for a few reasons:

- It lives in a subdirectory while most pages are at the root
- It uses mixed relative paths like `../..//assets/...` and `../assets/...`
- It contains an empty `<base >`
- Its Zendesk snippet source is malformed as `..static.zdassets.com/...` instead of a normal URL

Impact:

- This page is more likely to have path-related bugs than the root-level pages

## Likely "source of truth" pages for future edits

If someone needs to understand or extend the site quickly, these files are the best anchors:

- `index.html` - richest example of the full marketing stack
- `ghostwriting-services.html` - best representative modern service page
- `book-editing-services/index.html` - nested service page with path quirks
- `about-us.html` - about-specific pattern and FAQ behavior
- `contact-us.html` - simplest contact conversion page
- `assets/js/custom.js` - primary shared behavior
- `assets/css/header.css` - header/nav system
- `assets/css/buttons.css` - unified CTA/button system
- `assets/css/style.css` - major global visual system
- `assets/css/new-service.css` - service-page building blocks

## Recommended mental model for editing

When changing this project, think in this order:

1. Is this a one-page content change or a cross-site shell change?
2. If it is cross-site, which duplicated HTML pages need the same update?
3. Is the visual rule controlled by inline page CSS, `style.css`, `header.css`, `buttons.css`, or `new-service.css`?
4. Is the interaction controlled by page-local inline JS or `assets/js/custom.js`?
5. Does the change affect one of the two Formspree flows, reCAPTCHA, the modal, or chat widgets?

## Bottom line

This repository is a manually maintained static marketing site built from duplicated HTML pages plus a shared asset layer. The main engineering challenges are not framework complexity but duplication, mixed styling layers, mirrored external URLs, and path consistency. The core reusable systems are the header, buttons, forms, chat integrations, service-page structure, and shared visual assets.
