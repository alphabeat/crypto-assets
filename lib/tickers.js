import fetch from 'node-fetch'

const BITTREX_BASE_URL = 'https://api.bittrex.com/v3'
const KRAKEN_BASE_URL = 'https://api.kraken.com/0/public/Ticker'

async function getBittrexTicker({ token, market }) {
  const pair = `${token}-${market}`
  const url = `${BITTREX_BASE_URL}/markets/${pair}/ticker`

  const response = await fetch(url)
  const { lastTradeRate } = await response.json()
  
  if ( lastTradeRate ) {
    return lastTradeRate
  }

  return 0
}

async function getKrakenTicker({ token, market }) {
  const parsedToken = token === 'BTC' ? 'XBT' : token
  const pair = `${parsedToken}${market}`
  const url = `${KRAKEN_BASE_URL}?pair=${pair}`

  const response = await fetch(url)
  const { result } = await response.json()

  const pairKey = `X${parsedToken}Z${market}`

  if ( result && result[pairKey] ) {
    const parsedResult = parseFloat(result[pairKey].c[0]).toFixed(2)
    
    return parsedResult
  }

  return 0
}

export async function fetchTickerPrice({ platform, token, market }) {
  if ( platform === 'kraken' ) {
    return getKrakenTicker({ token, market })
  }

  return getBittrexTicker({ token, market })
}
