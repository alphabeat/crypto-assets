const { client, query } = require('../../../lib/faunadb')

async function getAllTickers(res) {
  try {
    const tickers = await client.query(
      query.Map(
        query.Paginate(
          query.Match(
            query.Index('allTickers')
          )
        ),
        (ref) => query.Get(ref)
      )
    )

    res.status(200).json(tickers.data)
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

async function createTicker(data, res) {
  try {
    await client.query(
      query.Create(
        query.Collection('tickers'),
        { data: JSON.parse(data) }
      )
    )

    res.status(200).json({ success: true })
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

module.exports = async (req, res) => {
  if ( req.method === 'POST' ) {
    return createTicker(req.body, res)
  }

  await getAllTickers(res)
}
