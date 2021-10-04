import { MongoClient } from 'mongodb';
import { ethers } from "ethers";
import { env } from 'process'

const MONGODB_URI = env.MONGODB_URI;
const MONGODB_DB = env.MONGODB_DB;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    // check the cached.
    if (cachedClient && cachedDb) {
        // load from cache
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    // set the connection options
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    // Connect to cluster
    let client = new MongoClient(MONGODB_URI, opts);
    await client.connect();
    let db = client.db(MONGODB_DB);

    // set cache
    cachedClient = client;
    cachedDb = db;

    return {
        client: cachedClient,
        db: cachedDb,
    };
}

//Checks if public key is in db already.
export async function queryUser(walletAddress) {
    let client
    let db

    //Get db info. Function connectToDatabase will check if cache is available.
    let getDb = await connectToDatabase()
    client = await getDb.client
    db = getDb.db
    
    let query = {walletAddress : walletAddress}
    let res = await db.collection("login").findOne(query)
    if(await res == null) {
        return false
    }
    if(await res.walletAddress == walletAddress) {
        return await res
    }
}

//adds walletAddress to db, generates FRESH nonce to pair it with.
export async function newUser(walletAddress) {
    let client
    let db

    let getDb = await connectToDatabase()
    client = getDb.client
    db = getDb.db
    let collection = db.collection("login")

    let newUser = {
        walletAddress: walletAddress,
        nonce: newNonce()
    }
    try {
        await collection.insertOne(newUser)
    }
    catch(e) {
        console.log(e)
    }
    finally {
        return(await queryUser(walletAddress))
    }
}

//Validate walletAddress can be extracted from signedmessage and nonce.
export async function validateUser(signedObj) {
    //define variable to hold false boolean, until user is validated.
    let valid = false
    let client
    let db
    //Retreive address from signed message and message literal for validation.
    let retrievedAddress = ethers.utils.verifyMessage( signedObj.message , signedObj.signedMessage )
    //Return promise to make sure this is all done first.
    return new Promise(async (resolve, reject) => {
        //TODO: validate etheruem address is legit.
        if(retrievedAddress === signedObj.walletAddress) {
            let getDb = await connectToDatabase()
            client = getDb.client
            db = getDb.db
            let collection = db.collection("login")

            //generate new nonce and update db with it for next signing.
            let nonce = newNonce()

            //Update db entry of user with new nonce.
            collection.updateOne(
                {walletAddress: retrievedAddress},
                {
                    $set: {nonce: nonce}
                }
            ).then(resp => {
                if(resp.acknowledged) {
                    valid = true
                    return resolve(valid)
                    //Wait for this part here to make "valid" true. This way we know user is good, and db was updated.
                }
                else {
                    return reject(new Error("Validation failed."))
                }
            })
        }
    })
}

//Checks if user is in database, if found returns nonce, if not found, adds to db and creates nonce.
export async function doesUserExist(walletAddress) {
    let isUser = await queryUser(walletAddress)

    if(await isUser.walletAddress == walletAddress) {
        console.log("hey")
        return isUser.nonce
    }
    else if(!await isUser) {
        let addedUser = newUser(walletAddress)
        console.log(addedUser)
        if(addedUser) {
            console.log("added")
            return addedUser.nonce
        }
    }
}

function newNonce() {
    return Math.floor(Math.random() * 1000000)
}

