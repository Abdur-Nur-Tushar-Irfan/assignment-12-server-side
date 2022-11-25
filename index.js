const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion } = require('mongodb');
// const { json } = require('express');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

//user: assignment-12
//password: cYHQ8PJvRQyZjQah



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpvwzmp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run() {
    try {
        const laptopCollection = client.db('laptopCollection').collection('allCategories')
        const bookingsCollection = client.db('laptopCollection').collection('bookings')
        const usersCollection = client.db('laptopCollection').collection('users')
        //for all categories
        app.get('/allCategories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_Id: id }
            const result = await laptopCollection.find(query).toArray();
            res.send(result)

        })
        //for booking
        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingsCollection.insertOne(bookings)
            res.send(result)

        })
        //for users jwt
        app.get('/jwt',async(req,res)=>{
            const email=req.query.email;
            const query={email:email}
            const users=await usersCollection.findOne(query)
            if (users) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '7d' })
                return res.send({ accessToken: token })
            }
            console.log(users)
            res.send(403).send({ accessToken: 'Forbidden' })
        })
        //for users
        app.post('/users', async (req, res) => {
            const users = req.body
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })
        //load all product
        app.get('/bookings',async(req,res)=>{
            const email=req.query.email;
            const query={email:email}
            const bookings=await bookingsCollection.find(query).toArray()
            res.send(bookings)
        })




    }
    finally {

    }
} run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('assignment 12 server is running')
})

app.listen(port, () => {
    console.log(`assignment 12 is running on ${port}`)
})
