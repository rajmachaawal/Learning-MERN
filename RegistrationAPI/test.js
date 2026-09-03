import { hash, verifyPassword } from "ironpass";

const password = "SecurePass123!";

const hashedPassword = await hash(password);

console.log("Hash:", hashedPassword);

const correctPassword = await verifyPassword(
    password,
    hashedPassword
);

const wrongPassword = await verifyPassword(
    "WrongPassword123!",
    hashedPassword
);

console.log("Correct password:", correctPassword);
console.log("Wrong password:", wrongPassword);