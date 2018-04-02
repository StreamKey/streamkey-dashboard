import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'

import App from '../../App'
import AppHtml from '../controllers/AppHtml'

export default (req, res) => {
  const context = {}
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  )

  if (context.url) {
    res.redirect(context.url)
  } else {
    const html = AppHtml({ appMarkup: markup })
    res.status(200).send(html)
  }
}
