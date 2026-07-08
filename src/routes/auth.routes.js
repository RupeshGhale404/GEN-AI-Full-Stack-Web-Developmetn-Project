const {Router} = require('express')
const authController = require("../controllers/auth.controller")
const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public   
 */ 
authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Login user, excepts email and password in the request body, returns a JWT token if successful
 * @access Public   
 */ 
authRouter.post("/login", authController.loginUserController)
/**]
 * @route GET/api/auth/LOGOUT
 * @desc clear token from user cookies and add token to blacklist
 * @access public        
 */

authRouter.get("/logout", authController.logoutUserController)
module.exports = authRouter
