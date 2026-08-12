(function () {
  "use strict";

  const trustpilotSnapshot = {
    company: {
      name: "Flo Book Publishers",
      domain: "flobookpublishers.com",
      profileUrl: "https://uk.trustpilot.com/review/flobookpublishers.com",
      websiteUrl: "https://flobookpublishers.com/",
      writeReviewUrl: "https://uk.trustpilot.com/evaluate/flobookpublishers.com",
      claimed: "Claimed profile · June 2026",
      category: "Multimedia and Electronic Book Publisher",
      categoryUrl: "https://uk.trustpilot.com/categories/multimedia_and_electronic_book_publisher",
      description: "Flo Book Publishers is dedicated to helping authors transform their ideas into professionally published books. We provide comprehensive publishing solutions designed to guide writers through every stage of the publishing journey. Whether you’re publishing your first manuscript or expanding your author portfolio, our experienced team is here to support your goals. From meticulous editing and professional formatting to captivating cover design, publishing assistance and strategic marketing, we deliver personalized services tailored to your vision. At Flo Book Publishers, we are committed to quality, creativity and author success, ensuring every book reaches its full potential and connects with readers worldwide.",
      address: "2630 W Broward Blvd Suite 204 #1134, 33312, Fort Lauderdale, United States",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=2630+W+Broward+Blvd+Suite+204+%231134+Fort+Lauderdale+FL+33312",
      phone: "(407) 789-2593",
      phoneUrl: "tel:+14077892593",
      email: "info@flobookpublishers.com",
      emailUrl: "mailto:info@flobookpublishers.com"
    },
    rating: {
      score: "3.8",
      label: "Great",
      reviewCount: 2,
      distribution: [
        { label: "5-star", percent: 100 },
        { label: "4-star", percent: 0 },
        { label: "3-star", percent: 0 },
        { label: "2-star", percent: 0 },
        { label: "1-star", percent: 0 }
      ]
    },
    relatedCompanies: [
      { logo: "assets/prime-book.svg", name: "Prime Book Publishing Labs", domain: "primebookpublishinglabs.com", score: "3.6", reviews: "1", url: "https://uk.trustpilot.com/review/primebookpublishinglabs.com" },
      { logo: "assets/spines.svg", name: "Spines", domain: "spines.com", score: "4.6", reviews: "910", url: "https://uk.trustpilot.com/review/spines.com" },
      { logo: "assets/prime-publishing.svg", name: "Prime Publishing Labs", domain: "primepublishinglabs.com", score: "4.4", reviews: "86", url: "https://uk.trustpilot.com/review/primepublishinglabs.com" },
      { logo: "assets/decker.svg", name: "The Decker Press", domain: "thedeckerpress.com", score: "4.2", reviews: "6", url: "https://uk.trustpilot.com/review/thedeckerpress.com" }
    ],
    reviews: [
      {
        id: "customer",
        initials: "CU",
        avatarClass: "orange",
        reviewer: "customer",
        reviewerUrl: null,
        country: "US",
        reviewCount: "1 review",
        published: "Jul 8, 2026",
        experience: "30 June 2026",
        experienceIso: "2026-06-30",
        title: "What a smooth and seamless experience…",
        body: "What a smooth and seamless experience with these guys cant wait to see my book doing millions now.",
        verified: true
      },
      {
        id: "katelin-sarria",
        initials: "KS",
        avatarClass: "pink",
        reviewer: "Katelin Sarria",
        reviewerUrl: null,
        country: "US",
        reviewCount: "2 reviews",
        published: "Jul 7, 2026",
        experience: "24 June 2026",
        experienceIso: "2026-06-24",
        title: "My journey with the team has been an…",
        body: "My journey with the team has been an amazing experience. I wasn’t sure how to get my book in front of readers but thankfully I chose the right people to help me. My project manager Alex guided me through every step from building my author website to planning the marketing. They were patient with all my questions, kept me informed throughout the process and their team handled everything professionally. I truly appreciate the support I received and couldn’t be happier with the experience.",
        verified: true
      }
    ],
    experienceItems: [
      { title: "We’re open to all", body: "Anyone can write a Trustpilot review. People who write reviews have ownership to edit or delete them at any time, and they’ll be displayed as long as an account is active." },
      { title: "We fight fake reviews", body: "We use dedicated people and technology to safeguard our platform. Our automated systems and specialists work to identify and remove fake reviews." },
      { title: "We show the latest reviews", body: "Reviews appear in chronological order and company TrustScores are continuously recalculated as new reviews are published." },
      { title: "We encourage constructive feedback", body: "Useful, constructive feedback helps consumers make better choices and gives companies information they can act on." },
      { title: "We verify reviewers", body: "Companies can invite customers to write reviews, and Trustpilot applies labels that explain how each review was collected." },
      { title: "We advocate against bias", body: "Companies cannot pay to hide reviews or influence which reviews are published. Review content reflects the reviewer’s own experience." }
    ]
  };

  const links = {
    home: "https://uk.trustpilot.com/",
    categories: "https://uk.trustpilot.com/categories",
    blog: "https://uk.trustpilot.com/blog",
    login: "https://uk.trustpilot.com/users/connect",
    business: "https://business.trustpilot.com/",
    trustScore: "https://support.trustpilot.com/hc/en-us/articles/201748946-TrustScore-and-star-rating-explained",
    reviewInvitations: "https://support.trustpilot.com/hc/en-us/articles/223402468",
    transparency: "https://uk.trustpilot.com/trust/how-reviews-work",
    labels: "https://support.trustpilot.com/hc/en-us/articles/360015085894",
    experience: "https://uk.trustpilot.com/trust",
    appStore: "https://apps.apple.com/app/trustpilot-reviews-ratings/id1608392803"
  };

  function icon(name, className) {
    const paths = {
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v7H4V6h7"/>',
      pencil: '<path d="m4 20 4.2-1L19 8.2 15.8 5 5 15.8 4 20ZM13.8 7l3.2 3.2"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
      chevron: '<path d="m8 10 4 4 4-4"/>',
      right: '<path d="m9 18 6-6-6-6"/>',
      left: '<path d="m15 18-6-6 6-6"/>',
      shield: '<path d="M12 3 4.5 6v5.5c0 4.7 3 7.8 7.5 9.5 4.5-1.7 7.5-4.8 7.5-9.5V6L12 3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
      send: '<path d="m3 11 18-8-7 18-3-7-8-3Z"/><path d="m11 14 4-4"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
      phone: '<path d="M5 3h4l2 5-2.5 1.5a15 15 0 0 0 6 6L16 13l5 2v4c0 1.1-.9 2-2 2C10.2 20.5 3.5 13.8 3 5a2 2 0 0 1 2-2Z"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/>',
      globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
      sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
      useful: '<path d="M8 21H4V10h4M8 19h9.5a2 2 0 0 0 2-1.7l1-6A2 2 0 0 0 18.5 9H14l1-4c.3-1.4-.8-2.7-2.2-2.7L8 10v9Z"/>',
      share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8 11 7.5-4.5M8 13l7.5 4.5"/>',
      flag: '<path d="M5 21V4M5 5h12l-2 4 2 4H5"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>'
    };
    return '<svg class="tp-icon ' + (className || "") + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</svg>';
  }

  function trustpilotLogo(modifier) {
    return '<span class="tp-brand ' + (modifier || "") + '"><img src="../assets/images/Trustpilot-Logo.png" width="128" height="31" alt="Trustpilot"></span>';
  }

  function starTiles(count, sizeClass) {
    let stars = "";
    for (let i = 0; i < 5; i += 1) {
      stars += '<span class="tp-star-tile ' + (i < count ? "is-filled" : "") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.7 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.6-4.5 6.4-.9L12 2.7Z"/></svg></span>';
    }
    return '<span class="tp-stars ' + (sizeClass || "") + '" role="img" aria-label="Rated 5 out of 5 stars">' + stars + '</span>';
  }

  function renderHeader() {
    return '<header class="tp-header">' +
      '<div class="tp-header__inner tp-container">' +
        '<a class="tp-header__logo" href="' + links.home + '" aria-label="Trustpilot home">' + trustpilotLogo() + '</a>' +
        '<nav class="tp-header__desktop" aria-label="Primary navigation">' +
          '<a href="' + links.categories + '">Categories</a>' +
          '<a href="' + links.blog + '">Blog</a>' +
          '<a class="tp-header__icon" href="' + links.login + '" aria-label="Notifications">' + icon("bell") + '</a>' +
          '<a href="' + links.login + '">Log in</a>' +
          '<a class="tp-business-button" href="' + links.business + '">For businesses</a>' +
        '</nav>' +
        '<div class="tp-header__mobile">' +
          '<a href="' + links.login + '" aria-label="Notifications">' + icon("bell") + '</a>' +
          '<a href="' + links.login + '" aria-label="Log in">' + icon("user") + '</a>' +
          '<button class="tp-menu-button" type="button" aria-label="Open menu" aria-controls="tp-mobile-menu" aria-expanded="false">' + icon("menu") + '</button>' +
        '</div>' +
      '</div>' +
      '<nav id="tp-mobile-menu" class="tp-mobile-menu" aria-label="Mobile navigation" hidden>' +
        '<div class="tp-mobile-menu__top"><strong>Menu</strong><button type="button" class="tp-menu-close" aria-label="Close menu">' + icon("close") + '</button></div>' +
        '<a href="' + links.categories + '">Categories</a><a href="' + links.blog + '">Blog</a><a href="' + links.login + '">Log in</a><a href="' + links.business + '">For businesses</a>' +
      '</nav>' +
    '</header>';
  }

  function renderBreadcrumbs() {
    const items = [
      ["Media & Publishing", "https://uk.trustpilot.com/categories/media_publishing"],
      ["Books & Magazines", "https://uk.trustpilot.com/categories/books_magazines"],
      [trustpilotSnapshot.company.category, trustpilotSnapshot.company.categoryUrl],
      [trustpilotSnapshot.company.name, trustpilotSnapshot.company.profileUrl]
    ];
    return '<div class="tp-breadcrumbs"><nav class="tp-container" aria-label="Breadcrumb">' + items.map(function (item, index) {
      return (index ? '<span aria-hidden="true">›</span>' : '') + '<a href="' + item[1] + '"' + (index === items.length - 1 ? ' aria-current="page"' : '') + '>' + item[0] + '</a>';
    }).join("") + '</nav></div>';
  }

  function renderRatingCard(compact) {
    const rating = trustpilotSnapshot.rating;
    return '<section class="tp-rating-card ' + (compact ? "is-compact" : "") + '" aria-label="TrustScore ' + rating.score + ' out of 5">' +
      '<div class="tp-rating-card__main">' +
        '<div class="tp-rating-card__score"><strong>' + rating.score + '</strong><span>' + rating.label + '</span>' + starTiles(4, "is-small") + '<small>' + rating.reviewCount + ' reviews</small></div>' +
        '<div class="tp-rating-card__bars">' + rating.distribution.map(function (row) {
          return '<div class="tp-rating-mini-row"><span>' + row.label + '</span><i><b style="width:' + row.percent + '%"></b></i></div>';
        }).join("") + '</div>' +
      '</div>' +
      '<a class="tp-rating-card__link" href="' + links.trustScore + '">How is the TrustScore calculated?</a>' +
    '</section>';
  }

  function renderProfile() {
    const c = trustpilotSnapshot.company;
    return '<main>' +
      '<section class="tp-profile-wrap">' +
        '<div class="tp-container tp-profile-grid">' +
          '<div class="tp-profile-main">' +
            '<div class="tp-profile-summary">' +
              '<div class="tp-company-logo"><img src="../assets/images/new-logo.png" width="154" height="49" alt="Flo Book Publishers"></div>' +
              '<div class="tp-profile-copy">' +
                '<div class="tp-claimed">' + icon("check") + '<span>' + c.claimed + '</span></div>' +
                '<h1>' + c.name + '</h1>' +
                '<div class="tp-inline-rating"><a href="#all-reviews">Reviews ' + trustpilotSnapshot.rating.reviewCount + '</a><span>•</span>' + starTiles(4, "is-inline") + '<span>•</span><strong>' + trustpilotSnapshot.rating.score + '</strong>' + icon("info") + '</div>' +
                '<a class="tp-category-link" href="' + c.categoryUrl + '">' + c.category + '</a>' +
                '<div class="tp-profile-actions"><a class="tp-button tp-button--primary" href="' + c.writeReviewUrl + '">' + icon("pencil") + 'Write a review</a><a class="tp-button tp-button--secondary" href="' + c.websiteUrl + '">Visit website' + icon("external") + '</a></div>' +
              '</div>' +
            '</div>' +
            '<div class="tp-mobile-rating">' + renderRatingCard(true) +
              '<div class="tp-mobile-info">' +
                '<a class="tp-info-card" href="' + links.reviewInvitations + '"><span>' + icon("send") + '</span><div><strong>Asks customers to review</strong><small>This company invites their customers to review, whether positive or negative</small></div></a>' +
                '<a class="tp-info-card" href="' + links.transparency + '"><span>' + icon("chart") + '</span><div><strong>How this company uses Trustpilot</strong><small>See how their reviews and ratings are sourced, scored, and moderated</small></div>' + icon("external") + '</a>' +
              '</div>' +
            '</div>' +
            '<a class="tp-integrity" href="' + links.transparency + '">' +
              '<span class="tp-integrity__icon">' + icon("shield") + '</span><span>We use technology to protect platform integrity, but we don’t fact-check reviews</span>' + icon("chevron") +
            '</a>' +
            '<section class="tp-company-details" aria-labelledby="company-details-title">' +
              '<div class="tp-section-heading"><h2 id="company-details-title">Company details</h2><a href="' + c.categoryUrl + '">' + c.category + '</a>' + icon("info") + '</div>' +
              '<div class="tp-company-description"><h3>Written by the company</h3><p id="tp-company-description">' + c.description + '</p><button type="button" class="tp-see-more" aria-controls="tp-company-description" aria-expanded="false">See more</button></div>' +
            '</section>' +
            '<section class="tp-contact" aria-labelledby="contact-title"><h2 id="contact-title">Contact info</h2>' +
              '<div class="tp-contact-list"><a href="' + c.mapUrl + '">' + icon("location") + '<span>' + c.address + '</span></a><a href="' + c.phoneUrl + '">' + icon("phone") + '<span>' + c.phone + '</span></a><a href="' + c.emailUrl + '">' + icon("mail") + '<span>' + c.email + '</span></a><a href="' + c.websiteUrl + '">' + icon("globe") + '<span>' + c.domain + '</span></a></div>' +
            '</section>' +
          '</div>' +
          '<aside class="tp-sidebar">' + renderRatingCard(false) +
            '<a class="tp-info-card" href="' + links.reviewInvitations + '"><span>' + icon("send") + '</span><div><strong>Asks customers to review</strong><small>This company invites their customers to review, whether positive or negative</small></div></a>' +
            '<a class="tp-info-card" href="' + links.transparency + '"><span>' + icon("chart") + '</span><div><strong>How this company uses Trustpilot</strong><small>See how their reviews and ratings are sourced, scored, and moderated</small></div>' + icon("external") + '</a>' +
          '</aside>' +
        '</div>' +
      '</section>' + renderRelatedCompanies() + renderReviews() + '</main>';
  }

  function renderRelatedCompanies() {
    return '<section class="tp-related" aria-labelledby="related-title"><div class="tp-container">' +
      '<div class="tp-related__heading"><h2 id="related-title">People also looked at ' + icon("info") + '</h2><div class="tp-carousel-buttons"><button type="button" class="tp-carousel-prev" aria-label="Previous companies">' + icon("left") + '</button><button type="button" class="tp-carousel-next" aria-label="Next companies">' + icon("right") + '</button></div></div>' +
      '<div class="tp-related-track">' + trustpilotSnapshot.relatedCompanies.map(function (company) {
        return '<a class="tp-related-card" href="' + company.url + '"><img class="tp-company-mark" src="' + company.logo + '" width="62" height="54" alt="' + company.name + ' logo"><strong>' + company.name + '</strong><small>' + company.domain + '</small><span class="tp-related-rating">' + starTiles(4, "is-tiny") + '<span>' + company.score + ' (' + company.reviews + ')</span></span></a>';
      }).join("") + '</div>' +
    '</div></section>';
  }

  function renderDistribution() {
    return '<div class="tp-distribution">' + trustpilotSnapshot.rating.distribution.map(function (row) {
      return '<label class="tp-distribution-row"><input type="checkbox" ' + (row.percent === 0 ? 'disabled' : '') + '><span>' + row.label + '</span><i><b style="width:' + row.percent + '%"></b></i><em>' + row.percent + '%</em></label>';
    }).join("") + '</div>';
  }

  function renderReviews() {
    return '<section id="all-reviews" class="tp-reviews" aria-labelledby="reviews-title"><div class="tp-container tp-reviews-grid">' +
      '<aside class="tp-reviews-summary">' +
        '<div class="tp-score-heading"><svg viewBox="0 0 32 31" aria-hidden="true"><path fill="#73cf11" d="m16 0 3.7 11.3h11.9l-9.6 7 3.6 11.4-9.6-7-9.6 7L10 18.3l-9.6-7h11.9L16 0Z"/></svg><strong>' + trustpilotSnapshot.rating.score + '</strong>' + icon("info") + '</div>' +
        '<h2 id="reviews-title">All reviews <span>(' + trustpilotSnapshot.rating.reviewCount + ')</span></h2><p>2 reviews in the last 12 months</p><a class="tp-small-review-button" href="' + trustpilotSnapshot.company.writeReviewUrl + '">' + icon("pencil") + 'Write a review</a><p class="tp-check-copy">We perform checks on reviews ' + icon("info") + '</p>' +
        renderDistribution() + '<a class="tp-label-link" href="' + links.labels + '">How Trustpilot labels reviews ' + icon("external") + '</a>' +
      '</aside>' +
      '<div class="tp-review-column">' +
        '<div class="tp-review-notice">' + icon("info") + '<span>Companies on Trustpilot aren’t allowed to offer incentives or pay to hide reviews. Reviews are the opinions of individual users and not of Trustpilot. <a href="' + links.labels + '">Read more</a></span></div>' +
        '<div class="tp-review-controls">' +
          '<label class="tp-review-search">' + icon("search") + '<span class="tp-sr-only">Search reviews</span><input id="tp-review-search" type="search" placeholder="Search by keyword…" autocomplete="off"></label>' +
          '<div class="tp-filter-row"><button type="button" class="tp-filter-button" aria-expanded="false" aria-controls="tp-filter-popover">More filters ' + icon("sliders") + '</button><label class="tp-sort"><span class="tp-sr-only">Sort reviews</span><select id="tp-review-sort"><option value="recent">Most recent</option><option value="oldest">Oldest</option></select>' + icon("chevron") + '</label></div>' +
          '<div id="tp-filter-popover" class="tp-filter-popover" hidden><label><input id="tp-filter-verified" type="checkbox"> Verified reviews</label><label><input id="tp-filter-five" type="checkbox"> 5-star reviews</label><button id="tp-clear-filters" type="button">Clear filters</button></div>' +
        '</div>' +
        '<div id="tp-review-list" class="tp-review-list"></div>' +
        '<nav class="tp-pagination" aria-label="Review pages"><button type="button" disabled>Previous</button><span aria-current="page">1</span><button type="button" disabled>Next page</button></nav>' +
        renderExperience() +
      '</div>' +
    '</div></section>';
  }

  function renderReviewCard(review) {
    const reviewerIdentity = '<span class="tp-avatar is-' + review.avatarClass + '">' + review.initials + '</span><span><strong>' + review.reviewer + '</strong><small>' + review.country + ' · ' + review.reviewCount + '</small></span>';
    return '<article class="tp-review-card" data-review-id="' + review.id + '">' +
      '<div class="tp-review-card__head">' + (review.reviewerUrl ? '<a class="tp-reviewer" href="' + review.reviewerUrl + '">' + reviewerIdentity + '</a>' : '<div class="tp-reviewer">' + reviewerIdentity + '</div>') + '<time datetime="' + review.experienceIso + '">' + review.published + '</time></div>' +
      '<div class="tp-review-rating">' + starTiles(5, "is-review") + '<span>' + icon("check") + ' Verified</span></div>' +
      '<h3>' + review.title + '</h3><p>' + review.body + '</p><time class="tp-experience-date" datetime="' + review.experienceIso + '">' + review.experience + '</time>' +
      '<div class="tp-review-actions"><button type="button">' + icon("useful") + 'Useful</button><button type="button">' + icon("share") + 'Share</button><button type="button" aria-label="Report review">' + icon("flag") + '</button></div>' +
    '</article>';
  }

  function renderExperience() {
    return '<section class="tp-experience" aria-labelledby="experience-title"><h2 id="experience-title">The Trustpilot Experience <svg class="tp-experience-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.7 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.6-4.5 6.4-.9L12 2.7Z"/></svg></h2><div class="tp-accordion">' + trustpilotSnapshot.experienceItems.map(function (item, index) {
      return '<div class="tp-accordion-item"><h3><button type="button" aria-expanded="false" aria-controls="experience-panel-' + index + '"><span>' + item.title + '</span>' + icon("chevron") + '</button></h3><div id="experience-panel-' + index + '" class="tp-accordion-panel" hidden><p>' + item.body + '</p></div></div>';
    }).join("") + '</div><a class="tp-experience-button" href="' + links.experience + '">Take a closer look</a></section>';
  }

  const footerGroups = [
    { title: "About", links: [["About us", "https://uk.trustpilot.com/about"], ["Jobs", "https://business.trustpilot.com/jobs"], ["Contact", "https://support.trustpilot.com/hc/en-us/requests/new"], ["Blog", links.blog], ["How Trustpilot works", links.transparency], ["Press", "https://business.trustpilot.com/press"], ["Investor Relations", "https://investors.trustpilot.com/"]] },
    { title: "Community", links: [["Trust in reviews", "https://uk.trustpilot.com/trust"], ["Help Center", "https://support.trustpilot.com/hc/en-us"], ["Log in", links.login], ["Sign up", "https://uk.trustpilot.com/users/connect"]] },
    { title: "Businesses", links: [["Trustpilot Business", links.business], ["Products", "https://business.trustpilot.com/products"], ["Plans & Pricing", "https://business.trustpilot.com/pricing"], ["Business Login", "https://businessapp.b2b.trustpilot.com/"], ["Blog for Business", "https://business.trustpilot.com/blog"], ["Data Solutions", "https://business.trustpilot.com/data-solutions"]] }
  ];

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Côte d’Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hong Kong", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Republic of the Congo", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
  ];

  function renderFooter() {
    const legal = [["Legal", "https://uk.trustpilot.com/legal"], ["Privacy Policy", "https://uk.trustpilot.com/legal/privacy-and-cookies-policy"], ["Terms & Conditions", "https://uk.trustpilot.com/legal/for-reviewers/end-user-terms-and-conditions"], ["Guidelines for Reviewers", "https://legal.trustpilot.com/for-reviewers/guidelines-for-reviewers"], ["System status", "https://status.trustpilot.com/"], ["Cookie preferences", "https://uk.trustpilot.com/legal/privacy-and-cookies-policy"], ["Modern Slavery Statement", "https://cdn.trustpilot.net/trustpilot.com/media/modern-slavery-statement.pdf"]];
    return '<footer class="tp-footer"><div class="tp-container">' +
      '<a class="tp-footer__brand" href="' + links.home + '">' + trustpilotLogo() + '</a>' +
      '<p class="tp-recaptcha-copy">This site is protected by reCAPTCHA. We collect device and interaction signals for security purposes as described in our <a href="https://policies.google.com/privacy">Privacy Policy</a>.</p>' +
      '<div class="tp-footer-grid">' + footerGroups.map(function (group) {
        return '<nav aria-label="' + group.title + '"><h2>' + group.title + '</h2>' + group.links.map(function (link) { return '<a href="' + link[1] + '">' + link[0] + '</a>'; }).join("") + (group.title === "About" ? '<a class="tp-app-store" href="' + links.appStore + '"><span>Download on the</span><strong>App Store</strong></a>' : '') + '</nav>';
      }).join("") +
      '<div class="tp-footer-social"><h2>Follow us on</h2><a href="https://www.facebook.com/Trustpilot/" aria-label="Facebook">f</a><a href="https://x.com/Trustpilot" aria-label="X">X</a><a href="https://www.instagram.com/trustpilot/" aria-label="Instagram">◎</a><a href="https://www.linkedin.com/company/trustpilot/" aria-label="LinkedIn">in</a><a href="https://www.youtube.com/@Trustpilot" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" fill="currentColor"/><path d="m10 9 5 3-5 3Z" fill="#191919"/></svg></a></div>' +
      '<div class="tp-country"><label for="tp-country-select">Choose country</label><select id="tp-country-select" aria-label="Choose country">' + countries.map(function (country) { return '<option' + (country === "United Kingdom" ? ' selected' : '') + '>' + country + '</option>'; }).join("") + '</select></div></div>' +
      '<div class="tp-footer-legal">' + legal.map(function (link) { return '<a href="' + link[1] + '">' + link[0] + '</a>'; }).join("") + '</div><p class="tp-copyright">© 2026 Trustpilot, Inc. All rights reserved.</p>' +
    '</div></footer>';
  }

  function initMenu() {
    const button = document.querySelector(".tp-menu-button");
    const close = document.querySelector(".tp-menu-close");
    const menu = document.querySelector(".tp-mobile-menu");
    if (!button || !menu) return;
    let lastFocus = null;
    function setOpen(open) {
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
      document.body.classList.toggle("tp-menu-open", open);
      if (open) { lastFocus = document.activeElement; close.focus(); }
      else if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    button.addEventListener("click", function () { setOpen(button.getAttribute("aria-expanded") !== "true"); });
    close.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !menu.hidden) setOpen(false); });
    document.addEventListener("click", function (event) { if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) setOpen(false); });
  }

  function initDescription() {
    const button = document.querySelector(".tp-see-more");
    const text = document.querySelector(".tp-company-description");
    if (!button || !text) return;
    button.addEventListener("click", function () {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.textContent = expanded ? "See more" : "See less";
      text.classList.toggle("is-expanded", !expanded);
    });
  }

  function initCarousel() {
    const track = document.querySelector(".tp-related-track");
    const previous = document.querySelector(".tp-carousel-prev");
    const next = document.querySelector(".tp-carousel-next");
    if (!track || !previous || !next) return;
    function step(direction) {
      const card = track.querySelector(".tp-related-card");
      track.scrollBy({ left: direction * ((card ? card.offsetWidth : 260) + 16), behavior: "smooth" });
    }
    function update() {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }
    previous.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initAccordions() {
    const buttons = Array.prototype.slice.call(document.querySelectorAll(".tp-accordion-item button"));
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const willOpen = button.getAttribute("aria-expanded") !== "true";
        buttons.forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          document.getElementById(other.getAttribute("aria-controls")).hidden = true;
        });
        if (willOpen) {
          button.setAttribute("aria-expanded", "true");
          document.getElementById(button.getAttribute("aria-controls")).hidden = false;
        }
      });
    });
  }

  function initReviews() {
    const list = document.getElementById("tp-review-list");
    const search = document.getElementById("tp-review-search");
    const sort = document.getElementById("tp-review-sort");
    const filterButton = document.querySelector(".tp-filter-button");
    const popover = document.getElementById("tp-filter-popover");
    const verified = document.getElementById("tp-filter-verified");
    const five = document.getElementById("tp-filter-five");
    const clear = document.getElementById("tp-clear-filters");
    function update() {
      const query = search.value.trim().toLowerCase();
      let reviews = trustpilotSnapshot.reviews.filter(function (review) {
        const haystack = [review.reviewer, review.title, review.body].join(" ").toLowerCase();
        return (!query || haystack.indexOf(query) !== -1) && (!verified.checked || review.verified) && (!five.checked || true);
      });
      reviews.sort(function (a, b) { return sort.value === "oldest" ? a.experienceIso.localeCompare(b.experienceIso) : b.experienceIso.localeCompare(a.experienceIso); });
      list.innerHTML = reviews.length ? reviews.map(renderReviewCard).join("") : '<div class="tp-no-results"><strong>No matching reviews</strong><span>Try another keyword or clear your filters.</span></div>';
    }
    search.addEventListener("input", update);
    sort.addEventListener("change", update);
    verified.addEventListener("change", update);
    five.addEventListener("change", update);
    filterButton.addEventListener("click", function () { const open = filterButton.getAttribute("aria-expanded") !== "true"; filterButton.setAttribute("aria-expanded", String(open)); popover.hidden = !open; });
    clear.addEventListener("click", function () { search.value = ""; verified.checked = false; five.checked = false; update(); });
    document.addEventListener("click", function (event) { if (!popover.hidden && !popover.contains(event.target) && !filterButton.contains(event.target)) { popover.hidden = true; filterButton.setAttribute("aria-expanded", "false"); } });
    update();
  }

  function renderApp() {
    const app = document.getElementById("tp-app");
    app.innerHTML = renderHeader() + renderBreadcrumbs() + renderProfile() + renderFooter();
    app.setAttribute("aria-busy", "false");
    initMenu();
    initDescription();
    initCarousel();
    initAccordions();
    initReviews();
  }

  renderApp();
}());
