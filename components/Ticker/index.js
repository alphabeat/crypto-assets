function Ticker(props) {
  const { coin, market, value } = props

  return (
    <div className="tile is-parent">
      <article className="tile is-child box">
        <p className="title">
          { value.toFixed(2) }
        </p>
        <p className="subtitle">
          { coin } / { market }
        </p>
      </article>
    </div>
  )
}

export default Ticker
