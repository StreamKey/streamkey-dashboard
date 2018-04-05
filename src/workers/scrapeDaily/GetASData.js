import StreamRail from './AS/StreamRail'

export default async dateTs => {
  const streamRailData = await StreamRail.getData(dateTs)
  return [{
    key: 'streamRail',
    data: streamRailData
  }]
}
