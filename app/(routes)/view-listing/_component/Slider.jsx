"use client"

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'

function Slider({ imageList, loading }) {
  console.log(imageList)

  if (loading) {
    return (
      <div className='w-full h-[300px] bg-slate-200 animate-pulse rounded-lg'></div>
    )
  }

  if (!imageList || imageList.length === 0) {
    return (
      <div className='w-full h-[300px] bg-slate-100 rounded-lg flex items-center justify-center'>
        <p>No images available</p>
      </div>
    )
  }

  return (
    <div className='mt-5'>
      <Carousel className="">
        <CarouselContent>
          {imageList.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[100px] md:h-[400px]">
                <Image
                  src={item.url}
                  width={800}
                  height={350}
                  alt={`listing-image-${index}`}
                  className='rounded-xl object-cover h-[300px] w-full'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default Slider