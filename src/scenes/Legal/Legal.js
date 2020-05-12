import React, { Component } from 'react'
import { injectIntl } from 'react-intl'

import PMLFR from '../../assets/images/meteo-media-logo.png'
import PMPFR from '../../assets/images/PMP.credits.png'

import legalEN from '../../assets/images/poweredBy.png'
import legalENQC from '../../assets/images/poweredByQC.png'
import legalFR from '../../assets/images/propulsePar.png'
import legalFRQC from '../../assets/images/propulseParQC.png'

import legalFRSHD from '../../assets/images/meteo-media-logo.png'
import legalENSHD from '../../assets/images/weather-network-logo.png'



class Legal extends Component {
  getLogo = () => {
    switch (this.props.player.design.name) {
      case 'PML':
        return {fr: PMLFR, en: PMLFR}
      case 'PMP':
        return {fr: PMPFR, en: PMPFR}
      case 'SHD':
      case 'PHD':
        return {fr: legalFRSHD, en: legalENSHD}
      default:
        return {
          fr: this.props.localization[1] === 'QC' ? legalFRQC : legalFR,
          en: this.props.localization[1] === 'QC' ? legalENQC : legalEN
        }
    }
  }


  render () {
    const legals = this.getLogo();
    let legal = null

    if(this.props.intl.locale === 'fr-CA' || this.props.intl.locale === 'fr-FR') {
      legal = legals.fr
    } else {
      legal = legals.en
    }

    if(this.props.content === 'HOURLY')
      return null

    return (
      <section id="legals" className={this.props.player.design.name}>
        <img className="logo" src={legal}  alt={ "" } />
      </section>
    )
  }
}

export default injectIntl(Legal)
