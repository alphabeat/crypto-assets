import fetch from 'node-fetch'

const BITTREX_BASE_URL = 'https://api.bittrex.com/v3'
const KRAKEN_BASE_URL = 'https://api.kraken.com/0/public/Ticker'

async function getBittrexTicker({ coin, market }) {
  const pair = `${coin}-${market}`
  const url = `${BITTREX_BASE_URL}/markets/${pair}/ticker`

  const response = await fetch(url)
  const { lastTradeRate } = await response.json()
  
  if ( lastTradeRate ) {
    return lastTradeRate
  }

  return 0
}

async function getKrakenTicker({ coin, market }) {
  const parsedCoin = coin === 'BTC' ? 'XBT' : coin
  const pair = `${parsedCoin}${market}`
  const url = `${KRAKEN_BASE_URL}?pair=${pair}`

  const response = await fetch(url)
  const { result } = await response.json()

  const pairKey = `X${parsedCoin}Z${market}`

  if ( result && result[pairKey] ) {
    return parseFloat(result[pairKey].c[0]).toFixed(2)
  }

  return 0
}

export async function fetchTickerPrice({ platform, coin, market }) {
  if ( platform === 'kraken' ) {
    return getKrakenTicker({ coin, market })
  }

  return getBittrexTicker({ coin, market })
}
