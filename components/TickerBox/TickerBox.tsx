import { useCallback } from 'react'
import Error from 'next/error'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import Ticker from '../../models/ticker'
import { useCurrency } from '../../context/currency'
import useFetchCoinPrice from '../../lib/hooks/useFetchCoinPrice'

import SpinnerFallback from '../SpinnerFallback/SpinnerFallback'

export type TickerBoxProps = {
  ticker: Ticker
  onDelete: () => void
}

const TickerBox: React.FC<TickerBoxProps> = ({
  ticker,
  onDelete,
}) => {
  const { coin } = ticker
  const { currency } = useCurrency()
  const { price: tickerPrice, isLoading, hasError } = useFetchCoinPrice(currency, coin)

  const handleDelete = useCallback(() => {
    const message = 'Are you sure ? This action is irreversible.'

    if ( confirm(message) ) {
      onDelete()
    }
  }, [])

  const valueColor = tickerPrice === 0 ? 'has-text-danger' : 'has-text-grey'

  if (hasError) return <Error statusCode={ 500 } />

  return (
    <div className="tile is-parent">
      <article className="tile is-child box has-background-light">
        {isLoading ? (
          <SpinnerFallback size='sm' />
        ) : (
          <>
          <div className="box-content">
            <div className="ticker-price">
              <p className={`title ${valueColor}`}>
                { tickerPrice.toFixed(2) }
              </p>
              <p className="subtitle has-text-grey">
                { coin } / { currency }
              </p>
            </div>
            <div className="box-overlay">
              <span className="icon has-text-danger"  onClick={ handleDelete }>
                <FontAwesomeIcon icon={ faTrashAlt } />
              </span>
            </div>
          </div>
          <style jsx>{`
            .box {
              padding: 0;
            }

            .box-content {
              position: relative;
              padding: 1.25rem;
            }

            .box-content:hover .box-overlay .icon {
              opacity: 1;
            }

            .ticker-price {
              position: relative;
            }

            .box-overlay {
              height: 100%;
              position: absolute;
              top: 0;
              right: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .box-overlay .icon {
              cursor: pointer;
              opacity: 0;
              flex-grow: 1;
            }
          `}</style>
          </>
        )}
      </article>
    </div>
  )
}

export default TickerBox
