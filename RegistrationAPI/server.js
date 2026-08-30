const express =  require("express");

const expApp = express();


//STARTING A SERVER:
expApp.listen(3000, () => {
    console.log("Server running on port 3000");
});



//EXPRESS MIDDLEWARE:
expApp.use(express.json());


//GET ROUTE FOR REGISTRATION API:
expApp.get('/registration',(req, res) => {
    res.send("Hello from Express!")
});


//POST ROUTE:
//ALSO AN EXAMPLE OF CLIENT REQUEST VALIDATION:
expApp.post('/api/auth/register',(req, res) => {
    let hasMissingFields = true;
    const {username, firstName, lastName, email, dateOfBirth, password} = req.body;

    //TRIMMING OF TRAILING SPACES:
    const cleanedData = {
        username: username?.trim(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim(),
        dateOfBirth: dateOfBirth?.trim(),
        password
    };

    const requiredFields = [
        "username",
        "firstName",
        "lastName",
        "email",
        "dateOfBirth",
        "password"
    ];


    //BELOW CODE ALSO VALIDATES FIELDS BUT EVERYTHING IS EXPLICITLY HANDLED:
    for(const field of requiredFields){
        if(!cleanedData[field]){
            hasMissingFields = false;
            break;
        }
    }

    //BELOW IS AN IMPLICIT WAY TO WRITE THE SAME THING AS ABOVE USING .some():
    hasMissingFields = requiredFields.some(field => !cleanedData[field]);
    if(hasMissingFields){
        res.status(400).json({
            "message":"User sent bad data",
            "status":"Bad Request"
        })
    }else{
        res.status(201).json({
            "message":"User created successfully",
            "status":"Created"
        })
    }

});