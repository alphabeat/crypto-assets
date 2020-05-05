import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import IconText from '../IconText'

function Ticker(props) {
  const { coin, market, onDelete, value } = props

  const isEmpty = !Boolean(value)

  const handleDelete = () => {
    const message = `
      Are you sure ? This action is irreversible.
    `

    if ( confirm(message) ) {
      onDelete()
    }
  }

  const renderPlaceholder = () => {
    return (
      <article className="tile is-child box empty-box has-background-white-bis has-text-info">
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
  }

  const renderBoxContent = () => {
    return (
      <article className="tile is-child box has-background-light">
        <div className="box-content">
          <div className="ticker-price">
            <p className="title has-text-grey">
              { value.toFixed(2) }
            </p>
            <p className="subtitle has-text-grey">
              { coin } / { market }
            </p>
          </div>
          <div className="delete-icon has-text-danger" onClick={ handleDelete }>
            <FontAwesomeIcon icon={ faTrashAlt } />
          </div>
        </div>
        <style jsx>{`
          .box {
            cursor: pointer;
          }

          .box-content {
            position: relative;
          }

          .box-content:hover .delete-icon {
            opacity: 1;
          }

          .ticker-price {
            position: relative;
          }

          .delete-icon {
            position: absolute;
            right: 0;
            top: 1.5rem;
            opacity: 0;
          }
        `}</style>
      </article>
    )
  }

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

export default Ticker
