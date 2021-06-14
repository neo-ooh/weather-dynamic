import { BroadSignActions } from 'dynamics-utilities';
import API                  from 'dynamics-utilities/src/library/API';
import { Context }          from 'dynamics-utilities/src/library/Context';
import Backgrounds          from 'library/Backgrounds';
import settings             from 'library/settings';
import React, { Component } from 'react';

import { IntlProvider } from 'react-intl';
import englishMessages  from './assets/locales/en-CA';
import frenchMessages   from './assets/locales/fr-CA';
import Background       from './scenes/Background/Background';
import Error            from './scenes/Error/Error';

import ErrorBoundary from './scenes/Error/ErrorBoundary';

import Forecast from './scenes/Forecast/Forecast';
import Hourly   from './scenes/Hourly/Hourly';
import Legal    from './scenes/Legal/Legal';
import Log      from './scenes/Log/Log';
import National from './scenes/National/National';
import Now      from './scenes/Now/Now';

import './style/App.scss';

// location
const messages = {
  'fr-FR': frenchMessages,
  'fr-CA': frenchMessages,
  'en-CA': englishMessages,
};

class App extends Component {
  contents = {
    'NOW'     : Now,
    'TOMORROW': Now,
    'HOURLY'  : Hourly,
    'FORECAST': Forecast,
    'NATIONAL': National,
  };

  constructor(props) {
    super(props);

    document.getElementById('broadsign-holder').addEventListener('click', this.broadSignPlay);

    // Get our context
    this.ctx = new Context();
    this.api = new API(process.env.REACT_APP_API_URL, this.ctx.getParam('key'));

    // Build the state
    this.state = {
      // Player infos
      player: {
        location: null,
        design  : this.ctx.getSupport('HD'),
      },

      // What to display
      content    : this.ctx.getParam('content'),
      weatherData: null,

      // Locale (the language)
      locale: this.ctx.getParam('locale'),

      // location (the position)
      location   : null,
      geolocation: { Latitude: 49.895077, Longitude: -97.138451 },

      // Where are we at ?
      inited  : false,
      display : false,
      onError : false,
      errorMsg: 'Screen location could not be determined',

      // Debugging
      production: process.env.REACT_APP_ENV === 'production',
      logs      : [],
    };
  }

  componentDidMount() {
    this.checkCache().then(this.detectLocation);
  }

  checkCache() {
    // Check cache state and erase if new day
    const lastUpdate = localStorage.getItem('weather-dynamic.refresh');
    if (lastUpdate === null) {
      let d = new Date();
      d.setHours(0, 0, 0, 0);
      return Promise.resolve().then(() => localStorage.setItem('weather-dynamic.refresh', d.getTime()));
    }

    const refreshRate = this.state.production ? 1000 * 3600 * 24 : 300 * 1000;

    if (Date.now() - lastUpdate > refreshRate) {
      return caches.delete(settings.cacheName).then(() => {
        this.log('Cache Cleaned');
        let d = new Date();
        this.state.production && d.setHours(0, 0, 0, 0);
        localStorage.setItem('weather-dynamic.refresh', d.getTime());
      });
    }

    return Promise.resolve();
  }

  detectLocation = () => {
    this.setState({
      location: this.ctx.getLocation(),
    }, this.initLocation);
  };

  broadSignPlay = () => {
    this.log('Broadsign Play');

    this.setState({
      display: true,
    });

    if (this.state.onError && this.state.production) {
      BroadSignActions.stopDisplay();
    }
  };

  // Init location
  initLocation() {
    let language = this.state.location[1] === 'QC' ? 'fr-CA' : 'en-CA';
    language     = this.ctx.getParam('locale') || language;

    this.setState({
      locale: language,
      inited: true,
    });

    Backgrounds.init(this.state.location, this.state.player.design.name, this.log);
  }

  log = msg => {
    this.setState(state => ({
      logs: [ ...state.logs, msg ],
    }));
  };

  componentDidCatch(error) {
    this.onError(error);
  }

  onWeatherData = weatherData => {
    this.setState({
      weatherData: weatherData,
    });
  };

  setLocation = newLocation => {
    this.setState({
      location: newLocation,
    });
  };

  onContentUpdate = newContent => {
    this.setState({
      content: newContent,
    });
  };

  onError = (message) => {
    this.setState({
      onError : true,
      errorMsg: message,
    });

    console.log(message);

    if (this.state.production && !this.state.display) {
      BroadSignActions.skipDisplay();
      return;
    }

    if (this.state.production && this.state.display) {
      BroadSignActions.stopDisplay();

    }
  };

  render() {
    if (!this.state.inited ||
      (this.state.onError && this.state.production)) {
      return null;
    }

    const logs = this.state.production ? null : <Log logs={ this.state.logs } key="logs"/>;

    if (this.state.location === null) {
      return logs;
    }

    const Scene = this.contents[this.state.content];

    return (
      <IntlProvider
        locale={ this.state.locale }
        messages={ messages[this.state.locale] }>
        <section id="main-wrapper">
          { this.state.display &&
          <Background key="background"
                      content={ this.state.content }
                      weatherData={ this.state.weatherData }
                      player={ this.state.player }
                      location={ this.state.location }
                      log={ this.log }/> }
          <main
            className={ this.state.player.design.name }
            style={ { transform: 'scale(' + this.state.player.design.scale + ')' } }>
            <ErrorBoundary>
              { this.state.onError && <Error message={ this.state.errorMsg } key="error"/> }
              { !this.state.onError &&
              <Scene
                key="scene"
                player={ this.state.player }
                content={ this.state.content }
                onWeatherData={ this.onWeatherData }
                setLocation={ this.setLocation }
                onContentUpdate={ this.onContentUpdate }
                onError={ this.onError }
                location={ this.state.location }
                shouldDisplay={ this.state.display }
                log={ this.log }
              /> }
              <Legal
                key="legal"
                player={ this.state.player }
                content={ this.state.content }
                locale={ this.state.locale }
                location={ this.state.location }/>
              {/*{ logs }*/ }
            </ErrorBoundary>
          </main>
        </section>
      </IntlProvider>
    );
  }
}

export default App;
