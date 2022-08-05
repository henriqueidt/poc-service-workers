const fallbackImageUrl = '/assets/images/lego-soldiers.jpeg'

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v2');
  await cache.addAll(resources);
};

const saveInCache = async (request, response) => {
  const cache = await caches.open('v2');
  await cache.put(request, response)
}

const getFallbackImage = async () => {
  const fallbackImageResponse = await caches.match(fallbackImageUrl)

  if(fallbackImageResponse) {
    return fallbackImageResponse
  }

  return new Response('Network error', {
    status: 400,
    headers: { 'Content-Type': 'text/plain' },
  });
}

const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request)
  if(cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if(!networkResponse.ok) {
      return getFallbackImage()
    }

    saveInCache(request, networkResponse.clone())
    return networkResponse

  } catch (error) {
    return getFallbackImage()
  }
}

self.addEventListener('activate', (event) => {
  console.log('Activating Worker')
});

self.addEventListener('install', (event) => {
  console.log('Installing Worker')
  event.waitUntil(
    addResourcesToCache([
      '/assets/images/lego-soldiers.jpeg',
      'https://live.staticflickr.com/3300/5751764100_de46b84168_h.jpg'
    ])
  );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
      cacheFirst(event.request)
    )
});