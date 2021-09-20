/* eslint-env serviceworker */
let VERSION = "0.0.0";

self.addEventListener("install", ev => {
	log("installing");
});

self.addEventListener("activate", ev => {
	log("activating");
});

self.addEventListener("fetch", ev => {
	log("retrieving", ev.request.url);
});

function log(...msg) {
	console.log(`[Service Worker] v${VERSION}`, ...msg); // eslint-disable-line no-console
}
