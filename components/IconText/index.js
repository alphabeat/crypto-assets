import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function IconText(props) {
  const { icon, text } = props

  return (
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <span className="icon">
            <FontAwesomeIcon icon={ icon } />
          </span>
          <p>{ text }</p>
        </div>
      </div>
    </div>
  )
}

export default IconText