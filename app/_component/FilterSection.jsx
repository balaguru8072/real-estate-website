import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Bath, Bed, BedDouble, CarFront } from 'lucide-react'

function FilterSection({ setBedCount, setBathCount, setParkingCount, setHomeType }) {
    return (
        <div className='px-3 py-2 grid grid-cols-2 md:flex gap-2'>
            <Select onValueChange={setBedCount}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bed" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="2">
                            <h2 className='flex gap-2'>
                                <BedDouble className='h-5 w-5 text-primary' /> 2+</h2>
                        </SelectItem>
                        <SelectItem value="3">
                            <h2 className='flex gap-2'>
                                <BedDouble className='h-5 w-5 text-primary' /> 3+</h2>
                        </SelectItem>
                        <SelectItem value="4">
                            <h2 className='flex gap-2'>
                                <BedDouble className='h-5 w-5 text-primary' /> 4+</h2>
                        </SelectItem>
                        <SelectItem value="5">
                            <h2 className='flex gap-2'>
                                <BedDouble className='h-5 w-5 text-primary' /> 5+</h2>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select onValueChange={setBathCount}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bath" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="2">
                            <h2 className='flex gap-2'>
                                <Bath className='h-5 w-5 text-primary' /> 2+</h2>
                        </SelectItem>
                        <SelectItem value="3">
                            <h2 className='flex gap-2'>
                                <Bath className='h-5 w-5 text-primary' /> 3+</h2>
                        </SelectItem>
                        <SelectItem value="4">
                            <h2 className='flex gap-2'>
                                <Bath className='h-5 w-5 text-primary' /> 4+</h2>
                        </SelectItem>
                        <SelectItem value="5">
                            <h2 className='flex gap-2'>
                                <Bath className='h-5 w-5 text-primary' /> 5+</h2>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select onValueChange={setParkingCount}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Parking" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="2">
                            <h2 className='flex gap-2'>
                                <CarFront className='h-5 w-5 text-primary' /> 2+</h2>
                        </SelectItem>
                        <SelectItem value="3">
                            <h2 className='flex gap-2'>
                                <CarFront className='h-5 w-5 text-primary' /> 3+</h2>
                        </SelectItem>

                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select onValueChange={()=> value == 'All' ? setHomeType(null) : setHomeType}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Home Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="All">
                            All Types
                        </SelectItem>
                        <SelectItem value="Single Family Home">
                            Single Family Home
                        </SelectItem>

                        <SelectItem value="Town House">
                            Town House
                        </SelectItem>
                        <SelectItem value="Condo">
                            Condo
                        </SelectItem>

                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default FilterSection