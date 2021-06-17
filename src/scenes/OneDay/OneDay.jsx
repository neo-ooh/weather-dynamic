import classNames                          from 'classnames';
import { DynamicContext }                  from 'dynamics-utilities';
import React                               from 'react';
import { useTranslation }                  from 'react-i18next';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import getIcon  from '../../library/getIcon';
import './OneDay.scss';
import Today    from './Today';
import Tomorrow from './Tomorrow';

const OneDay = ({ weatherData, content }) => {
  const { t }       = useTranslation('weather');
  const { support } = React.useContext(DynamicContext);

  const iconId = React.useMemo(() => weatherData.ObsIcon || weatherData.FxIconDay, [ weatherData ]);
  const label  = React.useMemo(() => weatherData.ObsCondition || weatherData.FxConditionDay, [ weatherData ]);

  return (
    <div id="one-day" className={ classNames(support.design) }>
      <div className="one-day-box">
      <SwitchTransition>
        <CSSTransition timeout={ { appear: 750, enter: 750, exit: 250 } }
                       appear={ true }
                       key={ content }
                       classNames="day">
          <div className={ classNames('transition-wrapper', content) }>
            <div className={ classNames('weather-label', { small: label.length > 11 }) }>
              <span>{ label }</span>
            </div>
            <div className="weather-icon" style={ { backgroundImage: `url(${ getIcon(iconId) })` } }/>
            { content === 'today' && <Today weatherData={ weatherData }/> }
            { content === 'tomorrow' && <Tomorrow weatherData={ weatherData }/> }
          </div>
        </CSSTransition>
      </SwitchTransition>
      </div>
    </div>
);
};

export default OneDay;
