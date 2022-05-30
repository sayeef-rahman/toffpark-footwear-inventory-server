const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request');
const res = require('express/lib/response');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
//Database name: toffpark
//Collection name: wearhouse
// Heroku Server Link: https://sleepy-chamber-78225.herokuapp.com/

//Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.onmvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const shoesCollection = client.db('toffpark').collection('wearhouse');

    //get all data from server
    app.get('/wearhouse', async (req, res) => {
      const query = {};
      const cursor = shoesCollection.find(query);
      const shoes = await cursor.toArray();
      res.send(shoes);
    });

    //get specific data using ID
    app.get('/wearhouse/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const shoe = await shoesCollection.findOne(query);
      res.send(shoe);
    });

    // POST
    app.post('/wearhouse', async (req, res) => {
      const newShoe = req.body;
      const result = await shoesCollection.insertOne(newShoe);
      res.send(result);
    });

    //PUT
    // update Quantity
    app.put('/wearhouse/:id', async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updateQuantity.newQuantity
        }
      };
      const result = await shoesCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

    })

    // DELETE
    app.delete('/wearhouse/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await shoesCollection.deleteOne(query);
      res.send(result);
    });

  }
  finally {

  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running Server')
})

app.listen(port, () => {
  console.log('listening port', port)
})