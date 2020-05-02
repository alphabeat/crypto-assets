const faunadb = require('faunadb')

const secret = process.env.FAUNA_SECRET_KEY
const { query } = faunadb
const client = new faunadb.Client({ secret })

module.exports = {
  client,
  query,
};
