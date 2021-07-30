//import * as tf from '@tensorflow/tfjs-node';
const fs = require('fs');
const path = require('path');
const axios= require('axios');

const ImgClassify= (imgobj) => {
    axios
  .get('https://localhost:8000/v2', {})
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch(error => {
    console.log(error)
  })

}

module.exports= ImgClassify;