import React, { Component } from 'react'
import WeatherAPI from 'library/WeatherAPI'

import Captions from '../Captions/Captions'
import OneDay from '../OneDay/OneDay'

export default class Now extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isReady: false,
      asFailed: false,
      weatherLoaded: false,
      todayForecast: null,
      tomorrowForecast: null
    }
  }

  todayForecast = undefined
  tomorrowForecast = undefined

  loadWeatherData () {
    if (this.state.weatherLoaded) {
      return
    }

    this.setState({
      weatherLoaded: true
    })

    this.props.log('Loading weather data')

    let getWeather = new WeatherAPI()

    getWeather.now(...this.props.localization)
      .then(this.handleFailedRequests)
      .then(req => {
        if (req !== null) {
          this.todayForecast = req
          this.checkLoadedData()
        }
      })

    getWeather.tomorrow(...this.props.localization)
      .then(this.handleFailedRequests)
      .then(req => {
        if (req !== null) {
          this.tomorrowForecast = req
          this.checkLoadedData()
        }
      })
  }

  handleFailedRequests = req => {
    if (req === null) {
      return null
    }

    if (req === 'BAD CONTENT') {
      return null
    }

    if (!req.hasOwnProperty('content')) {
      return null
    }

    if ('error' in req.content) {
      return null
    }

    return req.content
  }

  checkLoadedData = () => {
    if (this.todayForecast === undefined || this.tomorrowForecast === undefined) return

    if (this.todayForecast === null || this.tomorrowForecast === null) {
      this.setState({asFailed: true})
      return this.props.onError('Error while loading weather data')
    }

    this.setState({
      isReady: true,
      todayForecast: this.todayForecast,
      tomorrowForecast: this.tomorrowForecast
    })

    this.props.log('Weather data loaded')
  }

  componentDidMount () {
    this.loadWeatherData()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.shouldDisplay && this.props.shouldDisplay) {
      this.props.log('Beginning display')

      this.props.setLocation(this.state.todayForecast.Location)
      this.props.onWeatherData(this.state.todayForecast)

      setTimeout(() => {
        this.props.onContentUpdate('TOMORROW')

        this.props.onWeatherData(this.state.tomorrowForecast)

      }, this.props.player.design.name === 'DCA' ? 4600 : 7125)
    }
  }

  render () {
    if (!this.state.isReady) {
      return null // skip
    }

    const weatherData = this.props.content === 'NOW' ? this.state.todayForecast : this.state.tomorrowForecast

    if (weatherData == null) {
      return null
    }

    return [
      <Captions key="captions"
        content={this.props.content}
        localization={weatherData.Location}
        shouldDisplay={this.props.shouldDisplay}
        player={this.props.player} />,
      <OneDay key="now-oneday"
        player={this.props.player}
        content={this.props.content}
        weatherData={weatherData} />
    ]
  }
}
