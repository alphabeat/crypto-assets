import { useCallback } from 'react'
import Error from 'next/error'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Ticker from '../../models/ticker'
import { useCurrency } from '../../context/currency'
import useFetchCoinPrice from '../../lib/hooks/useFetchCoinPrice'

import IconText from '../IconText/IconText'
import SpinnerFallback from '../SpinnerFallback/SpinnerFallback'

export type EmptyTickerBoxProps = {
  onAdd: () => void
}

const EmptyTickerBox: React.FC<EmptyTickerBoxProps> = ({ onAdd }) => (
  <div className="tile is-parent">
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
  </div>
)

export default EmptyTickerBox
