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
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>CryptoAssets</strong> by Julien Kilo.
            The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout