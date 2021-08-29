import { useSWRConfig } from 'swr'
import React from 'react'

import { useCurrency } from '../../context/currency';
import { useDashboard } from '../../context/dashboard';
import { getRecordId } from '../../lib/db/faunadb.utils';
import { getAssetsKey } from '../../lib/hooks/useFetchAssets';
import { getCoinTickerKey } from '../../lib/hooks/useFetchCoinPrice';

import AssetsPieChart from '../AssetsPieChart/AssetsPieChart';
import { AssetWithPrices, DbAsset } from '../../models/asset';

const AssetsOverview: React.VFC = () => {
  const { cache } = useSWRConfig()
  const { currency, currentBTCPrice } = useCurrency()
  const { dashboard } = useDashboard()
  const dashboardRef = getRecordId(dashboard)

  const assets: DbAsset[] = cache.get(getAssetsKey(dashboardRef))

  const assetsWithPrices: AssetWithPrices[] = assets.map((dbAsset) => {
    const asset = dbAsset.data
    const unitFiatPrice = cache.get(getCoinTickerKey(currency, asset.coin))
    const unitBtcPrice = asset.coin === 'BTC'
      ? 1
      : unitFiatPrice / currentBTCPrice

    return {
    ...asset,
    unitFiatPrice,
    unitBtcPrice,
  }
})

  const pieChartData = assetsWithPrices.reduce((acc, asset) => {
    const { balance, coin, unitBtcPrice } = asset

    const newBTCValue = balance * unitBtcPrice
    const newCoinValue = acc[coin]
    ? {
      ...acc[coin],
      balance: Number(acc[coin].balance) + Number(balance),
      currentBTCValue: acc[coin].currentBTCValue + newBTCValue
    }
    : { ...asset, currentBTCValue: newBTCValue };

    return {
      ...acc,
      [asset.coin]: newCoinValue,
    };
  }, {})

  const totalAssetsFiatValue = assetsWithPrices
    .reduce((sum, asset) => sum + asset.balance * asset.unitFiatPrice, 0)
    .toFixed(2)

  const totalAssetsBtcValue = assetsWithPrices
    .reduce((sum, asset) => sum + asset.balance * asset.unitBtcPrice, 0)
    .toFixed(8)

  return (
    <div className="charts-container columns">
      <div className="column is-half is-hidden-mobile">
        <AssetsPieChart data={ Object.values(pieChartData) } />
      </div>
      <div className="column is-one-quarter">
        <article className="box has-text-centered has-background-light">
          <p className="title has-text-grey">
            {totalAssetsFiatValue}
          </p>
          <p className="subtitle has-text-grey">
            Total ({currency})
          </p>
        </article>
      </div>
      <div className="column is-one-quarter">
        <article className="box has-text-centered has-background-light">
          <p className="title has-text-grey">
            {totalAssetsBtcValue}
          </p>
          <p className="subtitle has-text-grey">
            Total (BTC)
          </p>
        </article>
      </div>
    </div>
  )
}

export default AssetsOverview;
