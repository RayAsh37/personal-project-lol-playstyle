import { createClient } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { useEffect, useState } from 'react'

export async function getServerSideProps(context) {
  const champidSS = context.params.champid
  const dataChampInfo = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/12.19.1/data/en_US/champion/${champidSS}.json`
  ).then((res) => res.json())

  //get champion info COMPLETE
  const championInfo = dataChampInfo.data[champidSS]

  const TOKEN = process.env.NEXT_PUBLIC_TOKEN

  // const client = createClient({
  //   projectId: 'x62bwg2o',
  //   dataset: 'production',
  //   apiVersion: '2022-10-18',
  //   useCdn: false,
  // })

  const client = createClient({
    projectId: 'x62bwg2o',
    dataset: 'production',
    apiVersion: '2022-10-18',
    useCdn: false,
    token: TOKEN,
  })

  //query for comments
  const getComments = await client.fetch(
    `*[_type == "comment"  && championName == "${champidSS}"]`
  )

  return {
    props: {
      championInfo,
      getComments,
      TOKEN,
    },
  }
}

//image component loader function
const myLoader = ({ src }) => {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${src}_0.jpg`
}

export default function IndividualChamp({ championInfo, getComments, TOKEN }) {
  //take the time + date to create a new ID
  const today = new Date()
  const date =
    today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate()
  const time =
    today.getHours() + '' + today.getMinutes() + '' + today.getSeconds()
  const dateTime = date + '' + time

  //get the parameter from the query
  const router = useRouter()
  const champIdForDB = router.query.champid

  //semi-controlled input
  const [comment, setComment] = useState('')
  const [userID, setUserID] = useState('')
  const [allComments, setAllComments] = useState(getComments)

  //create a Sanity client
  const client = createClient({
    projectId: 'x62bwg2o',
    dataset: 'production',
    apiVersion: '2022-10-18',
    useCdn: false,
    token: TOKEN,
  })

  //add a comment
  const handleSubmit = (e) => {
    e.preventDefault()
    const doc = {
      _id: dateTime,
      _type: 'comment',
      championName: champIdForDB,
      comment: comment,
      userId: userID,
    }

    //create new comment
    client
      .createIfNotExists(doc)
      .then((res) => {
        console.log(res, 'comment was created (or was already present)')
      })
      .then(() => {
        //update the comment list with new comments
        client
          .fetch(`*[_type == "comment"  && championName == "${champIdForDB}"]`)
          .then((res) => {
            setAllComments(res)
          })
      })
  }

  //delete Comment
  const deleteItem = (value) => {
    client
      .delete(value)
      .then(() => {
        console.log('Comment deleted')
      })
      .then(() => {
        //update the comments list after deleting
        client
          .fetch(`*[_type == "comment"  && championName == "${champIdForDB}"]`)
          .then((res) => {
            setAllComments(res)
          })
      })
      .catch((err) => {
        console.error('Delete failed: ', err.message)
      })
  }

  //take comment input
  const handleChange = (value) => {
    setComment(value)
  }

  //take UserID input
  const handleChangeUserID = (value) => {
    setUserID(value)
  }

  return (
    <div className='flex flex-col justify-start align-middle items-center'>
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
        priority
        // quality={1}
      />
      <br />
      <form
        className='flex flex-col justify-center'
        onSubmit={(e) => handleSubmit(e)}
      >
        <label htmlFor='userId'>User Id: </label>
        <input
          type='text'
          className='text-black'
          onChange={(e) => handleChangeUserID(e.target.value)}
        ></input>
        <label htmlFor='Comment'>Comment: </label>
        <textarea
          type='text'
          // value={comment}
          onChange={(e) => handleChange(e.target.value)}
          rows='9'
          cols='50'
          className='text-black'
        ></textarea>
        <br />
        <button
          type='submit'
          className='bg-slate-800 hover:bg-slate-500 h-[3rem] rounded-lg'
        >
          Post Comment
        </button>
      </form>
      <br />
      <h2 className='font-bold'>Comments:</h2>
      <ul className='list-disc flex flex-col flex-start w-[25rem]'>
        {allComments.map((singleComment) => {
          return (
            <li key={singleComment._id}>
              <hr />
              <p>{singleComment.userId}: </p>
              <p>{singleComment.comment}</p>
              <button
                onClick={() => {
                  deleteItem(singleComment._id)
                }}
                className='bg-red-600 w-[4rem] rounded-lg'
              >
                Delete
              </button>
              <hr />
            </li>
          )
        })}
      </ul>
      <br />
      <Link href={'/'}>
        <a href='' className='hover:text-slate-300'>
          Return to all champs
        </a>
      </Link>
    </div>
  )
}
