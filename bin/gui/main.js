const $ = require('jquery')
var {ipcRenderer}=require('electron');
var appset = require('../app/settings.json');

var RROOT='../bin/repo/';
var Titlebar = require('../bin/repo/gui/js/modules/vg-titlebar.js');
var {DropNote}=require('../bin/repo/gui/js/modules/vg-dropnote.js');
var {FINDparentele} = require('../bin/repo/gui/js/tools/vg-displaytools.js');
var floatv = require('../bin/repo/gui/js/modules/vg-floatviews.js');
var {aappuser} = require('../bin/repo/ds/users/vogel-users.js');

var {navroutes}=require('../bin/routes.js');

var {usersls}=require('../bin/gui/storage/lstore.js');
var creator = require('../bin/gui/tools/tracker-creation.js');

var qtrack = require('../bin/back/quote-tracking.js');


//  TITLE BAR //////////////////////////////////////////////////////////
try{
  var appuser = JSON.parse(localStorage.getItem(usersls.curruser)).uname;
  document.getElementById(Titlebar.tbdom.info.username).innerText = appuser;
}catch{}

document.getElementById(Titlebar.tbdom.title).innerText = 'Lead Tracker';

let qactions={
  new:{
    id:'new-lead',
    src:'../bin/repo/assets/icons/add-document.png',
    title:'New Lead',
    ondblclick:(ele)=>{creator.EDITtracker();}

  },
  filter:{
    id:'filter-leads',
    src:'../bin/repo/assets/icons/filter.png',
    title:'Filter',
    ondblclick:(ele)=>{floatv.SELECTview(document.getElementById('preview-center'),'Filter Options');}
  }
}
let mactions={
  analytics:{
    id:'tracker-analytics',
    src:'../bin/repo/assets/icons/chart-histogram.png',
    title:'Analytics View',
    ondblclick:(ele)=>{ipcRenderer.send('analytics-page', 'Switching to Analytics...');}
  },
  commish:{
    id:'tracker-commish',
    src:'../bin/repo/assets/icons/dollar-thin.png',
    title:'Commissions View',
    ondblclick:(ele)=>{ipcRenderer.send('commish-page', 'Switching to Commissions...');}
  },

}


Titlebar.SETUPtitlebar(qactions,mactions);

///////////////////////////////////////


document.getElementById(Titlebar.tbdom.page.user).addEventListener('click',(ele)=>{//GOTO LOGIN
  ipcRenderer.send(navroutes.gotologin,'Opening Login Dash...');
});
if(appset.users[appuser].group == "CONS"){
  $(document.getElementById('tracker-commish')).hide();
}else{$(document.getElementById('tracker-commish')).show();}
////////////////////////////////////////////////////////////////////////////////

document.getElementById('tracker-tables').addEventListener('dblclick',(ele)=>{
  let lrow = FINDparentele(ele.target,'tracker-row');
  if(lrow){creator.EDITtracker(lrow);}
});

//var maintlist = new ObjList;
console.log(appuser)
creator.SETUPuseryear(appset.users[appuser].group!='MAN'?appuser:undefined).then(
  list=>{
    //check for updates
    console.log(list);
    qtrack.CHECKquotechanges(list,appset.users[appuser].group!='MAN'?appuser:undefined).then(
      ulist=>{
        //display quotes that
        console.log('CHANGED LIST> ',ulist);
      }
    )
    qtrack.GETuntrackedquotes(list,appset.users[appuser].group!='MAN'?appuser:undefined).then(
      ulist=>{
        //display list of quotes to be tracked
        console.log(ulist);
        qtrack.STARTtrackquotes(ulist).then(
          res=>{
            if(res&&res.err){DropNote('tr','Quotes did not Sync','yellow');console.log(res.err);}
            else{DropNote('tr','Quotes have Synced','green');}
          }
        );
      }
    )
  }
);
