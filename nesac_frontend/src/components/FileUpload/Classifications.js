import React from 'react'


const Classifications = ({data}) => {
    console.log(data);
    return (
        <div style={{ 
            //display: "grid",
             //justifyContent: 'center', 
             //alignItems: 'center', 
             width:"100%", 
             //gridTemplateColumns: 2
            }}>
            {data.data.map((str) => {
                str=str.slice(0,str.length-1)
                const data= str.split(':')
                return <div style={{width:"100%"}}>{data[2]+"        :        "+data[0]}</div>
            })}
        </div>
    )
}



export default Classifications;
