import React, { useContext, useState } from 'react'

type Currency = 'EUR' | 'USD'

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = React.createContext<CurrencyContextType>({} as CurrencyContextType)

const CurrencyProvider: React.FC = (props) => {
  const [currency, setCurrency] = useState<Currency>('EUR')

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }} {...props} />
  )
}

const useCurrency = () => useContext(CurrencyContext)

export { CurrencyProvider, useCurrency }
