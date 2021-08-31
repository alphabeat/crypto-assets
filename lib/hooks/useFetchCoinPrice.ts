import useSWR, { useSWRConfig } from 'swr'

import Currency from '../../models/currency';
import priceFetcher from '../api/priceFetcher';
import { isStableCoin } from '../utils';

const TICKER_URL = `${process.env.NEXT_PUBLIC_PRICE_TICKER_BASE_URL}/coins/single`

export const getCoinTickerKey = (currency: Currency, coin: string) =>
  `${TICKER_URL}/${currency}/${coin}`

const useFetchCoinPrice = (currency: Currency, coin: string) => {
  const { cache } = useSWRConfig()

  const isStableUsd = isStableCoin(coin) && currency === 'USD'

  const { data, error: hasError } = useSWR(
    () => (coin && !isStableUsd) ? [TICKER_URL, currency, coin] : null,
    priceFetcher,
    { revalidateOnFocus: false }
  )

  if (data) {
    cache.set(getCoinTickerKey(currency, coin), data.rate)
  } else if (isStableUsd) {
    cache.set(getCoinTickerKey(currency, coin), 1)
  }

  return {
    price: data?.rate || (isStableUsd ? 1 : 0),
    isLoading: !data && !isStableUsd && !hasError,
    hasError,
  }
}

export default useFetchCoinPrice
