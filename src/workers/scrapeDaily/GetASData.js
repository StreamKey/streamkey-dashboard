import StreamRail from './AS/StreamRail'
import Lkqd from './AS/Lkqd'

export default async dateTs => {
  const streamRailData = await StreamRail.getData(dateTs)
  const lkqdData = await Lkqd.getData(dateTs)
  return [{
    key: 'streamRail',
    data: streamRailData
  }, {
    key: 'lkqd',
    data: lkqdData
  }]
}
