/*

    This is a big ol file that holds most of the backend work done.


*/
import { ethers } from "ethers";
import { env } from 'process'
import QRCode from 'qrcode'
import FormData from 'form-data'

const pinataAPIKey = env.PINATA_APIKEY
const pinataAPISecret = env.PINATA_APISECRET
const mongoDbUri = env.MONGODB_URI

export async function connectWallet() {
    //define variable that holds nonce for signing.
    let nonce

    //Get metamask info
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //Get signer
    const signer = provider.getSigner()

    //Get address from metamask.
    let getWalletAddress = await signer.getAddress()

    console.log(getWalletAddress)
    /*  

        Check if address exists in db so far. If it does, request will return either:
        New nonce that is generated after last authentication, or fresh nonce from newly created db entry.
        Nesting these within (.then) functions so nothing occurs when it's not supposed to.

    */
    authApiCall("?checkaddress=" + getWalletAddress).then(async nonceObj => {
        nonce = JSON.parse(nonceObj).nonce
        //save as variable to keep susinct throughout operations (validations later)
        let message = "To sign in, sign this one time nonce: " + nonce
        //Prompt user to sign message, get hex of signed message, then send publicAddress, message, and signed message to db.
        let signature = await signer.signMessage(message);
        
        let signedObj = {
            purpose: "validation",
            walletAddress: getWalletAddress,
            message: message,
            signedMessage: signature,
        }
        sendSignedMessageAuth(signedObj).then(x => {
            //TODO
            //Eventually this should recieve a JWT. When I go and encrypt everything.
            console.log(x)
        })
    })
}

//generates Qr code, returns QR code canvas obj
export function generateQrCode() {
    var strBytes = new Uint8ClampedArray("google.com")
    var segs = [
        { data: strBytes, mode: 'byte' },
        //{ data: '0123456', mode: 'numeric' }
    ]
    let r = QRCode.toCanvas([segs])
        .then(r => {
            console.log(r)
            return r
        })
        .catch((err) => {
            console.log(err)
        })
    return r
}

//Gets canvas, creates blob, converts to stream, sends to api for pinning.
export async function pinImage(canvas) {
    
    const data = await new Promise((resolve, reject) => { 
        //canv.getImageData(can.)
        let canv = canvas.getContext('2d')
        let canvID = canv.getImageData(0, 0, 500, 500)
        let canvDataObj = {
            data: canvID.data,
            height: canvID.height,
            width: canvID.width
        }
        return resolve(canvID)
    })
    console.log(data.data.buffer)
    let pinApiResponse = await imageDataToMintAPI(data.data.buffer)
    console.log(pinApiResponse)
}


//Generates image&url from Canvas obj
//Sent from getData
//@arg canvas is a sent canvas.current
export async function getObjURL(canvas) {
    let img = new Image()
    let canv = canvas

    return new Promise((resolve, reject) => { 
        canv.toBlob(async (blob)=> {
            let url = URL.createObjectURL(blob)
            img.src = url
            // console.log("data length: " + canvas.length)
            console.log("url2: " + img.src)
            return resolve(img)
        })
    })
}

export async function getData(canvas) {
    let imgData
    let x = getObjURL(canvas)
    .then(qr => {
        imgData = qr
        console.log(imgData)
    })
    .catch(err => {
        console.log(err)
    })
}


export function getQrCode() {
    let qrData
    let qr = generateQrCode()
    .then(qr => {
        qrData = getObjURL(qr)
    })
    .catch(err => {
        console.log(err)
    })
    console.log(qrData)
}



export const rgbToHEX = (r, g ,b ,a) => {
    let rString = r.toString(16)
    let gString = g.toString(16)
    let bString = b.toString(16)
    //a = Math.round(a * 255).toString(16)

    if (rString.length ==1) {
        rString = "0" + rString
    }
    if (gString.length ==1) {
        gString = "0" + gString
    }
    if (bString.length ==1) {
        bString = "0" + bString
    }
    /*if (a.length ==1) {
        a = "0" + a
    }*/

    return "#" + rString + gString + bString// + a
}

export const hexToRGB = (h) => {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length == 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
  
    // 6 digits
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }
    
    return [r, g, b];
}


//Argument is JSON string of ImageArray data raw, height, and width of canvas.
async function imageDataToMintAPI(idObjectString) {
    //let idString = JSON.stringify(idObjectString)
    let idString = idObjectString

    const response = await fetch('/api/mint', {
        method: 'POST',
        body: idString,
        headers: {
          //'Content-Type': 'application/json',
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

async function authApiCall(query) {
    const url = '/api/auth';

    let call = url + query

    const response = await fetch(call, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    });
    if(response.ok) {
        return response.text()
    }
    else {
        return new Error("Response from API not good.")
    }
}

/*

    Send obj as POST req to /api/auth. This should contain obj of:
    address, signedMessage

*/
async function sendSignedMessageAuth(message) {
    let encodeObj = JSON.stringify(message)

    const response = await fetch('/api/auth', {
        method: 'POST',
        body: encodeObj,
        headers: {
          'Content-Type': 'application/json',
        }
    });
    if(response.ok) {
        return response.text()
    }
    else {
        return new Error("Response from API not good.")
    } 
}