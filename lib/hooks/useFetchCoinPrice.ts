import useSWR, { useSWRConfig } from 'swr'

import Currency from '../../models/currency';
import priceFetcher from '../api/priceFetcher';

const TICKER_URL = `${process.env.NEXT_PUBLIC_PRICE_TICKER_BASE_URL}/coins/single`

export const getCoinTickerKey = (currency: Currency, coin: string) =>
  `${TICKER_URL}/${currency}/${coin}`

const useFetchCoinPrice = (currency: Currency, coin: string) => {
  const { cache } = useSWRConfig()
  const { data, error: hasError } = useSWR(
    () => coin ? [TICKER_URL, currency, coin] : null,
    priceFetcher,
    { revalidateOnFocus: false }
  )

  if (data) {
    cache.set(getCoinTickerKey(currency, coin), data.rate)
  }

  return {
    price: data?.rate || 0,
    isLoading: !data && !hasError,
    hasError,
  }
}

export default useFetchCoinPrice
