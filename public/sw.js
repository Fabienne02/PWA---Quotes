// Bron: https://github.com/cmda-minor-web/progressive-web-apps-2122/blob/main/examples/node-advanced-static-prerendering-example/src/service-worker.js
// Static files in the cach
const CORE_CACHE_VERSION = 'v3'
const CORE_ASSETS = [
  '/',
  '/styles.css',
  '/offline',
  '/Icons/icon-512x512.png'
]


self.addEventListener('install', event => {
  console.log('Installing service worker')

 // Skip waiting, new server in action
  event.waitUntil(
    caches.open(CORE_CACHE_VERSION).then(function(cache) {
      return cache.addAll(CORE_ASSETS).then(() => self.skipWaiting());
    })
  );
});

// Activating serverworker
self.addEventListener('activate', event => {
  console.log('Activating service worker')
  event.waitUntil(clients.claim());
});

// Fetch files and in cache, else if offline cache page
self.addEventListener('fetch', event => {
  console.log('Fetch event: ', event.request.url);
  if (isCoreGetRequest(event.request)) {
    console.log('Core get request: ', event.request.url);
    // cache only strategy
    event.respondWith(
      caches.open(CORE_CACHE_VERSION)
        .then(cache => cache.match(event.request.url))
    )
  } else if (isHtmlGetRequest(event.request)) {
    console.log('html get request', event.request.url)
    // generic fallback
    event.respondWith(

      
// Fallback if no files in cache, go to Offline.ejs
      caches.open('html-cache')
        .then(cache => cache.match(event.request.url))
        .then(response => response ? response : fetchAndCache(event.request, 'html-cache'))
        .catch(e => {
          return caches.open(CORE_CACHE_VERSION)
            .then(cache => cache.match('/offline'))
        })
    )
  }
});

// Cloning pages in cache
function fetchAndCache(request, cacheName) {
  return fetch(request)
    .then(response => {
      if (!response.ok) {
        throw new TypeError('Bad response status');
      }

      const clone = response.clone()
      caches.open(cacheName).then((cache) => cache.put(request, clone))
      return response
    })
}

/**
 * Checks if a request is a GET and HTML request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is a GET and HTML request
 */
function isHtmlGetRequest(request) {
  return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1);
}

/**
 * Checks if a request is a core GET request
 *
 * @param {Object} request        The request object
 * @returns {Boolean}            Boolean value indicating whether the request is in the core mapping
 */
function isCoreGetRequest(request) {
  return request.method === 'GET' && CORE_ASSETS.includes(getPathName(request.url));
}

/**
 * Get a pathname from a full URL by stripping off domain
 *
 * @param {Object} requestUrl        The request object, e.g. https://www.mydomain.com/index.css
 * @returns {String}                Relative url to the domain, e.g. index.css
 */
function getPathName(requestUrl) {
  const url = new URL(requestUrl);
  return url.pathname;
}