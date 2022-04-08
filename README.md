# Quotes 🪅
<img src="https://github.com/Fabienne02/Quotes/blob/main/assets/Focus quote.jpg" width=530 >

# Introduction
Quotes is een web-app die je door inspireerde quotes laat scrollen.
Pin jouw favorite quotes of laat je verassen door de random quote generator!

<img src="https://github.com/Fabienne02/Quotes/blob/main/assets/quotes.png" height="700" alt="banner">

## Table of contents
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [About](#about)
  - [Gecodeerd met](#gecodeerd-met)
  - [Features](#features)
  - [Wishlist](#wishlist)
  - [Installing](#installing)
  - [Activity diagram](#activity-diagram)
  - [Presentation](#presentation)
  - [Sources](#sources)
  - [Author](#author)
  - [License](#license)

## About
**Quotes is een webapp waar je geinspireerd kan worden door design quotes!**

Quotes maakt gebruik van een api: https://quote.api.fdnd.nl/v1/quote

Lees de comments voor meer informatie.<br>
Quotes werkt aan de hand van een serversworker, dit is een verbinding tussen de browser en de browser server.<br>
Een serviceworker gebruik je om je pagina offline toegangankelijk te maken, de perfomance te boosten of voor extra beveiliging.<br>
Een serviceworker gaat vaak hand in hand met een cache. Quotes maakt gebruik van statische cache en een dynamische cache. >br>
Statische cache zijn bestanden over url locaties die van te voren naar de cache worden gestuurd, dus offline toegankelijk zijn.<br>
Dynamische cache zijn vaak url locaties die bezocht zijn online door de gebruiker en na bezoek in de cache worden opgeslagen voor offline toegang.<br>


## Gecodeerd met
Quotes is gecodeerd in EJS (node), Javascript
Vol Server side gerenderd.

## Features
<ul>
  <li>Geneer een random quote van de dag</li>
  <li>Focus op jouw favoriete quote</li>
</ul>

## Wishlist
<ul>
  <li>Deel jouw favoriete quote op twitter</li>
  <li>Voeg je eigen quotes toe aan de api</li>
</ul>

## Installing
1. Clone deze repository naar jouw lokale folder
```
git clone https://github.com/Fabienne02/PWA---Quotes.git
```
2. Open de folder in jouw code applicatie [Zoals VSCODE](https://code.visualstudio.com/Download)
4. Install all packages
```
npm install || npm i
```
5. Start de applicatie met de volgende command
```
npm install || npm start
```
6. Open de de localhost:3002 in je browser

## Activity diagram
<img src="https://github.com/Fabienne02/PWA---Quotes/blob/main/assets/activity-diagram.png">
<br><br>
Hierbij werkt sw.js als volgt:<br>
Dit is de statische cache. Deze cache heet V3 en bevat de volgende assets<br>

```
const CORE_CACHE_VERSION = 'v3'
const CORE_ASSETS = [
  '/',
  '/styles.css',
  '/offline',
  '/Icons/icon-512x512.png'
]
```

<br><br>
Hier luisteren we naar de install van de service worker, kijken we of er een service working in de wait staan en sturen we die door naar active. <br>
Dit kan ook manual maar dit maakt het makkelijker.<br>
```
self.addEventListener('install', event => {
  console.log('Installing service worker')

 // Skip waiting, new server in action
  event.waitUntil(
    caches.open(CORE_CACHE_VERSION).then(function(cache) {
      return cache.addAll(CORE_ASSETS).then(() => self.skipWaiting());
    })
  );
});
```
<br><br>
De volgende code luisteren we naar activate van de serviceworker, dus tot active status. dan fetchen we de files uit de cache. <br>
Anders... (else if) als je niet kan fetchen pak dan /offline uit de statische cache en toon die!<br>
```
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
```
<br><br>
Bij de volgende code clonen we paginas naar de cache, dit werkt als dynamische cache<br>
```
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
```
<br><br>
Voor de rest maak ik parameters aan doormiddel van functions voor html request, core request en url's.
HTML request kijkt naar de html files of in dit geval EJS vertaald naar HTML
Core request kijkt naar de statische files 
URL is voor het define van een document zoals quotes.nl/index.css naar index.css <br>

## Presentation
Lees meer over de presentatie van deze web-app  in de [wiki](https://github.com/Fabienne02/PWA---Quotes/wiki)
- [Critical render path](https://github.com/Fabienne02/PWA---Quotes/wiki/Critical-render-path)
- [Lighthouse](https://github.com/Fabienne02/PWA---Quotes/wiki/Lighthouse)
- Font-display: swap
- Compression 
- js defer tag

Hierbij heb ik ook geprobeerd een control header in te stellen, dit beïnvloede mijn snelheid negatief met 0,2-0,4 seconden dus heb ik deze weg gelaten.

## Sources
- [Code hulp bron](https://developer.mozilla.org/en-US/)
- [Fetch in Node](https://dev.to/pratham82/using-fetch-api-in-node-js-with-weather-api-3a7d)
- [PWA](https://vaadin.com/learn/tutorials/learn-pwa/turn-website-into-a-pwa)


## Author
De maker van deze WPA is: [*Fabienne van den Steen*](https://github.com/Fabienne02)

## License 
[![license](https://img.shields.io/github/license/DAVFoundation/captain-n3m0.svg?style=flat-square)]()
