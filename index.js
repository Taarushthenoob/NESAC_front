const express = require('express');
const fileUpload= require('express-fileupload');
const fs = require('fs');
const path = require('path');
const axios= require('axios');
const cors = require('cors');
const bodyParser = require('body-parser')
//import * as tf from '@tensorflow/tfjs-node';
const ImgClassify = require('./ImgClassify');
const SampleZeroes= Array(299*299*3).fill(0);

const app = express();

app.use(cors());
app.use(express.urlencoded({ 
     extended: true 
}));
app.use(express.json());
app.use(fileUpload());

app.post('/upload', (req,res) => {
    if(req.files== null)
    {
        return res.status(400).json({ msg: "No file uploaded." });
    }
    const file = req.files.file;
    const f= req.body.func;
    let extName = path.extname(file.name);

    let imgListIC = ['.png','.jpg','.jpeg','.gif'];
    let imgListSS= ['.tif'];
    if(f==="ic"){
      if(!imgListIC.includes(extName)){
        fs.unlinkSync(file.tempFilePath);
        return res.status(422).json({ msg: "Wrong file type, please upload image only." });
    }
    }
    else{
      if(!imgListSS.includes(extName)){
        fs.unlinkSync(file.tempFilePath);
        return res.status(422).json({ msg: "Wrong file type, please upload tiff file only." });
    }
    }

    // let tensorimg= tf.node.decodeImage(file);
    // console.log(tensorimg.shape);
    

    file.mv(`${__dirname}/nesac_frontend/public/uploads/${file.name}`, err => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        
        res.json({fileName: file.name, filePath: `/uploads/${file.name}` });
    });

    //ImgClassify({});

    axios
//   .get('http://localhost:8000/v2/models/inception_graphdef/versions/1/ready', {})
//   .then(res => {
//     console.log(`statusCode: ${res.status}`)
//     console.log(res)
//   })
//   .catch(error => {
//     console.log(error)
//   })
/*** REMOVED DUE TO ERROR IN LINUX ****/

  

  
});

app.post('/classify', (req,res) => {

  // if(req.files== null)
  //   {
  //       return res.status(400).json({ msg: "No file uploaded." });
  //   }
    // const file = req.files.file;
    // let extName = path.extname(file.name);
   //  const result={};

   const tensor1= req.body.imgtensor;
   console.log(typeof(tensor1));
   let finTensor= tensor1.split(',').map((item)=> {
     return parseInt(item,10);
   });
  axios.post('http://localhost:8000/v2/models/inception_graphdef/versions/1/infer', {
              
                        "id":"01", 
                        "inputs": 
                        [{
                            "name":"input", 
                            "shape":[1,299,299,3], 
                            "datatype":"FP32",  
                            "data":[
                                finTensor
                            ]
                        }], 
                        "outputs":[ {
                            "name":"InceptionV3/Predictions/Softmax", 
                            "parameters": {"classification" : 5}
                        }
                      ] 
                
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": '*',
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }
              }
            )
            .then(resp => {
                console.log(`statusCode: ${resp.statusCode}`);
                console.log(resp.data.outputs[0]);
                //console.log(resp);
                res.send(resp.data.outputs[0]);
              })
              .catch(error => {
                console.log(error)
        });

        

});


app.post('/segment', (req,res) => {

  // if(req.files== null)
  //   {
  //       return res.status(400).json({ msg: "No file uploaded." });
  //   }
    // const file = req.files.file;
    // let extName = path.extname(file.name);
   //  const result={};

   const tensor1= req.body.imgtensor;
   console.log(typeof(tensor1));
   let finTensor= tensor1.split(',').map((item)=> {
     return parseInt(item,10);
   });
  axios.post('http://localhost:8000/v2/models/inception_graphdef/versions/1/infer', {
              
                        "id":"01", 
                        "inputs": 
                        [{
                            "name":"input", 
                            "shape":[1,299,299,3], 
                            "datatype":"FP32",  
                            "data":[
                                finTensor
                            ]
                        }], 
                        "outputs":[ {
                            "name":"InceptionV3/Predictions/Softmax", 
                            "parameters": {"classification" : 5}
                        }
                      ] 
                
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": '*',
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }
              }
            )
            .then(resp => {
                console.log(`statusCode: ${resp.statusCode}`);
                console.log(resp.data.outputs[0]);
                //console.log(resp);
                res.send(resp.data.outputs[0]);
              })
              .catch(error => {
                console.log(error)
        });

        

});

app.listen(5000, () => console.log("Server has started. Listening on port 5000..."));
