import { get } from './CacheService'
import settings from './settings'

export default class WeatherAPI {
  constructor () {
    WeatherAPI.options = {
      params: {
        locale: WeatherAPI.locale,
        key: WeatherAPI.APIKey
      }
    }
  }

  now (country, province, city) {
    return this.getLocalized('/now', country, province, city)
  }

  tomorrow (country, province, city) {
    return this.getLocalized('/tomorrow', country, province, city)
  }

  forecast (country, province, city) {
    return this.getLocalized('/forecast', country, province, city)
  }

  national () {
    const url = settings.apiURL + '/national' + this.getParams()
    return get(url)
  }

  backgrounds (period, country, province, city) {
    return this.getLocalized('/backgrounds/' + period, country, province, city)
  }

  getLocalized (endpoint, country, province, city) {
    return get(settings.apiURL + endpoint + '/' + country + '/' + province + '/' + city + this.getParams()).then(resp => {
      return resp
    })
  }
  getParams () {
    return '?locale=' + WeatherAPI.locale + '&key=' + WeatherAPI.APIKey
  }

  // ///////
  // LOCALE
  static locale = ''
  static APIKey = ''
  static onError

  static setLocale (locale) {
    WeatherAPI.locale = locale
  }

  static setAPIKey (key) {
    WeatherAPI.APIKey = key
  }

  // OPTIONS
  static options = {}
}
