import express from "express";
import { createRegistration, getAllRegistrations } from "../controllers/Auth.controller.js";

const registrationRoutes = express.Router();

registrationRoutes.post("/", createRegistration);
registrationRoutes.get("/admin", getAllRegistrations);

export default registrationRoutes;