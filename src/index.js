import React from 'react';
import ReactDOM from 'react-dom';

import ErrorBoundary from './scenes/Error/ErrorBoundary'
import App from './App';

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>, document.getElementById('root'));

// Setting service worker based on environnement
if(process.env.REACT_APP_ENV === 'development') {
  serviceWorker.unregister();
} else {
  serviceWorker.register();
}
