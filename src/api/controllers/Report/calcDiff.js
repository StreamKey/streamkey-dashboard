export default report => {
  const diffs = {
    diffCpm: report.sspCpm - report.asCpm,
    diffImp: report.sspImp - report.asImp,
    diffRev: report.sspRev - report.asRev
  }
  return diffs
}
