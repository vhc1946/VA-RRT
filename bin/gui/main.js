const $ = require('jquery')
var {ipcRenderer}=require('electron');

var RROOT='../bin/repo/';
var Titlebar = require('../bin/repo/gui/js/modules/vg-titlebar.js');
var {DropNote}=require('../bin/repo/gui/js/modules/vg-poppers.js');
var {navroutes}=require('../bin/routes.js');
var {aappuser} = require('../bin/repo/ds/users/vogel-users.js');
var {usersls}=require('../bin/gui/storage/lstore.js');
var creator = require('../bin/gui/tracker-creation.js');
var appset = require('../app/settings.json');
var { FINDparentele } = require('../bin/repo/gui/js/tools/vg-displaytools.js');

var { EDITtracker } = require('../bin/gui/sumtracker.js');

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
  let lrow = FINDparentele(ele.target,'tracker-row');
  if(lrow){
    EDITtracker(lrow);
  }
});

// QUOTE SYNCING //

var qtrack = require('../bin/quote-tracking.js');

//var maintlist = new ObjList;

/*
Erik F
Jeff V
Grant V
Ken W
Jessica V
*/
var fs = require('fs');
var path=require('path');

creator.SETUPuseryear(appset.users[appuser].group!='MAN'?appset.users[appuser].name:undefined).then(
  list=>{
    console.log('User List: ',list);
    qtrack.GETuntrackedquotes(list,'VOGCH').then(
      ulist=>{
        console.log('Untracked List: ',ulist);
        console.log(qtrack.STARTtrackquotes(ulist));
      }
    )
  }
);
/*
    for(let i=0;i<list.length;i++){
      list[i].bookprc = (list[i].bookprc.toUpperCase() == "Y")?true:false;
      list[i].finance = (list[i].finance.toUpperCase() == "Y")?true:false;
      list[i].rewards = (list[i].rewards.toUpperCase() == "Y")?true:false;

      list[i].estimator = list[i].cons;
      delete list[i].cons;

      for(let cat in list[i].amounts){
        if(list[i].amounts[cat] > 0){
          list[i].amount = list[i].amounts[cat];
          list[i].cat = cat;
          break;
        }
      }
      delete list[i].amounts;

      list[i] = qtrack.aqtrack(list[i]);

    }

    console.log("Converted> ",list);

    fs.writeFile(path.join(__dirname,'../store/convertlist.json'),JSON.stringify(list),(err)=>{
      console.log(err?err:'WAS filed');
    });
    */
