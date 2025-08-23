

const CACHE_NAME = "Curo-ai-cache-v1";
const urlsToCache = [
    "./",                
    "./index.html",      
    "./style.css",   
    "./script.js",    
    "./manifest.json",   
    "./images/lightt/logo.png", 
    "./images/darkk/logo.png" 
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache).catch((error) => {
                console.error("Failed to cache resources:", error);
            });
        })
    );
});


self.addEventListener("fetch", (event) => {

    if (event.request.url.includes('/generate-content') || event.request.url.includes('/is-complex')) {

        return; 
    }


    event.respondWith(
        caches.match(event.request).then((response) => {

            return response || fetch(event.request);
        }).catch((error) => {
            console.error("Fetch failed:", error);
        })
    );
});


self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});