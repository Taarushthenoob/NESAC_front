import React, {useState} from 'react'
import Alert from 'react-bootstrap/Alert';


const Message = ({msg}) => {
  const [show, setShow] = useState(true);

  if (show) {
      
    return (
      <Alert variant={msg.variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{msg.variant==="success"? "Yay!": "Uh-Oh!"}</Alert.Heading>
        <p>
          {msg.data}
        </p>
      </Alert>
    );
  }
  //return <Button onClick={() => setShow(true)}>Show Alert</Button>;
  return <div></div>;
}


export default Message
