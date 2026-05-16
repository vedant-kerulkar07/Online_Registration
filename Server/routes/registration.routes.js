import express from "express";
import { createRegistration } from "../controllers/Auth.controller.js";

const registrationRoutes = express.Router();

registrationRoutes.post("/", createRegistration);

export default registrationRoutes;