import { useFetch, useIsLive } from 'dynamics-utilities';
import React                   from 'react';
import { useTranslation }      from 'react-i18next';
import Captions                from 'scenes/Captions/Captions';

// import Captions from '../Captions/Captions';
// import OneDay   from '../OneDay/OneDay';

const Now = ({ location, locale }) => {
  const [ isLive, liveStart ] = useIsLive();
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

  const data = React.useMemo(() => content === 'today' ? todayForecast : tomorrowForecast, [content, todayForecast, tomorrowForecast]);

  if (!isLive) {
    return null; // skip
  }

  console.log(data)

  return (
    <React.Fragment>
      <Captions top={t('weather')}
                middle={data.localization.Name}
                bottom={t(content)} />
    </React.Fragment>
  )
    // <Captions key="captions"
    //           content={ this.props.content }
    //           localization={ weatherData.Location }
    //           shouldDisplay={ this.props.shouldDisplay }
    //           player={ this.props.player }/>,
    // <OneDay key="now-oneday"
    //         player={ this.props.player }
    //         content={ this.props.content }
    //         weatherData={ weatherData }/>,
};

export default Now;
