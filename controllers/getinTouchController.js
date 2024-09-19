const getintouch = require("../models/getinTouchModel")


exports.getinTouch = async (req, res) => {
    const { name, mobile, email, subject, message , companySize , Industry } = req.body;
    console.log(req.body)
    // const userId = req.user.id; // Assuming userId is available in req.user.id
    try {
    if (!name || !mobile || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
        const newSubmission = new getintouch({ name, mobile, email, subject, message  , Industry , companySize});
        await newSubmission.save();
        return res.json({ message: "Submission successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while submitting the form" });
    }
};

exports.deleteGetInTouchSubmission = async (req, res) => {
    const userId = req.user._id; // Assuming the user's ID is available in the request object
    const submissionId = req.params.id; // The ID of the submission to delete

    try {
        // Find the submission by ID and ensure it belongs to the logged-in user
        const submission = await getintouch.findOne({ _id: submissionId, user: userId });

        if (!submission) {
            return res.status(404).json({ error: "Submission not found or does not belong to the user" });
        }

        // Delete the submission
        await submission.remove();

        res.json({ message: "Submission deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the submission" });
    }
};




  