const mockReport = {
  range: {
    from: 1522530000,
    to: 1522616400 // Not including
  },
  header: [
    {
      title: 'SSP',
      type: 'string',
      key: 'ssp'
    }, {
      title: 'AS',
      type: 'string',
      key: 'as'
    }, {
      title: 'Tag',
      type: 'string',
      key: 'tag'
    }, {
      title: 'Opp',
      type: 'integer',
      key: 'opportunities'
    }
  ],
  data: [
    {
      ssp: 'SSP1',
      as: 'AS1',
      tag: 'TAG1',
      opportunities: 4
    }, {
      ssp: 'SSP1',
      as: 'AS2',
      tag: 'TAG2',
      opportunities: 12
    }, {
      ssp: 'SSP1',
      as: 'AS1',
      tag: 'TAG3',
      opportunities: 2
    }, {
      ssp: 'SSP1',
      as: 'AS2',
      tag: 'TAG4',
      opportunities: 0
    }
  ]
}

export default async req => {
  return {
    success: true,
    report: mockReport
  }
}
