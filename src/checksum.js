import RNFetchBlob from 'rn-fetch-blob';
import { btoa } from 'abab';

export default async ({ path }) => {
  const md5 = await RNFetchBlob.fs.hash(path, 'md5');
  const hexArray = md5.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ");
  const byteString = String.fromCharCode.apply(null, hexArray);

  return btoa(byteString);
}
