const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { json } = require('express');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

//user: assignment-12
//password: cYHQ8PJvRQyZjQah



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpvwzmp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//for veryfyjwt
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization
    console.log('inside verifyjwt', authHeader)
    if (!authHeader) {
        return res.status(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded
        next();
    })

}
async function run() {
    try {
        const laptopCollection = client.db('laptopCollection').collection('allCategories')
        const bookingsCollection = client.db('laptopCollection').collection('bookings')
        const usersCollection = client.db('laptopCollection').collection('users')
        const ProductsCollection = client.db('laptopCollection').collection('products')
        const adverticesCollection= client.db('laptopCollection').collection('advertices')
        const reportsCollection= client.db('laptopCollection').collection('reports')
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
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const users = await usersCollection.findOne(query)
            if (users) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '7d' })
                return res.send({ accessToken: token })
            }
            console.log(users)
            res.status(403).send({ accessToken: 'Forbidden' })
        })
        //for users
        app.post('/users', async (req, res) => {
            const users = req.body
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })
        //load all product
        app.get('/bookings', verifyJWT,async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                res.status(403).send({ message: 'forbidden access' })
            }
            const query = { email: email }
            const bookings = await bookingsCollection.find(query).toArray()
            res.send(bookings)
        })
        // get method for users
        app.get("/users", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === "admin" });
        });
        //for adding products
        app.post('/products', async (req, res) => {
            const products = req.body
            const result = await ProductsCollection.insertOne(products)
            res.send(result)

        })
        //for readings products
        app.get('/products',verifyJWT,async(req,res)=>{
            const email=req.query.email
            const query={email: email}
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                res.status(403).send({ message: 'forbidden access' })
            }
            const result=await ProductsCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/products/:id',async(req,res)=>{
            const id=req.params.id;
            const email = req.query.email;
            const query={_id:ObjectId(id)}
            const result=await ProductsCollection.deleteOne(query)
            res.send(result)

        })
        //get methods for seller
        app.get('/seller',async(req,res)=>{
           const role=req.query.role;
           const query={role: role};
           const result=await usersCollection.find(query).toArray()
           res.send(result)
        })
        //for seller delete
        app.delete('/seller/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await usersCollection.deleteOne(query)
            res.send(result)

        })
        //get methods for buyer
        app.get('/buyer',async(req,res)=>{
            const role=req.query.role;
            const query={role:role};
            const result=await usersCollection.find(query).toArray()
            res.send(result)

        })
        //for buyer delete method
        app.delete('/buyer/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await usersCollection.deleteOne(query)
            res.send(result)

        })
        //for advertices
        app.post('/advertices',async(req,res)=>{
            const items=req.body;
            const result=await adverticesCollection.insertOne(items)
            res.send(result)
        })
        //for read advertices
        app.get('/advertices',async(req,res)=>{
            const query={}
            const result=await adverticesCollection.find(query).toArray()
            res.send(result)
        })
        //for report item
        app.post('/reports',async(req,res)=>{
            const report=req.body;
            const result=await reportsCollection.insertOne(report)
            res.send(result)
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
