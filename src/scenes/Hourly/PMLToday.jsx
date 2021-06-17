import { DynamicContext } from 'dynamics-utilities';
import React              from 'react';
import { useTranslation } from 'react-i18next';
import { CSSTransition }  from 'react-transition-group';
import SunCalc            from 'suncalc';
import UseDayPeriod       from '../../library/useDayPeriod';


const PMLToday = ({ weatherData, support }) => {
  const { t }       = useTranslation('weather');
  const { context } = React.useContext(DynamicContext);
  const latLng      = React.useMemo(() => context.getGeoLocation(), [ context ]);
  const period      = UseDayPeriod(latLng.lat, latLng.lng);
  const sunTimes    = React.useMemo(() => SunCalc.getTimes(new Date(), latLng.lat, latLng.lng), []);

  const [ sunsetSunriseTime, sunsetSunriseMessageKey ] = React.useMemo(() => {
    const currDate = new Date();
    return [
      currDate < sunTimes.sunrise ? sunTimes.sunrise : sunTimes.sunset,
      currDate < sunTimes.sunrise ? 'sunrise' : 'sunset',
    ];
  }, [ sunTimes ]);

  return (
    <CSSTransition timeout={ { appear: 750, enter: 750, exit: 250 } }
                   appear={ true }
                   classNames="transition">
      <div id="hourly-now">
        <div className="now-caption">{ t('now') }</div>
        <div className="temperature">{ weatherData.TemperatureC }°</div>
        <hr className="v-separator"/>
        <div className="feels-like">
          { t('feels-like-lng') } { weatherData.FeelsLikeC }°
        </div>
        <div className="sunset-sunrise"><span>
              { t(sunsetSunriseMessageKey) }&nbsp;
          { sunsetSunriseTime.toLocaleString('en-CA', { hour: 'numeric', minute: 'numeric', hour12: true }) }
            </span></div>
      </div>
    </CSSTransition>
  );
};

export default PMLToday;
