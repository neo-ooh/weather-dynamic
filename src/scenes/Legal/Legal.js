import React, { Component } from 'react'

class Legal extends Component {
  render () {

    if(this.props.localization === undefined) return null

    let legal = {}
    if(this.props.locale === 'fr-CA') {
      legal = { url: "images/propulsePar", alt:"Météo Média" }
    } else {
      legal = { url: "images/poweredBy", alt:"The Weather Network" }
    }

    legal.url += this.props.localization[1] === 'QC' ? 'QC.png' : '.png'

    return (
      <section id="legals" className={this.props.player.support}>
        <img className="logo" src={legal.url}  alt={legal.alt} />
      </section>
    )
  }
}

export default Legal
