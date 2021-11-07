'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "df8839c4295b4d42fe7fbeb907b26e32",
"assets/assets/100anios.png": "989e5bdb56e45c859e9996477782b53d",
"assets/assets/actualizaDatos.jpg": "e435cbbd8c58c6c3574a5fddd925ad5d",
"assets/assets/agregar.jpg": "567414fb8d42a966f7a51b93ace80709",
"assets/assets/background.jpg": "d28d1da24da8e7005c9b3735962f4741",
"assets/assets/bajo.jpg": "4a713cce7af542e2b5534bdc2d93d453",
"assets/assets/cap.png": "ef9941290c50cd3866e2ba6b793f010d",
"assets/assets/carrito.jpg": "03da74b8f0d3b90ce4b8e2fe83095455",
"assets/assets/completo.jpg": "df375295d5cad324571e13ce41e9414b",
"assets/assets/completo1.jpg": "555a536786a1607b446aebdb3bb036f1",
"assets/assets/completo2.jpg": "5ee453eb830fc117d3ead3f7657bbb68",
"assets/assets/escudo.png": "d54221941e772358a959861d3b4a4a87",
"assets/assets/escudo2.png": "56e18887e87f952d34182e620f23fadc",
"assets/assets/escudo3.png": "42cb0788278c97c291815a490b7a4b87",
"assets/assets/escudoSalud.jpg": "eb817e8da982a0e226ca26945118cebb",
"assets/assets/escudoVerde.jpg": "d28d1da24da8e7005c9b3735962f4741",
"assets/assets/logoheader.svg": "d54221941e772358a959861d3b4a4a87",
"assets/assets/logoMedina.png": "4091c1a9f8722165a9c3b6b0bb312e99",
"assets/assets/menuBajo.jpg": "dcbd1c616f95626589667b10a69cf871",
"assets/assets/mexico.jpg": "70902a9a9653c7699488648fcd715433",
"assets/assets/mexico1.jpg": "1e147e8bdfbe94817fe41cc58cbbab64",
"assets/assets/person.jpg": "b05f5fe83bffdafd6f83854a37861817",
"assets/assets/qrValido.jpg": "fa240ca8aff6e699d849f1a4d1389158",
"assets/assets/re.png": "ef9941290c50cd3866e2ba6b793f010d",
"assets/assets/salud.jpg": "2a36dfb7a1a96ef6d1b2df680c9adf9b",
"assets/assets/salud1.jpg": "e5d11d2e7ceeeccb828587472aab7b34",
"assets/assets/salud3.jpg": "1407520d9d50521f5f5d5fa1d4188b81",
"assets/assets/salud4.jpg": "fcb1e4631595ad9858e4f254b5165f52",
"assets/assets/saludVerde.jpg": "d28d1da24da8e7005c9b3735962f4741",
"assets/assets/tarjeta.gif": "1fd4b6dbd1fc9a627a9c4d5cd06393e0",
"assets/assets/verde.jpg": "3a4f0c5af353df7e32265f4bdff6a568",
"assets/assets/verde.png": "4e146631de01816671da596e88ddab6f",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "68be2e76f4d55cf7ca35db92ee63c79a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "7d094c3148cd8e46faaa6a56a1245e91",
"/": "7d094c3148cd8e46faaa6a56a1245e91",
"main.dart.js": "fb706c8a4d37d3885b26c50b700a8f41",
"manifest.json": "641f3e025c291a66ca7592e19645d185",
"version.json": "610818ccea0567fb6e86f2d849d26564"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
