import { S3 } from "aws-sdk";
import fs from "fs";

const endpoint=  "https://44f9e927f4d42ed2e9dcf6ce90d5794f.r2.cloudflarestorage.com";
const access_key_id="942cd726a0a1654fcc4afdf9b1fa4c60";
const access_key_secret= "fd5804722d6923b5bc8e02a4e974c4daba9273048d4db48605efbc0c85302014";

const s3 = new S3({
    endpoint: endpoint,
    accessKeyId: access_key_id,
    secretAccessKey: access_key_secret,
    signatureVersion: "v4",
  });

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-clone-bucket",
        Key: fileName,
    }).promise();
    // console.log(response);
}