import { useState } from 'react'
import fetch from 'node-fetch'
import Error from 'next/error'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faGripHorizontal, faChartPie } from '@fortawesome/free-solid-svg-icons'

import AssetCard from '../../components/AssetCard'
import AssetForm from '../../components/AssetForm'
import AssetsPieChart from '../../components/AssetsPieChart'
import Layout from '../../components/Layout'
import TickerBox from '../../components/TickerBox'
import TickerForm from '../../components/TickerForm'

import { DbAsset } from '../../models/asset'
import Ticker, { DbTicker } from '../../models/ticker'
import { fetchTickerPrice } from '../../lib/tickers'

const getEmptyTicker = (index: number): DbTicker => ({
  ref: {
    '@ref': {
      id: `empty-slot-${index}`,
    },
  },
  ts: 1,
  data: {
    platform: 'Kraken',
    coin: '',
    market: '',
  }
})

const getRecordId = (record: DbTicker | DbAsset) => record.ref['@ref'].id

const fetchTickersWithPrices = (tickers: DbTicker[]): Promise<DbTicker[]> =>
  Promise.all(tickers.map(async (ticker) => ({
    ...ticker,
    data: {
      ...ticker.data,
      value: await fetchTickerPrice(ticker.data),
    },
  })))

const isStableCoin = (coin: string) => ['USDT', 'USDC', 'BUSD', 'DAI'].includes(coin)

type DashboardProps = {
  error: string
  assets: DbAsset[]
  tickers: DbTicker[]
  dashboardRef: string
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  assets,
  tickers,
  dashboardRef,
}) => {
  if ( error ) {
    return <Error statusCode={ 404 } />
  }

  const userTickers = [
    ...tickers,
    tickers.length < 4 && getEmptyTicker(tickers.length),
  ].filter(Boolean)

  const [displayAssetModal, toggleAssetModal] = useState(false)
  const [displayTickerModal, toggleTickerModal] = useState(false)
  const [selectedAsset, setSelected] = useState(null)
  const [currentView, changeView] = useState('cards')

  const handleAssetModalClose = () => {
    setSelected(null)
    toggleAssetModal(false)
  }

  const handleAssetClick = (asset) => {
    setSelected(asset)
    toggleAssetModal(true)
  }

  const handleTickerDelete = async (tickerId: string) => {
    try {
      const dashboardUrl = `/api/dashboard/${dashboardRef}`
      const response = await fetch(`${dashboardUrl}/tickers/${tickerId}`, {
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
      <TickerBox
        key={ id }
        onDelete={() => handleTickerDelete(id)}
        onAdd={() => toggleTickerModal(true)}
        ticker={ ticker.data }
      />
    )
  })

  const mappedAssetsCards = assets
    .sort((a, b) => a.data.coin.localeCompare(b.data.coin))
    .map(asset =>
      <div key={ getRecordId(asset) } className="column is-one-third">
        <AssetCard
          asset={ asset.data }
          onClick={() => handleAssetClick(asset)}
        />
      </div>
    )

  const renderNewAssetButton = () => {
    return (
      <button
        className="button is-fu llwidth is-info is-outlined"
        onClick={() => toggleAssetModal(true)}
      >
        <span className="icon is-small">
          <FontAwesomeIcon icon={ faPlus } />
        </span>
        <span>Add an asset</span>
      </button>
    )
  }

  const pieChartData = assets.reduce((acc, { data }) => {
    const newCoinValue = acc[data.coin]
    ? {
      ...acc[data.coin],
      balance: acc[data.coin].balance + data.balance,
      currentBTCValue: acc[data.coin].currentBTCValue + data.currentBTCValue
    }
    : { ...data };

    return {
      ...acc,
      [data.coin]: newCoinValue,
    };
  }, {})

  return (
    <Layout hasHero>
      <div className="Dashboard">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-10">
              <section className="info-tiles">
                <div className="tile is-ancestor has-text-centered">
                  { mappedTickers }
                </div>
              </section>
              <section className="view-tiles">
                <div className="buttons">
                  <button
                    className={`button is-small ${currentView === 'charts' ? 'is-black' : 'is-white'}`}
                    onClick={() => currentView !== 'charts' && changeView('charts')}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={ faChartPie } />
                    </span>
                  </button>
                  <button
                    className={`button is-small ${currentView === 'cards' ? 'is-black' : 'is-white'}`}
                    onClick={() => currentView !== 'cards' && changeView('cards')}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={ faGripHorizontal } />
                    </span>
                  </button>
                </div>
              </section>
              {
                currentView === 'cards'
                ? (
                  <div className="columns is-multiline">
                    { mappedAssetsCards }
                  </div>
                )
                : (
                  <div className="charts-container columns">
                    <div className="column is-half">
                      <AssetsPieChart data={ Object.values(pieChartData) } />
                    </div>
                    <div className="column is-one-quarter">
                      <article className="box has-text-centered has-background-light">
                        <p className="title has-text-grey">
                          {
                            assets
                              .reduce((sum, asset) => sum += asset.data.currentEURValue, 0)
                              .toFixed(2)
                          }
                        </p>
                        <p className="subtitle has-text-grey">
                          Total (EUR)
                        </p>
                      </article>
                    </div>
                    <div className="column is-one-quarter">
                      <article className="box has-text-centered has-background-light">
                        <p className="title has-text-grey">
                          {
                            assets
                              .reduce((sum, asset) => sum += asset.data.currentBTCValue, 0)
                              .toFixed(8)
                          }
                        </p>
                        <p className="subtitle has-text-grey">
                          Total (BTC)
                        </p>
                      </article>
                    </div>
                  </div>
                )
              }
              <div className="columns is-centered">
                {
                  currentView === 'cards'
                  ? (
                    <div className="column is-one-fifth">
                      { renderNewAssetButton() }
                    </div>
                  )
                  : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <TickerForm
        show={ displayTickerModal }
        handleClose={() => toggleTickerModal(false)}
        dashboardRef={ dashboardRef }
      />
      <AssetForm
        show={ displayAssetModal }
        handleClose={ handleAssetModalClose }
        asset={ selectedAsset }
        dashboardRef={ dashboardRef }
      />
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { id } = params

  const { VERCEL_URL } = process.env
  const API_BASE_URL = `http://${VERCEL_URL}/api/dashboard`

  const dashboardUrlWithId = `${API_BASE_URL}/${id}`

  const fetchDashboardResponse = await fetch(dashboardUrlWithId)
  
  if ( !fetchDashboardResponse.ok ) {
    return {
      props: { error: true },
    }
  }

  const dashboard = await fetchDashboardResponse.json()

  if ( dashboard.data.isDashboardProtected ) {
    return {
      props: { login: true },
    }
  }

  const dashboardRef = getRecordId(dashboard)
  const dashboardUrlWithRef = `${API_BASE_URL}/${dashboardRef}`

  const fetchTickers = async (): Promise<DbTicker[]> => {
    const response = await fetch(`${dashboardUrlWithRef}/tickers`)

    return response.json()
  }

  const fetchAssets = async (): Promise<DbAsset[]> => {
    const response = await fetch(`${dashboardUrlWithRef}/assets`)

    return response.json()
  }

  const [tickers, assets] = await Promise.all([
    fetchTickers(),
    fetchAssets(),
  ])

  const tickersWithPrices = await fetchTickersWithPrices(tickers)

  const tickerBTCEUR = tickersWithPrices.find(ticker => {
    const { coin, market } = ticker.data

    return coin === 'BTC' && market === 'EUR'
  })

  const currentBTCPrice = tickerBTCEUR
    ? tickerBTCEUR.data.value
    : (
      await fetchTickerPrice({
        platform: 'Binance',
        coin: 'BTC',
        market: 'EUR',
      })
    )

  const tickerEURUSD = await fetchTickerPrice({
    platform: 'Binance',
    coin: 'EUR',
    market: 'USDT',
  })

  const assetsPromises = assets.map(async (asset) => {
    const { platform, coin, balance } = asset.data

    let currentPrice;

    if (isStableCoin(coin)) {
      currentPrice = 1 / currentBTCPrice
    } else if (coin === 'BTC') {
      currentPrice = 1
    } else {
      currentPrice = await fetchTickerPrice({ platform, coin, market: 'BTC' } as Ticker)
    }

    const currentBTCValue = balance * currentPrice

    return {
      ...asset,
      data: {
        ...asset.data,
        currentBTCValue,
        currentEURValue: currentBTCValue * currentBTCPrice / (isStableCoin(coin) ? tickerEURUSD : 1),
      }
    }
  })

  const assetsWithPrices: DbAsset[] = await Promise.all(assetsPromises)

  return {
    props: {
      tickers: tickersWithPrices,
      assets: assetsWithPrices,
      dashboardRef,
    },
  }
}

export default Dashboard
