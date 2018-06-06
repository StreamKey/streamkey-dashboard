import Report from '../controllers/Report/'

export default async req => {
  const { from, to } = req.query
  let report
  switch (req.params.report) {
    case 'tag':
      report = await Report.getByDate(from, to)
      break
    case 'ssp-as':
      report = await Report.groupBySspAs(from, to)
      break
    default:
      throw new Error('no-such-report')
  }
  return {
    success: true,
    report
  }
}
