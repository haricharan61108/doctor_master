import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import authRoutes from "./routes/auth.js"

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());


//authorization route for registeration and login of the doctor
app.use("/auth",authRoutes);

app.listen(5000,()=> {
    console.log("server has started on port 5000");
})

