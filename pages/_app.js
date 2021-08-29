import { SWRConfig } from 'swr'

import '../styles/styles.sass'

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}
