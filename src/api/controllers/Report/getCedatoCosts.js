import Sequelize from 'sequelize'
import moment from 'moment'

import DB from '../../../DB/'

export default async (fromTs, toTs) => {
  const fromStr = moment(fromTs, 'X').format('YYYY-MM-DD HH:mm:ss')
  const toStr = moment(toTs, 'X').format('YYYY-MM-DD HH:mm:ss')
  const totalCost = await DB.sequelize.query(
    `SELECT SUM("cost") FROM "CedatoCosts" WHERE "date" >= '${fromStr}' AND "date" < '${toStr}'`,
    { type: Sequelize.QueryTypes.SELECT }
  )
  return {
    range: {
      from: fromTs,
      to: toTs
    },
    totalCost: totalCost.length === 1 ? Number(totalCost[0].sum) : 0
  }
}
