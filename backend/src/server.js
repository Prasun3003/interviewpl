import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
const app = express();

const __dirname = path.resolve();

app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

//make our app ready for deployment

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.get("/books",(req,res)=>{
  res.status(200).json({ message: "Books" });
});

app.listen(ENV.PORT, () => {
  console.log(`Server is running on http://localhost:${ENV.PORT}`);
});
