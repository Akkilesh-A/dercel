import { S3 } from "aws-sdk";
import fs from "fs"
import path from "path"

const endpoint=  "https://44f9e927f4d42ed2e9dcf6ce90d5794f.r2.cloudflarestorage.com";
const access_key_id="942cd726a0a1654fcc4afdf9b1fa4c60";
const access_key_secret= "fd5804722d6923b5bc8e02a4e974c4daba9273048d4db48605efbc0c85302014";

const s3 = new S3({
    endpoint: endpoint,
    accessKeyId: access_key_id,
    secretAccessKey: access_key_secret,
    signatureVersion: "v4",
  });

    export async function downloadS3Folder(prefix: string) {
        const allFiles = await s3.listObjectsV2({
            Bucket: "vercel-clone-bucket",
            Prefix: prefix
        }).promise();
        
        const allPromises = allFiles.Contents?.map(async ({Key}) => {
            return new Promise(async (resolve) => {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path.join(__dirname, Key);
                const outputFile = fs.createWriteStream(finalOutputPath);
                const dirName = path.dirname(finalOutputPath);
                if (!fs.existsSync(dirName)){
                    fs.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: "vercel-clone-bucket",
                    Key
                }).createReadStream().pipe(outputFile).on("finish", () => {
                    resolve("");
                })
            })
        }) || []
        console.log("awaiting");

        await Promise.all(allPromises?.filter(x => x !== undefined));
    }

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-clone-bucket",
        Key: fileName,
    }).promise();
    console.log(response);
}