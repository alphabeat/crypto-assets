import { useRouter } from 'next/router'

const API_URL = `http://localhost:3000/api/dashboard`

function DashboardForm(props) {
  const { show, handleClose } = props
  const router = useRouter()
  const activeClass = show ? 'is-active' : ''

  async function createEmptyDashboard() {
    try {
      const response = await fetch(API_URL, {
        method: 'POST'
      })
      const result = await response.json()

      console.log(result)
      const { dashboardId } = result.data

      router.push(`/dashboard/${dashboardId}`)
    }
    catch (e) {
      console.error(e.message)
    }
  }

  return (
    <div className={`modal ${activeClass}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">
              New dashboard
            </p>
            <div className="card-header-icon">
              <button
                className="delete"
                aria-label="close"
                onClick={ handleClose }
              ></button>
            </div>
          </header>
          <section className="card-content">
            <div className="columns has-text-centered">
              <div className="column">
                <button className="button" onClick={() => createEmptyDashboard()}>
                  Empty dashboard
                </button>
              </div>
              <div className="column">
                <button className="button is-primary">
                  Filled dashboard
                </button>
              </div>
            </div>
          </section>
          <footer className="card-footer" style={{ justifyContent: 'flex-end' }}>
            <div className="card-footer-item">
              <button className="button is-link is-light" onClick={ handleClose }>Cancel</button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default DashboardForm