import { DynamicContext, useFetch, useIsLive } from 'dynamics-utilities';
import React                                   from 'react';
import { useTranslation }                      from 'react-i18next';

import Hour     from './Hour/Hour';

import './Hourly.scss';
import PMLToday from './PMLToday';

const Hourly = ({ location, locale }) => {
  const [ isLive, liveStart ] = useIsLive();
  const { support }           = React.useContext(DynamicContext);
  const { t }                 = useTranslation('weather');

  const requestArgs = React.useMemo(() => ({
    country : location.country,
    province: location.province,
    city    : location.city,
    locale,
  }), [ location ]);

  const [ weatherData, weatherDataIsLoading ] = useFetch('/dynamics/_weather/hourly', 'get', requestArgs, true);

  const [ todayWeatherData, todayWeatherDataIsLoading ] = useFetch('/dynamics/_weather/current', 'get', requestArgs, true);

  React.useEffect(() => {
    if (isLive && !weatherDataIsLoading && !todayWeatherDataIsLoading) {
      console.log(`Ready ${ Date.now() - liveStart }ms after display start`);
    }
  });

  if (!isLive || weatherDataIsLoading || todayWeatherDataIsLoading) {
    return null; // skip
  }

  return (
    <>
      { support.design === 'PML' && <PMLToday weatherData={ todayWeatherData } support={ support }/> }
      <div className="hours">
        { weatherData.HourlyPeriod.slice(1, 7).map(hour => (
          <Hour weatherData={ hour } key={ hour.TimestampLocal }/>
        )) }
      </div>
    </>
  );
};

export default Hourly;
