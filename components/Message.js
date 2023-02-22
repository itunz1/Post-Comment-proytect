import React, { Children } from 'react'

export default function Message({children, avatar, username, description}) {
  return (
    <div className='p-8 my-6 bg-white border-b-2 rounded-lg shadow-lg'>
        <div className='flex items-center gap-3'>
            <img src={avatar} className='w-10 rounded-full'/>
            <h2>{username}</h2>
        </div>
        <div className='py-4'>
            <p>{description}</p>
        </div>
        {children}
    </div>
  )
}
