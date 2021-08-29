import React, { useContext } from 'react'
import { DbDashboard } from '../models/dashboard'

type DashboardContextType = {
  dashboard: DbDashboard
}

const DashboardContext = React.createContext<DashboardContextType>({} as DashboardContextType)

const DashboardProvider: React.FC<DashboardContextType> = (props) => {
  const { dashboard } = props

  return (
    <DashboardContext.Provider value ={{ dashboard }} {...props} />
  )
}

const useDashboard = () => useContext(DashboardContext)

export { DashboardProvider, useDashboard }