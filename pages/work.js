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