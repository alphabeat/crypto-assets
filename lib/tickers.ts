import fetch from 'node-fetch'

import Ticker from '../models/ticker'

const BITTREX_BASE_URL = 'https://api.bittrex.com/v3'
const KRAKEN_BASE_URL = 'https://api.kraken.com/0/public/Ticker'
const BINANCE_BASE_URL = 'https://api.binance.com/api/v3/ticker/price'

async function getBittrexTicker(ticker: Ticker) {
  const { coin, market } = ticker
  const pair = `${coin}-${market}`
  const url = `${BITTREX_BASE_URL}/markets/${pair}/ticker`

  const response = await fetch(url)
  const { lastTradeRate } = await response.json()
  
  if ( lastTradeRate ) {
    return parseFloat(lastTradeRate)
  }

  return 0
}

async function getKrakenTicker(ticker: Ticker) {
  const { coin, market } = ticker
  const parsedCoin = coin.replace(/^BTC$/, 'XBT')
  const parsedMarket = market.replace(/^BTC$/, 'XBT')

  const pair = `${parsedCoin}${parsedMarket}`
  const url = `${KRAKEN_BASE_URL}?pair=${pair}`

  const response = await fetch(url)
  const { result } = await response.json()

  if ( result ) {
    const pairKey = Object.keys(result)[0]

    return parseFloat(result[pairKey].c[0])
  }

  return 0
}

async function getBinanceTicker(ticker: Ticker) {
  const { coin, market } = ticker
  const parsedMarket = market.replace(/^USD$/, 'USDC')

  const pair = `${coin}${parsedMarket}`
  const url = `${BINANCE_BASE_URL}?symbol=${pair}`

  const response = await fetch(url)
  const { price } = await response.json()

  if ( price ) {
    return parseFloat(price)
  }

  return 0
}

export async function fetchTickerPrice(ticker: Ticker) {
  const { platform } = ticker

  switch (platform.toLowerCase()) {
    case 'kraken':
      return getKrakenTicker(ticker)
    case 'binance':
      return getBinanceTicker(ticker)
    case 'bittrex':
      return getBittrexTicker(ticker)
  }
}
