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
        const reviewCollecttion = client.db('greenTure').collection('review')

        app.get('/services', async (req, res) => {
          const query = {}
          const cursor = serviceCollection.find(query);
          const services = await cursor.limit(3).toArray()
          res.send(services)
        })

        app.get('/servicesall', async (req, res) => {
          const query = {}
          const cursor = serviceCollection.find(query);
          const services = await cursor.toArray()
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

        //review api
        app.post('/review', async (req, res) => {
          const query = req.body;
          const result = await reviewCollecttion.insertOne(query)
          res.send(result)
        })

        app.get('/review', async(req, res) => {
          let query = {}
          if (req.query.serviceId) {
            query = {
              serviceId: req.query.serviceId
            }
          }
          const cursor = reviewCollecttion.find(query);
          const review = await cursor.toArray()
          res.send(review)

        })

        app.get('/reviews', async (req, res) => {
          let query = {}
          if (req.query.email) {
            query = {
              email: req.query.email
            }
          }
          const cursor = reviewCollecttion.find(query);
          const reviews = await cursor.toArray()
          res.send(reviews)
        })

        app.delete('/review/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await reviewCollecttion.deleteOne(query);
          res.send(result)
        })

        app.get('/reviewupdate/:id', async (req, res)=>{
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await reviewCollecttion.findOne(query)
          res.send(result)
        })

        app.patch('/updatereview/:id', async (req, res) => {
          const id = req.params.id;
          const review = req.body;
          console.log(review)
          console.log(review.userName,review.img,review.review)
          const query = { _id: ObjectId(id) };
          const option = {upsert: true}
          const updatedReview = {
            $set: {
              userName: review.userName,
              img: review.img,
              review:review.review
            }
          }
          const result = await reviewCollecttion.updateOne(query, updatedReview, option)
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