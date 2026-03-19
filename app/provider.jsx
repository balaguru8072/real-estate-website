import React from 'react'
import Header from './_component/Header'

function Provider({ children }) {
  return (
    <div>
      <Header></Header>
      <div className='mt-35'>
        {children}
      </div>
    </div>
  )
}

export default Provider
