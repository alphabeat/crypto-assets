import { useState } from 'react'
import Router from 'next/router'

function TickerForm(props) {
  const { show, handleClose, dashboardRef } = props

  const API_URL = `http://localhost:3000/api/dashboard/${dashboardRef}`

  const INPUT_FIELDS = ['platform', 'coin', 'market']
  const initialState = INPUT_FIELDS.reduce((acc, field) => ({
    ...acc,
    [field]: '',
  }), { dashboard: dashboardRef })

  const [fields, setFields] = useState(initialState)

  const handleInputChange = (event) => {
    event.persist()

    const { name, value, type } = event.target
    let parsedValue = value

    if ( type === 'number' ) {
      parsedValue = parseFloat(value)
    }

    setFields(inputs => ({
      ...inputs,
      [name]: parsedValue,
    }))
  }

  const handleSubmit = async (event) => {
    event.persist()

    try {
      const response = await fetch(`${API_URL}/tickers`, {
        method: 'POST',
        body: JSON.stringify(fields),
      })
      const result = await response.json()

      if ( result.success ) {
        Router.reload()
      }
      else {
        throw new Error(result.error)
      }
    }
    catch (e) {
      console.error(e.message)
    }
  }

  const activeClass = show ? 'is-active' : ''
  const isValidForm = Object.values(fields).every(Boolean)

  return (
    <div className={`modal ${activeClass}`}>
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
              ></button>
            </div>
          </header>
          <section className="card-content">
            <div className="field">
              <label className="label">Platform</label>
              <div className="control">
                <div className="select">
                  <select name="platform" value={ fields.platform } onChange={ handleInputChange }>
                    <option value="">Choose one...</option>
                    <option value="bittrex">Bittrex</option>
                    <option value="kraken">Kraken</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Coin</label>
              <div className="control">
                <input
                  type="text"
                  name="coin"
                  value={ fields.coin }
                  className="input"
                  placeholder="BTC"
                  onChange={ handleInputChange }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Market</label>
              <div className="control">
                <input
                  type="text"
                  name="market"
                  value={ fields.market }
                  className="input"
                  placeholder="EUR"
                  onChange={ handleInputChange }
                />
              </div>
            </div>
          </section>
          <footer className="card-footer" style={{ justifyContent: 'flex-end' }}>
            <div className="card-footer-item">
              <button className="button is-link is-light" onClick={ handleClose }>Cancel</button>
            </div>
            <div className="card-footer-item">
              <button className="button is-link" onClick={ handleSubmit } disabled={ !isValidForm }>
                Add
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default TickerForm;