// import express from "express";
// import { ENV } from "./lib/env.js";
// import path from "path";
// import { connectDB } from "./lib/db.js";
// const app = express();
// import cors from "cors";
// import {serve} from "inngest/express"

// import { inngest, functions } from "./lib/inngest.js"

// const __dirname = path.resolve();

// app.use(express.json());
// app.use(cors({origin: "http://localhost:5173", credentials: true}));

// app.use("/api/inngest",serve({client:inngest,functions}))

// app.get("/hello", (req, res) => {
//   res.status(200).json({ message: "Hello World" });
// });

// //make our app ready for deployment

// if (ENV.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "../../frontend/dist");

//   app.use(express.static(frontendPath));

//   app.get("/*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// }


// app.get("/books",(req,res)=>{
//   res.status(200).json({ message: "Books" });
// });

// console.log(functions);



// const startServer = async () => {
//   try{
//     await connectDB();
//     app.listen(ENV.PORT, () => {  
//       console.log(`Server is running on http://localhost:${ENV.PORT}`);
//     });
    
//   }catch(error){
//     console.error("error in starting server",error);
//     process.exit(1);
//   }
// };

// startServer();

import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

import chatRoutes from "./routes/chatRoutes.js";

import {clerkMiddleware} from "@clerk/express";
import {protectRoute} from "./middleware/protectRoute.js";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*"}));

app.use(clerkMiddleware());

// Inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// Simple health check

app.use("/api/chat",chatRoutes)

app.get("/", (req, res) => {
  res.json({ status: "ok", inngest: true });
});

app.get("/video-calls",protectRoute,(req,res)=>{
    res.status(200).json({message:"Video calls"})
})

async function start() {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log("Server ready on port", ENV.PORT);
  });
}

start();

