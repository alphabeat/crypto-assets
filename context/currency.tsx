import Error from 'next/error'
import React, { useContext, useEffect, useState } from 'react'
import SpinnerFallback from '../components/SpinnerFallback/SpinnerFallback'
import useFetchCoinPrice from '../lib/hooks/useFetchCoinPrice'

import Currency from '../models/currency'



type CurrencyContextType = {
  currency: Currency
  currentBTCPrice: number
}

const CurrencyContext = React.createContext<CurrencyContextType>({} as CurrencyContextType)

type CurrencyProviderProps = {
  currency: Currency
}

const CurrencyProvider: React.FC<CurrencyProviderProps> = (props) => {
  const { currency } = props;
  const {
    price: currentBTCPrice,
    isLoading,
    hasError,
  } = useFetchCoinPrice(currency, 'BTC')

  if (isLoading) return <SpinnerFallback />

  if (hasError) return <Error statusCode={ 500 } />

  return (
    <CurrencyContext.Provider value={{ currency, currentBTCPrice }} {...props} />
  )
}

const useCurrency = () => useContext(CurrencyContext)

export { CurrencyProvider, useCurrency }
