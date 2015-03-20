class UtmForm
  constructor: (options = {}) ->
    @_utmParamsMap = {}
    @_utmParamsMap.utm_source   = options.utm_source_field || 'USOURCE'
    @_utmParamsMap.utm_medium   = options.utm_medium_field || 'UMEDIUM'
    @_utmParamsMap.utm_campaign = options.utm_campaign_field || 'UCAMPAIGN'
    @_utmParamsMap.utm_content  = options.utm_content_field || 'UCONTENT'
    @_utmParamsMap.utm_term     = options.utm_term_field || 'UTERM'

    @_initialReferrerField      = options.initial_referrer_field || 'IREFERRER'
    @_lastReferrerField         = options.last_referrer_field || 'LREFERRER'
    @_initialLandingPageField   = options.initial_landing_page_field || 'ILANDPAGE'
    @_visitsField               = options.visits_field || 'VISITS'

    # Options:
    # "none": Don't add any fields to any form
    # "first": Add UTM and other fields to only first form on the page
    # "all": (Default) Add UTM and other fields to all forms on the page
    @_addToForm                 = options.add_to_form || 'all';

    @utmCookie = new UtmCookie({
      domain: options.domain,
      sessionLength: options.sessionLength,
      cookieExpiryDays: options.cookieExpiryDays })

    if @_addToForm != 'none'
      @addAllFields()

  addAllFields: ->
    for param, fieldName of @_utmParamsMap
      @addFormElem fieldName, @utmCookie.readCookie(param)

    @addFormElem @_initialReferrerField, @utmCookie.initialReferrer()
    @addFormElem @_lastReferrerField, @utmCookie.lastReferrer()
    @addFormElem @_initialLandingPageField, @utmCookie.initialLandingPageUrl()
    @addFormElem @_visitsField, @utmCookie.visits()

    return

  addFormElem: (fieldName, fieldValue) ->
    if fieldValue
      allForms = document.querySelectorAll('form')

      if allForms.length > 0
        if window._addToForm == 'first'
          firstForm = allForms[0]
          firstForm.insertBefore(@getFieldEl(fieldName, fieldValue), firstForm.firstChild)
        else
          for form in allForms
            form.insertBefore(@getFieldEl(fieldName, fieldValue), form.firstChild)
    return

  # NOTE: This should be called for each form element or since it
  # attaches itself to the first form
  getFieldEl: (fieldName, fieldValue) ->
    fieldEl = document.createElement('input')
    fieldEl.type = "hidden"
    fieldEl.name = fieldName
    fieldEl.value = fieldValue
    fieldEl

_uf = window._uf || {}
window.UtmForm = new UtmForm _uf
