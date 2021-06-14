import { useFetch, useIsLive }  from 'dynamics-utilities';
import React         from 'react';

// import Captions from '../Captions/Captions';
// import OneDay   from '../OneDay/OneDay';

const Now = ({ location, locale }) => {

  const isLive = useIsLive();

  const [ todayForecast, todayForecastIsLoading ] = useFetch('/dynamics/_weather/current', 'get', {
    country : location.country,
    province: location.province,
    city    : location.city,
    locale,
  }, true);

  const [ tomorrowForecast, tomorrowForecastIsLoading ] = useFetch('/dynamics/_weather/next-day', 'get', {
    country : location.country,
    province: location.province,
    city    : location.city,
    locale,
  }, true);

  if (!this.state.isReady) {
    return null; // skip
  }

  const weatherData = this.props.content === 'NOW' ? this.state.todayForecast : this.state.tomorrowForecast;

  if (weatherData == null) {
    return null;
  }

  console.log(isLive, todayForecast, tomorrowForecast)

  return [
    // <Captions key="captions"
    //           content={ this.props.content }
    //           localization={ weatherData.Location }
    //           shouldDisplay={ this.props.shouldDisplay }
    //           player={ this.props.player }/>,
    // <OneDay key="now-oneday"
    //         player={ this.props.player }
    //         content={ this.props.content }
    //         weatherData={ weatherData }/>,
  ];
};

export default Now;
