const path = require('path'); // Import the path module
const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// localfileupload -> handler function
exports.localFileUpload = async (req, res) => {
    try {
        const file = req.files.file;
        console.log("FILE AA GAYI JEE", file);

        let filePath = path.join(__dirname, "files", Date.now() + `.${file.name.split('.')[1]}`);
        console.log("PATH->", filePath);

        file.mv(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading file",
                });
            }
        });

        res.json({
            success: true,
            message: 'Local File Uploaded Successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

// image upload ka handler
function isFileSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileCloudinary(file, folder,quality) {
    const options = { folder, resource_type: "auto" };
    console.log("temp file path", file.tempFilePath);
    if(quality){
        options.quality=quality;
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
    try {
        // data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);
        // validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!isFileSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'File Format not Supported',
            });
        }
        // file format supported hai
        const response = await uploadFileCloudinary(file, "Codehelp");
        console.log(response);
          // db m entry
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image Successfully Uploaded',
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

// video upload ka handler
exports.videoUpload = async (req, res) => {
    try {
        // fetch data
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;

        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'File Format not Supported',
            });
        }

        // upload to cloudinary
        const response = await uploadFileCloudinary(file, "Codehelp");
        console.log(response);

        // db m entry
        const fileData = await File.create({
            name,
            tags,
            email,
            videoUrl: response.secure_url,
        });
        res.json({
            success: true,
            videoUrl: response.secure_url,
            message: 'Video Successfully Uploaded',
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something Went Wrong',
        });
    }
}


//imagesizereducer
exports.imageSizeReducer=async(req,res)=>{
    try{
        // data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);
        // validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!isFileSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'File Format not Supported',
            });
        }
        // file format supported hai
        const response = await uploadFileCloudinary(file, "Codehelp",30);
        console.log(response);
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image Successfully Uploaded',
        });

    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something Went Wrong',
        });

    }
}