// Log Aggregation
import en          from 'assets/locales/en.json';
import fr          from 'assets/locales/fr.json';
import { Dynamic } from 'dynamics-utilities';
import React       from 'react';
import ReactDOM from 'react-dom';
import App      from 'App';

import ErrorBoundary from './scenes/Error/ErrorBoundary';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <ErrorBoundary>
    <Dynamic name="weather"
             locales={ {
               en: { weather: en },
               fr: { weather: fr },
             } }
             apiUrl={ process.env.REACT_APP_API_URL }>
      <App/>
    </Dynamic>
  </ErrorBoundary>, document.getElementById('root'));

// Setting service worker based on environnement
if (process.env.REACT_APP_ENV === 'development') {
  serviceWorker.unregister();
} else {
  serviceWorker.register();
}
