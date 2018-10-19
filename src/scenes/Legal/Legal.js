import React, { Component } from 'react'

class Legal extends Component {
  render () {

    if(this.props.localization === undefined) return null

    let legal = {}
    if(this.props.localization[1] === 'QC') {
      legal = { url: "images/logo_mm.png", alt:"Météo Média" }
    } else {
      legal = { url: "images/logo_twn.png", alt:"The Weather Network" }
    }

    return (
      <section id="legals" className={this.props.player.support}>
        <img className="logo" src={legal.url}  alt={legal.alt} />
      </section>
    )
  }
}

export default Legal
