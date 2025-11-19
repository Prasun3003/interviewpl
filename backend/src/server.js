import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
const app = express();
import cors from "cors";
import {serve} from "inngest/express"

import { inngest, functions } from "./lib/inngest.js"

const __dirname = path.resolve();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use("/api/inngest",serve({client:inngest,functions}))

app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

//make our app ready for deployment

if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}


app.get("/books",(req,res)=>{
  res.status(200).json({ message: "Books" });
});

console.log(functions);



const startServer = async () => {
  try{
    await connectDB();
    app.listen(ENV.PORT, () => {  
      console.log(`Server is running on http://localhost:${ENV.PORT}`);
    });
    
  }catch(error){
    console.error("error in starting server",error);
    process.exit(1);
  }
};

startServer();
