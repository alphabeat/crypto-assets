import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEuroSign } from '@fortawesome/free-solid-svg-icons'
import { faBtc } from '@fortawesome/free-brands-svg-icons'

const PLATFORM_COLOR = {
  bittrex: 'primary',
  kraken: 'success',
  waves: 'warning',
  chronomint: 'danger',
}

function AssetCard(props) {
  const {
    balance,
    initialValue,
    platform,
    token,
    currentBTCValue,
    currentEURValue,
  } = props

  const platformColor = PLATFORM_COLOR[platform.toLowerCase()]

  function renderCardContent() {
    return (
      <div>
        <header className="card-header">
          <p className="card-header-title">
            { token }
          </p>
          <p className="card-header-icon">
            <span className={`tag is-${platformColor}`}>{ platform }</span>
          </p>
        </header>
        <div className="card-content">
          <p className="title is-6">
            { balance }
          </p>
          <p className="content has-text-grey">
              <span className="icon">
                <FontAwesomeIcon icon={ faBtc } />
              </span>
              { currentBTCValue.toFixed(8) }
            </p>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <p className="title is-6 has-text-success">
              { currentEURValue.toFixed(2) }
              <span className="icon">
                <FontAwesomeIcon icon={ faEuroSign } />
              </span>
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="Asset card">
      { renderCardContent() }
    </div>
  )
}

export default AssetCard
