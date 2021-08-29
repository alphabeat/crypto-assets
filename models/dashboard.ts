type Dashboard = {
  id: string
  isPasswordProtected: boolean
}

export type DbDashboard = FaunaDBRecord<Dashboard>

export default Dashboard
