import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import WeatherAPI from 'library/WeatherAPI'
import getIcon from '../../library/getIcon'
import {injectIntl} from 'react-intl'
import messages from '../../library/messages'

import { getSunTimes } from '../../library/Backgrounds'
import Hour from './Hour/Hour'

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

    getWeather.hourly(...this.props.localization)
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

    // const columns = this.state.weatherData.LongTermPeriod.slice(0, 5).map(day =>
    //   <DayColumn
    //     weatherData={day}
    //     key={day.Period}
    //     player={this.props.player}/>)

    const now = this.state.weatherData['HourlyPeriod'][0]
    const iconStyle = {backgroundImage: 'url(' + getIcon(now.FxIcon) + ')'}

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

    return [
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
            <div className="icon" style={iconStyle}></div>
            <div className="temperature">{now.TemperatureC}°</div>
            <hr className="h-separator" />
            <div className="feels-like">
              { this.props.intl.formatMessage(messages['feelsLikeLng']) } {now.FeelsLikeC}°
            </div>
            <div className="sunset-sunrise"><span>
              { this.props.intl.formatMessage(messages[sunsetSunriseMsg]) }&nbsp;
              {sunsetSunrise.toLocaleString('en-CA', {hour: 'numeric', minute: 'numeric', hour12: true})}
            </span></div>
          </div>
      </ReactCSSTransitionGroup>,
      <ReactCSSTransitionGroup
        transitionName="transition-hours"
        transitionAppearTimeout={1250}
        transitionEnterTimeout={1250}
        transitionLeaveTimeout={1250}
        transitionAppear={true}
        transitionEnter={true}
        transitionLeave={true}
        component="section"
        id="hours"
        key="hours">
        { this.state.weatherData.HourlyPeriod.slice(1, 7).map(hour => (
          <Hour data={hour} key={hour.TimestampLocal} />
        ))}
      </ReactCSSTransitionGroup>
    ]

  }
}

export default injectIntl(Forecast)
