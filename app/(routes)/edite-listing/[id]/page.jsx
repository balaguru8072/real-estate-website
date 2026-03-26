"use client"
import React, { useEffect, use, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from '../../../../utils/supabase/client';
import { Loader } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import FileUploader from '../_component/FileUploader';

function EditListing({ params }) {

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [listingData, setListingData] = useState(null);
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      verifyUserRecord();
    }
  }, [user, isLoaded]);

  const verifyUserRecord = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select("*")
      .eq('createdBy', user?.primaryEmailAddress?.emailAddress)
      .eq('id', id);

    if (data && data.length > 0) {
      setListingData(data[0]);
    } else {
      router.replace('/');
      toast("You are not authorized to edit this listing.");
    }
  };

  // const onSubmitHandler = async (formValue) => {
  //   setLoader(true);
  //   const { data, error } = await supabase
  //     .from('listing')
  //     .update(formValue)
  //     .eq('id', id)
  //     .select();

  //   if (data) {
  //     toast("Listing updated successfully!");
  //   } else {
  //     console.error(error);
  //     toast("Error updating listing.");
  //   }

  //   for (const image of images) {
  //     const file =image;
  //     const fileName= Date.now().toString();
  //     const fileExt =fileName.split('.').pop();
  //     const {data, error} = await supabase.storage
  //       .from('listingImages')
  //       .upload(`${fileName}`, file, {
  //         contentType: `image/${fileExt}`,
  //         upsert: false   
  //       });

  //       if(error){
  //         console.error("Error uploading image: ", error);
  //         toast("Error uploading image: " + error.message);
  //         setLoader(false);

  //       }else{
  //         toast("Image uploaded successfully!");
  //         const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
  //         console.log(imageUrl)
  //         const {data, error} = await supabase
  //         .form('listingImages')
  //         .insert([
  //           {
  //             url: imageUrl,
  //             listing_id: params?.id
  //           }
  //         ])
  //         .select();
  //         if(error){
  //           setLoader(false);
  //           console.error("Error saving image URL to database: ", error);
  //           toast("Error saving image URL to database: " + error.message);
  //         }
  //         console.log("Image uploaded successfully: ", data);

  //       }
  //       setLoader(false);
  //   }
  // };

  const onSubmitHandler = async (formValue) => {
    setLoader(true);

    // 1. Update listing data
    const { error: updateError } = await supabase
      .from('listing')
      .update(formValue)
      .eq('id', id);

    if (updateError) {
      toast("Error updating listing");
      setLoader(false);
      return;
    }

    // 2. Upload images
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listingImages')
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (uploadError) {
        console.error(uploadError);
        toast("Image upload failed");
        continue;
      }

      const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;

      const { error: dbError } = await supabase
        .from('listingImages')
        .insert([
          {
            url: imageUrl,
            listing_id: id,
          },
        ]);

      if (dbError) {
        console.error(dbError);
        toast("Saving image failed");
      }
    }

    setLoader(false);
    toast("Listing updated successfully!");
  };

  return (
    <div className='px-10 md:px-36 my-10'>
      <h2 className='font-bold text-2xl'>
        Enter some more details about your listing
      </h2>

      <Formik
        enableReinitialize={true}
        initialValues={{
          type: listingData?.type || "",
          propertytype: listingData?.propertytype || "",
          bedroom: listingData?.bedroom || "",
          bathroom: listingData?.bathroom || "",
          builtln: listingData?.builtln || "",
          parking: listingData?.parking || "",
          lotsize: listingData?.lotsize || "",
          area: listingData?.area || "",
          price: listingData?.price || "",
          hoa: listingData?.hoa || "",
          description: listingData?.description || "",
          profileImage: user?.imageUrl,
          fullName: user?.fullName,
        }}
        onSubmit={(values) => {
          onSubmitHandler(values);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <div className='p-8 rounded-lg shadow-md mt-5'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                {/* Rent or Sale */}
                <div className='flex flex-col gap-2'>
                  <h2 className='font-bold text-lg text-slate-500'>Rent or Sale</h2>
                  <RadioGroup
                    value={values.type}
                    onValueChange={(v) => setFieldValue("type", v)}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="Rent" id="Rent" />
                      <Label htmlFor="Rent">Rent</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="Sell" id="Sell" />
                      <Label htmlFor="Sell">Sell</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Property Type */}
                <div className='flex flex-col gap-2'>
                  <h2 className='font-bold text-lg text-slate-500'>Property Type</h2>
                  <Select
                    value={values.propertytype}
                    onValueChange={(v) => setFieldValue("propertytype", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single Family House">Single Family House</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div></div>

                {/* Row 2 */}
                <div>
                  <h2 className='font-bold text-gray-500'>Bedroom</h2>
                  <Input type="number" name="bedroom" value={values.bedroom} onChange={handleChange} />
                </div>

                <div>
                  <h2 className='font-bold text-gray-500'>Bathroom</h2>
                  <Input type="number" name="bathroom" value={values.bathroom} onChange={handleChange} />
                </div>

                <div>
                  <h2 className='font-bold text-gray-500'>Built In</h2>
                  <Input type="number" name="builtln" value={values.builtln} onChange={handleChange} />
                </div>

                {/* Row 3 */}
                <div>
                  <h2 className='font-bold text-gray-500'>Parking</h2>
                  <Input type="number" name="parking" value={values.parking} onChange={handleChange} />
                </div>

                <div>
                  <h2 className='font-bold text-gray-500'>Lot Size</h2>
                  <Input type="number" name="lotsize" value={values.lotsize} onChange={handleChange} />
                </div>

                <div>
                  <h2 className='font-bold text-gray-500'>Area</h2>
                  <Input type="number" name="area" value={values.area} onChange={handleChange} />
                </div>

                <div>
                  <h2 className='font-bold text-gray-500'>Selling Price ($)</h2>
                  <Input type="number" name="price" value={values.price} onChange={handleChange} />
                </div>

                <div>
                  <h2 className='font-bold text-gray-500'>HOA ($)</h2>
                  <Input type="number" name="hoa" value={values.hoa} onChange={handleChange} />
                </div>

                {/* Description */}
                <div className='md:col-span-3'>
                  <h2 className='font-bold text-gray-500'>Description</h2>
                  <Textarea name="description" value={values.description} onChange={handleChange} />
                </div>

                {/* File Uploader */}
                <div className='md:col-span-3'>
                  <h2 className='font-bold text-gray-500'>Upload Property Images</h2>
                  <FileUploader setImages={(value) => setImages(value)} />
                </div>

                {/* Buttons */}
                <div className='md:col-span-3 flex justify-end gap-4 mt-4'>
                  <Button className="font-bold" variant="outline" type="submit">
                    Save
                  </Button>
                  <Button className="font-bold"

                    type="submit">
                    {loader ? <Loader /> : "Save & Publish"}
                  </Button>
                </div>

              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default EditListing