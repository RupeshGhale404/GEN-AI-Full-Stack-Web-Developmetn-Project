const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.model")

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            })
        }

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await UserModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


async function loginUserController(req, res) {

}

async function logoutUserController(req, res) {
    const token = req.cookies.token
    if(token)
    {
        await tokenBlacklistModel.create({token})
    }
        res.clearCookie("token")
        return res.status(200).json({
            message: "Logout successful"
        })
    }



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController
}