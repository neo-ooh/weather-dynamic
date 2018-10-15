import React, { Component } from 'react'
import WeatherAPI from 'library/WeatherAPI'

import Background from '../Background/Background'
import Captions from '../Captions/Captions'
import OneDay from '../OneDay/OneDay'

export default class Now extends Component {
  constructor (props) {
    super(props)

    this.state = {
      content: 'NOW', // TOMORROW
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
    console.log(req)
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
    console.log('Data loaded')
    if (this.todayForecast === undefined || this.tomorrowForecast === undefined) return

    if (this.todayForecast === null || this.tomorrowForecast === null) {
      this.setState({asFailed: true})
      console.log(this.todayForecast)
      console.log(this.tomorrowForecast)
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
      this.props.log('Begining display')

      setTimeout(() => {
        this.setState({
          content: 'TOMORROW'
        })
      }, 7125)
    }
  }

  render () {
    if (!this.state.isReady) {
      return null // skip
    }

    const weatherData = this.state.content === 'NOW' ? this.state.todayForecast : this.state.tomorrowForecast

    if (weatherData == null) {
      return null
    }

    return [
      this.props.shouldDisplay &&
      <Background key="background"
        content={this.state.content}
        weatherData={weatherData}
        player={this.props.player}
        location={weatherData.Location}
        log={this.props.log}/>,
      <Captions key="captions"
        content={this.state.content}
        localization={weatherData.Location}
        shouldDisplay={this.props.shouldDisplay}/>,
      <OneDay key="now-oneday"
        player={this.props.player}
        content={this.state.content}
        weatherData={weatherData} />
    ]
  }
}
