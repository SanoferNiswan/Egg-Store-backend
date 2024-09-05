const express = require('express')
const cors = require ('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const customerData = mongoose.Schema({
    CustomerId: { type: Number},//, required: true },
    CustomerName: { type: String},//, required: true },
    ShopName: { type: String},//, required: true },
    ShopAddress: { type: String},//, required: true },
    Mobile: { type: String},// required: true }  // Use String if it may contain spaces or special characters
  });
  

const transactionData = mongoose.Schema({
    CustomerId : Number, 
    TranId : Number,
    CustomerName : String,
    ShopName : String,
    ShopAddress : String,
    Mobile : String,
    TrayDelivered : Number,
    TrayCollected : Number,
    TotalAmount: Number,
    PaidAmount : Number,
    BalanceAmount : Number,
    DelivereyPerson : String
},{
    timestamps : true
})

// const settlementData = mongoose.Schema({
//     CustomerId : Number, 
//     CustomerName : String,
//     ShopName : String,
//     ShopAddress : String,
//     Mobile : String,
//     AmountToBePaid : Number,
//     TrayToBeCollected : Number
// },{
//     timestamps : true
// })

const settlementData = mongoose.Schema({
  CustomerId: Number,
  AmountToBePaid: { type: Number, default: 0 }, // Default initial value
  TrayToBeCollected: { type: Number, default: 0 } // Default initial value
}, {
  timestamps: true
});

const customerModel = mongoose.model("customer",customerData)
const transactionModel = mongoose.model("transaction",transactionData)
const settlementModel = mongoose.model("settlement",settlementData)

//get data
//​http://localhost:8080/
app.get("/getcustomers",async(req,res) => {
    const data = await customerModel.find({})
    res.json({success : true, data : data})

})

app.get("/gettrandetails/:id",async(req,res) => {
  const { id } = req.params;
  console.log(id);
  const data = await transactionModel.find({CustomerId : id})
  console.log(data)
  res.json({success : true, data : data})

})

// Get Settlement Details by Customer ID
app.get("/getsettlementdetails/:id", async (req, res) => {
  const { id } = req.params;
  const data = await settlementModel.find({ CustomerId: id });
  res.json({ success: true, data: data });
});

// app.get("/gettrandetails/:id", async (req, res) => {
//   try {
//     const {id}  = req.params;
//     _id = parseInt(id)
//     console.log(req.body, id);

//     // Find transaction by MongoDB _id
//     const data = await transactionModel.findById(id);
//     console.log("data", data);

//     if (!data) {
//       return res.status(404).json({ success: false, message: "Transaction not found" });
//     }

//     res.json({ success: true, data: data });
//   } catch (error) {
//     console.error("Error fetching transaction details:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });


//save data
// app.post("/savecustomer",async(req,res) => {
//     console.log(req.body)
//     const data = customerModel(req.body)
//     await data.save()
//     res.send({success : true, message : "Data Saved Successfully", data : data})
// })

app.post("/savecustomer", async (req, res) => {
    console.log(req.body)
    const { ShopName, CustomerName, ShopAddress, Mobile, CustomerId } = req.body;
  
    if (!ShopName || !CustomerName || !ShopAddress || !Mobile) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
  
    // Optional: Additional validation for types or formats
    // if (typeof CustomerId !== 'number' || typeof ShopName !== 'string' || typeof CustomerName !== 'string') {
    //   return res.status(400).json({ success: false, message: "Invalid data types" });
    // }
  
    try {
      const data = new customerModel(req.body);
      await data.save();
      res.json({ success: true, message: "Data Saved Successfully", data: data });
    } catch (error) {
      console.error('Error saving customer:', error);
      res.status(500).json({ success: false, message: "Error saving customer" });
    }
  });
  
  

app.post("/savetrans",async(req,res) => {
    console.log(req.body)
    const data = transactionModel(req.body)
    await data.save()
    res.send({success : true, message : "Data Saved Successfully", data : data})
})

app.post("/savesettlement",async(req,res) => {
    console.log(req.body)
    const data = settlementModel(req.body)
    await data.save()
    res.send({success : true, message : "Data Saved Successfully", data : data})
})

app.put("/updatesettlement",async(req,res) => {
  debugger;
  console.log(req.body)
  const {CustomerId,...rest} = req.body
  console.log(rest)
  const data = await settlementModel.updateOne({CustomerId : CustomerId}, rest)
  console.log(data)
  res.send({success : true, message : "Data Updated Successfully", data : data})
})


//get data 
app.get("/getsettlementdetails/:id", async (req, res) => {
  const { id } = req.params;
  const data = await settlementModel.findOne({ CustomerId: id });
  res.json({ success: true, data: data });
});


//update Data
app.put("/update",async(req,res) => {
    debugger;
    console.log(req.body)
    const {id,...rest} = req.body
    console.log(rest)
    const data = await customerModel.updateOne({_id : id}, rest)
    res.send({success : true, message : "Data Updated Successfully", data : data})
})

//Delete data
app.delete("/delete/:id",async(req,res) => {
    const id = req.params.id
    console.log(id)
    const cusData = await customerModel.deleteMany({CustomerId : id})
    const tranData = await transactionModel.deleteMany({CustomerId : id})
    const settlementData = await settlementModel.deleteMany({CustomerId : id})
    console.log(cusData,tranData,settlementData)
    res.send({success : true, message : "Data Deleted Successfully", data : cusData})
})

mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("Conntected to DataBase")
    app.listen(PORT, () => console.log("Server is up and running..."))
})

.catch((err) => console.log(err))

 
