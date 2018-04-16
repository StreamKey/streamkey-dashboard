import Telaria from './SSP/Telaria'
import Freewheel from './SSP/Freewheel'
import Beachfront from './SSP/Beachfront'
import Aerserv from './SSP/Aerserv'
import SpotX from './SSP/SpotX'
import OneVideo from './SSP/OneVideo'

export default async dateTs => {
  const telariaData = await Telaria.getData(dateTs)
  const freewheelData = await Freewheel.getData(dateTs)
  const beachfrontData = await Beachfront.getData(dateTs)
  const aerservData = await Aerserv.getData(dateTs)
  const spotxData = await SpotX.getData(dateTs)
  const onevideoData = await OneVideo.getData(dateTs)
  return [{
    key: 'telaria',
    data: telariaData
  }, {
    key: 'freewheel',
    data: freewheelData
  }, {
    key: 'beachfront',
    data: beachfrontData
  }, {
    key: 'aerserv',
    data: aerservData
  }, {
    key: 'spotx',
    data: spotxData
  }, {
    key: 'onevideo',
    data: onevideoData
  }]
}
