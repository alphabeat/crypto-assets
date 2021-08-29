import { useSWRConfig } from 'swr'
import React, { useMemo, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { getTickersKey } from '../../lib/hooks/useFetchTickers'
import { DbTicker } from '../../models/ticker'
import IconText from '../IconText/IconText'

type TickerFormProps = {
  handleClose: () => void
  dashboardRef: string
}

const TickerForm: React.FC<TickerFormProps> = ({ handleClose, dashboardRef }) => {
  const { mutate, cache } = useSWRConfig()
  const API_URL = useMemo(() => `/api/dashboard/${dashboardRef}`, [dashboardRef])
  const tickers: DbTicker[] = cache.get(getTickersKey(dashboardRef))

  const initialState = {
    coin: '',
    dashboard: dashboardRef,
  }

  const [fields, setFields] = useState(initialState)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()

    const { name, value} = event.target

    setFields(inputs => ({
      ...inputs,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.persist()

    try {
      const response = await fetch(`${API_URL}/tickers`, {
        method: 'POST',
        body: JSON.stringify(fields),
      })
      const result = await response.json()

      if ( result.success ) {
        mutate(getTickersKey(dashboardRef), [...tickers, result.data], false)
        handleClose()
      }
      else {
        throw new Error(result.error)
      }
    }
    catch (e) {
      console.error(e.message)
    }
  }

  const isValidForm = Object.values(fields).every(Boolean)

  return (
    <div className={`modal is-active`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">
              New ticker
            </p>
            <div className="card-header-icon">
              <button
                className="delete"
                aria-label="close"
                onClick={ handleClose }
              />
            </div>
          </header>
          <section className="card-content">
            <div className="field">
              <label className="label">Coin</label>
              <div className="control">
                <input
                  name="coin"
                  value={ fields.coin }
                  className="input"
                  placeholder="BTC"
                  onChange={ handleInputChange }
                />
              </div>
            </div>
          </section>
          <footer className="card-footer ticker-card-footer">
            <button className="button is-link is-light" onClick={ handleClose }>Cancel</button>
            <button className="button is-link" onClick={ handleSubmit } disabled={ !isValidForm }>
              <IconText icon={ faPlus } text="Add" />
            </button>
          </footer>
          <style>{`
            .ticker-card-footer {
              justify-content: flex-end;
              gap: 1rem;
              padding: 1rem;
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}

export default TickerForm;