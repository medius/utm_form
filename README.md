## What does it do?
It adds UTM, referrer, landing page and other information to any lead generation form. It adds this extra information
as hidden fields on a form.

## Why do I need it?
If you want to know where each email list subscriber or lead is coming from, use this script to help with that. This
is different from analytics tools where you know this information in aggregate.

e.g. You'll know that bob@example.com originally came from Twitter, landed on page www.yoursite.com/promotion and
visited your website 3 times before giving you his email address.

**Information it adds to your forms:**
* 5 UTM parameters - Any UTM parameters in the URL that a visitor used to come to your website will be added to the form
* Initial Referrer - The webpage where the visitor came from for the first time
* Last Referrer - The webpage where the visitor came from most recently
* Initial Landing page - URL of the page on your website where the visitor landed the very first time
* Number of visits - The number of times the visitor came to your website before filling your form

## How do I use it?


1. Just add this before the closing `</body>` tag at the bottom of your page. Make sure to change the domain.

  ```html
  <script type="text/javascript" charset="utf-8">
    var _uf = _uf || {};
    _uf.domain = ".example.com";
  </script>

  <script src="//d12ue6f2329cfl.cloudfront.net/resources/utm_form-1.0.0.min.js" async></script>
  ```

2. You need to make your forms accept the new fields. Based on the information available for a visitor, the fields added
  to your form will be,

  * USOURCE - Value of *utm_source* if present
  * UMEDIUM - Value of *utm_medium* if present
  * UCAMPAIGN - Value of *utm_campaign* if present
  * UCONTENT - Value of *utm_content* if present
  * UTERM - Value of *utm_term* if present
  * IREFERRER - URL of the initial referrer
  * LREFERRER - URL of the last referrer
  * ILANDPAGE - Initial landing page
  * VISITS - Number of visits

  Note: A new visit happens when the visitor comes to your website after more than an hour (customizations).

## Customizations
If you would like to customize how fields get added to your form, you can change it as follows

  ```html
  <script type="text/javascript" charset="utf-8">
    var _uf = _uf || {};
    _uf.domain                     = ".example.com";

    _uf.utm_source_field           = "YOUR_SOURCE_FIELD"; // Default 'USOURCE'
    _uf.utm_medium_field           = "YOUR_MEDIUM_FIELD"; // Default 'UMEDIUM'
    _uf.utm_campaign_field         = "YOUR_CAMPAIGN_FIELD"; // Default 'UCAMPAIGN'
    _uf.utm_content_field          = "YOUR_CONTENT_FIELD"; // Default 'UCONTENT'
    _uf.utm_term_field             = "YOUR_TERM_FIELD"; // Default 'UTERM'

    _uf.initial_referrer_field     = "YOUR_INITIAL_REFERRER_FIELD"; // Default 'IREFERRER'
    _uf.last_referrer_field        = "YOUR_LAST_REFERRER_FIELD"; // Default 'LREFERRER'
    _uf.initial_landing_page_field = "YOUR_INITIAL_LANDING_PAGE_FIELD"; // Default 'ILANDPAGE'
    _uf.visits_field               = "YOUR_VISITS_FIELD"; // Default 'VISITS'

    _uf.sessionLength              = 2; // In hours. Default is 1 hour
  </script>

  <script src="//d12ue6f2329cfl.cloudfront.net/resources/utm_form-1.0.0.min.js async"></script>
  ```

## More Questions?
#### What happens if someone visits a bunch of pages on my website/blog before filling the form?
It doesn't matter. As soon as they land on your website, the script saves the information in a cookie. This 
cookie is valid for 365 days. It then adds this information to your form.

#### What's the session length for?
It's used to count the number of visits. If someone comes to your website after the session has expired, it will be counted
as a new visit.
