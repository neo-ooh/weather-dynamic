import { DynamicContext, useFetch, useIsLive } from 'dynamics-utilities';
import React                                   from 'react';
import { useTranslation }                      from 'react-i18next';
import { TransitionGroup }                     from 'react-transition-group';
import Background                              from '../Background';
import Captions                                from '../Captions/Captions';

import CityLine from './CityLine/CityLine';
import './National.scss';

const National = ({ location, locale }) => {
  const [ panel, setPanel ]   = React.useState('first');
  const [ isLive, liveStart ] = useIsLive();
  const { support }           = React.useContext(DynamicContext);
  const { t, i18n }                 = useTranslation('weather');

  const requestArgs = React.useMemo(() => ({
    locale,
  }), [ location ]);

  const [ nationalForecast, nationalForecastIsLoading ] = useFetch('/dynamics/_weather/national', 'get', requestArgs, true);

  React.useEffect(() => {
    if (!isLive) {
      return;
    }

    setTimeout(() => setPanel('second'), 7500);
  }, [ isLive ]);

  const weatherData = React.useMemo(() => {
    if (nationalForecastIsLoading) {
      return null;
    }

    const offset = panel === 'first' ? 0 : 5;
    return nationalForecast.slice(offset, offset + 5);
  }, [ nationalForecast, panel, nationalForecastIsLoading ]);

  React.useEffect(() => {
    if (isLive && !nationalForecastIsLoading) {
      console.log(`Ready ${ Date.now() - liveStart }ms after display`);
    }
  }, [ isLive, nationalForecastIsLoading ]);

  if (!isLive || nationalForecastIsLoading) {
    return null; // skip
  }

  return (
    <React.Fragment>
      <Background weatherData={ weatherData } content="national"/>
      <Captions top={ support.design !== 'HD' ? t('national.top') : null }
                middle={ support.design !== 'HD' ? t('national.bottom') : 'Canada' }
                bottom={ support.design !== 'HD' ? 'Canada' : t('national.bottom') }/>
      <div id="national" className={ support.design }>
        <TransitionGroup appear={true} component={null}>
          { weatherData.map((city, key) => (
            <CityLine weatherData={ city } design={ support.design } key={ key }/>
          )) }
        </TransitionGroup>
      </div>
    </React.Fragment>
  );
};

export default National;
