const CACHE_NAME = 'el-daheeh-cache-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './splash.css',
    './app.js',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Tajawal:wght@300;400;500;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching offline assets');
                return Promise.allSettled(
                    ASSETS.map((url) => {
                        return cache.add(url).catch((err) => {
                            console.warn(`[Service Worker] Failed to pre-cache asset: ${url}`, err);
                        });
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    
    const url = e.request.url;
    if (url.includes('firebase') || url.includes('firestore') || url.includes('googleapis') || url.includes('cloudinary')) {
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then((response) => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(e.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (e.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return null;
                });
            })
    );
});
