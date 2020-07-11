import React, {Component} from 'react'

import parseAdress from 'parse-address-string'
import querystring from 'querystring'
import URL from 'url-parse'
import Backgrounds from 'library/Backgrounds'
import settings from 'library/settings'

import WeatherAPI from 'library/WeatherAPI'
import {isBroadSignPlayer, BroadSignActions, resolveDesign, cache} from 'dynamics-utilities'

import ErrorBoundary from './scenes/Error/ErrorBoundary'
import Error from './scenes/Error/Error'
import Log from './scenes/Log/Log'

import Forecast from './scenes/Forecast/Forecast'
import Hourly from './scenes/Hourly/Hourly'
import National from './scenes/National/National'
import Now from './scenes/Now/Now'
import Legal from './scenes/Legal/Legal'

import './style/App.scss'

import {IntlProvider } from 'react-intl'
import frenchMessages from './assets/locales/fr-CA'
import englishMessages from './assets/locales/en-CA'
import Background from './scenes/Background/Background'

// LOCALIZATION
const messages = {
  'fr-FR': frenchMessages,
  'fr-CA': frenchMessages,
  'en-CA': englishMessages,
}

class App extends Component {
  contents = {
    'NOW': Now,
    'TOMORROW': Now,
    'HOURLY': Hourly,
    'FORECAST': Forecast,
    'NATIONAL': National
  }

  constructor(props) {
    super(props)

    // Set up cache
    cache.setCacheName('weather-dynamic')

    const urlParameters = querystring.parse((new URL(document.location)).query.substr(1))

    // BROADSIGN ----
    // Listen for start of display calls
    document.getElementById('broadsign-holder').addEventListener('click', this.broadSignPlay)

    // Build the state
    this.state = {
      // API Key
      APIKey: urlParameters.key || '',

      // Player infos
      player: {
        location: null,
        design: resolveDesign(urlParameters.design || urlParameters.support),
      },

      // What to display
      content: urlParameters.content ? urlParameters.content.toUpperCase() in this.contents ? urlParameters.content.toUpperCase() : 'NATIONAL' : 'NATIONAL', // TODAY, TOMORROW, FORECAST, NATIONAL
      weatherData: null,
      location: { Latitude: 49.895077, Longitude: -97.138451 },

      // Locale (the language)
      locale: urlParameters.locale || 'en-CA',

      // Localization (the position)
      localization: null,

      // Where are we at ?
      inited: false,
      display: false,
      onError: false,
      errorMsg: 'Screen localization could not be determined',

      // Debugging
      production: process.env.REACT_APP_ENV === 'production',
      logs: []
    }

    WeatherAPI.setLocale(this.state.locale)
    WeatherAPI.setAPIKey(this.state.APIKey)
  }

  componentDidMount() {
    this.checkCache().then(this.detectLocation())
  }

  checkCache() {
    // Check cache state and erase if new day
    const lastUpdate = localStorage.getItem('weather-dynamic.refresh')
    if (lastUpdate === null) {
      let d = new Date();
      d.setHours(0, 0, 0, 0)
      return Promise.resolve().then(localStorage.setItem('weather-dynamic.refresh', d.getTime()))
    }

    const refreshRate = this.state.production ? 1000 * 3600 * 24 : 300 * 1000
    if (Date.now() - lastUpdate > refreshRate) {
      return caches.delete(settings.cacheName).then(() => {
        this.log('Cache Cleaned')
        let d = new Date();
        this.state.production && d.setHours(0, 0, 0, 0)
        localStorage.setItem('weather-dynamic.refresh', d.getTime())
      })
    }

    return Promise.resolve()
  }

  detectLocation() {
    // LOCALIZATION ----

    if (isBroadSignPlayer) {
      this.log('Detecting location using BroadSign variables')
      this.log('Player location: ' + decodeURIComponent(window.BroadSignObject.display_unit_address))

      return parseAdress(decodeURIComponent(window.BroadSignObject.display_unit_address), (error, address) => {
        if (error) {
          return this.onError('Could not parse adresse: ' + decodeURIComponent(window.BroadSignObject.display_unit_address))
        }

        let country = 'CA'
        let province = address.state
        let city = address.city

        this.log('Country: ' + country + ', Province: ' + province + ', City: ' + city)

        this.setState(oldState => ({
          localization: [country, province, city],
          onError: city === null,
          errorMsg: city === null ? oldState.errorMsg : ''
        }), this.initLocalization)
      })
    }

    this.log('Detecting location using URL parameters')
    const urlParameters = querystring.parse((new URL(document.location)).query.substr(1))

    let country = urlParameters.country || 'CA'
    let province = urlParameters.province || '--'
    let city = urlParameters.city || '-'

    this.log('Country: ' + country + ', Province: ' + province + ', City: ' + city)

    this.setState(oldState => ({
      localization: [country, province, city],
      onError: city === '-',
      errorMsg: city === '-' ? oldState.errorMsg : ''
    }), this.initLocalization)
  }

  broadSignPlay = () => {
    this.log("Broadsign Play");

    this.setState({
      display: true
    })

    if (this.state.onError && this.state.production) {
      BroadSignActions.stopDisplay()
    }
  }

  // Init localization
  initLocalization() {
    let language = this.state.localization[1] === 'QC' ? 'fr-CA' : 'en-CA'

    const urlParameters = querystring.parse((new URL(document.location)).query.substr(1))
    language = urlParameters.locale || language

    WeatherAPI.setLocale(language)

    this.setState({
      locale: language,
      inited: true
    })

    Backgrounds.init(this.state.localization, this.state.player.design.name, this.log)
  }

  log = msg => {
    this.setState(state => ({
      logs: [...state.logs, msg]
    }))
  }

  componentDidCatch(error) {
    this.onError(error)
  }

  onWeatherData = weatherData => {
    this.setState({
      weatherData: weatherData
    })
  }

  setLocation = newLocation => {
    this.setState({
      location: newLocation
    })
  }

  onContentUpdate = newContent => {
    this.setState({
      content: newContent
    })
  }

  onError = (message) => {
    this.setState({
      onError: true,
      errorMsg: message
    });

    console.log(message);

    if (this.state.production && !this.state.display) {
      BroadSignActions.skipDisplay();
      return
    }

    if (this.state.production && this.state.display) {
      BroadSignActions.stopDisplay();
      return
    }
  }

  render() {
    if (!this.state.inited ||
      (this.state.onError && this.state.production)) {
      return null
    }

    const logs = this.state.production ? null : <Log logs={ this.state.logs } key="logs"/>

    if (this.state.localization === null) {
      return logs
    }

    const Scene = this.contents[this.state.content]

    return (
      <IntlProvider
        locale={ this.state.locale }
        messages={ messages[this.state.locale] }>
        <section id="main-wrapper">
          { this.state.display &&
            <Background key="background"
                      content={this.state.content}
                      weatherData={ this.state.weatherData }
                      player={ this.state.player }
                      location={ this.state.location }
                      log={ this.log }/> }
            <main
              className={ this.state.player.design.name }
              style={ {transform: 'scale(' + this.state.player.design.scale + ')'} }>
              <ErrorBoundary>
                { this.state.onError && <Error message={ this.state.errorMsg } key="error"/> }
                { !this.state.onError &&
                <Scene
                  key="scene"
                  player={ this.state.player }
                  content={ this.state.content }
                  onWeatherData={ this.onWeatherData }
                  setLocation={ this.setLocation }
                  onContentUpdate={ this.onContentUpdate }
                  onError={ this.onError }
                  localization={ this.state.localization }
                  shouldDisplay={ this.state.display }
                  log={ this.log }
                /> }
                <Legal
                  key="legal"
                  player={ this.state.player }
                  content={ this.state.content }
                  locale={ this.state.locale }
                  localization={ this.state.localization }/>
                {/*{ logs }*/ }
              </ErrorBoundary>
            </main>
        </section>
      </IntlProvider>
    )
  }
}

export default App
