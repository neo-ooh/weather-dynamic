import { DynamicContext }  from 'dynamics-utilities';
import weatherIconLabelMap from 'library/backgroundsMap.json';
import React               from 'react';
import UseDayPeriod        from './useDayPeriod';

const periods = [ 'MORNING', 'DAY', 'DUSK', 'NIGHT' ];
const BckgCtx = React.createContext({});

const BackgroundProvider = ({ children, location }) => {
  const { support, cache, api, params, context } = React.useContext(DynamicContext);
  const [ backgrounds, setBackgrounds ]          = React.useState([]);
  const latLng                                   = React.useMemo(() => context.getGeoLocation(), [ context ]);
  const period                                   = UseDayPeriod(latLng.lat, latLng.lng);

  // First step is to cache all background that may be/will be required
  React.useEffect(() => {
    const prepare = async () => {
      // Depending on the location background selection, there is one or multiple request to get the required backgrounds
      const requiredPeriods = location.background_selection === 'WEATHER' ? periods : [ 'RANDOM' ];

      const requests = requiredPeriods.map(period => (
        api.prepareUrl('/dynamics/_weather/backgrounds', 'get', {
          country  : location.country,
          province : location.province,
          city     : location.city,
          period   : period,
          format_id: params.format_id,
        }, true)));

      const responses = await Promise.all(requests.map(req => cache.get(req)));

      const backgrounds = [];

      // Now that we have the list of all the backgrounds we need, we parse each list and cache each backgrounds
      for (const resp of responses) {
        // Get the response as json
        const respBody = await resp.json();

        backgrounds.push(...respBody.content);
      }

      // We got the list of all the available backgrounds, make it available in our state for later use.
      setBackgrounds(backgrounds);

      // And finally, make sure all the backgrounds are cached.
      await Promise.all(backgrounds.map(b => cache.get(b.url)));
    };

    prepare();

  }, []);

  const getBackground = React.useCallback(async (weatherIcon) => {

    const weather = weatherIconLabelMap[weatherIcon] || null;

    const getRandomBackground = () => {
      return backgrounds.length > 0 && backgrounds[Math.floor(Math.random() * backgrounds.length)];
    };

    const getWeatherDependantBackground = (weather) => {
      const matchingBackground = backgrounds.filter(b =>
        b.weather.toUpperCase() === weather.toUpperCase() &&
        b.period.toUpperCase() === period.toUpperCase());

      return matchingBackground.length >= 1 ? matchingBackground[0] : null;
    };

    const background = location.background_selection.toUpperCase() === 'WEATHER' ?
                       getWeatherDependantBackground(weather) : getRandomBackground();

    if (!background) {
      return null; // No background available.
    }

    const backgroundImage = await cache.get(background.url);

    return URL.createObjectURL(await backgroundImage.blob());
  }, [ location, backgrounds, cache, period ]);

  const ctx = React.useMemo(() => ({ getBackground }), [ getBackground ]);

  return (
    <BckgCtx.Provider value={ ctx }>
      { children }
    </BckgCtx.Provider>
  );
};

export default BackgroundProvider;
export const BackgroundContext = BckgCtx;
