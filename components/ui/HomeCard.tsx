import Image from 'next/image'
import React from 'react'

const HomeCard = () => {
  return (
    <div className="bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer" >
      <div className="flex items-center justify-center glassmorphism size-12 rounded-[10px]">
            <Image
                src="/icons/add-meeting.svg"
                width={27}
                height={27}
                alt="meeting"
            />
        </div>
            <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
                New Meeting
            </h1>
            <p className="text-lg font-normal">Start an instant meeting</p>
            </div>
      </div>
  )
}

export default HomeCard
