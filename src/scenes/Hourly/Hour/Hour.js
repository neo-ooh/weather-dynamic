import React, {Component} from 'react'
import getIcon from '../../../library/getIcon'
import {injectIntl} from 'react-intl'

class Hour extends Component {
  render() {
    const iconStyle = {backgroundImage: 'url(' + getIcon(this.props.data.FxIcon) + ')'}

    /**
     * @var {string} hour
     */
    let hour = this.props.intl.formatTime(this.props.data.TimestampLocal)
    if(this.props.intl.locale === 'fr-CA') {
      hour = hour.replaceAll(' ', '');
      hour = hour.substring(0, hour.length - 2)
    } else {
      hour = hour.replaceAll('.', '');
      hour = hour.replaceAll(':00', '');
    }

    return (
      <div className="hour-wrapper">
        <div className="hour">{ hour }</div>
        <div className="icon" style={ iconStyle }/>
        <div className={['temperature', this.props.data.TemperatureC > 0 ? 'above' : 'below'].join(' ')}>
          {this.props.data.TemperatureC}°</div>
      </div>
    )
  };
}

export default injectIntl(Hour);
