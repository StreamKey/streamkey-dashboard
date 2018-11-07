import each from 'lodash/each'

import getByDate from './getByDate'

const groupBySsp = results => {
  const asList = ['aniview', 'lkqd', 'springserve', 'streamrail']
  const sspGroups = {
    'aerserv': {},
    'beachfront': {},
    'freewheel': {},
    'onevideo': {},
    'telaria': {},
    'spotx': {},
    'improvedigital': {},
    'tappx': {},
    // 'pulsepointctv': {},
    'v2v': {}
  }
  each(sspGroups, (ssp, sspKey) => {
    each(asList, as => {
      if (!sspGroups[sspKey]) {
        return
      }
      sspGroups[sspKey][as] = {
        revenue: 0,
        profit: 0,
        asRevenue: 0
      }
    })
  })
  each(results, r => {
    const ssp = r.ssp || 'v2v'
    if (!ssp) {
      return
    }
    const bucket = sspGroups[ssp][r.as]
    bucket.profit += r.profit
    bucket.asRevenue += r.asRev
    if (r.ssp) {
      bucket.revenue += r.sspRev
    } else {
      bucket.revenue += r.asRev
    }
  })
  each(sspGroups, (ssp, sspKey) => {
    each(ssp, (as, asKey) => {
      if (!sspGroups[sspKey]) {
        return
      }
      const bucket = sspGroups[sspKey][asKey]
      bucket.margin = bucket.revenue === 0 ? 0 : bucket.profit / bucket.revenue
    })
  })
  return groupsToArray(sspGroups)
}

const groupsToArray = sspGroups => {
  const res = []
  each(sspGroups, (ssp, sspKey) => {
    res.push({
      ...ssp,
      ssp: sspKey
    })
  })
  return res
}

const calcTotal = bySsp => {
  const total = {
    revenue: 0,
    profit: 0,
    margin: 0
  }
  each(bySsp, ssp => {
    each(ssp, as => {
      if (as.revenue) {
        total.revenue += as.revenue
      }
      if (as.profit) {
        total.profit += as.profit
      }
    })
  })
  total.margin = total.revenue === 0 ? 0 : total.profit / total.revenue
  return total
}

export default async (fromTs, toTs) => {
  const results = await getByDate(fromTs, toTs)
  const reports = {}
  reports.bySsp = groupBySsp(results.data)
  reports.total = calcTotal(reports.bySsp)
  return reports
}
