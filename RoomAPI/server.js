import dotenv from "dotenv";
dotenv.config();
import express from "express";
const expApp = express();
import User from "./Models/room.model.js";
import mongoose from "mongoose";


//<-----------------------------------------------------------EXPRESS SECTION---------------------------------------------------->


expApp.use(express.json());

