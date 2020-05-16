import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

function Home() {
  const [dashboardId, setDashboardId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if ( error ) {
      setTimeout(() => {
        setError('')
      }, 2000)
    }
  }, [error])

  async function handleSubmit(event) {
    event.preventDefault()

    router.push(`/dashboard/${dashboardId}`)
  }

  return (
    <Layout>
      <div className="Home">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4 has-text-centered">
              <button className="button is-link is-outlined">
                Create a new dashboard
              </button>
            </div>
          </div>
          <div>
            { error }
          </div>
          <div className="columns is-centered">
            <div className="column is-4 has-text-centered">
              <div className="search-bar">
                <h1 className="title is-3">Go to dashboard</h1>
                <form onSubmit={ handleSubmit }>
                  <div className="field has-addons">
                    <div className="control">
                      <input
                        type="text"
                        name="dashboardId"
                        value={ dashboardId }
                        className="input"
                        placeholder="Dashboard ID"
                        onChange={(e) => setDashboardId(e.target.value)}
                      />
                    </div>
                    <div className="control">
                      <button type="submit" className="button is-link" disabled={ dashboardId.length !== 8 }>
                        Go
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
