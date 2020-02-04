class UtmCookie
  constructor: (options = {}) ->
    @_cookieNamePrefix = '_uc_'
    @_domain = options.domain
    @_secure = options.secure || false
    @_initialUtmParams = options.initialUtmParams || false
    @_sessionLength = options.sessionLength || 1
    @_cookieExpiryDays = options.cookieExpiryDays || 365
    @_additionalParams = options.additionalParams || []
    @_additionalInitialParams = options.additionalInitialParams || []
    @_utmParams = [
      'utm_source'
      'utm_medium'
      'utm_campaign'
      'utm_term'
      'utm_content'
    ]

    @writeInitialReferrer()
    @writeLastReferrer()
    @writeInitialLandingPageUrl()
    @writeAdditionalInitialParams()
    @setCurrentSession()

    if @_initialUtmParams
      @writeInitialUtmCookieFromParams()

    if @additionalParamsPresentInUrl()
      @writeAdditionalParams()

    if @utmPresentInUrl()
      @writeUtmCookieFromParams()

    return

  createCookie: (name, value, days, path, domain, secure) ->
    expireDate = null
    if days
      date = new Date
      date.setTime date.getTime() + days * 24 * 60 * 60 * 1000
      expireDate = date

    cookieExpire = if expireDate? then '; expires=' + expireDate.toGMTString() else ''
    cookiePath = if path? then '; path=' + path else '; path=/'
    cookieDomain = if domain? then '; domain=' + domain else ''
    cookieSecure = if secure then '; secure' else ''
    document.cookie = @_cookieNamePrefix + name + '=' + escape(value) + cookieExpire + cookiePath + cookieDomain + cookieSecure
    return

  readCookie: (name) ->
    nameEQ = @_cookieNamePrefix + name + '='
    ca = document.cookie.split(';')
    i = 0
    while i < ca.length
      c = ca[i]
      while c.charAt(0) == ' '
        c = c.substring(1, c.length)
      if c.indexOf(nameEQ) == 0
        return c.substring(nameEQ.length, c.length)
      i++
    null

  eraseCookie: (name) ->
    @createCookie name, '', -1, null, @_domain, @_secure
    return

  getParameterByName: (name) ->
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    regexS = '[\\?&]' + name + '=([^&#]*)'
    regex = new RegExp(regexS)
    results = regex.exec(window.location.search)
    if results
      decodeURIComponent results[1].replace(/\+/g, ' ')
    else
      ''

  additionalParamsPresentInUrl: ->
    for param in @_additionalParams
      if @getParameterByName(param)
        return true
    return false

  utmPresentInUrl: ->
    for param in @_utmParams
      if @getParameterByName(param)
        return true
    return false

  writeCookie: (name, value) ->
    @createCookie name, value, @_cookieExpiryDays, null, @_domain, @_secure
    return

  writeCookieOnce: (name, value) ->
    existingValue = @readCookie(name)
    if !existingValue
      @writeCookie name, value
    return

  writeAdditionalParams: ->
    for param in @_additionalParams
      value = @getParameterByName(param)
      @writeCookie param, value
    return

  writeAdditionalInitialParams: ->
    for param in @_additionalInitialParams
      name = 'initial_' + param
      value = @getParameterByName(param) || null
      @writeCookieOnce name, value
    return

  writeUtmCookieFromParams: ->
    for param in @_utmParams
      value = @getParameterByName(param)
      @writeCookie param, value
    return

  writeInitialUtmCookieFromParams: ->
    for param in @_utmParams
      name = 'initial_' + param
      value = @getParameterByName(param) || null
      @writeCookieOnce name, value
    return

  _sameDomainReferrer: (referrer) ->
    hostname = document.location.hostname
    referrer.indexOf(@_domain) > -1 or referrer.indexOf(hostname) > -1

  _isInvalidReferrer: (referrer) ->
    referrer == '' or referrer == undefined

  writeInitialReferrer: ->
    value = document.referrer
    if @_isInvalidReferrer(value)
      value = 'direct'
    @writeCookieOnce 'referrer', value
    return

  writeLastReferrer: ->
    value = document.referrer
    if !@_sameDomainReferrer(value)
      if @_isInvalidReferrer(value)
        value = 'direct'
      @writeCookie 'last_referrer', value
    return

  writeInitialLandingPageUrl: ->
    value = @cleanUrl()
    if value
      @writeCookieOnce 'initial_landing_page', value
    return

  initialReferrer: ->
    @readCookie 'referrer'

  lastReferrer: ->
    @readCookie 'last_referrer'

  initialLandingPageUrl: ->
    @readCookie 'initial_landing_page'

  incrementVisitCount: ->
    cookieName = 'visits'
    existingValue = parseInt(@readCookie(cookieName), 10)
    if isNaN(existingValue)
      newValue = 1
    else
      newValue = existingValue + 1
    @writeCookie cookieName, newValue
    return

  visits: ->
    @readCookie 'visits'

  setCurrentSession: ->
    cookieName = 'current_session'
    existingValue = @readCookie(cookieName)
    if !existingValue
      @createCookie cookieName, 'true', @_sessionLength / 24, null, @_domain, @_secure
      @incrementVisitCount()
    return

  cleanUrl: ->
    cleanSearch = window.location.search.
      replace(/utm_[^&]+&?/g, '').
      replace(/&$/, '').
      replace(/^\?$/, '')

    window.location.origin + window.location.pathname + cleanSearch + window.location.hash
