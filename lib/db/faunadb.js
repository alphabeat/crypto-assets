const faunadb = require('faunadb')

const { FAUNA_SECRET_KEY: secret } = process.env
const { query } = faunadb
const client = new faunadb.Client({ secret })

module.exports = {
  client,
  query,
};
