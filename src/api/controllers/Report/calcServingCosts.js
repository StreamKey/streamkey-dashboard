export default report => {
  const costs = {
    sspScost: 0,
    asScost: 0
  }
  if (report.as === 'lkqd') {
    costs.asScost = (report.asImp / 1000) * 0.24
  }
  if (report.ssp === 'tremor') {
  }
  return costs
}
