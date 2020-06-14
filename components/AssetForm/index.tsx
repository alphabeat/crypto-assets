import { useState, useEffect } from 'react'
import Router from 'next/router'

type FormElement = HTMLButtonElement | HTMLSelectElement

type AssetFields = {
  coin: string
  balance: number
  platform: string
  initialValue: number
  dashboard: string
}

type FaunadbResult = {
  ref: object
  data: AssetFields
}

type AssetFormProps = {
  show: boolean
  handleClose: (event?: React.MouseEvent<HTMLButtonElement>) => void
  asset: FaunadbResult
  dashboardRef: string
}

function AssetForm(props: AssetFormProps) {
  const { show, handleClose, asset, dashboardRef } = props

  const API_URL = `/api/dashboard/${dashboardRef}`

  const isUpdate = Boolean(asset)

  const initialState = isUpdate
    ? {
        ...asset.data,
        dashboard: dashboardRef,
      }
    : {
      coin: '',
      balance: 0,
      platform: '',
      initialValue: 0,
      dashboard: dashboardRef,
    }

  const { id: assetId } = isUpdate ? asset.ref['@ref'] : { id: null }

  const [fields, setFields] = useState(initialState)

  useEffect(() => {
    setFields(initialState)
  }, [asset])

  const handleInputChange = (event: React.ChangeEvent<FormElement>) => {
    event.persist()

    const { name, value, type } = event.target
    let parsedValue: string | number = value

    if ( type === 'number' ) {
      parsedValue = parseFloat(value)
    }

    setFields(inputs => ({
      ...inputs,
      [name]: parsedValue,
    }))
  }

  const handleCreate = async () => {
    return fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(fields),
    })
  }

  const handleUpdate = async () => {
    const data = {
      ...asset,
      data: fields,
    }

    console.log('COUCOU', API_URL)

    return fetch(`${API_URL}/assets/${assetId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  const handleDelete = async () => {
    return fetch(`${API_URL}/assets/${assetId}`, {
      method: 'DELETE',
    })
  }

  const handleSubmit = async (event) => {
    event.persist()

    const actions = {
      create: handleCreate,
      update: handleUpdate,
      delete: handleDelete,
    }

    const userAction = event.target.innerHTML.toLowerCase()

    if ( userAction === 'delete' ) {
      const message = `
        Are you sure ? This action is irreversible.
      `

      if ( !window.confirm(message) ) { return }
    }

    try {
      const response = await actions[userAction]()
      const result = await response.json()

      if ( result.success ) {
        Router.reload()
      }
    }
    catch (e) {
      console.error(e.message)
    }
  }

  const activeClass = show ? 'is-active' : ''
  const isValidForm = () => {
    const fieldsValues = Object.values(fields)

    if ( isUpdate ) {
      return fieldsValues.some((value) => !Object.values(asset.data).includes(value))
    }

    return fieldsValues.every(Boolean)
  }

  return (
    <div className={`modal ${activeClass}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">
              {isUpdate ? 'Edit' : 'New'} asset
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
              <button className="button is-link is-light" onClick={ handleClose }>Cancel</button>
            </div>
            <div className="card-footer-item">
              <button className="button is-link" onClick={ handleSubmit } disabled={ !isValidForm() }>
                { isUpdate ? 'Update' : 'Create' }
              </button>
            </div>
            {
              isUpdate
              ? (
                <div className="card-footer-item">
                  <button className="button is-danger" onClick={ handleSubmit }>
                    Delete
                  </button>
                </div>
              )
              : null
            }
          </footer>
        </div>
      </div>
    </div>
  )
}

export default AssetForm
