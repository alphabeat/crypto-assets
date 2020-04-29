import Head from 'next/head'
import '../../styles/styles.sass'

function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>CrytoAssets</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      { children }
    </div>
  )
}

export default Layout