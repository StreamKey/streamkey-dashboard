import Sequelize from 'sequelize'

import DB from '../../../DB/'

export default async (fromTs, toTs) => {
  const reports = await DB.models.Reports.findAll({
    where: {
      date: {
        [Sequelize.Op.gt]: 0,
        // [lt]: 0
      }
    }
  })
  const data = reports.map(report => {
    return {
      ...report.dataValues
    }
  })
  return {
    range: {
      from: fromTs,
      to: toTs
    },
    header: [
      {
        key: 'tag',
        title: 'TAG',
        type: 'string'
      }, {
        key: 'ssp',
        title: 'SSP',
        type: 'string'
      }, {
        key: 'sspOpp',
        title: 'SSP Opp',
        type: 'integer'
      }, {
        key: 'sspImp',
        title: 'SSP Imp',
        type: 'integer'
      }, {
        key: 'sspCpm',
        title: 'SSP CPM',
        type: 'string' // Float
      }, {
        key: 'sspRev',
        title: 'SSP Rev',
        type: 'string' // Float
      }, {
        key: 'as',
        title: 'AS',
        type: 'string'
      }, {
        key: 'asOpp',
        title: 'AS Opp',
        type: 'integer'
      }, {
        key: 'asImp',
        title: 'AS Imp',
        type: 'integer'
      }, {
        key: 'asCost',
        title: 'AS Cost',
        type: 'string' // Float
      }, {
        key: 'profit',
        title: 'Profit',
        type: 'string' // Float
      }, {
        key: 'margin',
        title: 'Margin',
        type: 'string' // Float
      }
    ],
    data
  }
}
