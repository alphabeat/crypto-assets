import { faEuroSign } from '@fortawesome/free-solid-svg-icons'
import { faBtc } from '@fortawesome/free-brands-svg-icons'

import IconText from '../IconText'

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
        <div className="card-content has-text-centered">
          <p className="title is-6">
            { balance }
          </p>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <p className="content has-text-grey has-text-centered">
              Initial value:
              <br />
              <IconText icon={ faBtc } text={ initialValue.toFixed(8) } />
            </p>
          </div>
          <div className="card-footer-item">
            <p className="content has-text-grey has-text-centered">
              Current value:
              <br />
              <IconText icon={ faBtc } text={ currentBTCValue.toFixed(8) } />
            </p>
          </div>
        </footer>
        <footer className="card-footer">
          <div className="card-footer-item">
            <p className="title is-6 has-text-success">
              <IconText icon={ faEuroSign } text={ currentEURValue.toFixed(2) } />
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
