const STABLE_COINS = ['USDT', 'USDC', 'BUSD', 'DAI', 'rUSD']

const isStableCoin = (coin: string) => STABLE_COINS.includes(coin)

export default isStableCoin