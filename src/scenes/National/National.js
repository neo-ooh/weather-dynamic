import React, { Component } from 'react'
import { withLocalize } from 'react-localize-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import WeatherAPI from 'library/WeatherAPI'
import Background from '../Background/Background'
import Captions from '../Captions/Captions'

import CityLine from './CityLine/CityLine'

class National extends Component {
  constructor (props) {
    super(props)

    this.state = {
      status: 'FIRST',
      isReady: false,
      asFailed: false,
      weatherLoaded: false,
      firstScreen: null,
      secondScreen: null,
      location: {
        Latitude: 49.895077,
        Longitude: -97.138451
      }
    }
  }

  loadWeatherData () {
    if (this.state.weatherLoaded) {
      return
    }

    this.setState({
      weatherLoaded: true
    })

    this.props.log('Loading weather data')

    let getWeather = new WeatherAPI()

    getWeather.national()
      .then(this.handleFailedRequests)
      .then(req => {
        if (req !== null) {
          return this.setState({
            firstScreen: req.slice(0, 5),
            secondScreen: req.slice(5, 10),
            isReady: true
          })
        }

        // failed
        this.setState({
          asFailed: true
        })

        this.props.onError('Error while loading weather data')
      })

    this.props.log('Weather data loaded')
  }

  handleFailedRequests (req) {
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

  componentDidMount () {
    this.loadWeatherData()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.shouldDisplay && this.props.shouldDisplay) {
      this.props.log('Beginning display')

      setTimeout(() => {
        this.setState({
          status: 'SECOND'
        })
      }, this.props.player.support.design === 'DCA' ? 4600 : 7125)
    }
  }

  render () {
    if (!this.state.isReady) {
      return null // skip
    }

    const weatherData = this.state.status === 'FIRST' ? this.state.firstScreen : this.state.secondScreen

    const cities = weatherData.map((city, key) =>
      <CityLine weatherData={city} key={key + '-' + this.state.status} support={this.props.player.support}/>)

    return [
      this.props.shouldDisplay &&
      <Background key="background"
        content={this.props.content}
        weatherData={weatherData}
        player={this.props.player}
        location={this.state.location}
        log={this.props.log}/>,
      <Captions key="captions"
        content={this.props.content}
        player={this.props.player}
        shouldDisplay={this.props.shouldDisplay}/>,
      <section id="FCL-National" className={this.props.player.support.design} key="national-lines">
        <ReactCSSTransitionGroup
          transitionName="transition-national"
          transitionAppearTimeout={1250}
          transitionEnterTimeout={1250}
          transitionLeaveTimeout={1250}
          transitionAppear={true}
          transitionEnter={true}
          transitionLeave={true}
          component="div"
          id="national-wrapper"
          className={this.props.player.support.design} >
          { this.props.shouldDisplay && cities }
        </ReactCSSTransitionGroup>
      </section>
    ]
  }
}

export default withLocalize(National)
