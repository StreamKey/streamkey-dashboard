import Telaria from './SSP/Telaria'
import Freewheel from './SSP/Freewheel'
import Beachfront from './SSP/Beachfront'

export default async dateTs => {
  const telariaData = await Telaria.getData(dateTs)
  const freewheelData = await Freewheel.getData(dateTs)
  const beachfrontData = await Beachfront.getData(dateTs)
  return [{
    key: 'telaria',
    data: telariaData
  }, {
    key: 'freewheel',
    data: freewheelData
  }, {
    key: 'beachfront',
    data: beachfrontData
  }]
}
