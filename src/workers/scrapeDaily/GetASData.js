import StreamRail from './AS/StreamRail'
import Lkqd from './AS/Lkqd'
import Aniview from './AS/Aniview'

export default async dateTs => {
  const streamRailData = await StreamRail.getData(dateTs)
  const lkqdData = await Lkqd.getData(dateTs)
  const aniviewData = await Aniview.getData(dateTs)
  return [{
    key: 'streamRail',
    data: streamRailData
  }, {
    key: 'lkqd',
    data: lkqdData
  }, {
    key: 'aniview',
    data: aniviewData
  }]
}
