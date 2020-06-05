import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import IconText from '../components/IconText'
import Layout from '../components/Layout'

function Home() {
  const [dashboardId, setDashboardId] = useState('')
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()

    router.push(`/dashboard/${dashboardId}`)
  }

  return (
    <Layout>
      <div className="Home">
        <div className="background">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="container">
          <div className="text">
            <h1>All your crypto assets on one Dashboard</h1>
            <p className="description">
              Create your own dashboard to monitor the value of your crypto assets stored on various exchanges.
            </p>
            <button className="button is-link is-large">
              <IconText icon={ faPlus } text="Create new dashboard" />
            </button>
          </div>
          <div className="search-bar has-text-centered">
            <h1 className="title is-4 is-spaced">Already have a dashboard ?</h1>
            <h2 className="subtitle">
              Enter your Dashboard ID
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="control dashboard-id">
                <input
                  type="text"
                  id="dashboard-id-input"
                  className="input is-large"
                  name="dashboardId"
                  value={ dashboardId }
                  placeholder="••••••••"
                  pattern="^[A-Z0-9]{0,8}$"
                  onChange={(e) => setDashboardId(e.target.value)}
                />
              </div>
              <div className="control">
                <button
                  type="submit"
                  className="button is-link is-large is-outlined"
                  disabled={ dashboardId.length !== 8 }
                >
                  <span>Go to dashboard</span>
                  <span className="icon">
                    <FontAwesomeIcon icon={ faArrowRight } />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
