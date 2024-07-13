import axios from 'axios';


const axoisInstance = axios.create({});

export const apiConnector =(method,url,bodyData,headers,params)=>{
   return  axoisInstance({
    method:`${method}`,
    url:`${url}`,
    data:bodyData?bodyData:null,
    headers:headers?headers:null,
    params:params?params:null
   });
}