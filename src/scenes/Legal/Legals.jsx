import { Dynamic, DynamicContext } from 'dynamics-utilities';
import React                       from 'react';
import { useTranslation } from 'react-i18next';

import PMLFR      from '../../assets/images/meteo-media-logo.png';
import legalFRSHD from '../../assets/images/meteo-media-logo.png';
import PMLEN      from '../../assets/images/pml.en.svg';
import PMPFR      from '../../assets/images/PMP.credits.png';

import legalEN    from '../../assets/images/poweredBy.png';
import legalENQC  from '../../assets/images/poweredByQC.png';
import legalFR    from '../../assets/images/propulsePar.png';
import legalFRQC  from '../../assets/images/propulseParQC.png';
import legalENSHD from '../../assets/images/weather-network-logo.png';

import './Legal.scss';

const Legals = ({ location }) => {
  const { support } = React.useContext(DynamicContext)

  const { i18n } = useTranslation('weather');

  const logos = React.useMemo(() => {
    switch (support.design) {
      case 'PML':
        return { fr: PMLFR, en: PMLEN };
      case 'PMP':
        return { fr: PMPFR, en: PMPFR };
      case 'HD':
        return { fr: legalFRSHD, en: legalENSHD };
      default:
        return {
          fr: location.province === 'QC' ? legalFRQC : legalFR,
          en: location.province === 'QC' ? legalENQC : legalEN,
        };
    }
  }, [ support ]);


  let legal = null;

  if (i18n.language.startsWith('fr')) {
    legal = logos.fr;
  } else {
    legal = logos.en;
  }

  return (
    <section id="legals" className={ support.design }>
      <img className="logo" src={ legal } alt={ '' }/>
    </section>
  );
}

export default Legals;
