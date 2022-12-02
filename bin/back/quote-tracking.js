var path = require('path');
var {auser} = require('../appuser.js'); //initialize the app user object
var apaths = require('../../app/paths.json');
var {NEDBconnect}=require('../repo/tools/box/nedb-connector.js');
var {PUTtlist}=require('./RRT-requests.js');

var rrstore = path.join(auser.cuser.spdrive,apaths.deproot,apaths.store.root);
var mquotes = path.join(__dirname,'../../store/masterquotes.db')//path.join(rrstore,apaths.store.mquotes);


var aqtrack=(qt={})=>{
  if(!qt){qt={};}
  return{
    _id:qt._id&&qt._id!=''?qt._id:undefined,
    tag:qt.tag||'',
    client:qt.client||'',
    email:qt.email||'',
    phone:qt.phone||'',

    street:qt.street||'',
    city:qt.city||'',
    zip:qt.zip||'',

    comp:qt.comp||'VHC',
    estimator:qt.estimator||'',
    date:qt.date||new Date().toISOString().split('T')[0],

    finance:qt.finance!=undefined?qt.finance:false,
    bookprc:qt.bookprc!=undefined?qt.bookprc:true,
    rewards:qt.rewards!=undefined?qt.rewards:false,
    saletype:qt.saletype||'', //Full Component Other
    lead:qt.lead||'', // [list sourced from vapi]
    source:qt.source||'', // [list sourced from vapi]
    sold:qt.sold!=undefined?qt.sold:false,
    cat:qt.cat||'', // [list sourced from vapi]
    amount:qt.amount||0,

    prstvia:qt.prstvia||'',
    prstdate:qt.prstdate||null,
    status:qt.status||'Open',
    sold:qt.sold!=undefined?qt.sold:false,
    time:qt.time||null

  }
}
var quotes = new NEDBconnect(mquotes);
quotes.QUERYdb({}).then(res=>{console.log(res)})
/* Get untracked Quotes
  Gets user quotes and searches to see if there are any quotes not currently being
  tracked. It adds these to an array for the user to view.
*/
var GETuntrackedquotes = (tlist,cons=undefined)=>{
  return new Promise((resolve,reject)=>{
    quotes.QUERYdb(cons?{estimator:cons}:cons).then(
      result=>{
        let arr = result.err?[]:result.docs; //list of quotes
        let utlist = []; //list of untracked quotes
        for(let x=0,l=arr.length;x<l;x++){
          let found = false;
          for(let y=0,ll=tlist.length;y<ll;y++){
            if(tlist[y].tag===arr[x].id){
              found=true;
              break;
            }
          }
          if(!found){utlist.push(arr[x])}
        }
        return resolve(utlist);
      }
    );
  })
}

var CHECKquotechanges = (qlist,cons=undefined)=>{
  return new Promise((resolve,reject)=>{
    quotes.QUERYdb(cons?{estimator:cons}:cons).then(
      result=>{
        let arr=result.err?[]:result.docs;
        console.log(arr);
        let ctlist=[];//changes
        for(let x=0,l=arr.length;x<l;x++){
          for(let y=0,ll=qlist.length;y<ll;y++){
            if(arr[x].id===qlist.tag){
              if((arr[x].sold&&!qlist.sold) || (!arr[x].sold&&qlist.sold)){
                ctlist.push(arr[x]);
                break;
              }
            }
          }
        }
        return resolve(ctlist);
      }
    )
  })
}
/* Start Tracking Quotes
  Takes a list of user quotes and adds them to the users tracked quotes. These
  quotes will be updated in the tracker when the quote is updated elsewhere.

  If tracking an open quote, the quote will show as a single empty line on their
  tracker. Numerous empty lines of different categories could be added
  depending on the quote contents.

  If tracking a sold quote, the user will be prompted to prepare the job to sell
  by.
*/

var STARTtrackquotes = (ulist)=>{
  let tlist = [];
  for(let x=0,l=ulist.length;x<l;x++){
    let systems = ulist[x].info.build?ulist[x].info.build.systems:[];
    for(let y=0,ll=systems.length;y<ll;y++){
      //create new track
      tlist.push(aqtrack({
        tag:ulist[x].id,
        client:ulist[x].customer.name,
        street:ulist[x].street,
        city:ulist[x].city,
        estimator:ulist[x].estimator,
        zip:ulist[x].zip,
        date:ulist[x].opendate,
        cat:'system'
      }));
    }
  }
  return PUTtlist(tlist);
}

/*
  Takes in a quote and creates and creates the neccessary tracking lines for that
  given quote.
  By defualt a quotes tracking will have one line per system quoted. The user can
  add lines if they sold a trackable item. The total amount being tracked must
  not exceed that of the the quoted amount.
*/
var CREATEquotetrack=()=>{

}
/* Update Tracked Quotes
  Gets user quotes and compares for changes. A list of quotes that have changed
  are prepared for the user. The user will then be able to take the updates or
  not.
*/

module.exports={
  CHECKquotechanges,
  GETuntrackedquotes,
  STARTtrackquotes,
  aqtrack
}
