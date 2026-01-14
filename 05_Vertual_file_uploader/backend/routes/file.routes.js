import express from "express"
import { createWriteStream } from "fs"
import path from "path"

const router = express.Router()

router.post("/:filename", (req, res) => {
   const filename = req.params.filename
   const writeStream = createWriteStream(`./stroage/${filename}`)
   req.pipe(writeStream)
   res.send("file uploaded")
})  

export default router