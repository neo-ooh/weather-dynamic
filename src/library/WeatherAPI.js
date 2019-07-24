import { cache } from 'dynamics-utilities'

const apiURL = process.env.REACT_APP_API_URL

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
    const url = apiURL + '/national' + this.getParams()
    return cache.getJson(url)
  }

  backgrounds (period, support, country, province, city) {
    return this.getLocalized('/backgrounds/' + period + '/' + support, country, province, city)
  }

  getLocalized (endpoint, country, province, city) {
    return cache.getJson(apiURL + endpoint + '/' + country + '/' + province + '/' + city + this.getParams())
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
