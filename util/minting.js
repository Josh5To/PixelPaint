import { env } from 'process'
import pinataSDK from '@pinata/sdk'
import FormData from 'form-data'

const pinata = pinataSDK(env.PINATA_APIKEY, env.PINATA_APISECRET);
const pinataAPIKey = env.PINATA_APIKEY
const pinataAPISecret = env.PINATA_APISECRET

export function test() {
    pinata.testAuthentication().then((result) => {
        //handle successful authentication here
        console.log(result);
        return result
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}

export async function pinFile(imageDataObjString) {
   /* console.log(await imageDataObjString.locked)
    const idData = new Uint8ClampedArray(await imageDataObjString)
  //  const imageDataReformed
    console.log(idData)
    const rebuildImageData = new ImageData(idData, 500, 500)
    //console.log(rebuildImageData)

    //define variable for formdata to load all info to be pinned.
    const fileData = new FormData()*/

    fileData.append('file', blobStream)

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    fileData.append('pinataMetadata', metadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        body: fileData,
        headers: {
                'Content-Type': `multipart/form-data; boundary=${fileData._boundary}`,
                'pinata_api_key': pinataAPIKey,
                'pinata_secret_api_key': pinataAPISecret
        }
    });
    if(response.ok) {
        return response.text()
    }
    else {
        return new Error("Response from API not good.")
    } 

} 