export default report => {
  const diffs = {
    diffCpm: report.ssp ? report.sspCpm - report.asCpm : null,
    diffImp: report.ssp ? report.sspImp - report.asImp : null,
    diffRev: report.ssp ? report.sspRev - report.asRev : null
  }
  return diffs
}
