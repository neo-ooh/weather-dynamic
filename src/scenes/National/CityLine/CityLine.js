import getIcon              from 'library/getIcon';
import React, { Component } from 'react';
import { CSSTransition }    from 'react-transition-group';

import './CityLine.scss';

class National extends Component {
  render() {
    const iconID    = this.props.weatherData.ObsIcon ? this.props.weatherData.ObsIcon : this.props.weatherData.FxIconDay;
    const iconStyle = { backgroundImage: 'url(' + getIcon(iconID) + ')' };

    return (
      <CSSTransition timeout={ { appear: 750, enter: 750, exit: 250 } }
                     appear={ true }
                     key={ this.props.weatherData.Location.Name }
                     classNames="transition" {...this.props} >
        <div className={ 'city-line ' + this.props.design }>
          <div className="temperature-block">
          <span className="temperature">
            { this.props.weatherData.TemperatureC }°
          </span>
          </div>
          <div className="weather-icon" style={ iconStyle }/>
          <div className="city-name">
            { this.props.weatherData.Location.Name }
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default National;
