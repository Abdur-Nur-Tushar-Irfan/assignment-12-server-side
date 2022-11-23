const express =require('express')
const cors=require ('cors')
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

//user: assignment-12
//password: cYHQ8PJvRQyZjQah



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpvwzmp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run(){
    try{

    }
    finally{
        
    }
}


app.get('/',(req,res)=>{
   res.send('assignment 12 server is running')
})

app.listen(port,()=>{
    console.log(`assignment 12 is running on ${port}`)
})
