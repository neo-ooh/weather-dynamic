import classNames        from 'classnames';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import getIcon           from '../../../library/getIcon';

const Hour = ({ weatherData }) => {
  const iconStyle = React.useMemo(() => ({ backgroundImage: 'url(' + getIcon(weatherData.FxIcon) + ')' }), [ weatherData ]);

  return (
    <CSSTransition timeout={ { appear: 750, enter: 750, exit: 250 } }
                   in={true}
                   appear={ true }
                   classNames="hours">
      <div className="hour-wrapper">
        <div className="hour">{ (new Date(weatherData.TimestampLocal)).getHours() }h</div>
        <div className="icon" style={ iconStyle }/>
        <div className={ classNames('temperature',
          { 'above': weatherData.TemperatureC > 0 },
          { 'below': weatherData.TemperatureC <= 0 },
        ) }>
          { weatherData.TemperatureC }°
        </div>
      </div>
    </CSSTransition>
  );
};

export default Hour;
