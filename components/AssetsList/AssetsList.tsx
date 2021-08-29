import React, { useState } from 'react'
import Error from 'next/error'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { useDashboard } from '../../context/dashboard'
import { getRecordId } from '../../lib/db/faunadb.utils'
import useFetchAssets from '../../lib/hooks/useFetchAssets'
import { DbAsset } from '../../models/asset'

import AssetCard from '../AssetCard/AssetCard'
import AssetForm from '../AssetForm/AssetForm'
import SpinnerFallback from '../SpinnerFallback/SpinnerFallback'
import IconText from '../IconText/IconText'

const AssetsList: React.VFC = () => {
  const { dashboard } = useDashboard()
  const dashboardRef = getRecordId(dashboard)

  const { assets, isLoading, hasError} = useFetchAssets(dashboardRef)

  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false)
  const [selectedAsset, setSelected] = useState<DbAsset | null>(null)

  const handleAssetModalClose = () => {
    setSelected(null)
    setIsAssetFormOpen(false)
  }

  const handleClick = (asset: DbAsset) => {
    setSelected(asset)
    setIsAssetFormOpen(true)
  }

  if (hasError) return <Error statusCode={ 500 } />

  return (
    <section className="assets-tiles">
      <div className="columns is-multiline is-full">
        {isLoading ? (
          new Array(12).map(() => (
            <div className="column is-one-third">
              <SpinnerFallback size="sm" />
            </div>
          ))
        ) : (
          assets
          .sort((a, b) => a.data.coin.localeCompare(b.data.coin))
          .map(asset => (
            <div key={ getRecordId(asset) } className="column is-one-third">
              <AssetCard
                asset={ asset.data }
                onClick={() => handleClick(asset)}
              />
            </div>
          ))
        )}
      </div>
      <div className="columns is-centered mt-8">
        <div className="column is-narrow">
          <button
            className="button is-fu llwidth is-info is-outlined"
            onClick={() => setIsAssetFormOpen(true)}
          >
            <IconText icon={ faPlus } text="Add an asset" />
          </button>
        </div>
      </div>
      <AssetForm
        show={ isAssetFormOpen }
        handleClose={ handleAssetModalClose }
        asset={ selectedAsset }
        dashboardRef={ dashboardRef }
      />
    </section>
  )
}

export default AssetsList
