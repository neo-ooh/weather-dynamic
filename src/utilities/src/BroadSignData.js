const isBroadSignPlayer = require('utilities/src/isBroadSignPlayer')

function getVar(broadSignParameter) {
  return isBroadSignPlayer ? window.BroadSignObject[broadSignParameter] : null
}



module.exports = {
  getParameter: getVar,
  displayAddress: getVar.bind(null, 'display_unit_address'),
  displayLatLong: getVar.bind(null, 'display_unit_lat_long'),
  displayResolution: getVar.bind(null, 'display_unit_resolution'),
  playerID: getVar.bind(null, 'player_id'),
  frameID: getVar.bind(null, 'frame_id'),
  frameResolution: getVar.bind(null, 'frame_resolution'),
  displayDuration: getVar.bind(null, 'expected_slot_duration_ms'),
}
