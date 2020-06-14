///<reference path="../../lib/faunadb.d.ts" />
import { useRouter } from 'next/router'

type DashboardFormProps = {
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const API_URL = '/api/dashboard'

const DEFAULT_TICKERS = [
  { platform: 'bittrex', coin: 'BTC', market: 'EUR' },
  { platform: 'bittrex', coin: 'BTC', market: 'USD' },
  { platform: 'kraken', coin: 'ETH', market: 'EUR' },
  { platform: 'kraken', coin: 'ETH', market: 'USD' },
]

const DEFAULT_ASSETS = [
  { platform: 'bittrex', coin: 'BTC', balance: 1.00503293, initialValue: 1.00503293 },
  { platform: 'kraken', coin: 'BTC', balance: 0.21402864, initialValue: 0.21402864 },
  { platform: 'kraken', coin: 'ETH', balance: 32.6, initialValue: 0.00823043 },
  { platform: 'kraken', coin: 'XRP', balance: 4545, initialValue: 0.00005273 },
]

const getRecordId = (record: FaunaDBRecord) => record.ref['@ref'].id

function DashboardForm(props: DashboardFormProps) {
  const { show, handleClose } = props
  const router = useRouter()
  const activeClass = show ? 'is-active' : ''

  const createRecord = async (recordType: string, dashboardRef: string, data: any) => {
    return fetch(`${API_URL}/${dashboardRef}/${recordType}`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        dashboard: dashboardRef,
      }),
    })
  }

  async function createTickersAndAssets(dashboardRef: string) {
    return Promise.all([
      ...DEFAULT_TICKERS.map((ticker) => createRecord('tickers', dashboardRef, ticker)),
      ...DEFAULT_ASSETS.map((asset) => createRecord('assets', dashboardRef, asset)),
    ])
  }

  async function createDashboard(isFilled = false) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST'
      })
      const result = await response.json()

      const { dashboardId } = result.data

      if (isFilled) {
        const dashboardRef = getRecordId(result)

        await createTickersAndAssets(dashboardRef)
      }

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
                <button className="button" onClick={() => createDashboard(false)}>
                  Empty dashboard
                </button>
              </div>
              <div className="column">
                <button className="button is-primary" onClick={() => createDashboard(true)}>
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