import { useState } from 'react'
import fetch from 'node-fetch'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import AssetCard from '../components/AssetCard'
import AssetForm from '../components/AssetForm'
import Layout from '../components/Layout'
import Ticker from '../components/Ticker'
import TickerForm from '../components/TickerForm'

import { fetchTickerPrice } from "../lib/tickers"

const getEmptyTicker = (index) => ({
  ref: {
    '@ref': {
      id: `empty-slot-${index}`,
    },
  },
})

const getRecordId = (record) => record.ref['@ref'].id

function Home(props) {
  const { assets, tickers } = props
  const initialUserTickers = [
    ...tickers,
    tickers.length < 4 && getEmptyTicker(tickers.length),
  ].filter(Boolean)

  const [displayAssetModal, toggleAssetModal] = useState(false)
  const [displayTickerModal, toggleTickerModal] = useState(false)
  const [selectedAsset, setSelected] = useState(null)
  const [userTickers, setUserTickers] = useState(initialUserTickers)

  const handleAssetModalClose = () => {
    setSelected(null)
    toggleAssetModal(false)
  }

  const handleAssetClick = (asset) => {
    setSelected(asset)
    toggleAssetModal(true)
  }

  const handleTickerDelete = async (tickerId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tickers/${tickerId}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if ( result.success ) {
        Router.reload()
      }
    }
    catch (e) {
      console.error(e.message)
    }
  }

  const mappedTickers = userTickers.map(ticker => {
    const id = getRecordId(ticker)

    return (
      <Ticker
        key={ id }
        onDelete={() => handleTickerDelete(id)}
        onAdd={() => toggleTickerModal(true)}
        { ...ticker.data }
      />
    )
  })

  const mappedAssets = assets
    .sort((a, b) => a.data.coin.localeCompare(b.data.coin))
    .map(asset =>
      <div key={ getRecordId(asset) } className="column is-one-third">
        <AssetCard
          onClick={() => handleAssetClick(asset)}
          { ...asset.data }
        />
      </div>
    )

  const renderNewAssetButton = () => {
    return (
      <button
        className="button is-fullwidth is-info is-outlined"
        onClick={() => toggleAssetModal(true)}
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
      <TickerForm
        show={ displayTickerModal }
        handleClose={() => toggleTickerModal(false)}
      />
      <AssetForm
        show={ displayAssetModal }
        handleClose={ handleAssetModalClose }
        asset={ selectedAsset }
      />
    </Layout>
  )
}

export async function getServerSideProps() {
  const [fetchTickersResponse, fetchAssetsResponse] = await Promise.all([
    fetch('http://localhost:3000/api/tickers'),
    fetch('http://localhost:3000/api/assets'),
  ])

  const [tickers, assets] = await Promise.all([
    fetchTickersResponse.json(),
    fetchAssetsResponse.json(),
  ])

  const tickersWithPrices = await Promise.all(
    tickers.map(async (ticker) => ({
      ...ticker,
      data: {
        ...ticker.data,
        value: await fetchTickerPrice(ticker.data),
      },
    }))
  )

  let currentBTCPrice = tickersWithPrices.find(ticker => {
    const { coin, market } = ticker.data

    return coin === 'BTC' && market === 'EUR'
  })

  if ( !currentBTCPrice ) {
    const currentBTCEURPrice = await fetchTickerPrice({ platform: 'bittrex', coin: 'BTC', market: 'EUR' })

    currentBTCPrice = { data: { value: currentBTCEURPrice } }
  }

  const assetsPromises = assets.map(async (asset) => {
    const { platform, coin, balance } = asset.data

    const currentPrice = coin !== 'BTC'
      ? await fetchTickerPrice({ platform, coin, market: 'BTC' })
      : 1

    const currentBTCValue = balance * currentPrice 

    return {
      ...asset,
      data: {
        ...asset.data,
        currentBTCValue,
        currentEURValue: currentBTCValue * currentBTCPrice.data.value,
      }
    }
  })

  const assetsWithPrices = await Promise.all(assetsPromises)

  return {
    props: {
      tickers: tickersWithPrices,
      assets: assetsWithPrices,
    },
  }
}

export default Home
