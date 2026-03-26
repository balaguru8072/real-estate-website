"use client";

import React, { useState } from 'react'
// import GoogleAddress from '../../_component/GoogleAddress'
import LocationSearch from '../../_component/GoogleAddress'
import { Button } from "@/components/ui/button";
import { supabase } from '../../../utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

function AddNewlisting() {
    const [location, setLocation] = useState(null);
    const route = useRouter();
    const {user} = useUser();
    const [loader, setLoader] = useState(false);
    const handleSelectAddress = (data) => {
        // Handle the selected address here
        console.log("parent recived data: ", data)
        setLocation(data);
        console.log("Selected location:", data);
    }

    const nextHandler = async() => {
        setLoader(true);
        console.log("Location to be sent to next page: ", location);
        // You can use Next.js router to navigate to the next page and pass the location data

        const { data, error } = await supabase
            .from('listing')
            .insert([
                { 
                    address: location.address, 
                    coordinates: location.lat + "," + location.lng,
                    createdBy: user?.primaryEmailAddress.emailAddress
                },
            ])
            .select();

            if (data) {
                setLoader(false);
                console.log("Data inserted successfully:", data);
                toast("New Address Added Successfully!.......")
                route.replace(`/edite-listing/${data[0].id}`); // Navigate to the next page with the new listing ID
            }
            if (error) {
                setLoader(false);
                console.error("Error inserting data:", error);
                toast("server side error....")
            }

    }
    return (
        <div className='mt-10 md:mx-56 lg:mx-80'>
            <div className='p-10 flex flex-col gap-5 items-center justify-center'>
                <h2 className='font-bold text-2xl'>Add New Listing</h2>
                <div className='p-10 rounded-lg border shodow-md w-full flex flex-col gap-5'>
                    <h2 className='text-gray-500'>Enter Address which you want to list</h2>
                    {/* <GoogleAddress /> */}
                    <LocationSearch onSelectAddress={handleSelectAddress} />
                    <Button
                        disabled={!location || loader}
                        onClick={nextHandler}
                    >
                    {loader?<Loader  className='animate-spin'/>:
                      "NEXT"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddNewlisting