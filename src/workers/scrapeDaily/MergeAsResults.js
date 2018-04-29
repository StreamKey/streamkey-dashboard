export default (a, b) => {
  if (!a) {
    return b
  } else if (!b) {
    return a
  } else {
    return {
      ...a,
      asOpp: a.asOpp + b.asOpp,
      asImp: a.asImp + b.asImp,
      asRev: a.asRev + b.asRev,
      asCost: a.asCost + b.asCost
    }
  }
}
