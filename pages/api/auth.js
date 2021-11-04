import { connectToDatabase, doesUserExist, validateUser} from "../../util/mongodb";

export default async (req, res) => {

    if (req.method == 'POST') {
        //console.log(`Get request: ${res.statusCode} ${req.statusMessage} ${req.readable}`)
        if(req.body.purpose === "validation") {
            console.log("Request print: ")
            console.log(req)
            let validate = await validateUser(req.body)
            res.status(200).send(validate)
        }
    }

    if (req.method == 'GET') {
       // console.log(`Get request: ${res.statusCode} ${req.statusMessage} ${req.readable}`)
        //console.log(req.query)
        if(req.query.address) {
            const isUser = await doesUserExist(req.query.address)
            res.status(200).send(isUser);
        }
        if(req.query.checkaddress) {
            const isUser = await doesUserExist(req.query.checkaddress)
            res.status(200).send({nonce: isUser});
        }

        if(req.query.test) {
            res.status(200).send('x');
        }
    
    }

};