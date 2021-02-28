import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import IconText from '../IconText'
import Ticker from '../../models/ticker'

export type TickerBoxProps = {
  onAdd: () => void
  onDelete: () => void
  ticker: Ticker
}

const TickerBox: React.FC<TickerBoxProps> = ({
  onAdd,
  onDelete,
  ticker,
}) => {
  const { coin, market, platform, value } = ticker
  const isEmpty = value == null

  const handleDelete = useCallback(() => {
    const message = `
      Are you sure ? This action is irreversible.
    `

    if ( confirm(message) ) {
      onDelete()
    }
  }, [])

  const renderPlaceholder = useCallback(() => {
    return (
      <article
        className="tile is-child box empty-box has-background-white-bis has-text-info"
        onClick={() => onAdd()}
      >
        <IconText icon={ faPlus } text="Add ticker" />
        <style>{`
          .empty-box {
            cursor: pointer;
            border: 1px dashed hsl(0, 0%, 86%);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-box .level {
            margin: 0;
          }
        `}</style>
      </article>
    )
  }, [])

  const renderBoxContent = useCallback(() => {
    const valueColor = `has-text-${value === 0 ? 'danger' : 'grey'}`

    return (
      <article className="tile is-child box has-background-light">
        <div className="box-content">
          <div className="ticker-price">
            <p className={`title ${valueColor}`}>
              { value.toFixed(2) }
            </p>
            <p className="subtitle has-text-grey">
              { coin } / { market }
            </p>
          </div>
          <div className="box-overlay">
            <div className={`tag is-link is-light is-capitalized`}>
              { platform }
            </div>
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
      </article>
    )
  }, [])

  return (
    <div className="tile is-parent">
      {
        isEmpty
        ? renderPlaceholder()
        : renderBoxContent()
      }
    </div>
  )
}

export default TickerBox
