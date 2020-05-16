const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ID_LENGTH = 8;

export default () => {
  let rtn = '';

  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }

  return rtn
}