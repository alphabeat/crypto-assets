import { DbAsset } from '../../models/asset'
import { DbDashboard } from '../../models/dashboard'
import { DbTicker } from '../../models/ticker'

export const getRecordId = (record: DbDashboard | DbTicker | DbAsset) => record.ref['@ref'].id

export const getEmptyTicker = (index: number): DbTicker => ({
  ref: {
    '@ref': {
      id: `empty-slot-${index}`,
    },
  },
  ts: 1,
  data: { coin: '' }
})
