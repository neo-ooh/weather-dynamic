import classNames                          from 'classnames';
import { DynamicContext }                  from 'dynamics-utilities';
import React                               from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import './Captions.scss';

const Captions = ({ top, middle, bottom }) => {
  const { support } = React.useContext(DynamicContext);

  //
  // let top, middle, bottom
  //
  // let content = this.props.content.toLowerCase()
  //
  // if(content === 'forecast' && this.props.player.design.name === 'DCA') {
  //   content = 'forecast-3'
  // }
  //x
  // if(content === 'forecast' && (this.props.player.design.name === 'SHD' || this.props.player.design.name === 'PHD')) {
  //   content = 'forecast-5-short'
  // }
  //
  // if (this.props.content === 'NATIONAL' && (this.props.player.design.name === 'SHD' || this.props.player.design.name === 'PHD')) {
  //   top = null
  //   middle = 'Canada'
  //   bottom = this.props.intl.formatMessage(messages.nationalCaptionBottom)
  // } else if (this.props.content === 'NATIONAL') {
  //   top = this.props.intl.formatMessage(messages.nationalCaptionTop)
  //   middle = this.props.intl.formatMessage(messages.nationalCaptionBottom)
  //   bottom = 'Canada'
  // } else {
  //   if(this.props.localization === undefined) return null
  //   top = this.props.intl.formatMessage(messages.weather)
  //   middle = this.props.localization.Name
  //   bottom = this.props.intl.formatMessage(messages[content])
  // }
  //
  //

  const middleBarClassNames = [ 'middle-bar' ];
  const bottomBarClassNames = [ 'bottom-bar' ];

  if (middle.length > 15) {
    middleBarClassNames.push('small-text');
  }

  if (support.design === 'HD' && bottom.length > 8) {
    bottomBarClassNames.push('small-caption');
  }

  return (
    <section id="Captions" className={ support.design }>
      <div className="top-bar">
        <span>{ top }</span>
      </div>
      <div className={ classNames(middleBarClassNames) }>
        <span>{ middle }</span>
      </div>
      <SwitchTransition>
        <CSSTransition timeout={ { appear: 750, enter: 750, exit: 250 } }
                       appear={ true }
                       key={ bottom }
                       classNames="captions">
          <div className={ classNames(bottomBarClassNames) } key={ bottom }>
          <span>
            { bottom }
          </span>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </section>
  );
};

export default Captions;
