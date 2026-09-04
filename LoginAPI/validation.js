//FUNCTION VALIDATING THAT ALL FIELDS ARE STRING TYPE:
const fieldsAreStringType = (stringFields,rawData) => {
    let fieldsType = stringFields.some((field) => {
        return typeof rawData[field] != "string";
    })
    return fieldsType;
}

//FUNCTION VALIDATING THAT ALL REQUIRED FIELDS ARE PRESENT:
const haveRequiredFields = (fields,cleanedData) => {
    if(fields.includes("username") && fields.includes("password")){
        return true;
    }else if(fields.includes("email") && fields.includes("password")){
        return true;
    }else{
        return false;
    }
}

//FUNCTION VALIDATING FORMATS OF EACH LOGIN FIELD:
const formatValidator = (cleanedData) => {
    const errors = [];
    const errorTypes = {
        username: "Invalid Username Format",
        email: "Invalid Email Format",
        password: "Invalid Password Format"
    }
    const formatRules = {
        username:/^[A-Za-z][A-Za-z0-9_]{2,19}$/,
        email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[^\s]{8,64}$/
    }

    //THIS IS ITERATION OVER OBJECT's PROPERTIES:
    for(const [field, rule] of Object.entries(formatRules)){
       if(Object.keys(cleanedData).includes(field)){
        if(cleanedData[field]){
            if(!rule.test(cleanedData[field])){
                errors.push(errorTypes[field]);
            }
        }else{
            errors.push(errorTypes[field]);
        }
       }
    }
    return errors;
}





//EXPORTS:
export {fieldsAreStringType, haveRequiredFields, formatValidator}