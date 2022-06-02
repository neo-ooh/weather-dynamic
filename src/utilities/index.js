import * as cacheImp from './src/cache';

export { default as supports } from './src/supports';
export { default as designs } from './src/designs.json';

export { stopDisplay, skipDisplay } from './src/Broadsignlink';
export { default as resolveSupport } from './src/resolveSupport'
export { default as resolveDesign } from './src/resolveDesign'

export { default as isBroadSignPlayer } from './src/isBroadSignPlayer';
export { default as BroadSignData } from './src/BroadSignData';


export const cache = cacheImp;
