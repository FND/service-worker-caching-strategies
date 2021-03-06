/* eslint-env serviceworker */
let VERSION = "0.0.0";
let CACHE_NAME = "resources";

self.addEventListener("install", ev => {
	log("installing");
});

self.addEventListener("activate", ev => {
	log("activating");
});

self.addEventListener("fetch", ev => {
	log("retrieving", ev.request.url);
	ev.respondWith(networkFirst(ev));
});

async function staleWhileRevalidate(ev) {
	let { request } = ev;
	let networkResponse = fetch(request);
	ev.waitUntil(networkResponse.
		then(res => {
			log("✓ online retrieval", request.url);
			return add2cache(request, res.clone());
		}));

	let cache = await caches.open(CACHE_NAME);
	let cachedResponse = await cache.match(request);
	if(cachedResponse) {
		log("✓ cache retrieval", request.url);
		return cachedResponse;
	}

	return networkResponse;
}

async function networkFirst(ev) {
	let { request } = ev;
	try {
		let response = await fetch(request);
		log("✓ online retrieval", request.url);
		ev.waitUntil(add2cache(request, response.clone()));
		return response;
	} catch(err) {}

	log("✗ online retrieval", request.url);
	let cache = await caches.open(CACHE_NAME);
	let response = await cache.match(request);
	log("✓ cache retrieval", request.url);
	return response;
}

async function add2cache(request, response) {
	log("caching", request.url);
	let cache = await caches.open(CACHE_NAME);
	await cache.put(request, response);
}

function log(...msg) {
	console.log(`[Service Worker] v${VERSION}`, ...msg); // eslint-disable-line no-console
}
