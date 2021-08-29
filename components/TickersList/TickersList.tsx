import { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import Error from 'next/error'

import { useDashboard } from '../../context/dashboard'
import { getEmptyTicker, getRecordId } from '../../lib/db/faunadb.utils'
import useFetchTickers, { getTickersKey } from '../../lib/hooks/useFetchTickers'

import TickerBox from '../TickerBox/TickerBox'
import TickerForm from '../TickerForm/TickerForm'
import SpinnerFallback from '../SpinnerFallback/SpinnerFallback'
import EmptyTickerBox from '../TickerBox/EmptyTickerBox'

const TickersList: React.VFC = () => {
  const { mutate } = useSWRConfig()
  const { dashboard } = useDashboard()

  const dashboardRef = getRecordId(dashboard)

  const { tickers, isLoading, hasError } = useFetchTickers(dashboardRef)

  const [isTickerFormOpen, setIsTickerFormOpen] = useState(false)

  const handleTickerDelete = async (tickerId: string) => {
    try {
      const dashboardUrl = `/api/dashboard/${dashboardRef}`
      const response = await fetch(`${dashboardUrl}/tickers/${tickerId}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if ( result.success ) {
        mutate(
          getTickersKey(dashboardRef),
          tickers.filter((ticker) => getRecordId(ticker) !== tickerId),
          false
        )
      }
    }
    catch (e) {
      console.error(e.message)
    }
  }

  if (hasError) return <Error statusCode={ 404 } />

  if (isLoading) {
    return (
      <section className="info-tiles">
        <div className="tile is-ancestor has-text-centered">
          {new Array(4).map(() => (
            <div className="tile is-parent">
              <article className="tile is-child box has-background-light">
                <SpinnerFallback size="sm" />
              </article>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const userTickers = [
    ...tickers,
    tickers.length < 4 && getEmptyTicker(tickers.length),
  ].filter(Boolean)

  return (
    <section className="info-tiles">
      <div className="tile is-ancestor has-text-centered">
        {userTickers.map(ticker => {
          const id = getRecordId(ticker)

          return id.startsWith('empty-slot') ? (
            <EmptyTickerBox key={ id } onAdd={() => setIsTickerFormOpen(true)} />
          ) : (
            <TickerBox
              key={ id }
              ticker={ ticker.data }
              onDelete={() => handleTickerDelete(id)}
            />
          )
        })}
      </div>
      {isTickerFormOpen && (
        <TickerForm
          handleClose={() => setIsTickerFormOpen(false)}
          dashboardRef={ dashboardRef }
        />
      )}
    </section>
  )
}

export default TickersList
