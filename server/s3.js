const S3 = require("aws-sdk/clients/s3");
require("dotenv").config();
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const { AWS_KEY, AWS_SECRET, AWS_BUCKET_NAME } = process.env;

const s3 = new S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        res.json({
            success: false,
            message: "File upload failed",
        });
    }
    console.log(req.file);
    const { filename, mimetype, size, path } = req.file;

    const imgPath = fs.createReadStream(path);

    // add a func fs.unlinkSync(filePath) to delete the image from uploads

    console.log("the file in Server", req.file);
    const promise = s3
        .putObject({
            Bucket: `${AWS_BUCKET_NAME}`,
            ACL: "public-read",
            Key: filename,
            Body: imgPath,
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then((result) => {
            console.log("success, the result of the promise from s3");

            unlinkFile(req.file.path);
            next();
        })
        
        .catch((err) => {
            console.log("error s3",err);
            // uh oh
            return res.sendStatus(500);
        });
};
