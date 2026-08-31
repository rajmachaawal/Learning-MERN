const errorTypes = {
    username:"Invalid Username Format",
    email:"Invalid Email Format"
}
const formatRules = {
    username:/^[A-Za-z][A-Za-z0-9_]{2,19}$/,
    email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

for(const [field, rule] of Object.entries(formatRules)){
    console.log(field, rule);
}