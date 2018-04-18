import Report from '../controllers/Report/'

export default async req => {
  const report = await Report.getByDate()
  return {
    success: true,
    report
  }
}
