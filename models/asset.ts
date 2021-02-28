type Asset = {
  coin: string
  dashboard: string
  balance: number
  initialValue: number
  platform: string
  currentBTCValue?: number,
  currentEURValue?: number,
}

export type DbAsset = FaunaDBRecord<Asset>

export default Asset
