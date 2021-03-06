import Sequelize from 'sequelize'
import moment from 'moment'

import DB from '../../../DB/'
import calcDiff from './calcDiff'

const castTypes = data => {
  return {
    ...data,
    sspOpp: Number(data.sspOpp),
    sspImp: Number(data.sspImp),
    sspCpm: Number(data.sspCpm),
    sspRev: Number(data.sspRev),
    sspScost: Number(data.sspScost),
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
    const dataValues = castTypes(report.dataValues)
    if (dataValues.ssp === 'tappx') {
      const cpmImp = Number(dataValues.asCpm) * Number(dataValues.sspImp)
      dataValues.sspRev = cpmImp ? (cpmImp / 1000) : 0
    }
    const diffs = calcDiff(dataValues)
    return {
      ...dataValues,
      ...diffs
    }
  })
  const links = await DB.models.ReportLinks.findAll({
    where: {
      date: {
        [Sequelize.Op.gte]: moment(fromTs, 'X'),
        [Sequelize.Op.lte]: moment(toTs, 'X')
      }
    }
  })
  return {
    range: {
      from: fromTs,
      to: toTs
    },
    data,
    links
  }
}
