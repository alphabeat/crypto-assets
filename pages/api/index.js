const faunadb = require('faunadb')

const secret = process.env.FAUNA_SECRET_KEY
const { query } = faunadb
const client = new faunadb.Client({ secret })

module.exports = async (req, res) => {
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
