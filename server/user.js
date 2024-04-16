const User = require("./userModel");
const bcrypt = require("bcrypt");

const saveUserDetails = async (req, res, next) => {
    if (!req.body.password) {
        return res.status(400).json({ err: "please provide a password" })
    }
    if (req.body.password != req.body.confirmPassword) {
        return res.status(400).json({ err: "confirm password is not same as password" })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    try {
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            integratorId: req.body.integratorId,
        });
        res.status(201).json({
            status: "success",
            data: {
                newUser,
            },
        });
    } catch (error) {
        res.status(400).json({err:error})
    }
    
}

module.exports = saveUserDetails