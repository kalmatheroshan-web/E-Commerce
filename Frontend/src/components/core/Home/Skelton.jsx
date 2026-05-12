import React from 'react'

export default function Skelton() {
    return (
        <div className='flex flex-col gap-2'>
            <div className="bg-[#ccc] w-[200px] h-[250px] rounded-xl"></div>
            <div className="bg-[#ccc] w-[200px] h-[10px] rounded-md"></div>
            <div className="bg-[#ccc] w-[200px] h-[20px] rounded-md"></div>
            <div className="bg-[#ccc] w-[200px] h-[8px] rounded-md"></div>
        </div>
    )
}
