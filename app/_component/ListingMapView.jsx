"use client"

import React, { useEffect } from 'react'
import Listing from './Listing'
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
// import GoogleMapSection from './GoogleMapSection';
import MapSection from './MapSection';

function ListingMapView({ type }) {

    const [listings, setListings] = React.useState([]);
    const [searchAddress, setSearchAddress] = React.useState();
    const [bedCount, setBedCount] = React.useState(0);
    const [bathCount, setBathCount] = React.useState(0);
    const [parkingCount, setParkingCount] = React.useState(0);
    const [homeType, setHomeType] = React.useState();
    const [coordinates, setCoordinates] = React.useState();

    useEffect(() => {
        getLatestListing();
    }, [type, bedCount, bathCount, parkingCount, homeType])

    const getLatestListing = async () => {
        let query = supabase
            .from('listing')
            .select(`*, listingImages(
                url,
                listing_id)`)
            .eq('active', true)
            .eq('type', type)
            .gte('bedroom', bedCount)
            .gte('bathroom', bathCount)
            .gte('parking', parkingCount)
            .order('id', { ascending: false })

        if (homeType) {
            query = query.eq('propertytype', homeType)
        }

        const { data, error } = await query;

        // .select('*') 
        // console.log('All rows:', data, 'Error:', error);
        if (data) {
            setListings(data);
            console.log(data, `${type} data `)
        } else {
            console.log(error)
            toast.error('Failed to fetch server side data')
        }
    }

    const handleSearchClick = async () => {
        console.log(searchAddress, 'search address')
        const seractTerm = searchAddress?.address
        const { data, error } = await supabase
            .from('listing')
            .select(`*, listingImages(
                url,
                listing_id)`)
            .eq('active', true)
            .eq('type', type)
            .gte('bedroom', bedCount)
            .gte('bathroom', bathCount)
            .gte('parking', parkingCount)
            .like('address', '%' + seractTerm + '%')
            .order('id', { ascending: false })

        if (homeType) {
            query = query.eq('propertytype', homeType)
        }


        if (data) {
            setListings(data);
        }
        if (error) {
            console.log(error)
            toast.error('Search failed')
            return
        }

    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
                <Listing
                    listings={listings}
                    handleSearchClick={handleSearchClick}
                    searchAddress={(e) => setSearchAddress(e)}
                    setBedCount={setBedCount}
                    setBathCount={setBathCount}
                    setParkingCount={setParkingCount}
                    setHomeType={setHomeType}
                    setCoordinates={setCoordinates}
                />
            </div>
            <div className='flexed right-10 h-full md:w-[350px] lg:w-[450px] xl:w-[650px]' >
                {/* <GoogleMapSection  coordinates={coordinates}/> */}
                <MapSection coordinates={coordinates} listings={listings} />
            </div>
        </div>
    )
}

export default ListingMapView