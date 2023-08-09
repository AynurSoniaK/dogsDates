const express = require('express')
const { MongoClient } = require("mongodb")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()
const uri = process.env.URI
const PORT = process.env.API_PORT


const app = express()

if (PORT) {
    app.listen(PORT)
}

app.use(cors());

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
  })

app.post("/signin", async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const { email, password } = req.body

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')
        const isExistingUser = await users.findOne({ email })
        if (isExistingUser) {
            const match = await bcrypt.compare(password, isExistingUser.password)
            if (match) {
                const userToken = jwt.sign(isExistingUser, email, { expiresIn: "24h" })
                res.status(201).json({ userToken, user_id: isExistingUser.user_id })
            } else {
                res.status(400).send("Identifiants incorrects")
            }
        } else {
            res.status(400).send("User not found")
        }
    }
    catch (err) {
        console.log(err)
    }
})

app.post("/signup", async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const { email, password } = req.body
    const uniqueUserId = uuidv4()
    const saltRounds = 10;
    const hashedPsw = await bcrypt.hash(password, saltRounds)

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')

        const isExistingUser = await users.findOne({ email })
        if (isExistingUser) {
            return res.status(489).send("User already exists. Try to log in")
        }
        const lowerCaseEmail = email.toLowerCase();
        const data = {
            user_id: uniqueUserId,
            email: lowerCaseEmail,
            password: hashedPsw,
        }

        const createUser = await users.insertOne(data)
        const SECRET = 'is_secret';
        const userToken = jwt.sign(createUser, SECRET, { expiresIn: "24h" })
        res.status(201).json({ userToken, user_id: uniqueUserId })
    }
    catch (err) {
        console.log(err)
    }
})

app.get("/users", async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const idUser = req.query.user_id

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')
        const data = await users.find().toArray()
        const dataFiltered = data.filter((el) => { return el.user_id !== idUser })
        res.send(dataFiltered)
    } finally {
        await client.close()
    }
})

app.get("/dogsMatches", async (req, res) => {
    const client = new MongoClient(uri);
    const dogsId = JSON.parse(req.query.dogsIds)

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')
        const data = await users.aggregate(
            [
                {
                    $match: {
                        'user_id': {
                            $in: dogsId
                        }
                    }
                }
            ]
        ).toArray();
        res.send(data)
    } finally {
        await client.close()
    }
})

app.get("/user", async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const idUser = req.query.swipedUserId ?? req.query.user_id

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')

        const query = { user_id: idUser }
        const user = await users.findOne(query)
        res.send(user)
    } finally {
        await client.close()
    }
})

app.put("/update-user", async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const inputData = req.body.inputData


    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')
        const query = { user_id: inputData.user_id }
        const data = {
            $set: {
                name: inputData.name,
                dob: inputData.dob,
                race: inputData.race,
                gender: inputData.gender,
                url: inputData.url,
                about: inputData.about,
                city: inputData.city,
                weight: inputData.weight,
                matches: inputData.matches,
                noMatches: inputData.noMatches
            }
        }
        const updateUser = await users.updateOne(query, data)
        const updateCity = await users.updateMany({}, { "$set": { "noMatches": [] } })
        res.send(updateUser)
    }
    finally {
        await client.close()
    }
})

app.put("/addMatch", async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const { user_id, swipedUserId } = req.body

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')
        const query = { user_id: user_id }
        const data = {
            $push: {
                matches: { user_id: swipedUserId }
            }
        }

        const updateUser = await users.updateOne(query, data)
        res.send(updateUser)
    }
    finally {
        await client.close()
    }
})

app.put("/addNoMatch", async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const { user_id, swipedUserId } = req.body

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const users = bdd.collection('users')
        const query = { user_id: user_id }
        const data = {
            $push: {
                noMatches: { user_id: swipedUserId }
            }
        }
        const updateUser = await users.updateOne(query, data)
        res.send(updateUser)
    }
    finally {
        await client.close()
    }
})

app.get("/messages", async (req, res) => {
    const client = new MongoClient(uri);
    const { fromUserId, toUserId } = req.query
    const query = {
        from: fromUserId,
        to: toUserId
    }

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const messages = bdd.collection('messages')
        const data = await messages.find(query).toArray()
        res.send(data)
    } finally {
        await client.close()
    }
})

app.post("/addMessage", async (req, res) => {
    const client = new MongoClient(uri);
    const message = req.body.message

    try {
        await client.connect()
        const bdd = client.db('Dogs')
        const messages = bdd.collection('messages')
        const data = await messages.insertOne(message)
        res.send(data)
    } finally {
        await client.close()
    }
})

module.exports = app;