type Ticker = {
  coin: string
  market: string
  platform: 'Kraken' | 'Bittrex' | 'Binance'
  value?: number
}

export type DbTicker = FaunaDBRecord<Ticker>

export default Ticker
