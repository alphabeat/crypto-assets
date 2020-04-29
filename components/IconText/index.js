import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../../styles/IconText.module.sass'

function IconText(props) {
  const { icon, text } = props

  return (
    <div className="IconText">
      <span className="icon">
        <FontAwesomeIcon icon={ icon } />
      </span>
      { text }
    </div>
  )
}

export default IconText