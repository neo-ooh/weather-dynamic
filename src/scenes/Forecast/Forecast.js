import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { withLocalize } from 'react-localize-redux'
import WeatherAPI from 'library/WeatherAPI'

import Background from '../Background/Background'
import Captions from '../Captions/Captions'

import DayColumn from './DayColumn/DayColumn'

class Forecast extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isReady: false,
      asFailed: false,
      weatherLoaded: false,
      weatherData: null
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

    getWeather.forecast(...this.props.localization)
      .then(this.handleFailedRequests)
      .then(req => {
        if (req != null) {
          return this.setState({
            weatherData: req,
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
    }
  }

  render () {
    if (!this.state.isReady) {
      return null // skip
    }

    const columns = this.state.weatherData.LongTermPeriod.slice(0, 5).map(day =>
      <DayColumn weatherData={day} key={day.Period}/>)

    return [
      this.props.shouldDisplay &&
      <Background key="background"
        content={this.props.content}
        weatherData={this.state.weatherData}
        player={this.props.player}
        location={this.state.weatherData.Location}
        log={this.props.log} />,
      <Captions key="captions"
        content={this.props.content}
        player={this.props.player}
        localization={this.state.weatherData.Location}
        shouldDisplay={this.props.shouldDisplay}/>,
      <ReactCSSTransitionGroup
        transitionName="transition-forecast"
        transitionAppearTimeout={1250}
        transitionEnterTimeout={1250}
        transitionLeaveTimeout={1250}
        transitionAppear={true}
        transitionEnter={true}
        transitionLeave={true}
        component="div"
        id="FCL-Forecast"
        className={this.props.player.support.design}
        key="columns">
        { this.props.shouldDisplay && columns }
      </ReactCSSTransitionGroup>
    ]
  }
}

export default withLocalize(Forecast)
