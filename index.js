const express = require("express");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product")
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// API for signup any user

app.post("/register", async (req, res)=>{
    let user = new User(req.body)
    let result = await user.save();
    // for removing password
    result = result.toObject();
    delete result.password
    res.send(result)
});

// API for login

app.post("/login", async (req, res)=>{
    console.log(req.body)
    if(req.body.password && req.body.email){
        let user = await User.findOne(req.body).select("-password");
        if(user){
            res.send(user);
        }else{
            res.send({result:"user not found"})
        }
    }else{
        res.send({result:"user not found"})
    }
});

// API for add new product

app.post("/add-product", async (req, res) =>{
    let product = new Product(req.body)
    let result = await product.save();
    res.send(result)
});

// API for list all products

app.get("/products", async (req, res)=>{
    let product = await Product.find();
    if(product.length>0){
        res.send(product)
    }else{
        console.log({result:"User not found"})
    }
});

// API for delete any product

app.delete("/product/:id",async (req, res) =>{
    const result = await Product.deleteOne({_id:req.params.id})
    res.send(result);
});

// API for update page any one product

app.put("/update/:_id", async (req, res) => {
    console.log(req.params)
    const data = await Product.updateOne(
        req.params,
        {
            $set:req.body
        }
    )
    res.send(data)
});

// API for fetching any one product for update

app.get("/product/:id", async (req, res) => {
  const result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No result found" });
  }
});

// API for update any one product

app.put(("/product/:id"), async (req, res) =>{
  let result = await Product.updateOne(
    {_id: req.params.id},
    {
      $set: req.body
    }
  );
  res.send(result)
});

// Search API

app.get("/search/:key", async(req, res)=>{
  let result = await Product.find({
    "$or": [
      { name: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } }
    ]
  });
  res.send(result)
})

app.listen(5000);