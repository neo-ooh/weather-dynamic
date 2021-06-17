import React   from 'react';
import SunCalc from 'suncalc';

const defaultGeo = { lat: 49.895077, lng: -97.138451 }; // Winnipeg

const UseDayPeriod = (lat = null, lng = null) => {
  return React.useMemo(() => {
    const now      = new Date();
    const sunTimes = SunCalc.getTimes(now, lat || defaultGeo.lat, lng || defaultGeo.lng);

    // Select current Period
    if (now < sunTimes.sunrise) {
      return 'NIGHT';
    }

    if (now < sunTimes.goldenHourEnd) {
      return 'MORNING';
    }

    if (now < sunTimes.goldenHour) {
      return 'DAY';
    }

    if (now < sunTimes.night) {
      return 'DUSK';
    }

    return 'NIGHT';
  }, [ lat, lng ]);
};

export default UseDayPeriod;
