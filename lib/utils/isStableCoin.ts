const STABLE_COINS = ['USDT', 'USDC', 'BUSD', 'DAI']

const isStableCoin = (coin: string) => STABLE_COINS.includes(coin)

export default isStableCoin