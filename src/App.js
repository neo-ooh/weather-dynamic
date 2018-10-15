import React, { Component } from 'react'

import { renderToStaticMarkup } from 'react-dom/server'
import { withLocalize } from 'react-localize-redux'
import parseAdress from 'parse-address-string'
import windowSize from 'react-window-size'
import querystring from 'querystring'
import URL from 'url-parse'
import Backgrounds from 'library/Backgrounds'

import WeatherAPI from 'library/WeatherAPI'
import { stopDisplay } from './library/Broadsignlink'

import ErrorBoundary from './scenes/Error/ErrorBoundary'
import Forecast from './scenes/Forecast/Forecast'
import National from './scenes/National/National'
import Now from './scenes/Now/Now'
import Error from './scenes/Error/Error'
import Log from './scenes/Log/Log'

import fr_caLocalization from 'assets/localizations/fr-CA.json'
import en_caLocalization from 'assets/localizations/en-CA.json'

import './style/App.scss'

class App extends Component {
  contents = {
    'NOW': Now,
    'TOMORROW': Now,
    'FORECAST': Forecast,
    'NATIONAL': National
  }

  constructor (props) {
    super(props)

    const urlParameters = querystring.parse((new URL(document.location)).query.substr(1))

    // BROADSIGN ----
    // Listen for start of display calls
    document.getElementById('broadsign-holder').addEventListener('click', this.broadSignPlay)

    // Detect if this is a broadsign player
    const broadSignPlayer = typeof window.BroadSignObject !== 'undefined'

    // Build the state
    this.state = {
      // API Key
      APIKey: urlParameters.key || '',

      // Player infos
      player: {
        isBroadSign: broadSignPlayer,
        width: props.windowWidth,
        height: props.windowHeight,
        location: null
      },

      // What to display
      content: urlParameters.content ? urlParameters.content.toUpperCase() in this.contents ? urlParameters.content.toUpperCase() : 'NATIONAL' : 'NATIONAL', // TODAY, TOMORROW, FORECAST, NATIONAL
      support: urlParameters.support || 'FCL',

      // Localization (the language)
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

    // Store backgrounds
  }

  componentDidMount () {
    // LOCALIZATION ----

    // parseAdress('3700 Saint-Patrick-Street, Montreal, QC H4E 1A1', console.log)

    if (this.state.player.isBroadSign) {
      this.log('Detecting location using BroadSign variables')
      // Object.keys(window.BroadSignObject).map(this.log)
      return parseAdress(decodeURIComponent(window.BroadSignObject.display_unit_address), (error, address) => {
        if (error) {
          return this.onError('Could not parse adresse : ' + decodeURIComponent(window.BroadSignObject.display_unit_address))
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
    let province = urlParameters.province || ''
    let city = urlParameters.city || ''

    this.log('Country: ' + country + ', Province: ' + province + ', City: ' + city)

    this.setState(oldState => ({
      localization: [country, province, city],
      onError: city === null,
      errorMsg: city === null ? oldState.errorMsg : ''
    }), this.initLocalization)
  }

  broadSignPlay = () => {
    this.setState({
      display: true
    })

    if (!window.BroadSignObject) {
      console.log('No BroadSignObject has been found')
      console.log('This is not a BroadSign Player')
    }
  }

  // Init localization
  initLocalization () {
    this.props.initialize({
      languages: [
        {name: 'Canadian English', code: 'en-CA'},
        {name: 'Francais Canadien', code: 'fr-CA'}
      ],
      options: {renderToStaticMarkup}
    })

    this.props.addTranslationForLanguage(fr_caLocalization, 'fr-CA')
    this.props.addTranslationForLanguage(en_caLocalization, 'en-CA')

    let language = this.state.localization[1] === 'QC' ? 'fr-CA' : 'en-CA'

    const urlParameters = querystring.parse((new URL(document.location)).query.substr(1))
    language = urlParameters.locale || language

    this.props.setActiveLanguage(language)
    WeatherAPI.setLocale(language)

    this.setState({
      locale: language,
      inited: true
    })

    Backgrounds.init(this.state.localization)
  }

  log = msg => {
    this.setState(state => ({
      logs: [...state.logs, msg]
    }))
  }

  componentDidCatch (error) {
    this.onError(error)
  }

  onError = (message) => {
    this.setState({
      onError: true,
      errorMsg: message
    })

    if (this.state.production) {
      stopDisplay()
    }
  }

  render () {
    if(!this.state.inited) return null

    if (this.state.onError && this.state.display) {
      // skip
    }

    const logs = this.state.production ? null : <Log logs={this.state.logs} key="logs"/>

    if (this.state.localization === null) {
      return logs
    }

    const Scene = this.contents[this.state.content]

    return (
      <ErrorBoundary>
        {this.state.onError && <Error message={this.state.errorMsg} key="error"/>}
        { !this.state.onError &&
        <Scene
          key="scene"
          player={this.state.player}
          content={this.state.content}
          weatherData={this.state.weatherData}
          onError={this.onError}
          localization={this.state.localization}
          shouldDisplay={this.state.display}
          log={this.log}
        /> }
        { logs }
      </ErrorBoundary>
    )
  }
}

export default withLocalize(windowSize(App))
