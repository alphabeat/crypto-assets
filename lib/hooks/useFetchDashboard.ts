import useSWR from 'swr'

import { DbDashboard } from '../../models/dashboard';
import fetcher from '../api/fetcher';

const getDashboardUrl = (id: string) => `/api/dashboard/${id}`;

const useFetchDashboard = (id: string) => {
  const { data: dashboard, error: hasError } = useSWR<DbDashboard>(getDashboardUrl(id), fetcher)

  return {
    dashboard,
    isLoading: !dashboard && !hasError,
    hasError,
  }
}

export default useFetchDashboard