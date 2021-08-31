import { faPlus } from '@fortawesome/free-solid-svg-icons'

import IconText from '../IconText/IconText'

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
