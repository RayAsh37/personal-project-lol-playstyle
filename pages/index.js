// import { createClient } from 'next-sanity' //remove this later
import { useEffect, useState } from 'react'
import Champion from '../components/Champion'
import Search from '../components/Search'

// const client = createClient({
//   projectId: 'x62bwg2o',
//   dataset: 'production',
//   apiVersion: '2022-10-18',
//   useCdn: false,
// })

// export async function getStaticProps() {
//   const animals = await client.fetch(`*[_type == "animal"]`)
//   return {
//     props: {
//       animals,
//     },
//   }
// }

export async function getStaticProps() {
  //fetch version
  const versions = await fetch(
    'https://ddragon.leagueoflegends.com/api/versions.json'
  ).then((res) => res.json())
  const version = versions[0]

  //fetch champion list
  const champs = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version.toString()}/data/en_US/champion.json`
  ).then((res) => res.json())
  const champions = champs.data

  return {
    props: {
      champions,
    },
  }
}

export default function Home({ champions }) {
  const originalChampKeys = Object.keys(champions) //get keys of all champs as array

  const [displayChamps, setDisplayChamps] = useState(originalChampKeys)
  const [searchedChamp, setSearchedChamp] = useState('')
  // if (searchedChamp === '') {
  //   setDisplayChamps(originalChampKeys)
  // } else {
  //   const newChampKeys = originalChampKeys.filter((champKey) => {
  //     return champKey.toLowerCase().includes(searchedChamp)
  //   })
  //   setSearchedChamp(newChampKeys)
  // }

  useEffect(() => {
    if (searchedChamp === '') {
      setDisplayChamps(originalChampKeys)
    } else {
      const newChampKeys = originalChampKeys.filter((champKey) => {
        return champKey.toLowerCase().includes(searchedChamp)
      })
      setDisplayChamps(newChampKeys)
    }
  }, [searchedChamp])

  if (!champions)
    return (
      <>
        <Search />
        <p>Loadding...</p>
      </>
    )

  if (champions)
    return (
      <div>
        {/* <div>
            {animals.length > 0 && (
              <ul>
                {animals.map((animal) => (
                  <li key={animal._id}>{animal?.name}</li>
                ))}
              </ul>
            )}
          </div> */}
        <br />
        <hr />
        <Search setSearchedChamp={setSearchedChamp} />

        <hr />
        <div className='flex flex-initial flex-row flex-wrap justify-around'>
          {displayChamps.map((champion) => {
            return (
              <div key={champions[champion].id}>
                <Champion champion={champions[champion]} />
              </div>
            )
          })}
        </div>
        <hr />
        <br />
      </div>
    )
}
