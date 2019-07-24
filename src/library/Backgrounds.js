import SunCalc from 'suncalc'
import API from './WeatherAPI'
import settings from './settings'
import { cache } from 'dynamics-utilities'

const periods = ['MORNING', 'DAY', 'DUSK', 'NIGHT']

class Backgrounds
{
  _backgrounds = {}
  _selectionMethod = 'WEATHER'

  init(location, support, log) {
    const api = new API()
    Promise.all(
      periods.map(period =>
        api.backgrounds(period, support, ...location).then((response) => {
          if (typeof response.content === 'undefined') return

          this._backgrounds[period] = response.content.backgrounds
          this._selectionMethod = response.content.selection

          if(response.content.backgrounds.length === 0) {
            cache.remove(response.url)
          }
        })
      )
    ).then(() => {
      caches.open(settings.cacheName).then(cache =>
        cache.keys().then(storedRequests => {
          const keys = storedRequests.map(key => key.url)
          var filteredBackground = []
          for (var period in this._backgrounds) {
            let filteredPeriod = this._backgrounds[period]
              .map(background => background.path.replace(/\\\//g, "/"))
              .filter(path => !keys.includes(path))
              filteredBackground.push(...filteredPeriod)
          }
          cache.addAll([...new Set(filteredBackground)])
        })
      )
    })
  }

  get(weather, geo) {
    const period = this.getPeriod(geo)
    if(this._selectionMethod === 'RANDOM') return this.getRandom(this._backgrounds[period])

    const filteredBackgrounds = this._backgrounds[period]

    return this.getWeather(filteredBackgrounds, weather)
  }

  getPeriod(geo) {
    const currDate = new Date()
    const sunTimes = SunCalc.getTimes(currDate, geo.lat, geo.lng)

    let currPeriod

    // Select current Period
    if (currDate < sunTimes.sunrise) {
      currPeriod = 'NIGHT'
    } else if (currDate < sunTimes.goldenHourEnd) {
      currPeriod = 'MORNING'
    } else if (currDate < sunTimes.goldenHour) {
      currPeriod = 'DAY'
    } else if (currDate < sunTimes.night) {
      currPeriod = 'DUSK'
    } else {
      currPeriod = 'NIGHT'
    }

    return currPeriod
  }

  getRandom(filteredBackgrounds) {
    if(filteredBackgrounds.length === 0) return ''
    return filteredBackgrounds[Math.floor(Math.random() * filteredBackgrounds.length)].path.replace(/\\\//g, "/")
  }

  getWeather(filteredBackgrounds, weather) {
    const bckgIndex = filteredBackgrounds.findIndex(background => background.weather === weather)
    return bckgIndex === -1 ? '' : filteredBackgrounds[bckgIndex].path.replace(/\\\//g, "/")
  }
}

export default new Backgrounds()

