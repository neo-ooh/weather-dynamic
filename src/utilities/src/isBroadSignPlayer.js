/**
 * This module detects if the current application is running inside a BroadSignPlayer.
 * Its default exports equals true if it's a BroadSignPlayer, false otherwise
 *
 * @type {boolean}
 */

const isBroadSignPlayer = typeof navigator !== 'undefined' && typeof window.BroadSignObject !== 'undefined'

module.exports = isBroadSignPlayer