import React, { Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Translate, withLocalize } from 'react-localize-redux'

class Captions extends Component {
  render () {
    let top, middle, bottom

    const content = this.props.content.toLowerCase()

    if (this.props.content === 'NATIONAL') {
      top = <Translate id="national.top" />
      middle = <Translate id="national.bottom" />
      bottom = 'Canada'
    } else {
      top = <Translate id="weather" />
      middle = this.props.localization.Name
      bottom = <Translate id={content} />
    }

    return (
      <section id="Captions" >
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
          <span key={bottom}>{ bottom }</span>
        </ReactCSSTransitionGroup>
      </section>
    )
  }
}

export default withLocalize(Captions)
