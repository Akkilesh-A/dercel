import express from "express";
import cors from "cors"
import simpleGit from "simple-git";
import { generateRandomString } from "./utils";
import path from "path"
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import dotenv from "dotenv";

const app=express()
app.use(express.json())
app.use(cors())
dotenv.config()

app.get("/",(req,res)=>{
    res.status(200).json({
        message:`Healthy server running on port 3000`
    })
})

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generateRandomString();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    // console.log(files);

    files.forEach(async file => {
        let normalizedPath = file.replace(/\\/g, '/');
        await uploadFile(normalizedPath.slice(__dirname.length + 1), file);
    })

    // await new Promise((resolve) => setTimeout(resolve, 5000))
    // publisher.lPush("build-queue", id);

    // publisher.hSet("status", id, "uploaded");

    res.json({
        message:"Repo cloned successfully",
        id: id
    })

});

// app.get("/status", async (req, res) => {
//     const id = req.query.id;
//     const response = await subscriber.hGet("status", id as string);
//     res.json({
//         status: response
//     })
// })

app.listen(3000,()=>{
    console.log(`Listening on port 3000`)
})