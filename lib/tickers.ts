import fetch from 'node-fetch'

export async function fetchTickerPrice(coin: string, currency: string) {
  const url = `${process.env.PRICE_TICKER_BASE_URL}/coins/single`

  const response = await fetch(new Request(url), {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json',
      'x-api-key': process.env.PRICE_TICKER_API_KEY,
    }),
    body: JSON.stringify({
      currency,
      coin,
      meta: false,
    })
  })

  const { rate } = await response.json()

  return rate
}
