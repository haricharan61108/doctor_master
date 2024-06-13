import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";


//controller for registeration
export const register=async(req,res)=> {
    try {
        const {name,username,password}=req.body;

        //checking if any user with same username exists
        const existUser=await pool.query("SELECT * FROM doctor_master WHERE username=$1",[username]);
        if(existUser.rows.length>0) {
            return res.status(400).json({message: "Username already in existance"});
        }
        const salt=await bcrypt.genSalt();
        //encrypting the password using bcrypt
        const passwordHash=await bcrypt.hash(password,salt);
        //creating the user
        const newUser=await pool.query(
            "INSERT INTO doctor_master (name, username, password, created_at, updated_at) VALUES ($1,$2,$3,NOW(),NOW()) RETURNING *",[name,username,passwordHash]
        );
        
        res.status(201).json({message:"User succesfully registered",user:newUser.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: err.message});
    }
}


//controller for login
export const login=async(req,res)=> { 
    try {
    const {username,password}=req.body;
    const result=await pool.query("SELECT * FROM doctor_master WHERE username=$1",[username]);
    if(result.rows.length==0) {
        return res.status(400).json({message:"User doesnt exist"});
    }
    const user=result.rows[0];
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) {
        return res.status(400).json({message:"Invalid credentials"});
    }
    //asigning a token which expires in 1 hour
    const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'});  
    //deleting the user password so that it doesnt gets corrputed
    delete user.password;
    res.status(200).json({
        message:"Login succesfull",
        token
    })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error:err.message});
    }
    
}