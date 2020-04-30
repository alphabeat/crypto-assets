function Ticker(props) {
  const { coin, market, value } = props

  return (
    <div className="tile is-parent">
      <article className="tile is-child box is-info">
        <p className="title">
          { value }
        </p>
        <p className="subtitle">
          { coin } / { market }
        </p>
      </article>
    </div>
  )
}

export default Ticker
