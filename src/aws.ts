import { S3 } from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3({
    endpoint: process.env.BASE_URL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: "v4",
  });

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-clone-bucket",
        Key: fileName,
    }).promise();
    console.log(response);
}