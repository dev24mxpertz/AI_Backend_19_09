const Image = require('../models/imageModel');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: "public_s9UEwIJrtesNhEeT4uv0hklRmzc=",
  privateKey: "private_kP7A0uR8qBVwB4AAN35xkr/UwmU=",
  urlEndpoint: "https://ik.imagekit.io/dev19",
});

const uploadImage = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("File Data:", req.file);

        const { userId, name } = req.body;
        const file = req.file;

        // Check if an image already exists for the user
        let existingImage = await Image.findOne({ userId });

        if (existingImage) {
            // If an image already exists, update the existing image URL
            const uploadedImage = await imagekit.upload({
                file: file.buffer,
                fileName: file.originalname,
                tags: [userId]
            });

            existingImage.url = uploadedImage.url; // Update the image URL
            existingImage.name = name;
            await existingImage.save();

            console.log("Updated Image:", existingImage);

            return res.json({ success: true, message: 'Image updated successfully', data: existingImage });
        } else {
            // Upload image to ImageKit
            const uploadedImage = await imagekit.upload({
                file: file.buffer,
                fileName: file.originalname,
                tags: [userId]
            });

            // Save image info to database  
            const newImage = new Image({
                name: name,
                userId: userId,
                url: uploadedImage.url // Assuming uploadedImage.url contains the URL of the uploaded image
            });

            await newImage.save();

            console.log("New Image:", newImage);

            return res.json({ success: true, message: 'Image uploaded successfully', data: newImage });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
    }
};

const getImage = async (req, res) => {
    try {
        // Retrieve image data based on some criteria (e.g., user ID)
        const userId = req.params.userId;
        const image = await Image.findOne({ userId });

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Return the image data along with the name
        return res.json({ success: true, data: { name: image.name, url: image.url } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch image', error: error.message });
    }
};

module.exports = {
  uploadImage,
  getImage
};
