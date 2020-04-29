import AssetCard from '../components/AssetCard'
import Layout from '../components/Layout'
import Ticker from '../components/Ticker'
import assetsData from '../data/assets.json'

import { fetchTickerPrice } from "../lib/tickers"

const KRAKEN_TICKERS = [{
  platform: 'kraken',
  token: 'BTC',
  market: 'EUR',
}, {
  platform: 'kraken',
  token: 'BTC',
  market: 'USD',
}, {
  platform: 'kraken',
  token: 'ETH',
  market: 'EUR',
}, {
  platform: 'kraken',
  token: 'ETH',
  market: 'USD',
}]

function Home(props) {
  const { assets, tickers } = props

  const mappedTickers = tickers.map(ticker =>
    <Ticker key={`${ticker.token}-${ticker.market}`} {...ticker} />
  )

  const mappedAssets = assets
    .sort((a, b) => a.token.localeCompare(b.token))
    .map(asset =>
      <div key={ asset.token } className="column is-one-third">
        <AssetCard {...asset} />
      </div>
    )

  return (
    <Layout>
      <div className="Home">
        <section className="hero is-success is-small has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Crypto Assets
              </h1>
              <h2 className="subtitle">
                Welcome to your assets page!
              </h2>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-10">
              <section className="info-tiles">
                <div className="tile is-ancestor has-text-centered">
                  { mappedTickers }
                </div>
              </section>
              <div className="assets-container columns is-multiline">
                { mappedAssets }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const { assets } = assetsData;

  const tickers = await Promise.all(KRAKEN_TICKERS.map(async (ticker) => ({
    ...ticker,
    value: await fetchTickerPrice(ticker),
  })))

  const currentBTCPrice = tickers.find(({ token, market }) => token === 'BTC' && market === 'EUR')
  const assetsPromises = assets.map(async (asset) => {
    const { platform, token, market = 'BTC', balance } = asset

    const currentPrice = token !== 'BTC'
      ? await fetchTickerPrice({ platform, token, market })
      : 1

    const currentBTCValue = balance * currentPrice 

    return {
      ...asset,
      currentBTCValue,
      currentEURValue: currentBTCValue * currentBTCPrice.value,
    }
  })

  const assetsWithPrices = await Promise.all(assetsPromises);

  return {
    props: {
      tickers,
      assets: assetsWithPrices,
    },
  }
}

export default Home
