import React from 'react'

export default function Skelton() {
    return (
        <div className="flex flex-col gap-3 w-full animate-pulse">
            <div className="bg-gray-200 w-full h-[200px] sm:h-[250px] lg:h-[280px] rounded-2xl"></div>

            <div className="space-y-2 px-1">
                <div className="bg-gray-200 w-1/3 h-3 rounded-md"></div>
                <div className="bg-gray-200 w-full h-5 rounded-md"></div>
                <div className="bg-gray-200 w-2/3 h-3 rounded-md"></div>
            </div>
        </div>
    )
}