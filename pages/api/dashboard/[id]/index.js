const { client, query } = require('../../../../lib/db/faunadb')

async function getDashboard(id, res) {
  try {
    const dashboard = await client.query(
      query.Get(
        query.Match(
          query.Index('dashboards_search_by_id'),
          id
        )
      )
    )

    res.status(200).json(dashboard)
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

module.exports = async (req, res) => {
  const { id } = req.query

  await getDashboard(id, res)
}