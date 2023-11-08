const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sccpwsm.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        // Send a ping to confirm a successful connection

        const categoryCollection = client.db("bookDB").collection("categoryCollection")
        const booksCollection = client.db('bookDB').collection('booksCollection')
        const newArrivalCollection = client.db('bookDB').collection('newArrivalCollection')
        const featuredAuthorCollection = client.db('bookDB').collection('featuredAuthorCollection')
        const borrowedBooksCollection = client.db('bookDB').collection('borrowedBooksCollection')

        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/categories/:category', async (req, res) => {
            const cursor = booksCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/newArrivals', async (req, res) => {
            const cursor = newArrivalCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/featuredAuthors', async (req, res) => {
            const cursor = featuredAuthorCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/categories', async (req, res) => {
            const book = req.body;
            const result = await booksCollection.insertOne(book);
            res.json(result)
        })

        app.post('/borrowedBooks', async (req, res) => {
            const book = req.body;
            const result = await borrowedBooksCollection.insertOne(book);
            res.json(result)
        })

        app.get('/borrowedBooks', async (req, res) => {

            let query = {};

            if (req.query?.email) {
                query = { email: req.query?.email }
            }
            const cursor = borrowedBooksCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/borrowedBooks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await borrowedBooksCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const book = req.body;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    image: book.image,
                    name: book.name,
                    quantity: book.quantity,
                    author: book.author,
                    category: book.category,
                    rating: book.rating,
                    short_description: book.short_description,
                }
            };
            const result = await booksCollection.updateOne(query, updateDoc, options)
            res.json(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('my library my choice')
})

app.listen(port, () => {
    console.log(`my server is running like deer:${port}`)
})