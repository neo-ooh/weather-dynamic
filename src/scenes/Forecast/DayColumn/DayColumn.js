import React, { Component} from 'react'

import { injectIntl } from "react-intl"
import messages from '../../../library/messages'

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

    const dayPrefix = this.props.player.design.name === 'PML' ? 'days-' : 'short-days-';

    return (
      <div className="day-column">
        <div className="caption">{ this.props.intl.formatMessage(messages[dayPrefix + forecastDay]) }</div>
        <div className="weather-icon" style={iconStyle} />
        <div className={ ['weather-label', this.props.weatherData.FxConditionDay.length > 15 ?'small-text':''].join(' ') }>
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

export default injectIntl(DayColumn)
