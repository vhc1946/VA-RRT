
var trackerpath = path.join(au.auser.cuser.spdrive,'Vogel - IM/dev/SharePoint/Vogel - Res HVAC/Residential Sales Trackers/');
var trackerfile =  ' Sales Tracker.xlsx';

var asumtrackerrow = (astr = null) => {
  if (!astr||astr==undefined){astr={}}
  return{
    cons: astr["cons"] || '', //keep
    date: ExcelDateToJSDate(astr["date"]) || '', //keep
    //master:astr.mather (TRUE || FALSE)
    //sold:astr.sold (TRUE || FALSE)
    comp: astr["comp"] || '',  //keep
    client: astr["client"] || '', //keep
    street: astr["street"] || '', //keep
    city: astr["city"] || '', //keep
    zip: astr["zip"] || '', //keep
    phone1: astr["phone1"] || '', //keep
    email: astr["email"] || '', //keep
    time: astr["time"] || '', //keep
    source: astr["source"] || '', //keep
    lead: astr["lead"] || '', //keep
    rewards: astr["rewards"] || '', //keep
    prstvia: astr["prstvia"] || '', //keep
    bookprc: astr["bookprc"] || '', //keep
    prstdate: ExcelDateToJSDate(astr["prstdate"]) || '', //keep
    finance: astr["finance"] || '', //keep
    saletype: astr["saletype"] || '', //keep
    // salecat: astr.salecat,
    // amount: astr.amount,
    amounts:{
      iaq: parseInt(astr["iaq"] || '0'),
      option4: parseInt(astr["option4"] || '0'),
      option3: parseInt(astr["option3"] || '0'),
      option2: parseInt(astr["option2"] || '0'),
      option1: parseInt(astr["option1"] || '0'),
      boiler: parseInt(astr["boiler"] || '0'),
      cutin: parseInt(astr["cutin"] || '0'),
      desbuild: parseInt(astr["desbuild"] || '0'),
      windows: parseInt(astr["windows"] || '0'),
      doors: parseInt(astr["doors"] || '0'),
      gblock: parseInt(astr["gblock"] || '0'),
      insul: parseInt(astr["insul"] || '0'),
      repair: parseInt(astr["repair"] || '0')
    }
  }
};


var LOADtrackers=(trackerpath,trackerfile)=>{  //Loads excel files
    let templist = [];
    for (let i in appset.users){
      if(appset.users[i].group=='CONS'){
        let book = reader.readFile(path.join(trackerpath,appset.users[i].name+trackerfile));
        let rows = reader.utils.sheet_to_json(book.Sheets['tblALL']);
        for (let x = 0; x<rows.length; x++){
          templist.push(asumtrackerrow(rows[x]));
        }
      }
    }
    asumtracker.SETlist(templist);
    return asumtracker.list;
  }

var SAVEtrackers=(trackerpath,trackerfile,user)=>{
    let list = asumtracker.TRIMlist({cons:appset.users[user].name});
    for(let x=0;x<list.length;x++){
        for(let key in list[x].amounts){
        list[x][key] = list[x].amounts[key];
        }
    }
    let filepath = path.join(trackerpath,appset.users[user].name+trackerfile);
    let book = reader.utils.book_new();
    let sheet = reader.utils.json_to_sheet(list);

    reader.utils.book_append_sheet(book,sheet,'tblALL');
    reader.writeFile(book,filepath);
}
