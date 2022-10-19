import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const myLoader = ({ src }) => {
  return `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${src}_0.jpg`
  // // return `http://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/${src}.png`
  // return `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${src}_0.jpg`
}

const Champion = ({ champion }) => {
  const [championInfo, setChampionInfo] = useState('')

  //get specific ChampionInfo
  useEffect(() => {
    const fetcherChampionInfo = async () => {
      const dataChampInfo = await fetch(
        `http://ddragon.leagueoflegends.com/cdn/12.19.1/data/en_US/champion/${champion.id}.json`
      ).then((res) => res.json())
      setChampionInfo(dataChampInfo.data[champion.id])
    }
    fetcherChampionInfo()
  }, [champion])

  if (championInfo)
    return (
      <Link
        href={{
          pathname: `/${championInfo.id}`,
        }}
      >
        <a href=''>
          <br />
          <div className='min-w-[24rem] min-h-fit hover:bg-slate-800'>
            <h1 className='font-bold'>{championInfo.name}</h1>
            <h2 className='text-slate-400 font-normal italic'>
              {championInfo.title}
            </h2>
            <Image
              loader={myLoader}
              src={championInfo.id}
              alt='champion image'
              layout='responsive'
              width={1013} //original
              height={598} //original
              className='rounded-lg'
              priority
              quality={1}
            />
          </div>
          <hr />
        </a>
      </Link>
    )
}

export default Champion
