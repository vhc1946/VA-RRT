var vapi = require('../repo/apis/vapi/vapicore.js');

var halfpack = (method='',opts={})=>{
  return{
    collect:'apps',
    store:'SUMTRACKER',
    db:'mtracker',
    method:method,
    options:opts
  }
}
var PUTtlist=(tr=[])=>{
  return new Promise((res,rej)=>{
    if(tr.length!=0){
      var tpull = halfpack('insert',{
        docs:tr
      });
      vapi.SENDrequestapi(tpull,'mart').then(
        result=>{
          console.log('PUT LIST>> ',result);
          return res(result);
        }
      )
    }else{return res(false);}
  })
}

/* Modify Send SENDrequest
  Look in FT for updated SENDrequest
*/
var GETtlist=(cons=null)=>{
  return new Promise((res,rej)=>{
    var tpull = halfpack('query',{
      query:{estimator:cons?cons:undefined}
    });
    vapi.SENDrequestapi(tpull,'mart').then(
      result=>{
        console.log('GET LIST>> ',result);
        return res(result);
      }
    )
  })
}

var RMtlist=()=>{
  return new Promise((res,rej)=>{
    let ropt=halfpack('remove',{
      query:{},
      allow:true
    });
    vapi.SENDrequestapi(ropt,'mart').then(
      result=>{
        return res(result);
      }
    )
  })
}

/*
RMtlist().then(
  res=>{console.log(res);}
)
*/
module.exports={
  PUTtlist,
  GETtlist
}
