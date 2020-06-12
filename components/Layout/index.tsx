import Head from 'next/head'
import '../../styles/styles.sass'

interface LayoutProps {
  hasHero: boolean;
  children: JSX.Element;
}

function Layout(props: LayoutProps) {
  const { hasHero, children } = props

  return (
    <div className="Layout">
      <Head>
        <title>CrytoAssets</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {
        hasHero
          ? (
            <header className="hero is-link is-small has-text-centered">
              <div className="hero-body">
                <div className="container">
                  <h1 className="title">
                    Crypto Assets
                  </h1>
                  <h2 className="subtitle">
                    Follow-up of your assets
                  </h2>
                </div>
              </div>
            </header>
          )
          : null
      }
      <main>
        { children }
      </main>
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