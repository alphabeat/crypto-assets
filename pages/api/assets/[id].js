const { client, query } = require('../../../lib/faunadb')

async function updateAsset(id, asset, res) {
  try {
    await client.query(
      query.Update(
        query.Ref(query.Collection('assets'), id),
        { data: asset.data }
      )
    )

    res.status(200).json({ success: true })
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

async function deleteAsset(id, res) {
  try {
    await client.query(
      query.Delete(
        query.Ref(query.Collection('assets'), id),
      )
    )

    res.status(200).json({ success: true })
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

module.exports = async (req, res) => {
  const { body, method, query } = req

  if ( method === 'PUT' ) {
    return updateAsset(query.id, JSON.parse(body), res)
  }
  else if ( method === 'DELETE' ) {
    return deleteAsset(query.id, res)
  }

  res.status(400).json({ error: `Unhandled method ${method}` })
}