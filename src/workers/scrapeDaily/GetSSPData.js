import Telaria from './SSP/Telaria'
import Freewheel from './SSP/Freewheel'

export default async dateTs => {
  const telariaData = await Telaria.getData(dateTs)
  const freewheelData = await Freewheel.getData(dateTs)
  return [{
    key: 'telaria',
    data: telariaData
  }, {
    key: 'freewheel',
    data: freewheelData
  }]
}
