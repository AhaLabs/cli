import pinataSDK from '@pinata/sdk';
import { createReadStream } from 'fs';

function getSDK() {
  const key = process.env.PINATA_API_KEY;
  const secret = process.env.PINATA_API_SECRET;
  if (!(key && secret)) {
    throw new Error("Missing pinata api keys: PINATA_API_KEY, PINATA_API_SECRET");
  }
  return pinataSDK(key, secret);
}


export async function uploadFile(file: string): Promise<string> {
  const pinata = getSDK();
  const fileStream = createReadStream(file);
  const res = await pinata.pinFileToIPFS(fileStream, { pinataOptions: { cidVersion: 1 } });
  return res.IpfsHash;
}

export async function uploadJSON(json: any): Promise<string> {
  const pinata = getSDK();
  const res = await pinata.pinJSONToIPFS(json, { pinataOptions: { cidVersion: 1 } });
  return res.IpfsHash;
}

export async function uploadDirectory(dir: string): Promise<string> {
  const pinata = getSDK();
  const res = await pinata.pinFromFS(dir, { pinataOptions: { cidVersion: 1, wrapWithDirectory: false } });
  return res.IpfsHash;
}
