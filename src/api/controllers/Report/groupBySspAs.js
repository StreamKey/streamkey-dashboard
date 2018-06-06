import each from 'lodash/each'

import getByDate from './getByDate'

const mockData = [
  {
    ssp: 'Telaria',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }, {
    ssp: 'FreeWheel',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }, {
    ssp: 'AOL',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }, {
    ssp: 'BeachFront',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }, {
    ssp: 'V2V LKQD',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }, {
    ssp: 'V2V StreamRail',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }, {
    ssp: 'V2V SpringServe',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }, {
    ssp: 'V2V Aniview',
    lkqd: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    streamrail: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    springserve: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    },
    aniview: {
      profit: 1234.1234,
      profitDiff: 10.9876,
      margin: 34.34,
      marginDiff: 5.555
    }
  }
]

const groupBySsp = results => {
  const asList = ['aniview', 'lkqd', 'springserve', 'streamrail']
  const sspGroups = {
    'aerserv': {},
    'beachfront': {},
    'freewheel': {},
    'onevideo': {},
    'telaria': {},
    'v2v': {}
  }
  each(sspGroups, (ssp, sspKey) => {
    each(asList, as => {
      sspGroups[sspKey][as] = {
        revenue: 0,
        profit: 0
      }
    })
  })
  each(results, r => {
    const ssp = r.ssp || detectV2V(r)
    if (!ssp) {
      return
    }
    const bucket = sspGroups[ssp][r.as]
    bucket.profit += r.profit
    if (r.ssp) {
      bucket.revenue += r.sspRev
    } else {
      bucket.revenue += r.asRev
    }
  })
  each(sspGroups, (ssp, sspKey) => {
    each(ssp, (as, asKey) => {
      const bucket = sspGroups[sspKey][asKey]
      bucket.margin = bucket.revenue === 0 ? 0 : bucket.profit / bucket.revenue
    })
  })
  return groupsToArray(sspGroups)
}

const detectV2V = result => {
  return 'v2v'
  // console.error('Unknown SSP', result.ssp)
  // return 'v2v_aniview'
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

export default async (fromTs, toTs) => {
  const results = await getByDate(fromTs, toTs)
  const reports = {
    summary: {},
    bySsp: groupBySsp(results.data)
  }
  return reports
}
