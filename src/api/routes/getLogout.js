export default async req => {
  try {
    req.session.isLoggedIn = false
    req.session.save()
    req.session.destroy()
    return {
      success: true
    }
  } catch (e) {
    throw e
  }
}
