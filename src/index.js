import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ErrorBoundary from './scenes/Error/ErrorBoundary'
import * as serviceWorker from './serviceWorker'
import { LocalizeProvider } from 'react-localize-redux'

ReactDOM.render(
  <LocalizeProvider>
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>
  </LocalizeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
