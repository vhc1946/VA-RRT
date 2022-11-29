const $ = require('jquery')
var {ipcRenderer}=require('electron');

var RROOT='../bin/repo/';
var Titlebar = require('../bin/repo/gui/js/modules/vg-titlebar.js');
var {DropNote}=require('../bin/repo/gui/js/modules/vg-poppers.js');
var {navroutes}=require('../bin/routes.js');
var {aappuser} = require('../bin/repo/ds/users/vogel-users.js');
var {usersls}=require('../bin/gui/storage/lstore.js');
var sumtracker = require('../bin/gui/sumtracker.js');
var creator = require('../bin/gui/tracker-creation.js');
var appset = require('../app/settings.json');

var {GETtlist, PUTtlist}= require('../bin/RRT-requests.js');

//  TITLE BAR //////////////////////////////////////////////////////////
try{
  var appuser = JSON.parse(localStorage.getItem(usersls.curruser)).uname;
  document.getElementById(Titlebar.tbdom.info.username).innerText = appuser;
}catch{}
document.getElementById(Titlebar.tbdom.title).innerText = 'Lead Tracker';

let qactions={
  new:{
    id:'new-lead',
    src:'../bin/repo/assets/icons/open-new.png',
    title:'New Lead'
  },
  save:{
    id:'save-leads',
    src:'../bin/repo/assets/icons/disk.png',
    title:'Save'
  }
}

let mactions={
  analytics:{
    id:'tracker-analytics',
    src:'../bin/repo/assets/icons/chart-histogram.png',
    title:'Analytics View'
  },
  commish:{
    id:'tracker-commish',
    src:'../bin/repo/assets/icons/dollar-thin.png',
    title:'Commissions View'
  },

}

let qalist=Titlebar.CREATEactionbuttons(qactions);
let malist=Titlebar.CREATEactionbuttons(mactions);

Titlebar.ADDqactions(qalist);
Titlebar.ADDmactions(malist);

document.getElementById(Titlebar.tbdom.page.user).addEventListener('click',(ele)=>{//GOTO LOGIN
  ipcRenderer.send(navroutes.gotologin,'Opening Login Dash...');
});
document.getElementById(qactions.save.id).addEventListener('dblclick',(ele)=>{
  sumtracker.SAVEtrackers(trackerpath,trackerfile,appuser);
});

document.getElementById('tracker-analytics').addEventListener('click', (ele)=>{
  ipcRenderer.send('analytics-page', 'Switching to Analytics...');
});

document.getElementById('tracker-commish').addEventListener('click', (ele)=>{
  ipcRenderer.send('commish-page', 'Switching to Commissions...');
});

if(appset.users[appuser].group == "CONS"){
  $(document.getElementById('tracker-commish')).hide();
}else{
  $(document.getElementById('tracker-commish')).show();
}


document.getElementById('tracker-tables').addEventListener('dblclick',(ele)=>{
  let lrow = gendis.FINDparentele(ele.target,'tracker-row');
  if(lrow){
    for(let i=0;i<asumtracker.list.length;i++){
      if(asumtracker.list[i].client == lrow.children[1].innerText){
        index = i;
        currtab = lrow.parentNode.parentNode.id;
        EDITtracker();
        break;
      }
    }
  }
});

document.getElementById('tracker-edit-save').addEventListener('click', (ele)=>{
  for(let i in asumtrackerrow()){
    asumtracker.list[index][i] = document.getElementById(`preview-value-${i}`).value;
  }
  FILLtab(currtab);
  FILLtop();
});

//var maintlist = new ObjList;
var SETUPuseryear = ()=>{
  GETtlist().then(
    data=>{
      console.log(data.body.result);
      sumtracker.SETsumtracker(data.body.result);
      creator.CREATEviews(appuser);
      creator.FILLtop(appuser)
    }
  )
}

SETUPuseryear();
