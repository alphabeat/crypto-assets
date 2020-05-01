import { useState } from 'react'
import fetch from 'node-fetch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import AssetCard from '../components/AssetCard'
import AssetForm from '../components/AssetForm'
import Layout from '../components/Layout'
import Ticker from '../components/Ticker'

import { fetchTickerPrice } from "../lib/tickers"

const KRAKEN_TICKERS = [{
  platform: 'kraken',
  coin: 'BTC',
  market: 'EUR',
}, {
  platform: 'kraken',
  coin: 'BTC',
  market: 'USD',
}, {
  platform: 'kraken',
  coin: 'ETH',
  market: 'EUR',
}, {
  platform: 'kraken',
  coin: 'ETH',
  market: 'USD',
}]

function Home(props) {
  const { assets, tickers } = props
  const [displayModal, toggleModal] = useState(false)

  const mappedTickers = tickers.map(ticker =>
    <Ticker key={`${ticker.coin}-${ticker.market}`} {...ticker} />
  )

  const mappedAssets = assets
    .sort((a, b) => a.coin.localeCompare(b.coin))
    .map(asset =>
      <div key={ asset.coin } className="column is-one-third">
        <AssetCard {...asset} />
      </div>
    )

  function renderNewAssetButton() {
    return (
      <button
        className="button is-fullwidth is-info is-outlined"
        onClick={() => toggleModal(true)}
      >
        <span className="icon is-small">
          <FontAwesomeIcon icon={ faPlus } />
        </span>
        <span>Add an asset</span>
      </button>
    )
  }

  return (
    <Layout>
      <div className="Home">
        <section className="hero is-link is-small has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Crypto Assets
              </h1>
              <h2 className="subtitle">
                Follow-up of your assets
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
              <div className="columns is-centered">
                <div className="column is-one-fifth">
                  { renderNewAssetButton() }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AssetForm
        show={ displayModal }
        handleClose={() => toggleModal(false)}
      />
    </Layout>
  )
}

export async function getServerSideProps() {
  const fetchAssetsResponse = await fetch('http://localhost:3000/api')
  const result = await fetchAssetsResponse.json()

  const assets = result.map(({ data }) => data)

  const tickers = await Promise.all(KRAKEN_TICKERS.map(async (ticker) => ({
    ...ticker,
    value: await fetchTickerPrice(ticker),
  })))

  const currentBTCPrice = tickers.find(({ coin, market }) => coin === 'BTC' && market === 'EUR')
  const assetsPromises = assets.map(async (asset) => {
    const { platform, coin, balance } = asset

    const currentPrice = coin !== 'BTC'
      ? await fetchTickerPrice({ platform, coin, market: 'BTC' })
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
