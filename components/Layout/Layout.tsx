import Head from 'next/head'
import { useCallback, useState } from 'react'

import { CurrencyProvider } from '../../context/currency'
import Currency from '../../models/currency'

import Switch from '../Switch/Switch'

type LayoutProps = {
  hasHero: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ hasHero, children }) => {
  const [currency, setCurrency] = useState<Currency>('EUR')

  const switchCurrency = useCallback(
    () => setCurrency(currency === 'EUR' ? 'USD' : 'EUR'),
    [currency]
  )

  return (
    <CurrencyProvider currency={currency}>
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
                    <Switch checked={currency === 'EUR'} onSwitch={switchCurrency} />
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
    </CurrencyProvider>
  )
}

export default Layout
