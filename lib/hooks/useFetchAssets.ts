import useSWR from 'swr'

import { DbAsset } from '../../models/asset'
import fetcher from '../api/fetcher'

export const getAssetsKey = (dashboardId: string) => `/api/dashboard/${dashboardId}/assets`

const useFetchAssets = (dashboardId: string) => {
  const { data: assets, error: hasError } = useSWR<DbAsset[]>(getAssetsKey(dashboardId), fetcher)

  return {
    assets,
    isLoading: !assets && !hasError,
    hasError
  }
}

export default useFetchAssets