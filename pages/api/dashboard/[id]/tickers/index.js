const { client, query } = require('../../../../../lib/db/faunadb')

async function getTickers(dashboardRef, res) {
  try {
    const tickers = await client.query(
      query.Map(
        query.Paginate(
          query.Match(
            query.Index('all_dashboard_tickers'),
            dashboardRef
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
    const ticker = await client.query(
      query.Create(
        query.Collection('tickers'),
        { data: JSON.parse(data) }
      )
    )

    res.status(200).json({ data: ticker, success: true })
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

module.exports = async (req, res) => {
  const { body, method, query } = req

  if (method === 'POST') {
    return createTicker(body, res)
  }

  await getTickers(query.id, res)
}
