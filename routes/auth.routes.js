import Router from "express";
import { check } from "express-validator";
import authController from "../controller/auth.controller.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/registration",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "Password cannot be less than 4 characters").isLength({
      min: 4,
    }),
  ],
  authController.registration
);
router.post("/login", authController.login);
router.get("/users", roleMiddleware(["ADMIN"]), authController.getUsers);

export default router;
