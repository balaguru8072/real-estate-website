import { Bath, BedDouble, MapPin, Ruler, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import LocationSearch from './GoogleAddress'
import { Button } from '@/components/ui/button'
import FilterSection from './FilterSection'
import Link from 'next/link'

function Listing({ listings, handleSearchClick, searchAddress, setBedCount, setBathCount, setParkingCount, setHomeType, setCoordinates }) {
    const [address, setAddress] = React.useState();
    return (
        <div>
            <div className='p-3 flex gap-6'>
                <LocationSearch onSelectAddress={(e) => {
                    searchAddress(e);
                    setAddress(e);
                    setCoordinates({ lat: e.lat, lng: e.lng })
                    console.log(e, 'selected address')
                }} />
                <Button
                    onClick={handleSearchClick}
                    className='flex gap-2 p-5'>
                    <Search /> Search
                </Button>
            </div>

            <FilterSection
                setBedCount={setBedCount}
                setBathCount={setBathCount}
                setParkingCount={setParkingCount}
                setHomeType={setHomeType}
            />
            {address && <div className='px-3'>
                <h2 className='text-lg'>Found <span className='font-bold'>{listings.length}</span> results for <span className='font-bold text-primary'>{address.address}</span> </h2>
            </div>}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {listings.map((item, index) => (
                    <div key={index} className='p-3  hover:border hover:border-primary cursor-pointer rounded-lg  shadow-md'>
                        <Link href={'/view-listing/' + item.id}>
                            <div className='grid grid-cols-1 gap-2'>
                                {item.listingImages?.map((image, imgIndex) => (
                                    <div className='' key={imgIndex}>
                                        <Image
                                            src={image.url}
                                            alt={item.title || 'Listing Image'}
                                            width={800}
                                            height={150}
                                            className='rounded-lg object-cover h-[170px] w-full'
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className='flex mt-2 flex-col gap-2 justify-between'>
                                <h2 className='font-bold text-xl'>${item?.price}</h2>
                                <h2 className='flex gap-2 text-bold text-gray-400'>
                                    <MapPin className='' /> {item?.address}</h2>
                                <div className='flex gap-2 mt-2'>
                                    <h2 className='flex gap-2 w-full bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center'>
                                        <BedDouble className='h-4 w-4' />
                                        {item?.bedroom}
                                    </h2>
                                    <h2 className='flex gap-2 w-full bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center'>
                                        <Bath className='h-4 w-4' />
                                        {item?.bathroom}
                                    </h2>
                                    <h2 className='flex gap-2 w-full bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center'>
                                        <Ruler className='h-4 w-4' />
                                        {item?.area}
                                    </h2>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Listing