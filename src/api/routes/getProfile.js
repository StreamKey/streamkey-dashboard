export default async req => {
  return {
    success: true,
    user: req.session.user
  }
}
