import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { injectIntl } from "react-intl"
import messages from '../../library/messages'

import getIcon from 'library/getIcon'

class OneDay extends Component {
  render () {
    if(!this.props.weatherData) return null

    const iconID = this.props.weatherData.ObsIcon || this.props.weatherData.FxIconDay
    const iconStyle = {backgroundImage: 'url(' + getIcon(iconID) + ')'}

    const label = this.props.weatherData.ObsCondition || this.props.weatherData.FxConditionDay
    const labelClass = label !== undefined ? (label.length > 11 ? 'small' : '') : ''

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
        className={this.props.player.design.name}
        id="OneDay">
        <div id="oneDay-wrapper" className={this.props.content} key={this.props.content + '-' + this.props.weatherData.Location.Name}>
          <div className="top-part">
            <div className={'weather-label ' + labelClass}>
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
      <div className="bottom-part today">
        <div className={ 'temperature ' + (this.props.weatherData.TemperatureC <= 0 ? 'bellow-zero ' : ' ') + (this.props.weatherData.TemperatureC.length > 2 ? 'shrink ' : ' ')}>
          {this.props.weatherData.TemperatureC}°
        </div>
        <div className="details">
          <div className="detail-line feels-like">
            <span className="detail-name">
              { this.props.intl.formatMessage(messages.feelsLike) }
            </span>
            <span className="detail-value">
              {this.props.weatherData.FeelsLikeC}°
            </span>
          </div>
          <div className="detail-separator"></div>
          <div className="detail-line wind">
            <span className="detail-name">
              { this.props.intl.formatMessage(messages.wind) }
            </span>
            <span className="detail-value">
              {this.props.weatherData.WindSpeedKMH} km/h
            </span>
          </div>
          <div className="detail-separator"></div>
          <div className="detail-line min-max">
            <div className="temperature-line max">
              <span className="detail-name">
              { this.props.intl.formatMessage(messages.max) }
              </span>
              <span className="detail-value">
                {this.props.weatherData.TemperatureCMax}°
              </span>
            </div>
            <div className="temperature-line min">
              <span className="detail-name">
              { this.props.intl.formatMessage(messages.min) }
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
      <div className="bottom-part tomorrow">
        <div className="forecast">
          <div className="max">
            {this.props.weatherData.TemperatureCMax}°
          </div>
          <div className="min">
            {this.props.weatherData.TemperatureCMin}°
          </div>
        </div>
        <div className="details wide centered">
          <div className="detail-line wind">
            <span className="detail-name">
              { this.props.intl.formatMessage(messages.wind) }
            </span>
            <span className="detail-value">
              {this.props.weatherData.WindSpeedKMH} km/h
            </span>
          </div>
          <div className="detail-separator"></div>
          <div className="detail-line feels-like">
            <span className="detail-name">
              { this.props.intl.formatMessage(messages.pop) }
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

export default injectIntl(OneDay)
