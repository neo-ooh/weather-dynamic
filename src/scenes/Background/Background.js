import React, { Component } from 'react'
import getBackgroundURL from 'library/getBackgroundURL'
import _ from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class background extends Component {
  constructor (props) {
    super(props)

    this.state = {
      url: null
    }
  }

  componentDidMount () {
    const url = this.resolveBackground()
    this.setState({
      url: url
    })
  }

  componentDidUpdate (prevPros) {
    if (prevPros.content === this.props.content) {
      return null
    }

    this.componentDidMount()
  }

  resolveBackground () {
    let iconID

    switch (this.props.content) {
      case 'NATIONAL':
        iconID = this.getNationalBackground()
        break
      case 'FORECAST':
        iconID = this.getForecastBackground()
        break
      case 'TOMORROW':
        iconID = this.props.weatherData.FxIconDay
        break
      case 'NOW':
        iconID = this.props.weatherData.ObsIcon
        break
      default: return {}
    }

    let location

    if (this.props.player.isBroadSign) {
      location = {
        lat: window.BroadSignObject.display_unit_lat_lng.split(',')[0],
        lng: window.BroadSignObject.display_unit_lat_lng.split(',')[1]
      }
    } else {
      location = {
        lat: this.props.location.Latitude,
        lng: this.props.location.Longitude
      }
    }

    return getBackgroundURL(iconID, location)
  }

  getNationalBackground () {
    const icons = this.props.weatherData.map(day => day.ObsIcon)
    const iconsOrdered = _.chain(icons).countBy().toPairs().sortBy(1).reverse().map(0).value()
    return iconsOrdered[0]
  }

  getForecastBackground () {
    const icons = this.props.weatherData.LongTermPeriod.map(day => day.FxIconDay)
    const iconsOrdered = _.chain(icons).countBy().toPairs().sortBy(1).reverse().map(0).value()
    return iconsOrdered[0]
  }

  render () {
    if (this.props.url === null) {
      return null
    }

    return <ReactCSSTransitionGroup
      transitionName="transition-background"
      transitionAppearTimeout={1250}
      transitionEnterTimeout={1250}
      transitionLeaveTimeout={1250}
      transitionAppear={true}
      transitionEnter={true}
      transitionLeave={true}
      component="div"
      id="background-wrapper">
      <section
        key={this.state.url}
        id="main-background"
        style={{backgroundImage: 'url(' + this.state.url + ')'}} />
    </ReactCSSTransitionGroup>
  }
}
