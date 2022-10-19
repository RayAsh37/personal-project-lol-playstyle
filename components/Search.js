import React from 'react'

const Search = ({ setSearchedChamp }) => {
  const changeHandler = (e) => {
    setSearchedChamp(e.target.value)
  }
  return (
    <div className='h-full'>
      <input
        type='text'
        onChange={(e) => changeHandler(e)}
        placeholder='Enter Champion Name'
        className='dark:bg-black w-full h-full text-3xl hover:bg-slate-800 text-center'
      />
    </div>
  )
}

export default Search
