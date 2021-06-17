import { useIsLive }                       from 'dynamics-utilities';
import _                                   from 'lodash';
import React                               from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { BackgroundContext }               from '../../library/BackgroundProvider';
import './Background.scss';

const Background = ({ weatherData, content }) => {
  const [ backgroundUrl, setBackgroundUrl ] = React.useState(null);
  const { getBackground }                   = React.useContext(BackgroundContext);
  const [ isLive ]                          = useIsLive();

  const getNationalWeatherIcon = React.useCallback(() => {
    const icons = weatherData.map(day => day.ObsIcon);
    // Here we take all the weather icons (one per location) and we
    // - chain(): Enter lodash sequential mode
    // - countBy(): count the number of occurence of each element and make an object with result
    // - toPairs: Transform the object to an array like `Object.entries`
    // - sortBy: Sort the array by the occurrence count of each element
    // - reverse: Reverse the array, make it descending order so that the most occuring icon is the first
    // - map: Keep only the first element of each array element (the icon Id)
    // - value: Leave lodash sequential mode
    const iconsOrdered = _.chain(icons).countBy().toPairs().sortBy(1).reverse().map(0).value();

    // Return the first icon of the array, which represent the most occuring weather for the selection.
    return iconsOrdered[0];
  }, [ weatherData ]);

  const getForecastWeatherIcon = React.useCallback(() => {
    const icons        = weatherData.LongTermPeriod.map(day => day.FxIconDay);
    const iconsOrdered = _.chain(icons).countBy().toPairs().sortBy(1).reverse().map(0).value();
    return iconsOrdered[0];
  }, [ weatherData ]);

  const iconId = React.useMemo(() => {
    switch (content.toUpperCase()) {
      case 'NATIONAL':
        return getNationalWeatherIcon();
      case 'FORECAST':
        return getForecastWeatherIcon();
      case 'TOMORROW':
        return weatherData.FxIconDay;
      case 'TODAY':
        return weatherData.ObsIcon;
      default:
        return null;
    }
  }, [ content, weatherData ]);

  React.useEffect(() => {
    getBackground(iconId).then(bckg => {
      setBackgroundUrl(bckg);
    });
  }, [ iconId, getBackground ]);

  if (!backgroundUrl) {
    return null;
  }

  return (
    <SwitchTransition mode="in-out">
      <CSSTransition in={ isLive }
                     timeout={ { appear: 750, enter: 750, exit: 250 } }
                     appear={ true }
                     key={ iconId }
                     classNames="background">
        <div id="background"
             style={ { backgroundImage: `url(${ backgroundUrl })` } }/>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default Background;
