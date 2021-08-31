import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Error from 'next/error'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal, faChartPie } from '@fortawesome/free-solid-svg-icons'

import { useCurrency } from '../../context/currency'
import { DashboardProvider } from '../../context/dashboard'
import useFetchDashboard from '../../lib/hooks/useFetchDashboard'

import AssetsList from '../../components/AssetsList/AssetsList'
import AssetsOverview from '../../components/AssetsOverview/AssetsOverview'
import Layout from '../../components/Layout/Layout'
import SpinnerFallback from '../../components/SpinnerFallback/SpinnerFallback'
import TickersList from '../../components/TickersList/TickersList'

type View = 'list' | 'overview'

type DashboardProps = {
  dashboardId: string
}

const Dashboard: React.VFC<DashboardProps> = ({ dashboardId }) => {
  const { currency } = useCurrency()
  const { dashboard, isLoading, hasError } = useFetchDashboard(dashboardId)
  const [currentView, setCurrentView] = useState<View>('list')

  useEffect(() => setCurrentView('list'), [currency])

  if ( isLoading ) return <SpinnerFallback />

  if ( hasError ) return <Error statusCode={ 404 } />

  return (
    <DashboardProvider dashboard={dashboard}>
      <Layout hasHero>
        <div className="Dashboard">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-10">
                <TickersList />
                <section className="view-tiles">
                  <div className="buttons">
                    <button
                      className={`button is-small ${currentView === 'overview' ? 'is-black' : 'is-white'}`}
                      onClick={() => currentView !== 'overview' && setCurrentView('overview')}
                    >
                      <span className="icon">
                        <FontAwesomeIcon icon={ faChartPie } />
                      </span>
                    </button>
                    <button
                      className={`button is-small ${currentView === 'list' ? 'is-black' : 'is-white'}`}
                      onClick={() => currentView !== 'list' && setCurrentView('list')}
                    >
                      <span className="icon">
                        <FontAwesomeIcon icon={ faGripHorizontal } />
                      </span>
                    </button>
                  </div>
                </section>
                {currentView === 'list' ? <AssetsList /> : <AssetsOverview />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </DashboardProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id: dashboardId } = context.params

  return {
    props: {
      dashboardId,
    },
  }
}

export default Dashboard
