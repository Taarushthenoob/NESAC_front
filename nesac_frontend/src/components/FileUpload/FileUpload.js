import React, {Fragment, useState} from 'react'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import Message from '../Message/Message'
import Form from 'react-bootstrap/Form'
import { Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as tf from '@tensorflow/tfjs';
import 'antd/dist/antd.css';
import { SampleZeroes } from './samleZeroes';
import Classifications from './Classifications';

const FileUpload = ({func}) => {
    const [file, setFile]= useState(null);
    const [fileName, setFileName]= useState('No file chosen');
    const [uploadedFile, setUploadedFile]= useState({});
    const [outdata, setOutdata] = useState({});
    const [gotData, setGotData] = useState(false);
    //const [msg, setMsg]= useState({});
    //const [show, setShow] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [classifying, setClassifying] = useState(false);

    const openNotificationWithIcon = (type,info) => {
        notification[type]({
            message: type==='success'?'Yay!':'Uh-Oh!',
            description: info,
            duration: 5,
        });
    };

    // const onChange= file => {
    //     // setFile(e.target.files[0]);
    //     // setFileName(e.target.files[0].name);
    //     setFile(file);
    //     setFileName(file.name);
    //     return false;
    // };

    const SemanticImg= async e => {
        e.preventDefault();
        const formData = new FormData();
        
        const gantImage = document.getElementById('gant') ;
        const gantTensor = tf.browser.fromPixels(gantImage) ;
        console.log( 
        `Successful conversion from DOM to a ${gantTensor.shape} tensor`
        );
        const newSize= [299, 299];
        let finalTensor = tf.image.resizeBilinear( 
            gantTensor,
            newSize,
            true 
        )
        console.log( 
        `Successful conversion from DOM to a ${finalTensor.shape} tensor`
        );
        finalTensor= finalTensor.reshape([-1]);
        const values= finalTensor.dataSync();
        let finalArray=Array.from(values);
        console.log(finalArray);
        formData.append('imgtensor', finalArray);
        setClassifying(true);

        try {
            const res = await axios.post('/segment', formData, {
                headers: {
                    'Content-Type': 'multi-part/form-data'
                }
                });

            

            setOutdata(res.data);
            setClassifying(false);
                setGotData(true);
            openNotificationWithIcon("success", "Top 5 classifications are shown");
            
        } catch(err) {
            if(err.statusCode=== 500) {
                setClassifying(false);
                openNotificationWithIcon("error", "There was a problem with the Inference server. Try again after a while.");
            } else {
                setClassifying(false);
                openNotificationWithIcon("error", "F");
            }

        }

        return false;

    };





    const ClassifyImg= async e => {
        e.preventDefault();
        const formData = new FormData();
        
        const gantImage = document.getElementById('gant') ;
        const gantTensor = tf.browser.fromPixels(gantImage) ;
        console.log( 
        `Successful conversion from DOM to a ${gantTensor.shape} tensor`
        );
        const newSize= [299, 299];
        let finalTensor = tf.image.resizeBilinear( 
            gantTensor,
            newSize,
            true 
        )
        console.log( 
        `Successful conversion from DOM to a ${finalTensor.shape} tensor`
        );
        finalTensor= finalTensor.reshape([-1]);
        const values= finalTensor.dataSync();
        let finalArray=Array.from(values);
        console.log(finalArray);
        formData.append('imgtensor', finalArray);
        setClassifying(true);

        try {
            const res = await axios.post('/classify', formData, {
                headers: {
                    'Content-Type': 'multi-part/form-data'
                }
                });

            

            setOutdata(res.data);
            setClassifying(false);
                setGotData(true);
            openNotificationWithIcon("success", "Top 5 classifications are shown");
            
        } catch(err) {
            if(err.statusCode=== 500) {
                setClassifying(false);
                openNotificationWithIcon("error", "There was a problem with the Inference server. Try again after a while.");
            } else {
                setClassifying(false);
                openNotificationWithIcon("error", "F");
            }

        }

        // try {
        //     const res = await axios.post('http://localhost:8000/v2/models/inception_graphdef/versions/1/infer',  {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             "Access-Control-Allow-Origin": '*',
        //             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        //         },
        //         body: {
        //                 "id":"01", 
        //                 "inputs": 
        //                 [{
        //                     "name":"input", 
        //                     "shape":[2,299,299,3], 
        //                     "datatype":"FP32",  
        //                     "data":[
        //                         SampleZeroes, SampleZeroes
        //                     ]
        //                 }], 
        //                 "outputs":[ {
        //                     "name":"InceptionV3/Predictions/Softmax", 
        //                     "parameters": {"classification" : 5}
        //                 }, {
        //                     "name":"InceptionV3/Predictions/Softmax", 
        //                     "parameters": {"classification" : 5}
        //                 }] 
        //         }
        //         }
        //     );

        //     console.log(res);

        //     openNotificationWithIcon("success", "Inference received from localhost:8000");
            
        // } catch(err) {
        //     if(err.status=== 500) {
        //         setUploading(false);
        //         openNotificationWithIcon("error", "There was a problem with the Inference server. Try again after a while.");
        //     } else {
        //         setUploading(false);
        //         openNotificationWithIcon("error", "F");
        //     }

        // }
        return false;

    };


    const onSubmit= async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('func',func);
        setUploading(true);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multi-part/form-data'
                }
                });

            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });
            setUploading(false);
                
            openNotificationWithIcon("success", "File uploaded successfully");
            
        } catch(err) {
            if(err.response.status=== 500) {
                setUploading(false);
                openNotificationWithIcon("error", "There was a problem with the server. Try again after a while.");
            } else {
                setUploading(false);
                openNotificationWithIcon("error", err.response.data.msg);
            }

        }

        return false;

    };

    const props = {
      onRemove: file => {
        setFile(null);
        setFileName("no file chosen");
        setUploadedFile({});
        setGotData(false);
        setOutdata([]);


      },
      beforeUpload: file => {
        setFile(file);
        setFileName(file.name);
        setUploadedFile({});
        setGotData(false);
        setOutdata([]);
        return false;
      },
      
    };

    return (
        <>
            {/* {show? (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{msg.variant==="success"? "Yay!": "Uh-Oh!"}</Alert.Heading>
                <p>
                {msg.data}
                </p>
            </Alert>) : null} */}
            
                <div className="custom-file mb-4">
                    {/* <input type='file' className='custom-file-input' id='customFile' onChange={onChange} />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {fileName}
                    </label> */}
                    {/* <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Upload
                        action={onSubmit}
                        listType="picture"
                        maxCount={1}
                        >
                        <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                        </Upload>
                    </Space> */}
                    <Upload  {...props} maxCount={1}>
                        <Button icon={<UploadOutlined />}>{func==="ic"?"Select File [.jpg & .png only]":"Select File [.tif only]"}</Button>
                    </Upload>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                        disabled={file === null}
                        loading={uploading}
                        style={{ marginTop: 16 }}
                        >
                        {uploading ? 'Uploading' : 'Start Upload'}
                    </Button>
                </div>
            {/* <input type="submit" value="upload" className="btn btn-primary btn-block mt-3" /> */}
            

            { uploadedFile ? (
                
                <div className="row mt-5">
                    <div className='col-md-6 m-auto'>
                        <h4 className='text-center'> {uploadedFile.fileName}</h4>
                        <img id='gant' style={{width: '100%'}} src={uploadedFile.filePath} alt='' />
                    </div>
                </div>
                ) : null}
                {
                    func==="ic"? <><Button
                        type="submit"
                        onClick={ClassifyImg}
                        disabled={file === null}
                        loading={classifying}
                        style={{ marginTop: 16 }}
                        >
                        {classifying ? 'Getting data...' : 'Run Image Classification'}
                    </Button>
                    {
                        gotData? (
                            <div className="row mt-5">
                        <div className='col-md-6 m-auto'>
                            <h4 className='text-center'> Top 5 classifications with probability</h4>
                            <Classifications data={outdata} />
                        </div>
                        </div>
                        ): null
                    }
                    </> :
                    <>
                    <Button
                        type="submit"
                        onClick={SemanticImg}
                        disabled={file === null}
                        loading={classifying}
                        style={{ marginTop: 16 }}
                        >
                        {classifying ? 'Getting data...' : 'Run Semantic Segmentation'}
                    </Button>
                    {
                        gotData? (
                            <div className="row mt-5">
                        <div className='col-md-6 m-auto'>
                            <h4 className='text-center'> Top 5 classifications with probability</h4>
                            <Classifications data={outdata} />
                        </div>
                        </div>
                        ): null
                    }
                    </>
                }
                

               
            
        </>
    )
}

export default FileUpload;
