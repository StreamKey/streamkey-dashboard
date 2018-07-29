import moment from 'moment'
import Sheets from './Sheets'

import Report from '../Report/'
import { getPartnerName } from '../../../components/Utils'

const sheetTitle = 'Discrepancy ' + moment().format('HH:mm:ss')

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
    case 'total':
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
    case 'conditionalPercentageNeutral':
      return {
        addConditionalFormatRule: {
          rule: {
            ranges,
            booleanRule: {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [
                  {
                    userEnteredValue: '=AND(N(INDIRECT("R[0]C[0]", false)) <= 0.001, N(INDIRECT("R[0]C[0]", false)) >= -0.001)'
                  }
                ]
              },
              format: {
                textFormat: {
                  foregroundColor: {
                    blue: 0.5,
                    green: 0.5,
                    red: 0.5
                  },
                  italic: true
                }
              }
            }
          },
          index: 0
        }
      }
    case 'conditionalUsdNeutral':
      return {
        addConditionalFormatRule: {
          rule: {
            ranges,
            booleanRule: {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [
                  {
                    userEnteredValue: '=AND(INDIRECT("R[0]C[0]", false) <= 0.001, INDIRECT("R[0]C[0]", false) >= -0.001)'
                  }
                ]
              },
              format: {
                textFormat: {
                  foregroundColor: {
                    blue: 0.5,
                    green: 0.5,
                    red: 0.5
                  },
                  italic: true
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
                    userEnteredValue: '=AND(N(INDIRECT("R[0]C[0]", false)) >= 0.03, INDIRECT("R[0]C[1]", false) >= 10)'
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
                    userEnteredValue: '=AND(N(INDIRECT("R[0]C[0]", false)) <= -0.03, INDIRECT("R[0]C[1]", false) <= -10)'
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
                    userEnteredValue: '=AND(INDIRECT("R[0]C[0]", false) >= 10, N(INDIRECT("R[0]C[-1]", false)) >= 0.03)'
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
                    userEnteredValue: '=AND(INDIRECT("R[0]C[0]", false) <= -10, N(INDIRECT("R[0]C[-1]", false)) <= -0.03)'
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
      endColumnIndex: (asList.length + 1) * 2 + 1,
      startRowIndex: 0,
      endRowIndex: 1
    })
  }, {
    ...styles({
      type: 'centered',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 2 + 1,
      startRowIndex: 0,
      endRowIndex: 2
    })
  }, {
    ...styles({
      type: 'total',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 2 + 1,
      startRowIndex: 2,
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
        startColumnIndex: (i * 2) + 1,
        endColumnIndex: (i * 2) + 3
      },
      mergeType: 'MERGE_ALL'
    }
  })
}

const addHeader = data => {
  const firstRow = ['']
  const secondRow = ['']
  firstRow.push('Total')
  firstRow.push('')
  for (let as of asList) {
    firstRow.push(getPartnerName(as))
    firstRow.push('')
    secondRow.push('%')
    secondRow.push('$')
  }
  secondRow.push('%')
  secondRow.push('$')
  data.push(firstRow)
  data.push(secondRow)
}

const addTotalRow = (data, report) => {
  const totalRow = ['Total']
  const dataColumns = []
  let totalTotalAsRev = 0
  let totalTotalSspRev = 0
  for (let i in asList) {
    const as = asList[i]
    let totalAsRev = 0
    let totalSspRev = 0
    for (let ssp of report.bySsp) {
      totalSspRev += ssp[as].revenue
      totalAsRev += ssp[as].asRevenue
      totalTotalSspRev += ssp[as].revenue
      totalTotalAsRev += ssp[as].asRevenue
    }
    // Add total cells for this AS
    const totalDiff = totalSspRev - totalAsRev
    const totalDiffPercent = totalAsRev === 0 ? 0 : totalSspRev / totalAsRev - 1
    dataColumns.push(totalDiffPercent)
    dataColumns.push(totalDiff)
  }
  // Add total cells for all ASs
  const totalTotalDiff = totalTotalSspRev - totalTotalAsRev
  const totalTotalDiffPercent = totalTotalAsRev === 0 ? 0 : totalTotalSspRev / totalTotalAsRev - 1
  totalRow.push(totalTotalDiffPercent)
  totalRow.push(totalTotalDiff)
  totalRow.push(...dataColumns)
  data.push(totalRow)
}

const addAsRows = (data, report) => {
  for (let ssp of report.bySsp) {
    const row = [getPartnerName(ssp.ssp)]
    const dataColumns = []
    let totalSspRev = 0
    let totalAsRev = 0
    for (let as of asList) {
      const sspRevenue = ssp[as].revenue
      const asRevenue = ssp[as].asRevenue
      const diff = sspRevenue - asRevenue
      const diffPercent = asRevenue === 0 ? 0 : sspRevenue / asRevenue - 1
      dataColumns.push(diffPercent)
      dataColumns.push(diff)
      totalSspRev += sspRevenue
      totalAsRev += asRevenue
    }
    const totalDiff = totalSspRev - totalAsRev
    const totalDiffPercent = totalAsRev === 0 ? 0 : totalSspRev / totalAsRev - 1
    row.push(totalDiffPercent)
    row.push(totalDiff)
    row.push(...dataColumns)
    data.push(row)
  }
}

const addConditionalFormats = (data, formatData) => {
  const percentRanges = []
  const usdRanges = []
  for (let i = 0; i < (asList.length + 1); i++) {
    percentRanges.push({
      sheetId: '__sheetId__',
      startColumnIndex: (i * 2) + 1,
      endColumnIndex: (i * 2) + 2,
      startRowIndex: 2,
      endRowIndex: data.length
    })
    usdRanges.push({
      sheetId: '__sheetId__',
      startColumnIndex: (i * 2) + 2,
      endColumnIndex: (i * 2) + 3,
      startRowIndex: 2,
      endRowIndex: data.length
    })
  }

  for (let r of percentRanges) {
    formatData.push({
      ...styles({
        type: 'percentage',
        ...r
      })
    })
  }
  for (let r of usdRanges) {
    formatData.push({
      ...styles({
        type: 'usd',
        ...r
      })
    })
  }

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
  formatData.push({
    ...styles({
      sheetId: '__sheetId__',
      type: 'conditionalPercentageNeutral',
      ranges: percentRanges
    })
  })
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
      type: 'conditionalUsdNeutral',
      ranges: usdRanges
    })
  })
}

const addBorders = (report, formatData) => {
  // 1px borders to all cells
  formatData.push({
    ...styles({
      type: 'border',
      startColumnIndex: 0,
      endColumnIndex: (asList.length + 1) * 2 + 1,
      startRowIndex: 0,
      endRowIndex: 3 + report.bySsp.length,
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
      endColumnIndex: (asList.length + 1) * 2 + 1,
      startRowIndex: 2,
      endRowIndex: 3,
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
      endColumnIndex: (asList.length + 1) * 2 + 1,
      startRowIndex: 0,
      endRowIndex: 3 + report.bySsp.length,
      options: {
        width: 2,
        inner: false
      }
    })
  })
}

const createSheetData = report => {
  const data = []
  addHeader(data)
  addTotalRow(data, report)
  addAsRows(data, report)
  addConditionalFormats(data, formatData)
  addBorders(report, formatData)
  return {
    data,
    formatData
  }
}

const main = async ({ from, to }) => {
  const report = await Report.groupBySspAs(from, to)
  const { data, formatData } = createSheetData(report)
  const filename = 'Daily ' + moment(from, 'X').format('YYYY-MM-DD')
  const reportUrl = await Sheets.publishReport({ filename, sheetTitle, data, formatData })
  return reportUrl
}

export default main
