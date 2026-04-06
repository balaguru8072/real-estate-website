"use client"

import React, { use, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Slider from '../_component/Slider'
import Details from '../_component/Details'

function ViewListing({ params }) {
  const [loading, setLoading] = useState(true)
  const [listingDetail, setListingDetail] = useState(null)

  const resolvedParams = use(params)
  const id = resolvedParams.id

  useEffect(() => {
    if (id) {
      GetListingDetail()
    }
  }, [id])

  const GetListingDetail = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('listing')
      .select('*, listingImages(url, listing_id)')
      .eq('id', id)
      .eq('active', true)
      .single()

    if (error) {
      console.log(error, "error fetching listing details")
      toast.error('Server side error')
      setLoading(false)
      return
    }

    if (data) {
      setListingDetail(data)
      console.log(data, "view listing data")
    }

    setLoading(false)
  }

  return (
    <div className='px-4 md:px-32 lg:px-56'>
      <Slider
        imageList={listingDetail?.listingImages || []}
        loading={loading}
      />

      <Details listingDetail={listingDetail}/>
    </div>
  )
}

export default ViewListing