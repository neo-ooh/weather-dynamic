import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { injectIntl } from "react-intl"
import messages from '../../library/messages'

class Captions extends Component {
  render () {

    let top, middle, bottom

    let content = this.props.content.toLowerCase()

    if(content === 'forecast' && this.props.player.design.name === 'DCA') {
      content = 'forecast-3'
    }

    if (this.props.content === 'NATIONAL') {
      top = this.props.intl.formatMessage(messages.nationalCaptionTop)
      middle = this.props.intl.formatMessage(messages.nationalCaptionBottom)
      bottom = 'Canada'
    } else {
      if(this.props.localization === undefined) return null
      top = this.props.intl.formatMessage(messages.weather)
      middle = this.props.localization.Name
      bottom = this.props.intl.formatMessage(messages[content])
    }

    if(middle.length > 15) {
      content += " small-text"
    }

    return (
      <section id="Captions" className={this.props.player.design.name}>
        <div className="top-bar">
          <span>{ top }</span>
        </div>
        <div className={'middle-bar ' + content}>
          <span>{ middle }</span>
        </div>
        <ReactCSSTransitionGroup
          transitionName="transition-captions"
          transitionAppearTimeout={1250}
          transitionEnterTimeout={1250}
          transitionLeaveTimeout={1250}
          transitionAppear={true}
          transitionEnter={true}
          transitionLeave={true}
          component="section"
          className="bottom-bar">
          { this.props.shouldDisplay &&
            <span key={ bottom }>{ bottom }</span>
          }
        </ReactCSSTransitionGroup>
      </section>
    )
  }
}

export default injectIntl(Captions)
