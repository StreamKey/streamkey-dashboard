import Report from '../controllers/Report/'

export default async req => {
  const { from, to } = req.query
  const report = await Report.getByDate(from, to)
  return {
    success: true,
    report
  }
}
