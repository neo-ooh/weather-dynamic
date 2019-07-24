import React from 'react';
import ReactDOM from 'react-dom';

import {IntlProvider, addLocaleData} from 'react-intl'
import fr from 'react-intl/locale-data/fr'
import en from 'react-intl/locale-data/en'
import frenchMessages from './assets/locales/fr-CA'
import englishMessages from './assets/locales/en-CA'

import ErrorBoundary from './scenes/Error/ErrorBoundary'
import App from './App';

import * as serviceWorker from './serviceWorker'

// LOCALIZATION
const messages = {
  'fr-FR': frenchMessages,
  'fr-CA': frenchMessages,
  'en-CA': englishMessages,
}

addLocaleData([...fr, ...en])

ReactDOM.render(
  <IntlProvider
    locale={navigator.language}
    messages={messages[navigator.language]}>
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>
  </IntlProvider>, document.getElementById('root'));

// Setting service worker based on environnement
if(process.env.REACT_APP_ENV === 'development') {
  serviceWorker.unregister();
} else {
  serviceWorker.register();
}
