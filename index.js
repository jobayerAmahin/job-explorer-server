const express = require('express');
const cors = require('cors');
const app=express()
const port=process.env.PORT||3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.4hbs2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    const jobCollection=client.db('JobExplorerDB').collection('allJobsColl')
    const applicationCollection=client.db('JobExplorerDB').collection('allApplication')

    //Jobs API
    app.get('/allJobs',async(req,res)=>{
        const query=jobCollection.find()
        const result=await query.toArray()
        res.send(result)
    })

    app.get('/job/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await jobCollection.findOne(query)
        res.send(result)
    })

    //Application APIs

    app.post('/job-application',async(req,res)=>{
      const applicationData=req.body
      console.log(applicationData)
      const result=await applicationCollection.insertOne(applicationData)
      
      res.send(result)
    })

    //Test Data

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Server for job portal')
})

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})

