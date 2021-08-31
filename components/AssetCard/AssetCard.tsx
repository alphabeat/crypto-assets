import React from 'react'
import { faDollarSign, faEuroSign } from '@fortawesome/free-solid-svg-icons'
import { faBtc } from '@fortawesome/free-brands-svg-icons'

import Asset from '../../models/asset'
import { useCurrency } from '../../context/currency'
import useFetchCoinPrice from '../../lib/hooks/useFetchCoinPrice'

import IconText from '../IconText/IconText'

type AssetCardProps = {
  asset: Asset
  onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onClick,
}) => {
  const {
    balance,
    coin,
    initialValue,
  } = asset
  const { currency, currentBTCPrice } = useCurrency()
  const { price: currentAssetPrice } = useFetchCoinPrice(currency, coin)

  const currentAssetValue = balance * currentAssetPrice
  const currentBTCValue = coin === 'BTC'
    ? balance
    : balance * (currentAssetPrice / currentBTCPrice)

  const isCurrentValueUp = currentBTCValue >= initialValue
  const currentValueBackground = isCurrentValueUp ? '#effaf3' : '#fffbeb'
  const currentValueTextColor = isCurrentValueUp ? '#257942' : '#947600'
  const currencyIcon = currency === 'EUR' ? faEuroSign : faDollarSign

  return (
    <div className="AssetCard" onClick={() => onClick()} style={{ cursor: 'pointer' }}>
      <div className="card">
        <header className="card-header has-background-light">
          <p className="card-header-title">
            { coin }
            <p className="is-size-7 has-text-weight-normal has-text-grey">
              {`1 ${coin} = ${currentAssetPrice.toFixed(2)} ${currency}`}
            </p>
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
              <IconText icon={ currencyIcon } text={ currentAssetValue.toFixed(2) } />
            </div>
          </div>
        </footer>
      </div>
      <style>{`
        .card-header-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </div>
  )
}

export default AssetCard
