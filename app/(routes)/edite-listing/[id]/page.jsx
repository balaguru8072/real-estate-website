"use client"
import React, { useEffect, useState, use } from 'react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function EditListing({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [listingData, setListingData] = useState(null);
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || !id) return;
    verifyUserRecord();
  }, [isLoaded, user, id]);

  const verifyUserRecord = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select("*, listingImages(listing_id,url)")
      .eq('createdBy', user?.primaryEmailAddress?.emailAddress)
      .eq('id', id);

    if (error) {
      console.error("Fetch error:", error);
      toast("Error fetching listing");
      return;
    }

    if (data && data.length > 0) {
      setListingData(data[0]);
    } else {
      toast("You are not authorized to edit this listing.");
      router.replace('/');
    }
  };

  const onSubmitHandler = async (values, publish = false) => {
  try {
    if (!id) {
      toast("Listing ID is missing");
      return;
    }

    setLoader(true);

    const payload = {
      type: values.type || null,
      propertytype: values.propertytype || null,
      bedroom: values.bedroom ? Number(values.bedroom) : null,
      bathroom: values.bathroom ? Number(values.bathroom) : null,
      builtln: values.builtln ? Number(values.builtln) : null,
      parking: values.parking ? Number(values.parking) : null,
      lotsize: values.lotsize ? Number(values.lotsize) : null,
      area: values.area ? Number(values.area) : null,
      price: values.price ? Number(values.price) : null,
      hoa: values.hoa ? Number(values.hoa) : null,
      description: values.description || null,
      profileImage: values.profileImage || null,
      fullName: values.fullName || null,
      active: publish ? true : listingData?.active ?? false,
    };

    const { data, error } = await supabase
      .from('listing')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Update error:", error);
      toast("Update failed: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      toast("No row updated");
      return;
    }

    if (images && images.length > 0) {
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('listingImages')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast("Image upload failed");
          continue;
        }

        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;

        const { error: imageInsertError } = await supabase
          .from('listingImages')
          .insert([
            {
              url: imageUrl,
              listing_id: id,
            },
          ]);

        if (imageInsertError) {
          console.error("Image insert error:", imageInsertError);
          toast("Image DB save failed");
        }
      }
    }

    toast(publish ? "Listing published successfully!" : "Listing saved successfully!");

    if (publish) {
      router.push('/');
    } else {
      await verifyUserRecord();
    }
  } catch (error) {
    console.error("Submit error:", error);
    toast("Something went wrong");
  } finally {
    setLoader(false);
  }
};

  const publishBtnHandler = async () => {
    try {
      if (!id) {
        toast("Listing ID is missing");
        return;
      }

      setLoader(true);

      const { error } = await supabase
        .from('listing')
        .update({ active: true })
        .eq('id', id)
        .select();

      if (error) {
        console.error(error);
        toast("Error publishing listing");
        return;
      }

      toast("Listing published successfully!");
      await verifyUserRecord();
    } catch (error) {
      console.error(error);
      toast("Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className='px-10 md:px-36 my-10'>
      <h2 className='font-bold text-2xl'>
        Enter some more details about your listing
      </h2>

      <Formik
        enableReinitialize={true}
        initialValues={{
          type: listingData?.type ?? "",
          propertytype: listingData?.propertytype ?? "",
          bedroom: listingData?.bedroom ?? "",
          bathroom: listingData?.bathroom ?? "",
          builtln: listingData?.builtln ?? "",
          parking: listingData?.parking ?? "",
          lotsize: listingData?.lotsize ?? "",
          area: listingData?.area ?? "",
          price: listingData?.price ?? "",
          hoa: listingData?.hoa ?? "",
          description: listingData?.description ?? "",
          profileImage: user?.imageUrl ?? "",
          fullName: user?.fullName ?? "",
        }}
        onSubmit={onSubmitHandler}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div className='p-8 rounded-lg shadow-md mt-5'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                <div className='flex flex-col gap-2'>
                  <h2 className='font-bold text-lg text-slate-500'>Rent or Sale</h2>
                  <RadioGroup
                    value={values.type}
                    onValueChange={(value) => setFieldValue("type", value)}
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

                <div className='flex flex-col gap-2'>
                  <h2 className='font-bold text-lg text-slate-500'>Property Type</h2>
                  <Select
                    value={values.propertytype}
                    onValueChange={(value) => setFieldValue("propertytype", value)}
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

                <div className='md:col-span-3'>
                  <h2 className='font-bold text-gray-500'>Description</h2>
                  <Textarea name="description" value={values.description} onChange={handleChange} />
                </div>

                <div className='md:col-span-3'>
                  <h2 className='font-bold text-gray-500'>Upload Property Images</h2>
                  <FileUploader
                    setImages={setImages}
                    imageList={listingData?.listingImages || []}
                  />
                </div>

                <div className='md:col-span-3 flex justify-end gap-4 mt-4'>
                  <Button
                    disabled={loader}
                    variant="outline"
                    className="font-bold text-primary border-primary"
                    type="submit"
                  >
                    {loader ? <Loader className='animate-spin' /> : "Save"}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={loader} className="font-bold" type="button">
                        {loader ? <Loader className='animate-spin' /> : "Save & Publish"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Do you really want to publish the listing?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={publishBtnHandler}>
                          {loader ? <Loader className='animate-spin' /> : "Yes, Publish"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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