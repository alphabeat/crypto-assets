import Error from 'next/error'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import SpinnerFallback from '../components/SpinnerFallback/SpinnerFallback'
import useFetchCoinPrice from '../lib/hooks/useFetchCoinPrice'

import Currency from '../models/currency'



type CurrencyContextType = {
  currency: Currency
  toggleCurrency: () => void
  currentBTCPrice: number
}

const CurrencyContext = React.createContext<CurrencyContextType>({} as CurrencyContextType)

const CurrencyProvider: React.FC = (props) => {
  const [currency, setCurrency] = useState<Currency>('EUR')

  const {
    price: currentBTCPrice,
    isLoading,
    hasError,
  } = useFetchCoinPrice(currency, 'BTC')

  const toggleCurrency = () => {
    setCurrency((currency) => currency === 'EUR' ? 'USD' : 'EUR')
  }

  if (isLoading) return <SpinnerFallback />

  if (hasError) return <Error statusCode={ 500 } />

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, currentBTCPrice }} {...props} />
  )
}

const useCurrency = () => useContext(CurrencyContext)

export { CurrencyProvider, useCurrency }
