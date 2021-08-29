import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type IconTextProps = {
  icon: IconProp
  text: string
}

const IconText: React.VFC<IconTextProps> = ({ icon, text }) => (
  <span className="icon-text">
    <span className="icon">
      <FontAwesomeIcon icon={ icon } />
    </span>
    <span>{ text }</span>
  </span>
)

export default IconText