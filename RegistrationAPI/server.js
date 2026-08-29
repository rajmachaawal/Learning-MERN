const express =  require("express");

const expApp = express();


//SERVER RUNNING METHOD:
expApp.listen(3000, () => {
    console.log("Server running on port 3000");
})


//GET ROUTE FOR REGISTRATION API:
expApp.get('/registration',(req, res) => {
    res.send("Hello from Express!")
})