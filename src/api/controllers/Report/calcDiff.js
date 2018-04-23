export default report => {
  const costs = {
    diffCpm: report.sspCpm - report.asCpm,
    diffImp: report.asImp - report.sspImp
  }
  return costs
}
