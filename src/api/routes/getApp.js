import AppHtml from '../controllers/AppHtml'

export default (req, res) => {
  const html = AppHtml()
  res.status(200).send(html)
}
