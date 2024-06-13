import express from "express";
import {login, register} from "../controllers/auth.js";

const router=express.Router();

//route for registeration
router.post("/register",register);

//route for login 
router.post("/login",login);

export default router;