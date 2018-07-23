import moment from 'moment'
import Sheets from './Sheets'

import Report from '../Report/'
import { getPartnerName } from '../../../components/Utils'

const sheetTitle = 'SSP-AS ' + moment().format('HH:mm:ss')

const asList = [
  'lkqd',
  'streamrail',
  'springserve',
  'aniview'
]

const styles = ({
  type,
  startRowIndex,
  endRowIndex,
  startColumnIndex,
  endColumnIndex,
  ranges,
  options = {}
}) => {
  switch (type) {
    case 'centered':
      return {
        repeatCell: {
          range: {
            sheetId: '__sheetId__',
            startColumnIndex,
            endColumnIndex,
            startRowIndex,
            endRowIndex
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER'
            }
          },
          fields: 'userEnteredFormat(horizontalAlignment)'
        }
      }
    case 'bold':
      return {
        repeatCell: {
          range: {
            sheetId: '__sheetId__',
            startColumnIndex,
            endColumnIndex,
            startRowIndex,
            endRowIndex
          },
          cell: {
            userEnteredFormat: {
              textFormat: {
                bold: true
              }
            }
          },
          fields: 'userEnteredFormat(textFormat)'
        }
      }
    case 'usd':
      return {
        repeatCell: {
          range: {
            sheetId: '__sheetId__',
            startColumnIndex,
            endColumnIndex,
            startRowIndex,
            endRowIndex
          },
          cell: {
            userEnteredFormat: {
              numberFormat: {
                type: 'NUMBER',
                pattern: '$0.0'
              }
            }
          },
          fields: 'userEnteredFormat(numberFormat)'
        }
      }
    case 'percentage':
      return {
        repeatCell: {
          range: {
            sheetId: '__sheetId__',
            startColumnIndex,
            endColumnIndex,
            startRowIndex,
            endRowIndex
          },
          cell: {
            userEnteredFormat: {
              numberFormat: {
                type: 'NUMBER',
                pattern: '0%'
              }
            }
          },
          fields: 'userEnteredFormat(numberFormat)'
        }
      }
    case 'conditionalUsdPositive':
      return {
        addConditionalFormatRule: {
          rule: {
            ranges,
            booleanRule: {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [
                  {
                    userEnteredValue: '=INDIRECT("R[0]C[0]", false) - INDIRECT("R[0]C[1]", false) > 10'
                  }
                ]
              },
              format: {
                backgroundColor: {
                  blue: 0.9,
                  green: 1,
                  red: 0.9
                }
              }
            }
          },
          index: 0
        }
      }
    case 'conditionalUsdNegative':
      return {
        addConditionalFormatRule: {
          rule: {
            ranges,
            booleanRule: {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [
                  {
                    userEnteredValue: '=INDIRECT("R[0]C[1]", false) - INDIRECT("R[0]C[0]", false) > 10'
                  }
                ]
              },
              format: {
                backgroundColor: {
                  blue: 0.9,
                  green: 0.9,
                  red: 1
                }
              }
            }
          },
          index: 0
        }
      }
    case 'conditionalPercentagePositive':
      return {
        addConditionalFormatRule: {
          rule: {
            ranges,
            booleanRule: {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [
                  {
                    userEnteredValue: '=N(INDIRECT("R[0]C[0]", false)) - N(INDIRECT("R[0]C[1]", false)) > 0.3'
                  }
                ]
              },
              format: {
                backgroundColor: {
                  blue: 0.9,
                  green: 1,
                  red: 0.9
                }
              }
            }
          },
          index: 0
        }
      }
    case 'conditionalPercentageNegative':
      return {
        addConditionalFormatRule: {
          rule: {
            ranges,
            booleanRule: {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [
                  {
                    userEnteredValue: '=N(INDIRECT("R[0]C[1]", false)) - N(INDIRECT("R[0]C[0]", false)) > 0.3'
                  }
                ]
              },
              format: {
                backgroundColor: {
                  blue: 0.9,
                  green: 0.9,
                  red: 1
                }
              }
            }
          },
          index: 0
        }
      }
    case 'border':
      const borderStyle = {
        style: options.style || 'SOLID',
        width: options.width || 1,
        color: options.color || {
          red: 0,
          green: 0,
          blue: 0
        }
      }
      return {
        updateBorders: {
          range: {
            sheetId: '__sheetId__',
            startColumnIndex,
            endColumnIndex,
            startRowIndex,
            endRowIndex
          },
          top: borderStyle,
          right: borderStyle,
          bottom: borderStyle,
          left: borderStyle,
          innerHorizontal: options.inner === false ? undefined : borderStyle,
          innerVertical: options.inner === false ? undefined : borderStyle
        }
      }
    default:
      return {}
  }
}

const formatData = [
  {
    ...styles({
      type: 'bold',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 4 + 1,
      startRowIndex: 0,
      endRowIndex: 1
    })
  }, {
    ...styles({
      type: 'centered',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 4 + 1,
      startRowIndex: 0,
      endRowIndex: 3
    })
  }
]

for (let i = 0; i < asList.length + 1; i++) {
  formatData.push({
    mergeCells: {
      range: {
        sheetId: '__sheetId__',
        startRowIndex: 0,
        endRowIndex: 1,
        startColumnIndex: (i * 4) + 1,
        endColumnIndex: (i * 4) + 5
      },
      mergeType: 'MERGE_ALL'
    }
  })
}
for (let i = 0; i < (asList.length + 1) * 2; i++) {
  formatData.push({
    mergeCells: {
      range: {
        sheetId: '__sheetId__',
        startRowIndex: 1,
        endRowIndex: 2,
        startColumnIndex: (i * 2) + 1,
        endColumnIndex: (i * 2) + 3
      },
      mergeType: 'MERGE_ALL'
    }
  })
}
for (let i = 0; i < (asList.length + 1); i++) {
  formatData.push({
    ...styles({
      type: 'usd',
      startColumnIndex: (i * 4) + 1,
      endColumnIndex: (i * 4) + 3,
      startRowIndex: 3,
      endRowIndex: 11
    })
  })
  formatData.push({
    ...styles({
      type: 'percentage',
      startColumnIndex: (i * 4) + 3,
      endColumnIndex: (i * 4) + 5,
      startRowIndex: 3,
      endRowIndex: 11
    })
  })
}

const addHeader = data => {
  const firstRow = ['']
  const secondRow = ['Demand']
  const thirdRow = ['']
  firstRow.push('Total', '', '', '')
  secondRow.push('Profit $', '')
  secondRow.push('Margin %', '')
  thirdRow.push('Today', 'Yesterday')
  thirdRow.push('Today', 'Yesterday')
  for (let as of asList) {
    firstRow.push(getPartnerName(as), '', '', '')
    secondRow.push('Profit $', '')
    secondRow.push('Margin %', '')
    thirdRow.push('Today', 'Yesterday')
    thirdRow.push('Today', 'Yesterday')
  }
  data.push(firstRow)
  data.push(secondRow)
  data.push(thirdRow)
}

const addTotalRow = (data, diff) => {
  const total = {
    revenue: {
      current: 0,
      previous: 0
    },
    profit: {
      current: 0,
      previous: 0
    },
    margin: {
      current: 0,
      previous: 0
    }
  }
  const totalRow = ['Total']
  const dataColumns = []
  for (let as of asList) {
    const asTotal = {
      revenue: {
        current: 0,
        previous: 0
      },
      profit: {
        current: 0,
        previous: 0
      },
      margin: {
        current: 0,
        previous: 0
      }
    }
    for (let ssp of diff) {
      asTotal.profit.current += ssp[as].profit.current
      asTotal.profit.previous += ssp[as].profit.previous
      asTotal.revenue.current += ssp[as].revenue.current
      asTotal.revenue.previous += ssp[as].revenue.previous
      total.profit.current += ssp[as].profit.current
      total.profit.previous += ssp[as].profit.previous
      total.revenue.current += ssp[as].revenue.current
      total.revenue.previous += ssp[as].revenue.previous
    }
    // Add total cells for this AS
    asTotal.margin.current = asTotal.profit.current === 0 ? 0 : asTotal.profit.current / asTotal.revenue.current
    asTotal.margin.previous = asTotal.profit.previous === 0 ? 0 : asTotal.profit.previous / asTotal.revenue.previous
    dataColumns.push(asTotal.profit.current)
    dataColumns.push(asTotal.profit.previous)
    dataColumns.push(asTotal.margin.current)
    dataColumns.push(asTotal.margin.previous)
  }
  // Add total cells for all ASs
  total.margin.current = total.profit.current === 0 ? 0 : total.profit.current / total.revenue.current
  total.margin.previous = total.profit.previous === 0 ? 0 : total.profit.previous / total.revenue.previous
  totalRow.push(total.profit.current)
  totalRow.push(total.profit.previous)
  totalRow.push(total.margin.current)
  totalRow.push(total.margin.previous)
  totalRow.push(...dataColumns)
  data.push(totalRow)
}

const addAsRows = (data, diff) => {
  for (let ssp of diff) {
    const row = [getPartnerName(ssp.ssp)]
    const dataColumns = []
    const total = {
      revenue: {
        current: 0,
        previous: 0
      },
      profit: {
        current: 0,
        previous: 0
      },
      margin: {
        current: 0,
        previous: 0
      }
    }
    for (let as of asList) {
      dataColumns.push(ssp[as].profit.current)
      dataColumns.push(ssp[as].profit.previous)
      dataColumns.push(ssp[as].margin.current)
      dataColumns.push(ssp[as].margin.previous)
      total.profit.current += ssp[as].profit.current
      total.profit.previous += ssp[as].profit.previous
      total.revenue.current += ssp[as].revenue.current
      total.revenue.previous += ssp[as].revenue.previous
    }
    total.margin.current = total.profit.current === 0 ? 0 : total.profit.current / total.revenue.current
    total.margin.previous = total.profit.previous === 0 ? 0 : total.profit.previous / total.revenue.previous
    row.push(total.profit.current)
    row.push(total.profit.previous)
    row.push(total.margin.current)
    row.push(total.margin.previous)
    row.push(...dataColumns)
    data.push(row)
  }
}

const addBorders = (diff, formatData) => {
  // 1px borders to all cells
  formatData.push({
    ...styles({
      type: 'border',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 4 + 1,
      startRowIndex: 0,
      endRowIndex: 4 + diff.length,
      options: {
        width: 1
      }
    })
  })
  // 2px border around total row
  formatData.push({
    ...styles({
      type: 'border',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 4 + 1,
      startRowIndex: 3,
      endRowIndex: 4,
      options: {
        width: 2,
        inner: false
      }
    })
  })
  // 2px border around all cells
  formatData.push({
    ...styles({
      type: 'border',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 4 + 1,
      startRowIndex: 0,
      endRowIndex: 4 + diff.length,
      options: {
        width: 2,
        inner: false
      }
    })
  })
}

const addConditionalFormats = (diff, formatData) => {
  const usdRanges = []
  const percentRanges = []
  const sheetLines = diff.length + 4
  for (let i = 0; i < (asList.length + 1); i++) {
    usdRanges.push({
      sheetId: '__sheetId__',
      startColumnIndex: (i * 4) + 1,
      endColumnIndex: (i * 4) + 2,
      startRowIndex: 3,
      endRowIndex: sheetLines
    })
    percentRanges.push({sheetId: '__sheetId__',
      startColumnIndex: (i * 4) + 3,
      endColumnIndex: (i * 4) + 4,
      startRowIndex: 3,
      endRowIndex: sheetLines
    })
  }
  formatData.push({
    ...styles({
      sheetId: '__sheetId__',
      type: 'conditionalUsdPositive',
      ranges: usdRanges
    })
  })
  formatData.push({
    ...styles({
      sheetId: '__sheetId__',
      type: 'conditionalUsdNegative',
      ranges: usdRanges
    })
  })
  formatData.push({
    ...styles({
      sheetId: '__sheetId__',
      type: 'conditionalPercentagePositive',
      ranges: percentRanges
    })
  })
  formatData.push({
    ...styles({
      sheetId: '__sheetId__',
      type: 'conditionalPercentageNegative',
      ranges: percentRanges
    })
  })
}

const createSheetData = diff => {
  const data = []
  addHeader(data)
  addTotalRow(data, diff)
  addAsRows(data, diff)
  addBorders(diff, formatData)
  addConditionalFormats(diff, formatData)
  return {
    data,
    formatData
  }
}

const calcDiff = (report, yesterdayReport) => {
  if (!report || !yesterdayReport) {
    return []
  }
  // Assumes the same SSP order in report/yesterdayReport
  return report.map((c, i) => {
    return {
      ...c,
      ...calcDiffItem(c, yesterdayReport[i])
    }
  })
}

const calcDiffItem = (current, previous) => {
  const res = {}
  for (let k in current) {
    if (k === 'ssp') {
      continue
    }
    res[k] = {
      revenue: {
        current: current[k].revenue,
        previous: previous[k].revenue,
        diff: current[k].revenue - previous[k].revenue,
        diffPercent: previous[k].revenue === 0 ? 0 : (current[k].revenue / previous[k].revenue) - 1
      },
      profit: {
        current: current[k].profit,
        previous: previous[k].profit,
        diff: current[k].profit - previous[k].profit,
        diffPercent: previous[k].profit === 0 ? 0 : (current[k].profit / previous[k].profit) - 1
      },
      margin: {
        current: current[k].margin,
        previous: previous[k].margin,
        diff: current[k].margin - previous[k].margin,
        diffPercent: previous[k].margin === 0 ? 0 : (current[k].margin / previous[k].margin) - 1
      }
    }
  }
  return res
}

const main = async ({ from, to }) => {
  const yesterdayFrom = Number(moment(from, 'X').subtract(1, 'day').format('X'))
  const yesterdayTo = Number(moment(to, 'X').subtract(1, 'day').format('X'))
  const report = await Report.groupBySspAs(from, to)
  const yesterdayReport = await Report.groupBySspAs(yesterdayFrom, yesterdayTo)
  const diff = calcDiff(report.bySsp, yesterdayReport.bySsp)

  const { data, formatData } = createSheetData(diff)
  const filename = 'Daily ' + moment(from, 'X').format('YYYY-MM-DD')
  const reportUrl = await Sheets.publishReport({ filename, sheetTitle, data, formatData })
  return reportUrl
}

export default main
