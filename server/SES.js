require("dotenv").config();
const cryptoRandomString = require("crypto-random-string");
const aws = require("aws-sdk");

const { AWS_KEY, AWS_SECRET, AWS_REGION, sourceEmail } = process.env;

const ses = new aws.SES({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
    region: AWS_REGION,
});
const resetCode = cryptoRandomString({
    length: 6,
});
const sendResetCode = (email) => {
    
    return ses
        .sendEmail({
            Source: `${sourceEmail}`,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `we sent you a reset code for your password, please enter the code in the required field.!! ${resetCode}`,
                    },
                },
                Subject: {
                    Data: "Your Application Has Been Accepted!",
                },
            },
        })
        .promise()
        .then(() => {})
        .catch((err) => console.log("err", err));
};
module.exports = { sendResetCode, resetCode };