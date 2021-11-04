import { env } from 'process'
import pinataSDK from '@pinata/sdk'
import FormData from 'form-data'
import fs from 'fs'
import { Buffer, Blob } from 'buffer';
import { Readable } from 'stream'


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

export async function pinFile(buffer) {
    let apiEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    let fileData = new FormData()
    //Convert data to readable JSON
    let recievedJSON = JSON.parse(buffer.toString())
    //Convert image data back to uint8array
    let uintArray = Uint8Array.from(recievedJSON.image.split(','))
    //Create buffer from uint8 array
    let imageBuffer = Buffer.from(uintArray)
    //create Blob from buffer
    let imageBlob = new Blob(uintArray, {type: 'image/png'})

    //define variable for formdata to load all info to be pinned.
   // const fileData = new FormData()

    //let stream = imageBlob.stream()
    //let rstream = Readable.from(stream)
    //rstream.pause()

    console.log(imageBuffer)

   // fileData.append('file', rstream)

    fileData.append('file', fs.createReadStream(imageBuffer))

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    fileData.append('pinataMetadata', metadata);

    //console.log(fileData)

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: fileData,
        headers: {
                'Content-Type': `multipart/form-data; boundary=${fileData._boundary}`,
                pinata_api_key: pinataAPIKey,
                pinata_secret_api_key: pinataAPISecret
        }
    });
    console.log(response)
    if(response.ok) {
        return response.text()
    }
    else {
        return new Error("Response from API not good.")
    }
} 