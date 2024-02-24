
# Fingerprint

Eine einfache Webseite, die Informationen über deinen Browser, Betriebssystem, Gerät, etc. anzeigt. Ein Projekt für meine [VWA](https://de.wikipedia.org/wiki/Vorwissenschaftliche_Arbeit).


<!--
- user agent string
- user agent data
- vendor
- platform
- languages
- cookieEnabled
- deviceMemory
- do not track
- hardware concurrency
- keyboard layout map
- navigator.mimeTypes
- navigator.plugins
- graphics card (vendor & renderer)
- battery
- display-mode
- orientation
- resolution
- color-gamut
- hover, any-hover
- pointer, any-pointer
- window.devicePixelRatio
- screen pixel depth
- screen color depth
- screen is extended
- dynamic-range
- screen & viewport dimentions, top & left (innerHeight, outerHeight, screen.{availHeight, availTop, height}, screenY, visualViewport.{height, offsetTop})
- device posture, viewport segments
- virtual keyboard (+ geometrychange event)
- safe area
- prefers-color-scheme
- prefers-contrast
- prefers-reduced-data
- prefers-reduced-motion
- prefers-reduced-transparency
- Bluetooth availability
- network connection
- gamepads
- HID
- high dynamic range
- ink enhancement expected improvement
- max touch points
- online (+ window online/offline events)
- storage quota estimate
- document.featurePolicy
- permissions query
- headers (iframe, image, css, script, ...)
- history.length
- document.referrer
- performance.memory
- performance navigation type
- ambient light sensor
- compassneedscalibration event fired
- new Intl.DateTimeFormat().resolvedOptions() + new Date().getTimezoneOffset() (+ timezonechange event)
- date & time format
- date in milliseconds
- Audio (new AudioContext()(.createAnalyser)), https://webaudio.github.io/web-audio-api/#priv-sec, https://github.com/WebAudio/web-audio-api/issues/2061
- supported audio types (new Audio().canPlayType())
- supported video types (document.createElement("video").canPlayType())
- supported media recorder types (MediaRecorder.isTypeSupported()), https://w3c.github.io/mediacapture-record/#fingerprinting
- navigator.mediaDevices.enumerateDevices()
- navigator.mediaDevices.getSupportedConstraints()
- WebCodecs decodingInfo, https://w3c.github.io/webcodecs/#privacy-considerations
- (WebGL) canvas fingerprinting
- fonts (document.fonts.check('medium "Arial"'))
- speech synthesis voices
- public IP address
- update media query
- color media query
- color-index media query
- video-color-gamut media query
- video-dynamic-range media query
- media capabilities
- user activation
- motion sensors
- orientation sensors
- gravity acceleration
- navigator.globalPrivacyControl
- navigator.getAutoplayPolicy
- JavaScript recursion stack depth
- navigator.xr.isSessionSupported
- window.name
- window.opener
- installed applications via external protocol flooding (https://fingerprint.com/blog/external-protocol-flooding/)
- Math.sin/cos/tan/...
- JS Self-Profiling API
- localhost port sniffing
- frame rate
- endianness
- incognito
- ApplePaySession.canMakePayments();
- attributionsourceid (https://webkit.org/blog/11529/introducing-private-click-measurement-pcm/)
- system-ui font via brute-force
- "desktop site" mode enabled
- brave fingerprinting strictness
- WebGL2RenderingContext.prototype.getSupportedExtensions()
- GPUAdapter::{isCompatibilityMode, isFallbackAdapter, limits, requestAdapterInfo()}
- navigator.pdfViewerEnabled
- external.getHostEnvironmentValue() (Edge)
- PublicKeyCredential.{isUserVerifyingPlatformAuthenticatorAvailable, isPasskeyPlatformAuthenticatorAvailable}()

- installed browser extensions
- Turtledove/Fledge?
- digital goods?
- MIDI?
- Compute Pressure?, https://w3c.github.io/compute-pressure/
- InputDeviceCapabilities?
- TLS & HSTS?
- clock skew? (https://w3c.github.io/hr-time/#sec-security)
- mouse movement behavior?
- typing behavior?
- ad blocker enabled?
- Encrypted Media Extensions (navigator.requestMediaKeySystemAccess())?
- WeakRef GC reverse-engineering?
- performance observer?
- NFC (NDEFReader)?
- WebRTC local IP address leakage?
- device font size?
- WebAuthn? (e.g. isUserVerifyingPlatformAuthenticatorAvailable)
- system accent color? (https://drafts.csswg.org/css-color-4/#valdef-system-color-accentcolor)
- zoom level?
- WebGPU timestamp queries (https://gpuweb.github.io/gpuweb/#timestamp)?
- x86(_64) detection (https://github.com/fingerprintjs/fingerprintjs/blob/master/src/sources/architecture.ts)


## New stuff from Google & others:
- [Private State Token](https://wicg.github.io/trust-token-api/)
- [Attribution Reporting](https://wicg.github.io/attribution-reporting-api/)
- [Cross App and Web Attribution Measurement](https://github.com/WICG/attribution-reporting-api/blob/main/app_to_web.md)
- [Protected Audience](https://wicg.github.io/turtledove/)
- [Secure Private Advertising Remotely Run On Webserver (SPARROW)](https://github.com/WICG/sparrow)
- [Prefetch](https://wicg.github.io/nav-speculation/prefetch)
- [Prerendering](https://wicg.github.io/nav-speculation/prerendering)
- [Speculation Rules](https://wicg.github.io/nav-speculation/speculation-rules)
- [Bunde preloading](https://github.com/WICG/bundle-preloading)
- [User Agent Interaction with First-Party Sets](https://wicg.github.io/first-party-sets/)
- [requestStorageAccessFor](https://privacycg.github.io/requestStorageAccessFor/)
- [Client Hints Infrastructure](https://wicg.github.io/client-hints-infrastructure/)
- [User-Agent Client Hints](https://wicg.github.io/ua-client-hints/)
- [User Preference Media Features Client Hints Headers](https://wicg.github.io/user-preference-media-features-headers/)
- [Iframe credentialless](https://wicg.github.io/anonymous-iframe/)
- [Media Feeds](https://wicg.github.io/media-feeds/)
- [Fenced Frame](https://wicg.github.io/fenced-frame/)
- [A/B Worker Prototype](https://github.com/WICG/ab-worker-prototype/blob/main/EXPLAINER.md)
- [Privacy-preserving ads](https://github.com/WICG/privacy-preserving-ads)
- [Shared Storage](https://wicg.github.io/shared-storage/)
- [Private Aggregation](https://patcg-individual-drafts.github.io/private-aggregation-api/)
- [Topics](https://patcg-individual-drafts.github.io/topics/)
- [Interoperable Private Attribution End to End Protocol](https://github.com/patcg-individual-drafts/ipa/blob/main/IPA-End-to-End.md) (see also: [Chromium design doc 1](https://docs.google.com/document/d/1LBv-Sg84jyq3Em474kgEbOaJ1GY6XsQKj6TlAlnIkyw/preview), [2](https://docs.google.com/document/d/1KpdSKD8-Rn0bWPTu4UtK54ks0yv2j22pA5SrAD9av4s/preview))
- [Cookies Having Independent Partitioned State (CHIPS)](https://github.com/privacycg/CHIPS) (see also: [unofficial Chromium version](https://dcthetall.github.io/CHIPS-spec/draft-cutler-httpbis-partitioned-cookies.html))
- [Federated Credential Management API](https://fedidcg.github.io/FedCM/)
- [Client-Side Storage Partitioning](https://github.com/privacycg/storage-partitioning)
- [Partitioning Storage, Service Workers, and Communication APIs](https://github.com/wanderview/quota-storage-partitioning/blob/main/explainer.md)
- [Partition Network State](https://github.com/MattMenke2/Explainer---Partition-Network-State/)
- [Aggregated Reporting API](https://github.com/csharrison/aggregate-reporting-api)
- [Storage Access](https://privacycg.github.io/storage-access/)
- [Private Click Measurement](https://privacycg.github.io/private-click-measurement/)
- [Global Privacy Control (GPC)](https://privacycg.github.io/gpc-spec/)
- [Tracking Preference Expression (DNT)](https://w3c.github.io/dnt/drafts/tracking-dnt.html)
- [Standardizing Security Semantics of Cross-Site Cookies](https://github.com/DCtheTall/standardizing-cross-site-cookie-semantics/blob/main/README.md)
- [The IP Geolocation HTTP Client Hint](https://tfpauly.github.io/privacy-proxy/draft-pauly-httpbis-geoip-hint.html)
- [Private Access Tokens](https://github.com/tfpauly/privacy-proxy/blob/main/Retired/draft-private-access-tokens.md)
- [The Privacy Pass HTTP Authentication Scheme](https://www.ietf.org/id/draft-ietf-privacypass-auth-scheme-12.html)
- <s>[Federated Learning of Cohorts (FLoC)](https://github.com/WICG/floc)</s> (archived, replaced by [Topics API](https://patcg-individual-drafts.github.io/topics/))
- <s>[Web Environment Integrity](https://rupertbenwiser.github.io/Web-Environment-Integrity/)</s>

## Documents from W3C and others:
- [Improving the web without third-party cookies](https://w3ctag.github.io/web-without-3p-cookies/)
- [Privacy Principles](https://w3ctag.github.io/privacy-principles/)
- [Ethical Web Principles](https://w3ctag.github.io/ethical-web-principles/)
- [Web Platform Design Principles](https://w3ctag.github.io/design-principles/)
- [Self-Review Questionnaire: Security and Privacy](https://w3ctag.github.io/security-questionnaire/)
- [Observations on Private Browsing Modes](https://w3ctag.github.io/private-browsing-modes/)
- [Private Mode Browsing](https://w3ctag.github.io/private-mode/)
- [Mitigating Browser Fingerprinting in Web Specifications](https://w3c.github.io/fingerprinting-guidance/)
- [Navigational-Tracking Mitigations](https://privacycg.github.io/nav-tracking-mitigations/)
- [Privacy Considerations for Web Protocols](https://w3c.github.io/privacy-considerations/)
- [A Potential Privacy Model for the Web](https://github.com/michaelkleber/privacy-model)
-->