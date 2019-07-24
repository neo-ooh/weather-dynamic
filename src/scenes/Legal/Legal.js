import React, { Component } from 'react'
import { injectIntl } from 'react-intl'

import legalEN from '../../assets/images/poweredBy.png'
import legalENQC from '../../assets/images/poweredByQC.png'
import legalFR from '../../assets/images/propulsePar.png'
import legalFRQC from '../../assets/images/propulseParQC.png'



class Legal extends Component {
  render () {
    let legal = null

    if(this.props.intl.locale === 'fr-CA' || this.props.intl.locale === 'fr-FR') {
      legal = this.props.localization[1] === 'QC' ? legalFRQC : legalFR
    } else {
      legal = this.props.localization[1] === 'QC' ? legalENQC : legalEN
    }

    return (
      <section id="legals" className={this.props.player.support.design}>
        <img className="logo" src={legal}  alt={ "" } />
      </section>
    )
  }
}

export default injectIntl(Legal)
