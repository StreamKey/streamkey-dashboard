const calcProfit = (results, date) => {
  return results.map(r => {
    let profit
    let margin
    let sspCpm
    if (r.ssp) {
      profit = r.sspRev - r.sspScost - r.asScost - r.asCost
      margin = r.sspRev === 0 ? 0 : profit / r.sspRev
      sspCpm = r.sspImp === 0 ? 0 : ((r.sspRev / r.sspImp) * 1000)
    } else {
      profit = r.asRev - r.asCost - r.asScost
      margin = r.asRev === 0 ? 0 : profit / r.asRev
      sspCpm = null
    }
    const asCpm = r.asImp === 0 ? 0 : ((r.asRev / r.asImp) * 1000)
    const asPcpm = r.asImp === 0 ? 0 : ((r.asCost / r.asImp) * 1000)
    return {
      ...r,
      date,
      profit,
      margin,
      sspCpm,
      asCpm,
      asPcpm
    }
  })
}

export default calcProfit
