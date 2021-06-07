import RNFetchBlob from 'rn-fetch-blob';
import { btoa } from 'abab';

const checksum = async ({ path }: { path: string }) => {
  const md5 = await RNFetchBlob.fs.hash(path, 'md5');
  const hexArray = md5.replace(/\r|\n/g, "")
    .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
    .replace(/ +$/, "")
    .split(" ")
    .map(it => parseInt(it));

  const byteString = String.fromCharCode(...hexArray);

  return btoa(byteString);
}

export default checksum;
