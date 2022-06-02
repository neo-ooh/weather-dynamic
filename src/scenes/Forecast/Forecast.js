import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import WeatherAPI from 'library/WeatherAPI'

import Captions from '../Captions/Captions'

import DayColumn from './DayColumn/DayColumn'
import messages from '../../library/messages'
import {getSunTimes} from 'library/Backgrounds'

import { injectIntl } from 'react-intl'

class Forecast extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isReady: false,
      asFailed: false,
      weatherLoaded: false,
      weatherData: null,
      todayForecast: null,
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
          this.setState({
            weatherData: req,
            isReady: true
          })

          this.props.setLocation(req.Location)
          this.props.onWeatherData(req)

          return
        }

        // failed
        this.setState({
          asFailed: true
        })
        this.props.onError('Error while loading weather data')
      })

    if (this.props.player.design.name === 'PML') {
      getWeather.now(...this.props.localization)
        .then(this.handleFailedRequests)
        .then(req => {
          if (req !== null) {
            this.setState({
              todayForecast: req,
            })
          }
        })
    }

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
      <DayColumn
        weatherData={day}
        key={day.Period}
        player={this.props.player}/>)

    var nowJSX = null

    if (this.props.player.design.name === 'PML' && this.state.todayForecast != null) {
      const now = this.state.todayForecast

      let geo

      if (this.props.player.isBroadSign) {
        geo = {
          lat: window.BroadSignObject.display_unit_lat_long.split(',')[0],
          lng: window.BroadSignObject.display_unit_lat_long.split(',')[1]
        }
      } else {
        geo = {
          lat: this.state.weatherData.Location.Latitude,
          lng: this.state.weatherData.Location.Longitude
        }
      }

      const currDate = new Date()
      const sunTimes = getSunTimes(currDate, geo.lat ,geo.lng)

      const sunsetSunrise = currDate < sunTimes.sunrise ? sunTimes.sunrise : sunTimes.sunset
      const sunsetSunriseMsg = currDate < sunTimes.sunrise ? 'sunrise' : 'sunset'

      nowJSX = (
        <ReactCSSTransitionGroup
          transitionName="transition-hour-now"
          transitionAppearTimeout={1250}
          transitionEnterTimeout={1250}
          transitionLeaveTimeout={1250}
          transitionAppear={true}
          transitionEnter={true}
          transitionLeave={true}
          component="section"
          key="hour-now">
          <div id="hourly-now">
            <div className="now-caption">{ this.props.intl.formatMessage(messages['now']) }</div>
            <div className="temperature">{now.TemperatureC}°</div>
            <hr className="v-separator" />
            <div className="feels-like">
              { this.props.intl.formatMessage(messages['feelsLikeLng']) } {now.FeelsLikeC}°
            </div>
            <div className="sunset-sunrise"><span>
              { this.props.intl.formatMessage(messages[sunsetSunriseMsg]) }&nbsp;
              {sunsetSunrise.toLocaleString('en-CA', {hour: 'numeric', minute: 'numeric', hour12: true})}
            </span></div>
          </div>
        </ReactCSSTransitionGroup>
      )
    }

    return [
      nowJSX,
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
        id="forecast"
        className={this.props.player.design.name}
        key="columns">
        { this.props.shouldDisplay && columns }
      </ReactCSSTransitionGroup>
    ]
  }
}

export default injectIntl(Forecast)
