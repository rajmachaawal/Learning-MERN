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
            //FORMAT VALIDATION AND ERROR COLLECTION:
            const errors = [];
            const errorTypes = {
                username:"Invalid Username Format",
                firstName:"Invalid First Name",
                lastName:"Invalid First Name",
                email:"Invalid Email Format",
                dateOfBirth:"Invalid Date Format",
                password:"Invalid Password Format"
            }
            const formatRules = {
                username:/^[A-Za-z][A-Za-z0-9_]{2,19}$/,
                firstName: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
                lastName: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
                email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                dateOfBirth: /^\d{4}-\d{2}-\d{2}$/,
                password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[^\s]{8,64}$/
            }

            //THIS IS ITERATION OVER OBJECT's PROPERTIES:
            for(const [field, rule] of Object.entries(formatRules)){
               if(!rule.test(cleanedData[field])){
                errors.push(errorTypes[field]);
               } 
            }

            if(errors.length > 0){
                res.status(400).json({
                    message: "Validation Failed",
                    status: "Bad Request",
                    errors: `${errors}`
                })
            }else{
                res.status(201).json({
                    "message": "Validation Succeeded",
                    status: "Created"
                })
            }
            

        }
    }

});



//STARTING A SERVER:
expApp.listen(3000, () => {
    console.log("Server running on port 3000");
});