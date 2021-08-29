const { client, query } = require('../../../../../lib/db/faunadb')

async function deleteTicker(id, res) {
  try {
    await client.query(
      query.Delete(
        query.Ref(query.Collection('tickers'), id),
      )
    )

    res.status(200).json({ success: true })
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

module.exports = async (req, res) => {
  const { method, query } = req

  if (method === 'DELETE') {
    return deleteTicker(query.tickerId, res)
  }

  res.status(400).json({ error: `Unhandled method ${method}` })
}