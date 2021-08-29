import { useSWRConfig } from 'swr'
import React, { useState, useEffect } from 'react'

import { DbAsset } from '../../models/asset'
import { getAssetsKey } from '../../lib/hooks/useFetchAssets'
import { getRecordId } from '../../lib/db/faunadb.utils'

type FormElement = HTMLButtonElement | HTMLSelectElement

type AssetFormProps = {
  show: boolean
  handleClose: (event?: React.MouseEvent<HTMLButtonElement>) => void
  dashboardRef: string
  asset?: DbAsset
}

function AssetForm(props: AssetFormProps) {
  const { mutate } = useSWRConfig()
  const { show, handleClose, asset, dashboardRef } = props

  const API_URL = `/api/dashboard/${dashboardRef}`

  const isUpdate = Boolean(asset)

  const initialState = {
    coin: asset?.data.coin || '',
    balance: asset?.data.balance.toString() || '',
    initialValue: asset?.data.initialValue.toString() || '',
    dashboard: dashboardRef,
  }

  const assetId = isUpdate ? getRecordId(asset) : null

  const [fields, setFields] = useState(initialState)

  useEffect(() => setFields(initialState), [asset])

  const handleInputChange = (event: React.ChangeEvent<FormElement>) => {
    event.persist()

    const { name, value } = event.target

    setFields(inputs => ({
      ...inputs,
      [name]: value,
    }))
  }

  const handleCreate = async () => {
    const parsedFields = {
      ...fields,
      balance: Number(fields.balance.replace(',', '.')),
      initialValue: Number(fields.initialValue.replace(',', '.')),
    }

    return fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(parsedFields),
    })
  }

  const handleUpdate = async () => {
    const data = {
      ...asset,
      data: {
        ...fields,
        balance: Number(fields.balance.replace(',', '.')),
        initialValue: Number(fields.initialValue.replace(',', '.')),
      },
    }

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
      const message = 'Are you sure ? This action is irreversible.'

      if ( !window.confirm(message) ) { return }
    }

    try {
      const response = await actions[userAction]()
      const result = await response.json()

      if ( result.success ) {
        mutate(getAssetsKey(dashboardRef))
        handleClose()
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
                  placeholder="ETH"
                  onChange={ handleInputChange }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Balance</label>
              <div className="control">
                <input
                  name="balance"
                  value={ fields.balance.toString() }
                  className="input"
                  placeholder="1000"
                  onChange={ handleInputChange }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Initial BTC value</label>
              <div className="control">
                <input
                  name="initialValue"
                  value={ fields.initialValue.toString() }
                  className="input"
                  placeholder="0.01010101"
                  onChange={ handleInputChange }
                />
              </div>
            </div>
          </section>
          <footer className="card-footer asset-card-footer" style={{ padding: '1rem', justifyContent: 'flex-end' }}>
              <button className="button is-light" onClick={ handleClose }>Cancel</button>
              <button className="button is-link" onClick={ handleSubmit } disabled={ !isValidForm() }>
                { isUpdate ? 'Update' : 'Create' }
              </button>
              {
                isUpdate
                ? (
                  <button className="button is-danger" onClick={ handleSubmit }>
                    Delete
                  </button>
                )
                : null
              }
          </footer>
          <style>{`
            .asset-card-footer {
              justify-content: 'flex-end';
              gap: 1rem;
              padding: 1rem;
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}

export default AssetForm
