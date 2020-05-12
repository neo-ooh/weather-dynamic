import React, {Component} from 'react'
import getIcon from '../../../library/getIcon'

class Hour extends Component {
  render() {
    const iconStyle = {backgroundImage: 'url(' + getIcon(this.props.data.FxIcon) + ')'}

    return (
      <div className="hour-wrapper">
        <div className="hour">{(new Date(this.props.data.TimestampLocal)).getHours()}h</div>
        <div className="icon" style={ iconStyle }/>
        <div className="temperature">{this.props.data.TemperatureC}°</div>
      </div>
    )
  }
}

export default Hour;
