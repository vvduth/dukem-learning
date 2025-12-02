import React from 'react'

const Spiner = () => {
  return (
    <div className="flex items-center justify-center h-12 w-12">
        <span className="relative flex h-10 w-10">
            <span className="animate-spin absolute inline-flex h-full w-full rounded-full bg-linear-to-tr
             from-blue-500 via-purple-500 to-pink-500 opacity-30"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 bg-white"></span>
        </span>
    </div>
  )
}

export default Spiner