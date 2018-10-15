import settings from './settings'

export function get (url) {
  // Start by checking if the requested url isn't already stored
  return caches.open(settings.cacheName).then(cache =>
    cache.match(url).then(response => {
      // Is the request missing from the cache
      if (response === undefined) {
        return add(url).then(response => response.json().then(data => data))
      }

      // decode response
      return response.json().then(data => {
        // Is the request too old
        const responseTime = data.timestamp * 1000

        if (Date.now() - responseTime > data.refresh * 1000) {
          return add(url).then(response => response.json().then(data => data))
        }

        // Request OK, let's return it
        return data.content
      })
    })
  )
}

export function add (url) {
  let headers = new Headers()
  headers.append('pragma', 'no-cache')
  headers.append('cache-control', 'no-cache')

  return fetch(url, {headers: headers, mode: 'cors'}).then(response => {
    if (response.status !== 200) {
      return response
    }

    const resp = response.clone()

    caches.open(settings.cacheName).then(cache =>
      cache.delete(url).then(() =>
        cache.put(url, response)
      )
    )

    return resp
  })
}

export function remove (url) {
  return caches.open(settings.cacheName).then(cache =>
    cache.delete(url)
  )
}
