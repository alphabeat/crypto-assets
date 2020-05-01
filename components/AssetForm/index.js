import { useState } from 'react'
import Router from 'next/router'

function AssetForm(props) {
  const { show, handleClose } = props

  const initialState = {
    coin: '',
    balance: '',
    platform: '',
    initialValue: '',
  }

  const [fields, setFields] = useState(initialState)

  const onClose = () => {
    setFields(initialState)
    handleClose()
  }

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

    const response = await fetch('http://localhost:3000/api', {
      method: 'POST',
      body: JSON.stringify(fields)
    })

    const result = await response.json()

    if ( result.success ) (
      Router.reload()
    )
  }

  const activeClass = show ? 'is-active' : ''
  const isValidForm = () => {
    const fieldsValues = Object.values(fields)

    return fieldsValues.every(Boolean)
  }

  return (
    <div className={`modal ${activeClass}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">New asset</p>
            <div className="card-header-icon">
              <button
                className="delete"
                aria-label="close"
                onClick={ onClose }
              ></button>
            </div>
          </header>
          <section className="card-content">
            <div className="field">
              <label className="label">Coin</label>
              <div className="control">
                <input
                  type="text"
                  name="coin"
                  value={ fields.coin }
                  className="input"
                  placeholder="ETH"
                  onChange={ handleInputChange }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Balance</label>
              <div className="control">
                <input
                  type="number"
                  name="balance"
                  value={ fields.balance.toString() }
                  className="input"
                  placeholder="1000"
                  onChange={ handleInputChange }
                />
                {
                  Number(fields.balance) <= 0
                  ? (
                    <p className="help is-danger">The value must be strictly positive.</p>
                  )
                  : null
                }
              </div>
            </div>
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
              <label className="label">Initial BTC value</label>
              <div className="control">
                <input
                  type="number"
                  name="initialValue"
                  value={ fields.initialValue.toString() }
                  className="input"
                  placeholder="0.01010101"
                  onChange={ handleInputChange }
                />
                {
                  Number(fields.initialValue) <= 0
                  ? (
                    <p className="help is-danger">The value must be strictly positive.</p>
                  )
                  : null
                }
              </div>
            </div>
          </section>
          <footer className="card-footer" style={{ justifyContent: 'flex-end' }}>
            <div className="card-footer-item">
              <button className="button is-link is-light" onClick={ onClose }>Cancel</button>
            </div>
            <div className="card-footer-item">
              <button className="button is-link" onClick={ handleSubmit } disabled={ !isValidForm() }>
                Create
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default AssetForm
