const mongoose = require("mongoose")
// mongoose.set('debug', true);
mongoose
.connect("mongodb+srv://dev9mxpertz:admin%40321@cluster0.uvkaev8.mongodb.net/AITOOL?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("db connected!"))
.catch((err)=>console.log(err))