import { DynamicContext, IfParam, useFetch, useParams } from 'dynamics-utilities';
import React                                            from 'react';

import BackgroundProvider from './library/BackgroundProvider';
import { useTranslation } from 'react-i18next';
import Forecast           from './scenes/Forecast/Forecast';
import Hourly             from './scenes/Hourly/Hourly';
import National           from './scenes/National/National';
import Now                from './scenes/Now';

import './style/App.scss';

const App = () => {

  const { i18n } = useTranslation();
  const ctx      = React.useContext(DynamicContext);

  const [ country, province, city ] = React.useMemo(() => ctx.context.getLocation(), [ ctx ]);

  const [ location, locationIsLoading ] = useFetch(`/dynamics/_weather/locations/${ country }/${ province }/${ city }`,
    'get',
    null,
    true,
  );

  // Deduce and set the locale (language)
  const { locale: urlLocale } = useParams();

  const locale = React.useMemo(() => {
    return urlLocale ? urlLocale : province === 'QC' ? 'fr' : 'en';
  }, [ urlLocale, province ]);

  React.useEffect(() => {i18n.changeLanguage(locale); }, [ locale ]);

  if (locationIsLoading) {
    return null;
  }

  return (
    <BackgroundProvider location={ location }>
      <IfParam name="content"
               value="now"
               key="now">
        <Now location={ location } locale={ locale }/>
      </IfParam>
      <IfParam name="content"
                value="hourly"
                key="hourly">
         <Hourly location={ location } locale={ locale }/>
      </IfParam>
      <IfParam name="content"
               value="forecast"
               key="forecast">
        <Forecast location={ location } locale={ locale }/>
      </IfParam>
      <IfParam name="content"
               value="national"
               key="national">
        <National location={ location } locale={ locale } />
      </IfParam>,
    </BackgroundProvider>
  );
};

export default App;
