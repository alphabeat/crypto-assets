const { client, query } = require('../../../lib/faunadb')
const generateId = require('../../../utils/generateId')

async function createDashboard(dashboardId, res) {
  try {
    const data = {
      dashboardId,
      isPasswordProtected: false,
    }

    const dashboard = await client.query(
      query.Create(
        query.Collection('dashboards'),
        { data }
      )
    )

    res.status(200).json(dashboard)
  }
  catch (e) {
    res.status(500).json({ error: e.message })
  }
}

module.exports = async (req, res) => {
  const { method } = req

  if ( method === 'POST' ) {
    const id = generateId()

    return createDashboard(id, res)
  }
}