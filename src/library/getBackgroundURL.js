// import imagesSet from 'assets/fakes/imagesSet.json'
import backgroundMap from 'library/backgroundsMap.json'

import SunCalc from 'suncalc'

export default function getBackgroundURL (iconID, location) {
  const currPeriod = location ? getPeriodByLocation(location) : 'DAY'

  return '/images/backgrounds/' + currPeriod + '/' + backgroundMap[iconID] + '.jpeg'
}

function getPeriodByLocation (location) {
  const currDate = new Date()
  const sunTimes = SunCalc.getTimes(currDate, location.lat, location.lng)

  let currPeriod

  // Select current Period
  if (currDate < sunTimes.sunrise) {
    currPeriod = 'NIGHT'
  } else if (currDate < sunTimes.goldenHourEnd) {
    currPeriod = 'DAWN'
  } else if (currDate < sunTimes.goldenHour) {
    currPeriod = 'DAY'
  } else if (currDate < sunTimes.night) {
    currPeriod = 'DUSK'
  } else {
    currPeriod = 'NIGHT'
  }

  return currPeriod
}
