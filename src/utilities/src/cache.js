let parseCacheControl = require('parse-cache-control')

let cacheName = ''

/**
 * Set the name of the cache to work with
 * @param newCacheName string
 */
function setCacheName(newCacheName) {
  cacheName = newCacheName
}

/**
 * Get the response for the given URL. The response may be fetched from the cache if it's already present and not too old
 * or may be fetched fromn the server and stored in the cache before being returned. Execution time of this method will depend
 * from the network connection
 * @param url The url to fetch
 * @returns {Promise<Response>}
 */
function get (url) {
  return caches.open(cacheName).then(cache =>
    // Start by checking if the requested url isn't already stored
    cache.match(url).then(response => {
      // Is the request missing from the cache ?
      if (response === undefined) {
        // The request if missing, let's fetch it
        return add(url)
      }

      // We have the request, let's decode it
      // Get the request max-age in seconds as set by the server
      let cacheControl = response.headers.get('Cache-Control')
      let maxAge = cacheControl !== null ? parseCacheControl(cacheControl)['max-age'] : 3600 // If no max-age directive, assume 1 hour

      // Get the request date
      let requestDate = new Date(response.headers.get('Date'))

      // Check the response hasn't exceeded its max age
      if (Date.now() - requestDate.getTime() > maxAge * 1000) {
        // The request is too old, let's refresh it
        // We do not return the refreshed response as we do not want to slow down the application. We return the existing
        // response even though it is outdated, while it gets refreshed in the background.
        // TODO: use max-stale or else to control more this behaviour
        add(url)
      }

      // Response is fine, return it as is
      return response
    })
  )
}

/**
 * Get the response from the given url and return only it as JSON. The response headers and other informations will not
 * be returned by this method. This method uses the `get` method to get its data
 *
 * @param url
 * @returns {Promise<Object>}
 */
function getJson (url) {
  return get(url).then(response => response.json())
}

/**
 * Get the image from the given url and return it with a url for the stored data
 * @param url
 * @returns URL
 */
function getImage (url) {
  return get(url)
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
}

/**
 * Get the requested resource and store it in the cache
 * @param url
 * @returns {Promise<Response | never>}
 */
function add (url) {
  // Prepare request
  let headers = new Headers()
  // headers.append('pragma', 'no-cache')
  // headers.append('cache-control', 'no-cache')

  // Execute request
  return fetch(url, {headers: headers, mode: 'cors'}).then(response => {
    // Is the response OK ?
    if (response.status !== 200) {
      // Error in the response, return it as-is and do not store it
      return response
    }

    // `cache.put` 'consumes' the response, we need to clone it before to be able to use it after
    const resp = response.clone()

    // Store the newly retrieved response in the cache
    caches.open(cacheName).then(cache =>
      // Delete any previously stored response
      cache.delete(url).then(() =>
        cache.put(url, response)
      )
    )

    // Finally, return the response
    return resp
  })
}

/**
 * Remove the response from the cache for the given URL
 * @param url
 * @returns {Promise<boolean>}
 */
function remove (url) {
  return caches.open(cacheName).then(cache =>
    cache.delete(url)
  )
}

module.exports = {
  setCacheName: setCacheName,
  get: get,
  getJson: getJson,
  getImage: getImage,
  add: add,
  remove: remove,
}
