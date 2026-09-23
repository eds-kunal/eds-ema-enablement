/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes AEM Sites boilerplate / non-authorable chrome so the import contains
 * only page-level authorable content.
 * All selectors verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Tracking / ID-syncing iframe (demdex). Verified: cleaned.html line 566
    //   <iframe id="destination_publishing_iframe_wkndsite_0" src="...demdex.net...">
    WebImporter.DOMUtils.remove(element, [
      'iframe[id*="destination_publishing"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (site shell / layout). Verified in cleaned.html:
    //   header.cmp-experiencefragment--header .......... line 5 (logo, main nav, search, language nav, sign-in)
    //   footer.cmp-experiencefragment--footer .......... line 471 (footer logo, nav, social, copyright)
    //   #toggleNav ..................................... line 568 (mobile nav toggle)
    //   #mobileNav / .cmp-navigation--mobile ........... line 574 (mobile navigation drawer)
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
      '#toggleNav',
      '#mobileNav',
      '.cmp-navigation--mobile',
    ]);

    // Stray empty <meta> elements left inside cmp-image wrappers.
    // Verified: cleaned.html lines 183, 204, 227, 271, 334, 378 (<meta> with no attributes)
    element.querySelectorAll('meta').forEach((el) => el.remove());

    // AEM data-layer / link-accessibility tracking attributes (non-authorable).
    // Verified on <body> (cleaned.html line 1) and on cmp components throughout.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('data-cmp-data-layer-name');
      el.removeAttribute('data-cmp-link-accessibility-enabled');
      el.removeAttribute('data-cmp-link-accessibility-text');
    });
  }
}
