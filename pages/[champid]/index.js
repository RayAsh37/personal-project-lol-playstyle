import Image from 'next/image'
import Link from 'next/link'

export async function getServerSideProps(context) {
  const champidSS = context.params.champid
  const dataChampInfo = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/12.19.1/data/en_US/champion/${champidSS}.json`
  ).then((res) => res.json())

  const championInfo = dataChampInfo.data[champidSS]

  return {
    props: {
      championInfo,
    },
  }
}

const myLoader = ({ src }) => {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${src}_0.jpg`
}

export default function IndividualChamp({ championInfo }) {
  return (
    <div className='h-screen flex flex-col justify-start align-middle items-center'>
      <div>Hello {championInfo.name}</div>
      <div>{championInfo.title}</div>
      <Image
        loader={myLoader}
        src={championInfo.id}
        alt='champion image'
        layout='fixed'
        width={1013 / 2} //original
        height={598 / 2} //original
        className='rounded-lg'
        // priority
        // quality={1}
      />
      <br />
      <Link href={'/'}>
        <a href='' className='hover:text-slate-300'>
          Return to all champs
        </a>
      </Link>
    </div>
  )
}
