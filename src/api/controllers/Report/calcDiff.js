export default report => {
  const diffs = {
    diffCpm: report.sspCpm - report.asCpm,
    diffImp: report.asImp - report.sspImp,
    diffRev: report.asRev - report.sspRev
  }
  return diffs
}
