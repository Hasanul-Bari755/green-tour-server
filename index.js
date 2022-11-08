const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wc7jl9l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  async  function run() {
      try {
        const serviceCollection = client.db('greenTure').collection('services');

        app.get('/services', async (req, res) => {
          const query = {}
          const cursor = serviceCollection.find(query);
          const services = await cursor.limit(3).toArray();
          res.send(services)
        })

        app.get('/servicesall', async (req, res) => {
          const query = {}
          const cursor = serviceCollection.find(query);
          const services = await cursor.toArray();
          res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await serviceCollection.findOne(query);
          res.send(result)
        })

        app.post('/services', async (req, res) => {
          const query = req.body;
          const result = await serviceCollection.insertOne(query)
          res.send(result)
        })
        
      }
      finally {
        
      }
      
    }
    run().catch((error) => {
      console.log(error)
    });



app.get('/', (req, res) => {
    res.send('Green true server is running...')
})

app.listen(port, () => {
    console.log(`Green ture server is running ${port}`)
})