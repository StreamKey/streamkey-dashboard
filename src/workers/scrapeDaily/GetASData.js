import StreamRail from './AS/StreamRail'
import Lkqd from './AS/Lkqd'
import Aniview from './AS/Aniview'
import SpringServe from './AS/SpringServe'

const AdServers = [
  {
  //   key: 'streamrail',
  //   controller: StreamRail
  // }, {
    key: 'lkqd',
    controller: Lkqd
  // }, {
  //   key: 'aniview',
  //   controller: Aniview
  // }, {
  //   key: 'springserve',
  //   controller: SpringServe
  }
]

export default async (dateTs, errors) => {
  const results = []

  const fetchJobs = AdServers.map(async item => {
    try {
      const data = await item.controller.getData(dateTs)
      results.push({
        key: item.key,
        data
      })
    } catch (e) {
      errors.push(e)
    }
  })
  await Promise.all(fetchJobs)

  return results
}
