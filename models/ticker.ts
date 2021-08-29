type Ticker = {
  coin: string
}

export type DbTicker = FaunaDBRecord<Ticker>

export default Ticker
