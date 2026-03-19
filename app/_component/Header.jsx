'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
    const path = usePathname();

    useEffect(() => {
        console.log(path);
    }, [])
    return (
        <div className='p-6 px-10 flex justify-between items-center shadow-sm fixed top-0 w-full z-0 bg-white z-50'>
            <div className='flex gap-12 items-center'>
                <Image src={'/logo.svg'} alt="Logo" width={150} height={150} />
                <ul className='hidden md:flex gap-10'>
                    <Link href="/"><li className={`'hover:text-primary font-medium text-sm cursor-pointer' ${path === '/' ? 'text-primary' : ''}`}>For Sale</li></Link>
                    <Link href={"/for-rent"}><li className={`'hover:text-primary font-medium text-sm cursor-pointer' ${path === '/for-rent' ? 'text-primary' : ''}`}>For Rent</li></Link>
                    <Link href={"/agent-finder"}><li className={`'hover:text-primary font-medium text-sm cursor-pointer' ${path === '/agent-finder' ? 'text-primary' : ''}`}>Agent Finder</li></Link>
                </ul>
            </div>
            <div className='flex gap-2'>
                <Button className='flex gap-2'> <Plus className='h-5 w-5' /> Post your AD</Button>
                <Button variant="outline"> Login</Button>
            </div>
        </div>
    )
}

export default Header
