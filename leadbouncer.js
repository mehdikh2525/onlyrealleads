/* LeadBouncer.js – Lightweight bot-filtering snippet (MVP v0.1)
 * Drops into any page; exported as global LeadBouncer
 * Core rules: honeypot field, <3s submission timing, disposable-email blocklist
 * Behavioural signals (mouse path) are logged for future use but not yet scored.
 */
(function (window, document) {
  'use strict';

  /* ------------------------- Config & Utilities ------------------------- */
  // Minimum seconds a human usually takes to fill a form
  var MIN_HUMAN_SECONDS = 3;

  // Default disposable email domain blocklist (minimal fallback)
  var DISPOSABLE_DOMAINS = [
    'mailinator.com',
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'trashmail.com',
    'yopmail.com',
  ];

  // Fetch extended blocklist JSON once per session if provided
  function loadBlocklist(url) {
    if (!url || window.__lb_blocklistLoaded) return;
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (Array.isArray(json)) {
          DISPOSABLE_DOMAINS = DISPOSABLE_DOMAINS.concat(json);
        }
        window.__lb_blocklistLoaded = true;
      })
      .catch(function () {});
  }

  function isDisposable(email) {
    if (!email) return false;
    var domain = email.split('@')[1] || '';
    return DISPOSABLE_DOMAINS.indexOf(domain.toLowerCase()) !== -1;
  }

  function now() {
    return Date.now();
  }

  /* ----------------------------- Mouse Log ------------------------------ */
  var mouseLog = [];
  function setupMouseLogger() {
    var last = null;
    function handler(e) {
      var point = { x: e.clientX, y: e.clientY, t: now() };
      // Log only if moved more than 5px to reduce noise
      if (!last || Math.abs(point.x - last.x) + Math.abs(point.y - last.y) > 5) {
        mouseLog.push(point);
        last = point;
      }
      // Keep log lightweight
      if (mouseLog.length > 250) {
        window.removeEventListener('mousemove', handler);
      }
    }
    window.addEventListener('mousemove', handler);
  }

  /* --------------------------- LeadBouncer ----------------------------- */
  var LeadBouncer = {
    _forms: {},

    /**
     * Initialise LeadBouncer on a form
     * @param {string|HTMLFormElement} formSelectorOrEl – form id/CSS selector or element
     * @param {Object} opts – { formId: string, apiUrl: string, customerId: string }
     */
    init: function (formSelectorOrEl, opts) {
      opts = opts || {};
      var formEl = typeof formSelectorOrEl === 'string'
        ? document.querySelector(formSelectorOrEl)
        : formSelectorOrEl;
      if (!formEl || formEl.nodeName !== 'FORM') {
        console.error('[LeadBouncer] Form not found for selector', formSelectorOrEl);
        return;
      }

      // Lazy-load extended blocklist the first time init runs
      // if (opts.blocklistUrl) loadBlocklist(opts.blocklistUrl); // Temporarily disabled for testing

      // Add honeypot field if it doesn't exist
      var hpName = 'lb_hp';
      if (!formEl.querySelector('input[name="' + hpName + '"]')) {
        var hp = document.createElement('input');
        hp.type = 'text';
        hp.name = hpName;
        hp.style.display = 'none';
        hp.tabIndex = '-1';
        formEl.appendChild(hp);
      }

      // Store start time when the form first gets focus / keydown
      var startTime = null;
      var setStartTime = function () {
        if (!startTime) startTime = now();
      };
      formEl.addEventListener('focusin', setStartTime);
      formEl.addEventListener('keydown', setStartTime);

      // Intercept submission
      formEl.addEventListener('submit', function (e) {
        console.log('[LeadBouncer] Form submission intercepted');
        var submittedAt = now();
        var elapsed = startTime ? (submittedAt - startTime) / 1000 : 0;

        var honeypotVal = formEl.querySelector('input[name="' + hpName + '"]').value;
        var emailInput = formEl.querySelector('input[type="email"], input[name*="mail"]');
        var emailVal = emailInput ? emailInput.value.trim() : '';
        
        console.log('[LeadBouncer] Email found:', emailVal);
        console.log('[LeadBouncer] Elapsed time:', elapsed);
        console.log('[LeadBouncer] Honeypot value:', honeypotVal);

        var blockedReason = null;
        if (honeypotVal) blockedReason = 'honeypot';
        else if (elapsed && elapsed < MIN_HUMAN_SECONDS) blockedReason = 'fast_submission';
        else if (isDisposable(emailVal)) blockedReason = 'disposable_email';
        
        console.log('[LeadBouncer] Block reason:', blockedReason);

        var payload = {
          form_id: opts.formId || null,
          customer_id: opts.customerId || null,
          email: emailVal,
          elapsed_seconds: elapsed,
          status: blockedReason ? 'blocked' : 'passed',
          reason: blockedReason,
          mouse_log: mouseLog,
          submitted_at: new Date(submittedAt).toISOString(),
        };

        // Send to backend (non-blocking)
        if (opts.apiUrl) {
          console.log('[LeadBouncer] Sending payload:', payload);
          // Use fetch instead of sendBeacon for better compatibility with Edge Functions
          fetch(opts.apiUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + (opts.anonKey || '')
            },
            body: JSON.stringify(payload),
          }).then(function(response) {
            console.log('[LeadBouncer] Response:', response.status);
            if (!response.ok) {
              console.error('[LeadBouncer] HTTP error:', response.status, response.statusText);
            }
            return response.json();
          }).then(function(data) {
            console.log('[LeadBouncer] Response data:', data);
          }).catch(function (error) {
            console.error('[LeadBouncer] Fetch error:', error);
          });
        }

        if (blockedReason) {
          e.preventDefault();
          e.stopPropagation();
          alert('Your submission was blocked. Reason: ' + blockedReason + '. If this is a mistake, please contact support.');
          return false;
        }
        // Otherwise allow form to submit normally (but we've set action to javascript:void(0) for testing)
      });

      // Only set up mouse logger once per page
      if (!window.__lb_mouseLogger) {
        setupMouseLogger();
        window.__lb_mouseLogger = true;
      }

      // Save reference
      this._forms[formEl] = { opts: opts };
    },
  };

  // Expose globally
  window.LeadBouncer = LeadBouncer;
})(window, document); 