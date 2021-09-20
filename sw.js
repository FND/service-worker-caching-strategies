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

async function networkFirst(ev) {
	let { request } = ev;
	try {
		let response = await fetch(request);
		log("✓ online retrieval", request.url);
		ev.waitUntil(add2cache(request, response));
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
	await cache.put(request, response.clone());
}

function log(...msg) {
	console.log(`[Service Worker] v${VERSION}`, ...msg); // eslint-disable-line no-console
}
