# Learning-Node.js

Hey, Welcome to my Node.js repository!

Here, I will be making structured codebases/APIs/modules that are tested for production-level requirements!
And, the tech I will be using will be Javascript(Node.js),npm modules that are more efficient and development friendly!
I have decided that the error-handling and response will not be compromised anyhow! 
DO CHECK OUT AND LEAVE A STAR ⭐ if you appreciate this!

---

# THIS REPO IS ON EXAM STANDBY, FOR MY EXAMS ARE ONGOING!

For now, my exams are ongoing! So I will be empty committing this readme! So that my consistency of returning backto  where I need to be, doesn't get fades away!

And I am revisiting my methodologies, that I used in this project and what variations come around when the requirements are different!

# 15-09-2026 

As previously stated, today's session was highly focused around  broadcasting and room-scoped broadcasting! But, a problem occured- See, being exposed to these kind of system for the first time, feels overwhelming! So, I started Websocket again from the beginning!

There is no question that  I wouldn't understand these kinds of system! On the contrary, it is factually correct to say - I am allowed to learn with these mistakes at this stage only! Learning phase is the best phase to make mistakes and making any number of mistakes is no humiliation! But learning is crucial! - And after that I reminded msyelf about it and started over with clarity of what my goal is! 

So, yeah I can say that, I started over but this time everything made sense, and I even wrote the whole code by myself without looking up to anything!

But the learning ain't finished yet! next will be presence/membership state management!

**TILL THEN, PEACE OUT! ✌️**

---

# 14-09-2026 

So,we began developing something that is much higher than what we have developed till now! Now comes the Real-Time Communication System OR Chat Module!Surely, this will challenge my adaptability to think in different kind of systems! Its trippy but not impossible to understand!

I chose "ws" library for first learning how to develop this module! and then implement it using Socket.IO! For now I have learnt about establishing connection between client and server, and also performed message transfer! 

Next, I intend to learn Broadcasting and Room-Scoped Broadcasting!

**TILL THEN, PEACE OUT! ✌️**

---

# 14-09-2026 

It's 11:48 in the night when I committing today's progress and calling it a day for now! Today, we finally completed the room lifecycle i.e - CREATE-USE-EXPIRE-DELETE!

A new MongoDB feature was used for automated database record cleanup! And with this being finished, we started proceeding for the bigger guns - WebSocket!

Understood the basics of WebSocket, how it is different, and what problem it overcomes! I tried establishing a connection and did it! But it is too late to connect my first client to the server, SOOOOOOOOOOOO!

**TILL THEN, PEACE OUT! ✌️**

---

# 13-09-2026 

Summarizing all the sessions did today, I built Room Creation,Room Access, and Room Deletion Routes! Role based access was implemented in all protected routes!

A new mongoose method I encountered during today's session!.populate(), such a ease of access method, in extracting all or selective info from another table! without executing a secondary query!

Next, I will be designing actual Room! or maybe a little bit of frontend!

**TILL THEN, PEACE OUT! ✌️**

---

# 11-09-2026

Hmm! Today, I understood that the way I was handling auth requests was not production-level! and how authorization needs to be handled in production environment!

The complete authentication Middleware implemented, as well as the flow itself contains ability to handle invalid authentication requests efficiently!

Now, next I have to learn designing rooms, and as well as how users join and leave it! 

**TILL THEN, PEACE OUT! ✌️**

---

# 10-09-2026

Quite a lot time flew by, not much progress made! Because of longer college hours and poor health! But everything is back to where it was! And intensive development and learning has began again!

In today's session, I learnt about JWT's crucial points where it flexes its powers! And for now middleware is under construction! So the, protected routes can be provided for user requests!

Next, I will be creating the middlewares and implementing them in routes, which itself is a major checkpoint for this learning repository!

**TILL THEN, PEACE OUT! ✌️**

---

# 05-09-2026

Well, today's sessions felt like lectures out of a Backend/Security Engineering coursebook!But it all cleared up as I connected the little pieces of it! bit by bit! It all made sense, how authentication,  validaiton and authorization are both different, and have a specific reponsibility, of maintaining isolation, integrity and validity!

Today's sessions were hard focused on theoritical concepts of cryptography,stateless and stateful authentication! In consequential lectures we will apply them to our  architecture!

AND, one note, the loginAPI is not still finished! if I am learning it this time, I am going to do it whole-heartedly!

**TILL THEN, PEACE OUT! ✌️**

---

# 04-09-2026

In today's session, while developing login module, I realized how similar categorical modules like registration and login can have subtle and yet thin lines of separation in their logics! This realization occured during the validation layers!

A bug popped up right out of no where and that too a sneaky one, because of unhandled edge cases! Fixed it right then! the endpoint of my current loginAPI works just fine! 

I also implemented my colleague "krptonox"'s IRONPASS npm module here as well for credential authentication! Next, what remains is a final overall authentication testing and Regression! 

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