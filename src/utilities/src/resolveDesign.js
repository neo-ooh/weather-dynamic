const isBroadSignPlayer = require('utilities/src/isBroadSignPlayer')
const designs = require('utilities/src/designs.json')

module.exports = function(hint = null, fallback = "SHD") {
  const hintedDesign = designs.hasOwnProperty(hint) ? designs[hint] : null

  const resolutionSource = hintedDesign != null && hintedDesign.name === 'FCL' ? 'display_unit_resolution' : 'frame_resolution';

  // Get the current frame dimensions
  const [frameWidth, frameHeight] = isBroadSignPlayer ?
    window.BroadSignObject[resolutionSource].split('x').map(Number) :  // Get dimensions from BroadSign
    [window.innerWidth, window.innerHeight]                           // Get dimensions from the navigator

  if(hintedDesign != null) {
    console.log("Using hinted design")

    // We got a design
    // Return the design with the scale ratio for the current frame
    return {
      ...hintedDesign,
      scale: Math.min(frameWidth / hintedDesign.width, frameHeight / hintedDesign.height)
    }
  }

  // Check if the frame dimensions match any of the designs
  for(const designID in designs) {
    const design = designs[designID]

    if(design.width === frameWidth && design.height === frameHeight) {
      // Our current dimensions match a design
      console.log("Using resolution-matched design")

      return {
        ...design,
        scale: 1 // No need to calculate the ratio here as it is a perfect match
      }
    }
  }

  // If we are here it means there is no perfect match, let's check for any aspect ratio match
  for(const designID in designs) {
    const design = designs[designID]

    if(design.width / design.height === frameWidth / frameHeight) {
      console.log("Using aspect ratio-matched design")

      // Our current aspect ratio match this design
      // Return the design with the scale ratio for the current frame
      return {
        ...design,
        scale: Math.min(frameWidth / design.width, frameHeight / design.height)
      }
    }
  }

  // No design can be matched with the current frame, use the fallback design
  const design = designs[fallback]

  console.log("Using fallback design")

  return {
    ...design,
    scale: Math.min(frameWidth / design.width, frameHeight / design.height)
  }
}
