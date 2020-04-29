function Ticker(props) {
  const { token, market, value } = props

  return (
    <div className="tile is-parent">
      <article className="tile is-child box is-info">
        <p className="title">
          { value }
        </p>
        <p className="subtitle">
          { token } / { market }
        </p>
      </article>
    </div>
  )
}

export default Ticker
