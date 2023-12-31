const express =require('express');
const cors = require('cors');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucoarqa.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
//CRUD _________________________________________________________________________
const ProductCullections=client.db('productsDB').collection('products') 
// const CartCullections=client.db('productsDB').collection('carts') 
const CartCullections = client.db('productsDB').collection('carts');


app.get('/carts',async (req,res)=>{
  const cursor =CartCullections.find()
  const result= await cursor.toArray()
  res.send(result);
  
  
  })




app.get('/products',async (req,res)=>{
const cursor =ProductCullections.find()
const result= await cursor.toArray()
res.send(result);


})



// ...

app.get('/products/id/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await ProductCullections.findOne(query);
  res.send(result);
});

app.get('/products/brand/:brandName', async (req, res) => {
  const brandName = req.params.brandName;
  const query = { brandName };
  const result = await ProductCullections.find(query).toArray();
  res.send(result);
});

// ...
app.post('/products',async(req,res)=>{
  const newproduct=req.body
const result=await ProductCullections.insertOne(newproduct)
res.send(result)


})
 



app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await ProductCullections.findOne(query)
  res.send(result)
})

app.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true }
  const updateProduct = req.body;
  const product = {
    $set: {
      photo: updateProduct.photo,
      name: updateProduct.name,
      brandName: updateProduct.brandName,
      type: updateProduct.type,
      price: updateProduct.price,
      description: updateProduct.description,
      rating: updateProduct.rating,
    }
  }

  const result=await ProductCullections.updateOne(filter,product,options)
  res.send(result)
})










app.delete('/carts/id/:id',async(req,res)=>{
  const id =req.params.id
  const query ={_id:new ObjectId(id)}
 const result= await CartCullections.deleteOne(query)
 res.send(result)
})


app.get('/carts/user/:user', async (req, res) => {
  const user= req.params.user;
  const query = { user:user };
  const result = await CartCullections.find(query).toArray();
  res.send(result);
});



app.post('/carts', async (req, res) => {
  const cartproduct = req.body;
  console.log(cartproduct)
  const result = await CartCullections.insertOne(cartproduct);
  console.log(result)
  res.send(result);
});






//________________________________________________________________________
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
  res.send('BRAND SHOP IS RUNNING')
  

})
app.listen(port,()=>{
  console.log(` BRAND Server is running on ${port}`)
})