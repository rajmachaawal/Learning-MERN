# Learning-Node.js

Hey, Welcome to my Node.js repository!

Here, I will be making structured code snippets while learning how to use different Node.js and npm modules to build efficient and quality-tested APIs.

---

# 04-09-2026

In today's session, while developing login module, I realized how similar categorical modules like registration and login can have subtle and yet thin lines of separation in their logics! This realization occured during the validation layers!

A bug popped up right out of no where and that too a sneaky one, because of unhandled edge cases! Fixed it right then! the endpoint of my current loginAPI works just fine! 

Next, what remains in completion of this module is verification of login credentials, and authentication flow testing! 

**TILL THEN, PEACE OUT! ✌️**

---

# 03-09-2026

I added password hashing using an npm module developed by one of my colleagues, which uses PBKDF2 for password derivation and can be used for both Registration and Login modules.

The date validation layer is also now added for verifying whether the given date is actually valid. Along the way, I learnt about the JavaScript `Date` constructor and its date normalization behaviour.

And for now, our basic **REGISTRATION API ENDPOINT IS DONE!** 🎉

The next API I am planning to design is **LoginAPI**. We will start learning it in the next session!

This session deserves to end with the completion of our first milestone!

**TILL THEN, PEACE OUT! ✌️**

---

# 31-08-2026

In today's session, I understood the format validation layer. However, I noticed that the date is currently validated twice — once for its format and once for its actual validity. I will revisit and refine this later.

With this, our **BUSINESS LOGIC** began, starting with username uniqueness. I tested it using sample data in our collections.

An error occurred because of changes made to the MongoDB collection during my previous learning sessions. I carefully identified and removed the incorrect collection/index setup.

In the next session, I will be applying business logic to the remaining relevant fields and making the implementation scalable as well.

**TILL THEN, PEACE OUT! ✌️**

---

# 30-08-2026

With today's session, I learnt how Express.js acts as a framework for Node.js and how much it simplifies backend development and routing.

Currently, I know how to:

- Set up an Express server
- Understand what HTTP requests actually are
- Work with HTTP status codes
- Understand request and response headers
- Retrieve data from `req` objects

These are the checked boxes in my Express.js journey so far!

**AND YEAH!** I also wrote a scalable field-validation layer for my Registration API.

While developing it, I learnt how the **pipelining of validation layers** plays an important role in preventing unwanted bugs. I even preserved an earlier version of the code that demonstrates poor pipelining so I can compare it with the refined implementation later.

I then refined the validation pipeline and tested it properly using **Thunder Client**.

The next addition to the codebase will be the **format and value validation layer**, followed by **business logic**.

**TILL THEN, PEACE OUT! ✌️**

---

# 26-08-2026

I have understood how logical operators work in MongoDB so far!

My goal is to understand MongoDB up to **schema refinement and query formation**, which will help me implement some basic features in my first individual project.

Currently, I am refining my schema-designing abilities. In my last session, I designed my user schema.

Next onboard is **Express.js! 🚀**

**TILL THEN, PEACE OUT! ✌️**

---

# 24-08-2026

Since the last session, I have learnt how to create records of an entity in a collection and how to retrieve data using:

- `find()`
- `findOne()`
- `findById()`

I have also grasped the concept of using **comparison operators** to filter records based on numerical parameters.

I have realised one thing:

Storing a user's credentials securely in a database is quite far from where I started — but we will get there much sooner, at our own pace!

**TILL NEXT TIME, PEACE OUT! ✌️**

---

# 21-08-2026

I started learning API creation, beginning with a **Registration API**.

I used **Mongoose** to establish a connection with my MongoDB cluster.

For the next session, I planned to model a user record using Mongoose and create a user record during registration using a username and password.

The goal was also to learn how to securely store credentials using **hashed and salted passwords** rather than storing passwords directly.

**TILL THEN, PEACE OUT! ✌️**

---

# 20-08-2026

Created a simple weather app that fetches weather data for a location using the Weatherstack API and returns the result in JSON format.

This can later be reused while building more advanced weather applications using **MERN** or traditional **HTML/CSS/JavaScript** web applications.

I am planning to build a proper frontend for one in the future using **HTML/CSS or React!**

**TILL THEN, PEACE OUT! ✌️**