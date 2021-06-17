import classNames         from 'classnames';
import { DynamicContext } from 'dynamics-utilities';
import getIcon            from 'library/getIcon';
import React              from 'react';
import { useTranslation } from 'react-i18next';
import { CSSTransition }  from 'react-transition-group';

import dayMap from '../../../library/dayMap.json'

import './DayColumn.scss'

const DayColumn = ({ weatherData }) => {
  const { support } = React.useContext(DynamicContext);
  const { t }       = useTranslation('weather');

  // Day
  const forecastDay = React.useMemo(() => {
    const currDay = (new Date()).getDay();
    return (currDay + parseInt(weatherData.Period, 10)) % 7;
  }, [ weatherData ]);

  // Icon
  const iconStyle = React.useMemo(() => {
    const iconID = weatherData.FxIconDay;
    return { backgroundImage: 'url(' + getIcon(iconID) + ')' };
  }, [ weatherData ]);

  const dayPrefix = (support.design === 'PML' || support.design === 'PMP') ? 'days.' : 'days.shorts.';

  return (
    <CSSTransition timeout={ { appear: 750, enter: 750, exit: 250 } }
                   in={ true }
                   appear={ true }
                   classNames="forecast">
      <div className="day-column">
        <div className="caption">{ t(dayPrefix + dayMap[forecastDay]) }</div>
        <div className="weather-icon" style={ iconStyle }/>
        <div className={ classNames('weather-label', { 'small-text': weatherData.FxConditionDay.length > 15 }) }>
          <span className="label">
            { weatherData.FxConditionDay }
          </span>
        </div>
        <hr className="h-separator"/>
        <div className="max-temperature">{ weatherData.TemperatureCMax }°</div>
        <div className="min-temperature">{ weatherData.TemperatureCMin }°</div>
        <div className="v-separator"/>
      </div>
    </CSSTransition>
  );
};

export default DayColumn;
