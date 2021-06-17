import { DynamicContext, useFetch, useIsLive } from 'dynamics-utilities';
import React                                            from 'react';
import { useTranslation }      from 'react-i18next';
import Captions                from 'scenes/Captions/Captions';
import Background              from '../Background';
import Legals                  from '../Legal/Legals';
import OneDay                  from '../OneDay/OneDay';

const Now = ({ location, locale }) => {
  const [ isLive, liveStart ] = useIsLive();
  const { support } = React.useContext(DynamicContext);
  const { t } = useTranslation('weather');
  const [ content, setContent ] = React.useState('today');

  const requestArgs = React.useMemo(() => ({
    country : location.country,
    province: location.province,
    city    : location.city,
    locale,
  }), [ location ]);

  const [ todayForecast, todayForecastIsLoading ] = useFetch('/dynamics/_weather/current', 'get', requestArgs, true);

  const [ tomorrowForecast, tomorrowForecastIsLoading ] = useFetch('/dynamics/_weather/next-day', 'get', requestArgs, true);

  React.useEffect(() => {
    if(!isLive) {
      return;
    }

    setTimeout(() => setContent('tomorrow'), 7500);
  }, [isLive])

  const weatherData = React.useMemo(() => content === 'today' ? todayForecast : tomorrowForecast, [content, todayForecast, tomorrowForecast]);

  if (!isLive || !weatherData) {
    return null; // skip
  }

  return (
    <React.Fragment>
      <Background weatherData={weatherData} content={content} />
      <Legals children support={support} location={location} />
      <Captions top={t('weather')}
                middle={weatherData.Location.Name}
                bottom={t(content)} />
      <OneDay content={content} weatherData={weatherData} />
    </React.Fragment>
  )
};

export default Now;
