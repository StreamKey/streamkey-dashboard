import Sequelize from 'sequelize'
import moment from 'moment'

import DB from '../../../DB/'
import calcServingCosts from './calcServingCosts'

export default async (fromTs, toTs) => {
  const reports = await DB.models.Reports.findAll({
    where: {
      date: {
        [Sequelize.Op.gt]: moment(fromTs, 'X'),
        [Sequelize.Op.lt]: moment(toTs, 'X')
      }
    }
  })
  const data = reports.map(report => {
    const servingCosts = calcServingCosts(report.dataValues)
    return {
      ...report.dataValues,
      ...servingCosts
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
        type: 'string',
        group: 'ssp'
      }, {
        key: 'sspOpp',
        title: 'SSP Opp',
        type: 'integer',
        group: 'ssp'
      }, {
        key: 'sspImp',
        title: 'SSP Imp',
        type: 'integer',
        group: 'ssp'
      }, {
        key: 'sspCpm',
        title: 'SSP CPM',
        type: 'usd',
        group: 'ssp'
      }, {
        key: 'sspRev',
        title: 'SSP Rev',
        type: 'usd',
        group: 'ssp'
      }, {
        key: 'sspScost',
        title: 'SSP sCost',
        type: 'usd',
        group: 'ssp'
      }, {
        key: 'as',
        title: 'AS',
        type: 'string',
        group: 'as'
      }, {
        key: 'asOpp',
        title: 'AS Opp',
        type: 'integer',
        group: 'as'
      }, {
        key: 'asImp',
        title: 'AS Imp',
        type: 'integer',
        group: 'as'
      }, {
        key: 'asCost',
        title: 'AS Cost',
        type: 'usd',
        group: 'as'
      }, {
        key: 'asScost',
        title: 'AS sCost',
        type: 'usd',
        group: 'as'
      }, {
        key: 'profit',
        title: 'Profit',
        type: 'usd'
      }, {
        key: 'margin',
        title: 'Margin',
        type: 'percent'
      }
    ],
    data
  }
}
