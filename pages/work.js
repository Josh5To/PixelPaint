import QRCode from 'qrcode'


function calcWavedec(canv) {  
    let imgData = canv.getContext('2d').getImageData(0, 0, 500, 500).data

    getObjURL(canv)
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



//Generates image&url from Canvas obj
export function getObjURL(canvas) {
    var img = new Image()
    console.log(canvas)
    canvas.toBlob((blob)=> {
        let url = URL.createObjectURL(blob)
        img.src = url
       // console.log("data length: " + canvas.length)
        console.log("url: " + url)
    })
    return img
}


export function getData(canvas) {
    let qr = generateQrCode()
        .then(qr => {
            getObjURL(qr)
        })
        .catch(err => {
            console.log(err)
        })
    
    let img = getObjURL(canvas)
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