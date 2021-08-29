import Currency from "../../models/currency"

export type PriceTickerApiResponse = {
  cap: number
  rate: number
  volume: number
}

const priceFetcher = (url: string, currency: Currency, code: string): Promise<PriceTickerApiResponse> => fetch(new Request(url), {
  method: 'POST',
  headers: new Headers({
    'content-type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_PRICE_TICKER_API_KEY,
  }),
  body: JSON.stringify({
    currency,
    code,
    meta: false,
  })
}).then(res => res.json())

export default priceFetcher