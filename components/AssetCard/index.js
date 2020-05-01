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
    coin,
    currentBTCValue,
    currentEURValue,
  } = props

  const isCurrentValueUp = currentBTCValue >= initialValue
  const platformColor = PLATFORM_COLOR[platform.toLowerCase()]
  const currentValueBackground = isCurrentValueUp ? '#effaf3' : '#fffbeb'
  const currentValueTextColor = isCurrentValueUp ? '#257942' : '#947600'

  function renderCardContent() {
    return (
      <div>
        <header className="card-header has-background-light">
          <p className="card-header-title">
            { coin }
          </p>
          <p className="card-header-icon">
            <span className={`tag is-${platformColor} is-capitalized`}>{ platform }</span>
          </p>
        </header>
        <div className="card-content has-text-centered">
          <p className="title is-5">
            { balance }
          </p>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <div className="content has-text-grey has-text-centered">
              <span>Initial value:</span>
              <br />
              <IconText icon={ faBtc } text={ initialValue.toFixed(8) } />
            </div>
          </div>
          <div className="card-footer-item" style={{ backgroundColor: currentValueBackground }}>
            <div className="content has-text-centered" style={{ color: currentValueTextColor }}>
              <span>Current value:</span>
              <br />
              <IconText icon={ faBtc } text={ currentBTCValue.toFixed(8) } />
            </div>
          </div>
        </footer>
        <footer className="card-footer">
          <div className="card-footer-item">
            <div className="title is-6 has-text-info">
              <IconText icon={ faEuroSign } text={ currentEURValue.toFixed(2) } />
            </div>
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
