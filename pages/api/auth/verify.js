import { validateUser } from "../../../util/mongodb";

export default async (req, res) => {

    if (req.method == 'POST') {
        const { db } = await connectToDatabase();

        const movies = await db

        .collection("login")

        .find({})

        .toArray();

        res.status(200).json(movies);
    }

    if (req.method == 'GET') {
        console.log(`Get request: ${res.statusCode} ${req.statusMessage} ${req.readable}`)

        if(req.query.publicKey) {
            const valid = await validateUser(req.query)
            res.status(200).send(valid);
        }

        if(true) {
            res.status(200).send("hey")
        }
    
    }

};