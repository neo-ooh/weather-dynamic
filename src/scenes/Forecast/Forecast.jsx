import { DynamicContext, useFetch, useIsLive } from 'dynamics-utilities';
import React                                   from 'react';
import { useTranslation }                      from 'react-i18next';
import Background                              from '../Background';

import Captions  from '../Captions/Captions';
import PMLToday  from '../Hourly/PMLToday';
import Legals    from '../Legal/Legals';
import DayColumn from './DayColumn/DayColumn';

import './Forecast.scss';

const Forecast = ({ location, locale }) => {
  const [ isLive, liveStart ] = useIsLive();
  const { support }           = React.useContext(DynamicContext);
  const { t }                 = useTranslation('weather');

  const requestArgs = React.useMemo(() => ({
    country : location.country,
    province: location.province,
    city    : location.city,
    locale,
  }), [ location ]);

  let todayWeatherIsLoading = false;
  let todayWeather          = false;

  if (support.design === 'PML') {
    const [ todayWeatherData, todayWeatherDataIsLoading ] = useFetch('/dynamics/_weather/current', 'get', requestArgs, true);
    todayWeatherIsLoading                                 = todayWeatherDataIsLoading;
    todayWeather                                          = todayWeatherData;
  }

  const [ weatherData, weatherIsLoading ] = useFetch('/dynamics/_weather/forecast', 'get', requestArgs, true);

  if (!isLive || weatherIsLoading || (support.design === 'PML' && todayWeatherIsLoading)) {
    return null; // skip
  }

  var nowJSX = null;

  // if (this.props.player.design.name === 'PML' && this.state.todayForecast != null) {
  //   const now = this.state.todayForecast
  //   const iconStyle = {backgroundImage: 'url(' + getIcon(now.FxIconDay) + ')'}
  //
  //   let geo
  //
  //   if (this.props.player.isBroadSign) {
  //     geo = {
  //       lat: window.BroadSignObject.display_unit_lat_long.split(',')[0],
  //       lng: window.BroadSignObject.display_unit_lat_long.split(',')[1]
  //     }
  //   } else {
  //     geo = {
  //       lat: this.state.weatherData.Location.Latitude,
  //       lng: this.state.weatherData.Location.Longitude
  //     }
  //   }
  //
  //   const currDate = new Date()
  //   const sunTimes = getSunTimes(currDate, geo.lat ,geo.lng)
  //
  //   const sunsetSunrise = currDate < sunTimes.sunrise ? sunTimes.sunrise : sunTimes.sunset
  //   const sunsetSunriseMsg = currDate < sunTimes.sunrise ? 'sunrise' : 'sunset'
  //
  //   nowJSX = (
  //     <ReactCSSTransitionGroup
  //       transitionName="transition-hour-now"
  //       transitionAppearTimeout={1250}
  //       transitionEnterTimeout={1250}
  //       transitionLeaveTimeout={1250}
  //       transitionAppear={true}
  //       transitionEnter={true}
  //       transitionLeave={true}
  //       component="section"
  //       key="hour-now">
  //       <div id="hourly-now">
  //         <div className="now-caption">{ this.props.intl.formatMessage(messages['now']) }</div>
  //         <div className="temperature">{now.TemperatureC}°</div>
  //         <hr className="v-separator" />
  //         <div className="feels-like">
  //           { this.props.intl.formatMessage(messages['feelsLikeLng']) } {now.FeelsLikeC}°
  //         </div>
  //         <div className="sunset-sunrise"><span>
  //           { this.props.intl.formatMessage(messages[sunsetSunriseMsg]) }&nbsp;
  //           {sunsetSunrise.toLocaleString('en-CA', {hour: 'numeric', minute: 'numeric', hour12: true})}
  //         </span></div>
  //       </div>
  //     </ReactCSSTransitionGroup>
  //   )
  // }

  const contentLabels = { DCA: 'forecast-3', HD: 'forecast-5-short' };

  return (
    <React.Fragment>
      { (support.design !== 'PML' && support.design !== 'PMP') && <Background weatherData={ weatherData } content="forecast"/> }
      { (support.design !== 'PML' && support.design !== 'PMP') && <Captions top={ t('weather') }
                                              middle={ weatherData.Location.Name }
                                              bottom={ t(contentLabels[support.design] || 'forecast') }/> }
      { support.design === 'PML' && <PMLToday weatherData={ todayWeather } support={ support }/> }
      <div id="forecast" className={ support.design }>
        { weatherData.LongTermPeriod.slice(0, 5).map(day =>
          <DayColumn
            weatherData={ day }
            key={ day.Period }/>) }
      </div>
      <Legals location={ location }/>
    </React.Fragment>
  );
};

export default Forecast;
