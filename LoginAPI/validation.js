//FUNCTION VALIDATING THAT ALL FIELDS ARE STRING TYPE:
const fieldsAreStringType = (stringFields,rawData) => {
    let fieldsType = stringFields.some((field) => {
        return typeof rawData[field] != "string";
    })
    return fieldsType;
}

//FUNCTION VALIDATING THAT ALL REQUIRED FIELDS ARE PRESENT:
const haveRequiredFields = (fields) => {
    if(fields.includes("username") && fields.includes("password")){
        return true;
    }else if(fields.includes("email") && fields.includes("password")){
        return true;
    }else{
        return false;
    }
}




//EXPORTS:
export {fieldsAreStringType, haveRequiredFields}