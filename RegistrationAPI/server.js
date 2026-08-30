const express =  require("express");

const expApp = express();





//EXPRESS MIDDLEWARE:
expApp.use(express.json());


//GET ROUTE FOR REGISTRATION API:
expApp.get('/registration',(req, res) => {
    res.send("Hello from Express!")
});


//POST ROUTE:
//ALSO AN EXAMPLE OF CLIENT REQUEST VALIDATION:
expApp.post('/api/auth/register',(req, res) => {



    const {username, firstName, lastName, email, dateOfBirth, password} = req.body;
    
    // let hasMissingFields = true;
    // //TRIMMING OF TRAILING SPACES:
    // const cleanedData = {
    //     username: username?.trim(),
    //     firstName: firstName?.trim(),
    //     lastName: lastName?.trim(),
    //     email: email?.trim(),
    //     dateOfBirth: dateOfBirth?.trim(),
    //     password
    // };

    // const requiredFields = [
        //     "username",
    //     "firstName",
    //     "lastName",
    //     "email",
    //     "dateOfBirth",
    //     "password"
    // ];
    
    
    // //BELOW CODE ALSO VALIDATES FIELDS BUT EVERYTHING IS EXPLICITLY HANDLED:
    // for(const field of requiredFields){
    //     if(!cleanedData[field]){
        //         hasMissingFields = false;
    //         break;
    //     }
    // }
    
    
    // //BELOW IS AN IMPLICIT WAY TO WRITE THE SAME THING AS ABOVE USING .some():
    // hasMissingFields = requiredFields.some(field => !cleanedData[field]);
    
    // if(hasMissingFields){
    //     res.status(400).json({
    //         "message":"User sent bad data",
    //         "status":"Bad Request"
    //     })
    // }else{
    //     res.status(400).json({
    //         "message":"User sent bad data",
    //         "status":"Bad Request"
    //     })
    // }
    
    



    //------------THE ABOVE CODE IS ALSO AN EXAMPLE OF POOR PIPELINIG------------------->
    //------------THE CODE BELOW IS PROPER PIPELINING OF AN SCALABLE VALIDATION LAYER--->
    const stringFields = [
        "username",
        "firstName",
        "lastName",
        "email",
        "dateOfBirth",
        "password"
    ];

    const rawData = {username, firstName, lastName, email, dateOfBirth, password};
    
    //FUNCTION VALIDATING DATATYPE OF EACH FIELD:
    const stringValidator = (stringFields, rawData) => {
        let hasOtherTypeFields = stringFields.some((field) => {return typeof rawData[field] !== "string"});
        return hasOtherTypeFields;
    };
    if(stringValidator(stringFields, rawData)){
        res.status(400).json({
            "message":"User sent bad data",
            "status":"Bad Request"
        })
    }else{
        const requiredFields = [
            "username",
            "firstName",
            "lastName",
            "email",
            "dateOfBirth",
            "password"
        ];
        //DATA CLEANING:
        const cleanedData = {
            username: username?.trim(),
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            email: email?.trim(),
            dateOfBirth: dateOfBirth?.trim(),
            password
        };  

        //FUNCTION VALIDATING MISSING FIELDS:
        const missingFieldsValidator = (requiredFields, cleanedData) => {
            let hasMissingFields = requiredFields.some((field) => {return !cleanedData[field]});
            return hasMissingFields;
        }

        if(missingFieldsValidator(requiredFields, cleanedData)){
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
    }

});



//STARTING A SERVER:
expApp.listen(3000, () => {
    console.log("Server running on port 3000");
});