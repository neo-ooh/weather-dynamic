import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Translate, withLocalize } from 'react-localize-redux'

import getIcon from 'library/getIcon'

class OneDay extends Component {
  render () {
    const iconID = this.props.weatherData.ObsIcon ? this.props.weatherData.ObsIcon : this.props.weatherData.FxIconDay
    const iconStyle = {backgroundImage: 'url(' + getIcon(iconID) + ')'}

    const label = this.props.weatherData.ObsCondition ? this.props.weatherData.ObsCondition : this.props.weatherData.FxConditionDay

    const bottomPart = this.props.content === 'NOW' ? this.getTodayBottomSection() : this.getTomorrowBottomSection()

    return (
      <ReactCSSTransitionGroup
        transitionName="transition-oneday"
        transitionAppearTimeout={1250}
        transitionEnterTimeout={1250}
        transitionLeaveTimeout={1250}
        transitionAppear={true}
        transitionEnter={true}
        transitionLeave={true}
        component="section"
        id="OneDay">
        <div id="oneDay-wrapper" key={this.props.content + '-' + this.props.weatherData.Location.Name}>
          <div className="top-part">
            <div className="weather-label">
              <span className="label">{ label }</span>
            </div>
            <div className="weather-icon" style={iconStyle} />
          </div>
          <div className="separator"></div>
          { bottomPart }
        </div>
      </ReactCSSTransitionGroup>
    )
  }

  getTodayBottomSection () {
    return (
      <div className="bottom-part">
        <div className="temperature">
          {this.props.weatherData.TemperatureC}°
        </div>
        <div className="details">
          <div className="detail-line feels-like">
            <span className="detail-name">
              <Translate id="stats.feelsLike"/>
            </span>
            <span className="detail-value">
              {this.props.weatherData.FeelsLikeC}°
            </span>
          </div>
          <div className="detail-separator"></div>
          <div className="detail-line wind">
            <span className="detail-name">
              <Translate id="stats.wind"/>
            </span>
            <span className="detail-value">
              {this.props.weatherData.WindSpeedKMH} km/h
            </span>
          </div>
          <div className="detail-separator"></div>
          <div className="detail-line min-max">
            <div className="temperature-line max">
              <span className="detail-name">
                <Translate id="stats.max"/>
              </span>
              <span className="detail-value">
                {this.props.weatherData.TemperatureCMax}°
              </span>
            </div>
            <div className="temperature-line min">
              <span className="detail-name">
                <Translate id="stats.min"/>
              </span>
              <span className="detail-value">
                {this.props.weatherData.TemperatureCMin}°
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getTomorrowBottomSection () {
    return (
      <div className="bottom-part">
        <div className="forecast">
          <div className="max">
            {this.props.weatherData.TemperatureCMax}°
          </div>
          <div className="min">
            {this.props.weatherData.TemperatureCMin}°
          </div>
        </div>
        <div className="details wide margin">
          <div className="detail-line wind">
            <span className="detail-name">
              <Translate id="stats.wind"/>
            </span>
            <span className="detail-value">
              {this.props.weatherData.WindSpeedKMH} km/h
            </span>
          </div>
          <div className="detail-separator"></div>
          <div className="detail-line feels-like">
            <span className="detail-name">
              <Translate id="stats.pop"/>
            </span>
            <span className="detail-value">
              {this.props.weatherData.POPPercentDay}%
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default withLocalize(OneDay)
