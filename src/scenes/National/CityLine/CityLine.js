import React, { Component } from 'react'
import { withLocalize } from 'react-localize-redux'

import getIcon from 'library/getIcon'

class National extends Component {
  render () {
    const iconID = this.props.weatherData.ObsIcon ? this.props.weatherData.ObsIcon : this.props.weatherData.FxIconDay
    const iconStyle = {backgroundImage: 'url(' + getIcon(iconID) + ')'}

    return (
      <div className={'city-line ' + this.props.support.design}>
        <div className="temperature-block">
          <span className="temperature">
            { this.props.weatherData.TemperatureC }°
          </span>
        </div>
        <div className="weather-icon" style={iconStyle}></div>
        <div className="city-name">
          { this.props.weatherData.Location.Name }
        </div>
      </div>
    )
  }
}

export default withLocalize(National)
