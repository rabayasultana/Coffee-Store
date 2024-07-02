require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// // Middleware
// app.use(cors({
//   origin: '*'
// }));
// app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mwqipy1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    //   await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffee');

        const userCollection = client.db('coffeeDB').collection('user');

        app.get('/', (req, res) => {
          res.send('Coffee making server is running')
      })

      // app.get('/cors', (req, res) => {
      //   res.set('Access-Control-Allow-Origin', '*');
      //   res.send("This has CORS enabled 🎈" )
      //   })


        app.get('/coffee', async(req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffee', async(req, res) =>{
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.put('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updatedCoffee = req.body;

            const coffee = {
                $set: {
                    name: updatedCoffee.name, 
                    quantity: updatedCoffee.quantity, 
                    supplier: updatedCoffee.supplier, 
                    taste: updatedCoffee.taste, 
                    category: updatedCoffee.category, 
                    details: updatedCoffee.details, 
                    photo: updatedCoffee.photo
                }
            }

            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        app.delete('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })

        // user related apis

        app.get('/user', async(req, res) => {
          const cursor = userCollection.find();
          const result = await cursor.toArray();
          res.send(result);
      })

        app.post('/user', async(req, res) =>{
          const user = req.body;
          console.log(user);
          const result = await userCollection.insertOne(user);
          res.send(result);
        })

        app.patch('/user', async (req, res) => {
          const user = req.body;
          const filter = { email: user.email }
          const updateDoc = {
            $set: {
              lastLoggedAt: user.lastLoggedAt
            }
          }
          const result = await userCollection.updateOne(filter, updateDoc)
          res.send(result);
        })

        app.delete('/user/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const result = await userCollection.deleteOne(query);
          res.send(result);
      })


      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Coffee making server is running')
})

app.listen(port, () => {
    console.log(`Coffee Server is running on port: ${port}`)
})