const sendToken = async (user, res, statusCode) => {
    try {
        const token = await user.jwttoken(); // Ensure this is the correct method name
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
        };
        res.status(statusCode).cookie("token", token, options).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        console.error("Error in sendToken:", error);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
};

module.exports = sendToken;
