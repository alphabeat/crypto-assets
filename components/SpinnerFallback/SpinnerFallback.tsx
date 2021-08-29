import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type SpinnerFallbackProps = {
  size?: 'sm' | 'lg'
}

const SpinnerFallback: React.VFC<SpinnerFallbackProps> = ({ size = 'lg' }) => (
  <div className="spinner">
    <FontAwesomeIcon icon={ faSpinner } size={ size === 'sm' ? '2x' : '4x'} spin />
  </div>
)

export default SpinnerFallback
