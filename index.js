const express =require('express')
const { MongoClient } = require('mongodb');
const objectId=require('mongodb').ObjectId;
require('dotenv').config()
const cors=require('cors')
const app=express();
const fileUpload=require('express-fileupload')
const port=process.env.PORT||5000;


app.use(cors())
app.use(express.json())
app.use(fileUpload())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rh3cx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/',(req,res)=>{

    res.send('get the response')
})



async function run(){
    try{
    await client.connect();
    const database=client.db("TourTravel");
    const  serviceCollection=database.collection('services');
    const orderCollection=database.collection('orders')
    const  blogCollection=database.collection('Blogs')
    const  contactCollection=database.collection('contact')
    const usersCollection=database.collection('users')
    //get api
    
    app.get('/services',async(req,res)=>{
        const cursor=serviceCollection.find({})
        const services= await cursor.toArray();
        res.send(services)
    })
    
    //get the single service
    
    app.get('/services/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:objectId(id)}
      const service=await serviceCollection.findOne(query)
      res.json(service)
    })
    
    
    //Post api
    
    app.post('/services',async(req,res)=>{
       
   
      const place=req.body.place
      const description=req.body.description
      const price=req.body.price
      const image=req.files.image
      const imageData=image.data
      const encodedPic=imageData.toString('base64')
      const imgBuffer=Buffer.from(encodedPic,'base64')
      
      const services ={
        place,
        description,
        price,
        image:imgBuffer
      
      }
        
      const result= await serviceCollection.insertOne(services)
      console.log(result)
      res.json(result)
       // res.send('post hitted')
    })
    
//post the details

app.post('/orders',async(req,res)=>{
       
    const orders=req.body;
    console.log('hit the post api',orders)
  
     const result= await  orderCollection.insertOne(orders)
     console.log(result)
     res.json(result)
  
   // res.send('post hitted')
})

//get order

app.get('/orders',async(req,res)=>{
  const cursor= orderCollection.find({})
  const orders= await cursor.toArray();
  res.send(orders)
})

//delete

app.delete('/orders/:id',async(req,res)=>{
       
    const id=req.params.id;
      const query={_id:objectId(id)}
  
     const result= await  orderCollection.deleteOne(query)
     console.log(result)
     res.json(result)
  
   // res.send('post hitted')
})

app.post('/blog',async(req,res)=>{
const name=req.body.name
const place=req.body.place
const description=req.body.description
const image=req.files.image
const imageData=image.data
const encodedPic=imageData.toString('base64')
const imgBuffer=Buffer.from(encodedPic,'base64')

const blogs={
  name,
  place,
  description,
  image:imgBuffer
}
const result=await blogCollection.insertOne(blogs)
console.log(result)
res.json(result) 

})

app.get('/blog',async(req,res)=>{
  const cursor=blogCollection.find({})
  const blogs= await cursor.toArray()
  res.json(blogs)
})


app.post('/contact',async(req,res)=>{
  const contact=req.body
  const result= await contactCollection.insertOne(contact)
  res.json(result)
})

app.get('/contact',async(req,res)=>{
  const cursor=contactCollection.find({})
  const contact= await cursor.toArray();
  res.send(contact)
})


app.get('/users/:email',async(req,res)=>{
  const email=req.params.email;
  const query={email:email}
  const users=await usersCollection.findOne(query)
 let isAdmin=false
 if(users?.role==='admin'){
isAdmin=true;
 }
  res.json({admin:isAdmin})
})
  

//users post 
app.post('/users',async(req,res)=>{
     
  const users=req.body;
  console.log('hit the post api',users)

   const result= await usersCollection.insertOne(users)
   console.log(result)
   res.json(result)

 // res.send('post hitted')
})

app.put('/users',async(req,res)=>{
     
const users=req.body;
const filter={email:users.email}
const options={upsert:true}
const updateDoc={$set:users}

 const result= await usersCollection.updateOne(filter,updateDoc,options)
 console.log(result)
 res.json(result)

// res.send('post hitted')
})


app.put('/users/admin',async(req,res)=>{
     
const users=req.body;
const filter={email:users.email}
const options={upsert:true}
const updateDoc={$set:{role:'admin'}}

 const result= await usersCollection.updateOne(filter,updateDoc,options)
 console.log(result)
 res.json(result)

// res.send('post hitted')
})



    }
    finally{
       // await client.close();
    }
    }
    
    run().catch(console.dir);
    app.listen(port,()=>{
        console.log('listen to the port',port)
    })