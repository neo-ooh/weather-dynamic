import SunCalc from 'suncalc'
import API from './WeatherAPI'
import settings from './settings'

const periods = ['MORNING', 'DAY', 'DUSK', 'NIGHT']

class Backgrounds
{
  _backgrounds = []
  _selectionMethod = 'WEATHER'

  init(location, log) {
    const api = new API()
    Promise.all(
      periods.map(period =>
        api.backgrounds(period, ...location).then(({ content }) => {
          if (typeof content === 'undefined') return

          this._backgrounds = this._backgrounds.concat(content.backgrounds)
          this._selectionMethod = content.selection
        })
      )
    ).then(() => {
      log(this._backgrounds.length + ' background.s found')
      caches.open(settings.cacheName).then(cache =>
        cache.keys().then(storedRequests => {
          const keys = storedRequests.map(key => key.url)
          cache.addAll(this._backgrounds
            .map(background => background.path.replace(/\\\//g, "/"))
            .filter(path => !keys.includes(path)))
        })
      )
    })
  }

  get(weather, geo) {
    const period = this.getPeriod(geo)
    const filteredBackgrounds = this._backgrounds
      .filter(background => background.period === period)

    if(this._selectionMethod === 'RANDOM') return this.getRandom(filteredBackgrounds)

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

