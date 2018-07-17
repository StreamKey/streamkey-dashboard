import Sequelize from 'sequelize'
import moment from 'moment'

import DB from '../../../DB/'
import calcDiff from './calcDiff'

const castTypes = data => {
  return {
    ...data,
    sspCpm: Number(data.sspCpm),
    sspRev: Number(data.sspRev),
    sspCost: Number(data.sspCost),
    asImp: Number(data.asImp),
    asCost: Number(data.asCost),
    asScost: Number(data.asScost),
    asRev: Number(data.asRev),
    asCpm: Number(data.asCpm),
    asPcpm: Number(data.asPcpm),
    profit: Number(data.profit),
    margin: Number(data.margin)
  }
}

export default async (fromTs, toTs) => {
  const reports = await DB.models.Reports.findAll({
    where: {
      date: {
        [Sequelize.Op.gte]: moment(fromTs, 'X'),
        [Sequelize.Op.lte]: moment(toTs, 'X')
      }
    }
  })
  const data = reports.map(report => {
    const diffs = calcDiff(report.dataValues)
    return {
      ...castTypes(report.dataValues),
      ...diffs
    }
  })
  return {
    range: {
      from: fromTs,
      to: toTs
    },
    data
  }
}
