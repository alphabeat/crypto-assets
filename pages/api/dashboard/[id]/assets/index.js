const { client, query } = require('../../../../../lib/faunadb')

async function getAssets(dashboardRef, res) {
  try {
    const assets = await client.query(
      query.Map(
        query.Paginate(
          query.Match(
            query.Index('all_dashboard_assets'),
            dashboardRef
          )
        ),
        (ref) => query.Get(ref)
      )
    )

    res.status(200).json(assets.data)
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

async function createAsset(data, res) {
  try {
    await client.query(
      query.Create(
        query.Collection('assets'),
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
  const { body, method, query } = req

  if ( method === 'POST' ) {
    return createAsset(body, res)
  }

  await getAssets(query.id, res)
}
