import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import config from "../config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };

  return jwt.sign(payload, config.secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error", errors });
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res.status(400).json("Username already exists");
      }

      const hashedPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = await new User({
        username,
        password: hashedPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "User registered successfully" });
    } catch (e) {
      res.status(400).json("Registration error");
      console.log(e);
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      res.status(400).json("Login error");
      console.log(e);
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new authController();
