class UtmForm
  constructor: (options = {}) ->
    @_utmParamsMap = {}
    @_utmParamsMap.utm_source   = options.utm_source_field || 'USOURCE'
    @_utmParamsMap.utm_medium   = options.utm_medium_field || 'UMEDIUM'
    @_utmParamsMap.utm_campaign = options.utm_campaign_field || 'UCAMPAIGN'
    @_utmParamsMap.utm_content  = options.utm_content_field || 'UCONTENT'
    @_utmParamsMap.utm_term     = options.utm_term_field || 'UTERM'

    @_additionalParamsMap       = options.additional_params_map || {}

    @_initialReferrerField      = options.initial_referrer_field || 'IREFERRER'
    @_lastReferrerField         = options.last_referrer_field || 'LREFERRER'
    @_initialLandingPageField   = options.initial_landing_page_field || 'ILANDPAGE'
    @_visitsField               = options.visits_field || 'VISITS'

    # Options:
    # "none": Don't add any fields to any form
    # "first": Add UTM and other fields to only first form on the page
    # "all": (Default) Add UTM and other fields to all forms on the page
    @_addToForm                 = options.add_to_form || 'all';

    # Option to configure the form query selector to further restrict form
    # decoration, e.g. 'form[action="/sign_up"]'
    @_formQuerySelector         = options.form_query_selector || 'form';

    @utmCookie = new UtmCookie({
      domain: options.domain,
      sessionLength: options.sessionLength,
      cookieExpiryDays: options.cookieExpiryDays,
      additionalParams: Object.getOwnPropertyNames(@_additionalParamsMap) })

    if @_addToForm != 'none'
      @addAllFields()

  addAllFields: ->
    for param, fieldName of @_utmParamsMap
      @addFormElem fieldName, @utmCookie.readCookie(param)

    for param, fieldName of @_additionalParamsMap
      @addFormElem fieldName, @utmCookie.readCookie(param)

    @addFormElem @_initialReferrerField, @utmCookie.initialReferrer()
    @addFormElem @_lastReferrerField, @utmCookie.lastReferrer()
    @addFormElem @_initialLandingPageField, @utmCookie.initialLandingPageUrl()
    @addFormElem @_visitsField, @utmCookie.visits()

    return

  addFormElem: (fieldName, fieldValue) ->
    if fieldValue
      allForms = document.querySelectorAll(@_formQuerySelector)

      if allForms.length > 0
        if @_addToForm == 'first'
          firstForm = allForms[0]
          @insertAfter(@getFieldEl(fieldName, fieldValue), firstForm.lastChild)
        else
          for form in allForms
            @insertAfter(@getFieldEl(fieldName, fieldValue), form.lastChild)
    return

  # NOTE: This should be called for each form element or since it
  # attaches itself to the first form
  getFieldEl: (fieldName, fieldValue) ->
    fieldEl = document.createElement('input')
    fieldEl.type = "hidden"
    fieldEl.name = fieldName
    fieldEl.value = fieldValue
    fieldEl

  insertAfter: (newNode, referenceNode) ->
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)

_uf = window._uf || {}
window.UtmForm = new UtmForm _uf
