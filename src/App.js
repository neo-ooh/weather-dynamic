import { DynamicContext, IfParam, useFetch, useParams } from 'dynamics-utilities';
import React                            from 'react';

import { useTranslation } from 'react-i18next';
import Now                from './scenes/Now';

import './style/App.scss';

const App = () => {

  const { i18n } = useTranslation();
  const ctx = React.useContext(DynamicContext)

  // Start by getting our location
  const [ country, province, city ]     = React.useMemo(() => ctx.getLocation(), [ ctx ]);
  const [ location, locationIsLoading ] = useFetch(`/dynamics/_weather/${ country }/${ province }/${ city }`);

  // Deduce and set the locale (language)
  const { locale: urlLocale } = useParams();

  const locale = React.useMemo(() => {
    return urlLocale || province === 'QC' ? 'fr' : 'en';
  }, [ urlLocale, province ]);

  React.useEffect(() => {i18n.changeLanguage(locale); }, [ locale ]);

  if (locationIsLoading) {
    return null;
  }

  return [
    <IfParam name="content"
             value="NOW"
             key="now">
      <Now location={ location }/>
    </IfParam>,
    // <IfParam name="content"
    //          value="HOURLY"
    //          key="hourly">
    //   <Hourly location={ location }/>
    // </IfParam>,
    // <IfParam name="content"
    //          value="FORECAST"
    //          key="forecast">
    //   <Forecast location={ location }/>
    // </IfParam>,
    // <IfParam name="content"
    //          value="NATIONAL"
    //          key="national">
    //   <National location={ location }/>
    // </IfParam>,
  ];

};

export default App;
