declare interface FaunaDBRecord<T> {
  ref: {
    '@ref': {
      id: string
    }
  }
  ts: number
  data: T
}
