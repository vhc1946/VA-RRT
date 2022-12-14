var appset = require('../../app/settings.json');

var GENlists=(list,data,date=null)=>{
  list.vhc = list.vhc.concat(data.TRIMlist({comp:'VHC', date:date}, date?true:false));
  list.bee = list.bee.concat(data.TRIMlist({comp:'BEE', date:date}, date?true:false));
  list.comb = list.bee.concat(data.TRIMlist({ date:date}, date?true:false));
  return list;
}

var ametric=(am={})=>{
  if(!am){am={}}
  return{
    rev:am.rev||0,
    leads:am.leads||0,
    gleads:am.gleads||0,
    wins:am.winds||0,
    close:am.close||0,
    rpo:am.rpo||0,
    replace:am.replace||0,
    projects:am.projects||0,
    env:am.env||0,
    commsub:am.commsub||0,
    comm:am.comm||0,
    book:am.book||{count:0, rate:.01, comm:0},
    direct:am.direct||{sales:0, rate:.01, comm:0},
    spec:am.spec||{sales:0, rate:.05, comm:0},
    commish:am.commish||{},
    opts:am.opts||{}
  }
}

var GENmetrics=(list,paygroups=appset.reporting.commishtable.paygroups,categories=appset.reporting.categories)=>{  // Generates metrics
  let metrics = ametric();
  let qwinlose = {};

  for(let x=0;x<paygroups.length;x++){
    metrics.commish[paygroups[x].toLowerCase()]={
      total:0,
      spec:0,
      rate:0
    }
  }
  for(let c in categories){
    metrics.opts[c]={
      total:0,
      spec:0,
      count:0
    }
  }

  metrics.gleads = list.length;  // gross leads (before cancels)

  for(let x=0;x<list.length;x++){

    if(list[x].sold){
      metrics.rev = metrics.rev + Number(list[x].amount);
    }
    if(!qwinlose[list[x].tag]){qwinlose[list[x].tag]=false;}
    if (list[x].sold){   // totals number of wins
      qwinlose[list[x].tag]=true;
    }
  }
  //figure wins and loses
  for(let wl in qwinlose){
    metrics.leads++;
    if(qwinlose[wl]){metrics.wins++;}
  }
  
  if (metrics.leads != 0){  // calculates RPO and close %
    metrics.rpo = (metrics.rev / metrics.leads).toFixed(2);
    metrics.close = ((metrics.wins / metrics.leads) * 100).toFixed(1);
  }else{
    metrics.rpo = 0;
    metrics.close = 0;
  }

  return metrics;
}

var GENanalytics=(list)=>{
  let metrics = GENmetrics(list);
  return metrics;
}

var GENcommish=(list)=>{
  let metrics = GENmetrics(list);

  for(let key in metrics.commish.base){  // totals amounts for each commission tier
    metrics.commish.base[key] = metrics.opts.option4[key] + metrics.opts.option3[key] + metrics.opts.cutin[key] + metrics.opts.desbuild[key] + metrics.opts.iaq[key];
    metrics.commish.mid[key] = metrics.opts.option2[key] + metrics.opts.boiler[key];
    metrics.commish.prem[key] = metrics.opts.option1[key];
  }

  let ctable = appset.reporting.commishtable;

  for(let x=0;x<ctable.closerates.length;x++){
    if(metrics.close < ctable.closerates[x].rate){
      for(let y=0;y<ctable.paygroups.length;y++){
        metrics.commish[ctable.paygroups[y].toLowerCase()].rate=ctable.closerates[x].payouts[y]}
      break;
    }
  }

  /*
  console.log('COMMISH ',metrics.commish);

  if(metrics.close < 30.01){  // calculates commission rates
    metrics.commish.base.rate = .05;
    metrics.commish.mid.rate = .05;
    metrics.commish.prem.rate = .05;
  }else if(metrics.close < 35){
    metrics.commish.base.rate = .05;
    metrics.commish.mid.rate = .05;
    metrics.commish.prem.rate = .05;
  }else if(metrics.close < 40){
    metrics.commish.base.rate = .05;
    metrics.commish.mid.rate = .06;
    metrics.commish.prem.rate = .07;
  }else if(metrics.close < 45){
    metrics.commish.base.rate = .06;
    metrics.commish.mid.rate = .07;
    metrics.commish.prem.rate = .08;
  }else if(metrics.close < 50){
    metrics.commish.base.rate = .07;
    metrics.commish.mid.rate = .08;
    metrics.commish.prem.rate = .09;
  }else if(metrics.close < 55){
    metrics.commish.base.rate = .08;
    metrics.commish.mid.rate = .09;
    metrics.commish.prem.rate = .09;
  }else if(metrics.close < 60){
    metrics.commish.base.rate = .08;
    metrics.commish.mid.rate = .09;
    metrics.commish.prem.rate = .10;
  }else{
    metrics.commish.base.rate = .09;
    metrics.commish.mid.rate = .10;
    metrics.commish.prem.rate = .11;
  }
  console.log(metrics.commish);
  */
  for(let key in metrics.commish){
    metrics.commish[key].subtotal = metrics.commish[key].total - metrics.commish[key].spec;
    metrics.commish[key].earned = Math.trunc(metrics.commish[key].subtotal * metrics.commish[key].rate);
    metrics.commsub = metrics.commsub + metrics.commish[key].earned;
  }
  metrics.direct.comm = Math.trunc(metrics.direct.sales * metrics.direct.rate);
  metrics.spec.sales = metrics.commish.base.spec + metrics.commish.mid.spec + metrics.commish.prem.spec;
  metrics.spec.comm = Math.trunc(metrics.spec.sales * metrics.spec.rate);

  metrics.book.percent = (1 - (metrics.book.count / metrics.leads));

  for(let x=0;x<ctable.bookrates.length;x++){
    if(metrics.book.percent < ctable.bookrates[x].rate){
      metrics.book.rate = ctable.bookrates[x].payout;
      break;
    }
  }

  if(metrics.book.percent < .501){  // calculates Book Price modifier
    metrics.book.rate = -.03;
  }else if(metrics.book.percent < .601){
    metrics.book.rate = -.02;
  }else if(metrics.book.percent < .701){
    metrics.book.rate = -.01;
  }else if(metrics.book.percent < .801){
    metrics.book.rate = -.005;
  }else if(metrics.book.percent < .85){
    metrics.book.rate = 0;
  }else if(metrics.book.percent < .86){
    metrics.book.rate = .001;
  }else if(metrics.book.percent < .87){
    metrics.book.rate = .002;
  }else if(metrics.book.percent < .88){
    metrics.book.rate = .003;
  }else if(metrics.book.percent < .89){
    metrics.book.rate = .004;
  }else if(metrics.book.percent < .9){
    metrics.book.rate = .005;
  }else if(metrics.book.percent < .91){
    metrics.book.rate = .006;
  }else if(metrics.book.percent < .92){
    metrics.book.rate = .007;
  }else if(metrics.book.percent < .93){
    metrics.book.rate = .008;
  }else if(metrics.book.percent < .94){
    metrics.book.rate = .009;
  }else{
    metrics.book.rate = .01;
  }
  metrics.book.comm = metrics.rev * metrics.book.rate;
  metrics.book.percent = (metrics.book.percent * 100).toFixed(1);

  metrics.comm = Math.trunc(metrics.book.comm + metrics.direct.comm + metrics.spec.comm + metrics.commsub);  // total VHC commissions

  metrics.beerate = .08;
  if(metrics.env && metrics.env != 0){
    metrics.beecommish = metrics.env * metrics.beerate;
  }else{
    metrics.beecommish = 0;
  }



  return metrics;
}

module.exports={
  GENmetrics,
  GENanalytics,
  GENcommish
}
