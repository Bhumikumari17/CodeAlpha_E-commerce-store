const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const Order = require("./models/Order");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log(err));

// Home Route
app.get("/", (req, res) => {
    res.send("Berry Bloom Backend Running 🚀");
});

// =======================
// SIGNUP
// =======================
app.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                message: "Email already exists ❌"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "Account Created Successfully 🎉"
        });

    } catch (error) {

        console.log(error);

        res.json({
            message: "Something went wrong!"
        });

    }

});

// =======================
// LOGIN
// =======================
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                message: "User Not Found ❌"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                message: "Invalid Password ❌"
            });
        }

        res.json({
            message: "Login Successful ✅"
        });

    } catch (error) {

        console.log(error);

        res.json({
            message: "Something went wrong!"
        });

    }

});

// =======================
// ORDER
// =======================
app.post("/order", async (req, res) => {

    try {

        const { customerName, totalAmount, items } = req.body;

        const order = new Order({
            customerName,
            totalAmount,
            items
        });

        await order.save();

        res.json({
            message: "Order Placed Successfully 🎉"
        });

    } catch (error) {

        console.log(error);

        res.json({
            message: "Order Failed ❌"
        });

    }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});