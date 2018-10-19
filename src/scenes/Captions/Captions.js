import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Translate, withLocalize } from 'react-localize-redux'

class Captions extends Component {
  render () {

    let top, middle, bottom

    let content = this.props.content.toLowerCase()

    if(content === 'forecast' && this.props.player.support === 'DCA') {
      content = 'forecast-3'
    }

    if (this.props.content === 'NATIONAL') {
      top = <Translate id="national.top" />
      middle = <Translate id="national.bottom" />
      bottom = 'Canada'
    } else {
      if(this.props.localization === undefined) return null
      top = <Translate id="weather" />
      middle = this.props.localization.Name
      bottom = <Translate id={content} />
    }

    return (
      <section id="Captions" className={this.props.player.support}>
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

export default withLocalize(Captions)
