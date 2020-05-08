import { faEuroSign } from '@fortawesome/free-solid-svg-icons'
import { faBtc } from '@fortawesome/free-brands-svg-icons'

import IconText from '../IconText'

function AssetCard(props) {
  const {
    balance,
    coin,
    currentBTCValue,
    currentEURValue,
    initialValue,
    onClick,
    platform,
  } = props

  const isCurrentValueUp = currentBTCValue >= initialValue
  const currentValueBackground = isCurrentValueUp ? '#effaf3' : '#fffbeb'
  const currentValueTextColor = isCurrentValueUp ? '#257942' : '#947600'

  function renderCardContent() {
    return (
      <div className="card">
        <header className="card-header has-background-light">
          <p className="card-header-title">
            { coin }
          </p>
          <p className="card-header-icon">
            <span className={`tag is-link is-light is-capitalized`}>
              { platform }
            </span>
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
    <div className="AssetCard" onClick={() => onClick()} style={{ cursor: 'pointer' }}>
      { renderCardContent() }
    </div>
  )
}

export default AssetCard
