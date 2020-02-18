var UtmCookie;

UtmCookie = class UtmCookie {
  constructor(options = {}) {
    this._cookieNamePrefix = '_uc_';
    this._domain = options.domain;
    this._secure = options.secure || false;
    this._initialUtmParams = options.initialUtmParams || false;
    this._resetParams = options.resetParams || false;
    this._sessionLength = options.sessionLength || 1;
    this._cookieExpiryDays = options.cookieExpiryDays || 365;
    this._additionalParams = options.additionalParams || [];
    this._additionalInitialParams = options.additionalInitialParams || [];
    this._utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    this.writeInitialReferrer();
    this.writeLastReferrer();
    this.writeInitialLandingPageUrl();
    this.writeAdditionalInitialParams();
    if (this._initialUtmParams) {
      this.writeInitialUtmCookieFromParams();
    }
    if (this._resetParams) {
      if (!this.getCurrentSession()) {
        this.writeAdditionalParams();
        this.writeUtmCookieFromParams();
      }
    } else {
      if (this.additionalParamsPresentInUrl()) {
        this.writeAdditionalParams();
      }
      if (this.utmPresentInUrl()) {
        this.writeUtmCookieFromParams();
      }
    }
    this.setCurrentSession();
    return;
  }

  createCookie(name, value, days, path, domain, secure) {
    var cookieDomain, cookieExpire, cookiePath, cookieSecure, date, expireDate;
    expireDate = null;
    if (days) {
      date = new Date;
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expireDate = date;
    }
    cookieExpire = expireDate != null ? '; expires=' + expireDate.toGMTString() : '';
    cookiePath = path != null ? '; path=' + path : '; path=/';
    cookieDomain = domain != null ? '; domain=' + domain : '';
    cookieSecure = secure ? '; secure' : '';
    document.cookie = this._cookieNamePrefix + name + '=' + escape(value) + cookieExpire + cookiePath + cookieDomain + cookieSecure;
  }

  readCookie(name) {
    var c, ca, i, nameEQ, value;
    nameEQ = this._cookieNamePrefix + name + '=';
    ca = document.cookie.split(';');
    i = 0;
    while (i < ca.length) {
      c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        value = c.substring(nameEQ.length, c.length);
        if (value !== 'null') {
          return value;
        }
      }
      i++;
    }
    return null;
  }

  eraseCookie(name) {
    this.createCookie(name, '', -1, null, this._domain, this._secure);
  }

  getParameterByName(name) {
    var regex, regexS, results, value;
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    regexS = '[\\?&]' + name + '=([^&#]*)';
    regex = new RegExp(regexS);
    results = regex.exec(window.location.search);
    if (results) {
      value = decodeURIComponent(results[1].replace(/\+/g, ' '));
      if (value.length > 0) {
        return value;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  additionalParamsPresentInUrl() {
    var j, len, param, ref;
    ref = this._additionalParams;
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      if (this.getParameterByName(param)) {
        return true;
      }
    }
    return false;
  }

  utmPresentInUrl() {
    var j, len, param, ref;
    ref = this._utmParams;
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      if (this.getParameterByName(param)) {
        return true;
      }
    }
    return false;
  }

  writeCookie(name, value) {
    this.createCookie(name, value, this._cookieExpiryDays, null, this._domain, this._secure);
  }

  writeCookieOnce(name, value) {
    var existingValue;
    existingValue = this.readCookie(name);
    if (!existingValue) {
      this.writeCookie(name, value);
    }
  }

  writeAdditionalParams() {
    var j, len, param, ref, value;
    ref = this._additionalParams;
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      value = this.getParameterByName(param);
      this.writeCookie(param, value);
    }
  }

  writeAdditionalInitialParams() {
    var j, len, name, param, ref, value;
    ref = this._additionalInitialParams;
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      name = 'initial_' + param;
      value = this.getParameterByName(param);
      this.writeCookieOnce(name, value);
    }
  }

  writeUtmCookieFromParams() {
    var j, len, param, ref, value;
    ref = this._utmParams;
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      value = this.getParameterByName(param);
      this.writeCookie(param, value);
    }
  }

  writeInitialUtmCookieFromParams() {
    var j, len, name, param, ref, value;
    ref = this._utmParams;
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      name = 'initial_' + param;
      value = this.getParameterByName(param);
      this.writeCookieOnce(name, value);
    }
  }

  _sameDomainReferrer(referrer) {
    var hostname;
    hostname = document.location.hostname;
    return referrer.indexOf(this._domain) > -1 || referrer.indexOf(hostname) > -1;
  }

  _isInvalidReferrer(referrer) {
    return referrer === '' || referrer === void 0;
  }

  writeInitialReferrer() {
    var value;
    value = document.referrer;
    if (this._isInvalidReferrer(value)) {
      value = 'direct';
    }
    this.writeCookieOnce('referrer', value);
  }

  writeLastReferrer() {
    var value;
    value = document.referrer;
    if (!this._sameDomainReferrer(value)) {
      if (this._isInvalidReferrer(value)) {
        value = 'direct';
      }
      this.writeCookie('last_referrer', value);
    }
  }

  writeInitialLandingPageUrl() {
    var value;
    value = this.cleanUrl();
    if (value) {
      this.writeCookieOnce('initial_landing_page', value);
    }
  }

  initialReferrer() {
    return this.readCookie('referrer');
  }

  lastReferrer() {
    return this.readCookie('last_referrer');
  }

  initialLandingPageUrl() {
    return this.readCookie('initial_landing_page');
  }

  incrementVisitCount() {
    var cookieName, existingValue, newValue;
    cookieName = 'visits';
    existingValue = parseInt(this.readCookie(cookieName), 10);
    if (isNaN(existingValue)) {
      newValue = 1;
    } else {
      newValue = existingValue + 1;
    }
    this.writeCookie(cookieName, newValue);
  }

  visits() {
    return this.readCookie('visits');
  }

  getCurrentSession() {
    var cookieName;
    cookieName = 'current_session';
    return this.readCookie(cookieName);
  }

  setCurrentSession() {
    var cookieName, existingValue;
    cookieName = 'current_session';
    existingValue = this.readCookie(cookieName);
    if (!existingValue) {
      this.createCookie(cookieName, 'true', this._sessionLength / 24, null, this._domain, this._secure);
      this.incrementVisitCount();
    }
  }

  cleanUrl() {
    var cleanSearch;
    cleanSearch = window.location.search.replace(/utm_[^&]+&?/g, '').replace(/&$/, '').replace(/^\?$/, '');
    return window.location.origin + window.location.pathname + cleanSearch + window.location.hash;
  }

};

var UtmForm, _uf;

UtmForm = class UtmForm {
  constructor(options = {}) {
    this._utmParamsMap = {};
    this._utmParamsMap.utm_source = options.utm_source_field || 'USOURCE';
    this._utmParamsMap.utm_medium = options.utm_medium_field || 'UMEDIUM';
    this._utmParamsMap.utm_campaign = options.utm_campaign_field || 'UCAMPAIGN';
    this._utmParamsMap.utm_content = options.utm_content_field || 'UCONTENT';
    this._utmParamsMap.utm_term = options.utm_term_field || 'UTERM';
    this._initialUtmParamsMap = {};
    this._initialUtmParamsMap.initial_utm_source = options.initial_utm_source_field || 'IUSOURCE';
    this._initialUtmParamsMap.initial_utm_medium = options.initial_utm_medium_field || 'IUMEDIUM';
    this._initialUtmParamsMap.initial_utm_campaign = options.initial_utm_campaign_field || 'IUCAMPAIGN';
    this._initialUtmParamsMap.initial_utm_content = options.initial_utm_content_field || 'IUCONTENT';
    this._initialUtmParamsMap.initial_utm_term = options.initial_utm_term_field || 'IUTERM';
    this._additionalParamsMap = options.additional_params_map || {};
    this._additionalInitialParamsMap = options.additional_initial_params_map || {};
    this._initialReferrerField = options.initial_referrer_field || 'IREFERRER';
    this._lastReferrerField = options.last_referrer_field || 'LREFERRER';
    this._initialLandingPageField = options.initial_landing_page_field || 'ILANDPAGE';
    this._visitsField = options.visits_field || 'VISITS';
    // Options:
    // "none": Don't add any fields to any form
    // "first": Add UTM and other fields to only first form on the page
    // "all": (Default) Add UTM and other fields to all forms on the page
    this._addToForm = options.add_to_form || 'all';
    this._formQuerySelector = options.form_query_selector || 'form';
    this._decodeURIs = options.decode_uris || false;
    this.utmCookie = new UtmCookie({
      domain: options.domain,
      secure: options.secure,
      sessionLength: options.sessionLength,
      cookieExpiryDays: options.cookieExpiryDays,
      initialUtmParams: options.initial_utm_params,
      resetParams: options.reset_params_at_session_end,
      additionalParams: Object.getOwnPropertyNames(this._additionalParamsMap),
      additionalInitialParams: Object.getOwnPropertyNames(this._additionalInitialParamsMap)
    });
    this.addAllFields();
  }

  addAllFields() {
    var allForms, i, len;
    allForms = document.querySelectorAll(this._formQuerySelector);
    if (this._addToForm === 'none') {
      len = 0;
    } else if (this._addToForm === 'first') {
      len = Math.min(1, allForms.length);
    } else {
      len = allForms.length;
    }
    i = 0;
    while (i < len) {
      this.addAllFieldsToForm(allForms[i]);
      i++;
    }
  }

  addAllFieldsToForm(form) {
    var cookieName, fieldName, param, ref, ref1, ref2, ref3;
    if (form && !form._utm_tagged) {
      form._utm_tagged = true;
      ref = this._utmParamsMap;
      for (param in ref) {
        fieldName = ref[param];
        this.addFormElem(form, fieldName, this.utmCookie.readCookie(param));
      }
      ref1 = this._initialUtmParamsMap;
      for (param in ref1) {
        fieldName = ref1[param];
        this.addFormElem(form, fieldName, this.utmCookie.readCookie(param));
      }
      ref2 = this._additionalParamsMap;
      for (param in ref2) {
        fieldName = ref2[param];
        this.addFormElem(form, fieldName, this.utmCookie.readCookie(param));
      }
      ref3 = this._additionalInitialParamsMap;
      for (param in ref3) {
        fieldName = ref3[param];
        cookieName = 'initial_' + param;
        this.addFormElem(form, fieldName, this.utmCookie.readCookie(cookieName));
      }
      this.addFormElem(form, this._initialReferrerField, this.utmCookie.initialReferrer());
      this.addFormElem(form, this._lastReferrerField, this.utmCookie.lastReferrer());
      this.addFormElem(form, this._initialLandingPageField, this.utmCookie.initialLandingPageUrl());
      this.addFormElem(form, this._visitsField, this.utmCookie.visits());
    }
  }

  addFormElem(form, fieldName, fieldValue) {
    this.insertAfter(this.getFieldEl(fieldName, fieldValue), form.lastChild);
  }

  // NOTE: This should be called for each form element or since it
  // attaches itself to the first form
  getFieldEl(fieldName, fieldValue) {
    var fieldEl;
    fieldEl = document.createElement('input');
    fieldEl.type = "hidden";
    fieldEl.name = fieldName;
    fieldEl.value = fieldValue ? this._decodeURIs ? decodeURIComponent(fieldValue) : fieldValue : fieldValue;
    return fieldEl;
  }

  insertAfter(newNode, referenceNode) {
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

};

_uf = window._uf || {};

window.UtmForm = new UtmForm(_uf);
