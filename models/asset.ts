type Asset = {
  coin: string
  dashboard: string
  balance: number
  initialValue: number
}

export type DbAsset = FaunaDBRecord<Asset>

export type AssetWithPrices = Asset & {
  unitFiatPrice: number
  unitBtcPrice: number
}

export default Asset
