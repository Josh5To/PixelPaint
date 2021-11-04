import { test, pinFile } from "../../util/minting";
import { createFileID } from "../../work";
import fs from 'fs'
import { BlurOffRounded } from "@material-ui/icons";
import { StringDecoder } from "string_decoder"
const Base64Decoder = new StringDecoder('base64')


export default async (req, res) => {
    //console.log(req)
    req.on('data', (chunk) => {
        // There is some data to read now.
        console.log("Data:")

        //console.log(JSON.parse(Buffer.from(chunked).toString('utf8')))
    });

    if (req.method == 'POST') {
        //Create file to hold png
        let fileID = createFileID() + ".png"

        //Start read request info
        req.on('data', (chunk) => {
            console.log(`Received ${chunk.length} bytes of data.`)
            test()
            pinFile(chunk)
        });
        req.on('end', async () => {
            //console.log('There will be no more data.');

            console.log("Done writing data.")
           /* fs.realpath(fileID, async (err, resPath) => {
                try {
                    pinFile(resPath).then((pinRes) => {
                        if (JSON.parse(pinRes).IpfsHash.length > 5) {
                            res.status(200).send(pinRes)
                        }
                    })
                }
                catch(e) {
                    console.log("Error in pinning file: " + e)
                    res.status(200).send(false)
                }
            })*/
        });
        res.status(200).send(false)
    }


    if (req.method == 'GET') {
        //console.log(`Get request: ${res.statusCode} ${req.statusMessage} ${req.readable}`)
        res.status(200).send("yes")
    }
}

export const config = {
    api: {
      bodyParser: false,
    },
  }
  