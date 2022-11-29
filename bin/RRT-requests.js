var vapi = require('./repo/apis/vapi/vapicore.js');

var PUTtlist=(tr=[])=>{
  return new Promise((res,rej)=>{
  var tpull = {
    collect:'apps',
    store:'SUMTRACKER',
    db:'mtracker',
    method:'insert',
    options:{
      docs:tr
    }};
    vapi.SENDrequestapi(tpull,'mart').then(
      result=>{
        return res(result);
      }
    )
  })
}

/* Modify Send SENDrequest
  Look in FT for updated SENDrequest
*/
var GETtlist=()=>{
  return new Promise((res,rej)=>{
    var tpull = {
      collect:'apps',
      store:'SUMTRACKER',
      db:'mtracker',
      method:'query',
      options:{query:{}}
    };
    vapi.SENDrequestapi(tpull,'mart').then(
      result=>{
        return res(result);
      }
    )
  })
}

module.exports={
  PUTtlist,
  GETtlist
}
