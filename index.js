const express = require('express');
const fileUpload= require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload());

app.post('/upload', (req,res) => {
    if(req.files== null)
    {
        return res.status(400).json({ msg: "No file uploaded." });
    }
    const file = req.files.file;
    let extName = path.extname(file.name);

    let imgList = ['.png','.jpg','.jpeg','.gif'];
    
    if(!imgList.includes(extName)){
        fs.unlinkSync(file.tempFilePath);
        return res.status(422).json({ msg: "Wrong file type, please upload image only." });
    }

    

    file.mv(`${__dirname}/nesac_frontend/public/uploads/${file.name}`, err => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        res.json({fileName: file.name, filePath: `/uploads/${file.name}` });
    });
});

app.listen(5000, () => console.log("Server has started"));