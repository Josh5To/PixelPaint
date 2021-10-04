import { pinFile } from "../../util/minting";

export default async (req, res) => {
    //console.log(req)
    console.log("Request print: ")

    if (req.method == 'POST') {
        console.log(`Get request: ${res.statusCode} ${req.statusMessage} ${req.readable}`)
        //console.log(req.body)
        console.log("Request print: ")
        //let recievedFormData = req.body
       // console.log(req.body)
       // let resp = await pinFile(req.body)
        res.status(200).send("Hello")
        
    }


    if (req.method == 'GET') {
        //console.log(`Get request: ${res.statusCode} ${req.statusMessage} ${req.readable}`)
        res.status(200).send("yes")
    }

}