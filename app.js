// import express from 'express';
// import collection from './mongo.js';
// import cors from 'cors';

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// app.get("/", cors(), (req, res) => {});

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await collection.findOne({ email });
//     if (user) {
//       res.json("exists");
//     } else {
//       res.json("not exists");
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Server Error");
//   }
// });

// app.post("/sign-up", async (req, res) => {
//   const { email, password } = req.body;

//   const data = { email: email, password: password };

//   try {
//     const user = await collection.findOne({ email });
//     if (user) {
//       res.json("exists");
//     } else {
//       res.json("not exists");
//       await collection.insertMany([data]);
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Server Error");
//   }
// });
//  v
// app.listen(3000, () => console.log("Server running on port 3000"));
