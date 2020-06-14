import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type IconTextProps = {
  icon: IconProp
  text: string
}

function IconText(props: IconTextProps) {
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