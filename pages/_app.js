import '../styles/globals.css'

// slate-800
function MyApp({ Component, pageProps }) {
  return (
    <div className='dark:bg-black dark:text-white'>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
