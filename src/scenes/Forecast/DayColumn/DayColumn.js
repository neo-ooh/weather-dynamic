import React, { Component} from 'react'
import { Translate, withLocalize } from 'react-localize-redux'

import getIcon from 'library/getIcon'

class DayColumn extends Component {
  render () {
    // Day
    const d = new Date()
    const currDay = d.getDay()
    const forecastDay = (currDay + parseInt(this.props.weatherData.Period, 10)) % 7

    // Icon
    const iconID = this.props.weatherData.FxIconDay
    const iconStyle = {backgroundImage: 'url(' + getIcon(iconID) + ')'}

    return (
      <div className="day-column">
        <div className="caption"><Translate id={'days.' + forecastDay} /></div>
        <div className="weather-icon" style={iconStyle} />
        <div className="weather-label">
          <span className="label">
            { this.props.weatherData.FxConditionDay }
          </span>
        </div>
        <hr className="h-separator" />
        <div className="max-temperature">{ this.props.weatherData.TemperatureCMax }°</div>
        <div className="min-temperature">{ this.props.weatherData.TemperatureCMin }°</div>
        <div className="v-separator"></div>
      </div>
    )
  }
}

export default withLocalize(DayColumn)
