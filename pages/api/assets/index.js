const { client, query } = require('../../../lib/faunadb')

async function getAllAssets(res) {
  try {
    const assets = await client.query(
      query.Map(
        query.Paginate(
          query.Match(
            query.Index('allAssets')
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
  if ( req.method === 'POST' ) {
    return createAsset(req.body, res)
  }

  await getAllAssets(res)
}
