import iconsMap from './iconsMap.json'

export default function getIcon (iconID) {
  return '/images/icons/' + iconsMap[iconID] + '.png'
}
