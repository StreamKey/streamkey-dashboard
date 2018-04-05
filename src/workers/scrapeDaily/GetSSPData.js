import Telaria from './SSP/Telaria'

export default async dateTs => {
  const telariaData = await Telaria.getData()
  return [{
    key: 'telaria',
    data: telariaData
  }]
}
