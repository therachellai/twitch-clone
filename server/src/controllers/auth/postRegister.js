import User from "../../models/User.js";
import Channel from "../../models/Channel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const postRegister = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        const userExists = await User.exists({ email });

        if (userExists) {
            return res.status(409).send("Email already in use.");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newChannel = await Channel.create({});

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            channel: newChannel._id,
        });

        // Create JWT token

        const token = jwt.sign(
            // User details we would like to encrypt in JWT token
            { 
                userId: user._id, 
                email, 
            },
            // Secret
            process.env.TOKEN_KEY,
            // Additional config
            { 
                expiresIn: "8h",
            }
        );

        // Send success response back to the user with data of registered user and JWT 
        return res.status(201).json({
            userDetails:{
                email,
                username,
                token,
            }
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send("Error occurred. Please try again.");
    }

    return res.send("User has been added to database.");
}