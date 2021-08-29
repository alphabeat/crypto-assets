import useSWR from 'swr'

import { DbTicker } from '../../models/ticker'
import fetcher from '../api/fetcher'

export const getTickersKey = (dashboardId: string) => `/api/dashboard/${dashboardId}/tickers`

const useFetchTickers = (dashboardId: string) => {
  const { data: tickers, error: hasError } = useSWR<DbTicker[]>(getTickersKey(dashboardId), fetcher)

  return {
    tickers,
    isLoading: !tickers && !hasError,
    hasError
  }
}

export default useFetchTickers