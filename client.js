































/*jslint bitwise: true, browser: true, continue: true, es5: true, maxerr: 8, node: true, nomen: true, regexp: true, stupid: true, sub: true, white: true */ /*global $, atob: true, Buffer, btoa: true, chrome, Float64Array: true, jQuery, YUI */ (function() { 'use strict'; var db, debug, HND_II, LN2, my, PI1, PI2, rqd, svr; if(window.my && window.my.IS_NODEJS) { global.window = global.process.window; global.window.global = global.window.window = global.window; } debug = window.debug = window.debug || {}; HND_II = -1; my = window.my = window.my || {}; db = my.db = window.db = my.db || {}; LN2 = window.LN2 = Math.log(2); PI1 = window.PI1 = Math.PI; PI2 = window.PI2 = 2 * PI1; rqd = my.rqd = window.rqd = my.rqd || {}; svr = my.svr = window.svr = my.svr || {}; (function() {
  var client, fnn; client = window.client = window.client || {};
  //// debug
  my.sseReload();
  ['cnvOut', 'textStdin', 'textStdout', 'textFile'].forEach(
    function(kk) {client[kk] = document.getElementById(kk);});
  //// finance
  fnn = window.fnn = window.fnn || document.getElementById('tabFnn');
  fnn.cnv = fnn.querySelector('canvas');
  fnn.fnRender = function(oo, vv) {
    return vv.toString().replace(/(\d+\.\d\d).+/, '$1');};
  fnn.input = fnn.querySelectorAll('input[type="text"]');
  fnn.input[0].value = 'yhoo,ibm';
  
  
  
  fnn.input[2].value = new Date().toISOString().slice(0, 10);
  fnn.input[1].value = my.tmDateAdd(fnn.input[2].value, -364).toISOString().slice(0, 10);
  
  
  fnn.nData = fnn.nData || fnn.querySelector('#fnnData');
  //// OPTIMIZATION - cache callback
  fnn._xhrGetStock = function(data, kwargs2) {
    var aaData, fit, ii1, ii2, ll1, ll2, scale, tmp, ww1, ww2, yscale, yy;
    ll1 = data.ll1; ll2 = data.tt.ll2; yscale = data.sink(1).max1(data);
    yy = data.mul(yscale.copy().inv()).slice(null, null, null, ll2);
    fit = yy.sink(Number(fnn.querySelector('select').value) + 3).fitCos(yy);
    //// forecast
    yy = data.copy(); yy.slice(null, null, ll2, null).set(data.slice(null, null, ll2 - 1, ll2));
    //// itp
    yy = data.sink(Math.min(fnn.cnv.width, data.ll2)).itp2(data);
    scale = data.ll2 / yy.ll2;
    yy = my.Array2.zip(
      yy,
      yy.zeros().addPoly(fit.slice(null, null, 3, null), scale),
      yy.zeros().addCos(fit, scale));
    //// debug
    fnn.data = data; fnn.fit = fit; fnn.yy = yy;
    window.yy = yy; yy.plot2d(
      {
        'cnv': fnn.cnv,
        'legend': kwargs2.qq,
        'lineV': [[ll2 / scale, '#000']],
        'stack': true});
    aaData = my.Array2(8, ll1); aaData.slice(4, 7).transpose().fitCosTime(fit);
    tmp = my.Array2(1, ll1); yscale.transpose();
    ii1 = -1;
    //// order
    ii1 += 1; aaData.get(ii1).set(my.count());
    //// stock
    ii1 += 1;
    //// timeframe
    ii1 += 1; aaData.get(ii1).set(ll2);
    //// moving average
    ii1 += 1; aaData.get(ii1).mean1(data).mul(yscale);
    //// amplitude
    ii1 += 1; aaData.get(ii1).mul(yscale);
    //// period
    ii1 += 1; ww1 = aaData.get(ii1); ww2 = ww1.copy().mul(0.5);
    //// high
    ii1 += 1; yy = aaData.get(ii1).sub(tmp.set(ww1).modInv(ll2));
    yy.minMag(tmp.set(yy).add(ww1));
    //// low
    ii1 += 1; aaData.get(ii1).set(yy).add(ww2).minMag(tmp.set(yy).sub(ww2));

    aaData = aaData.transpose().toAoa();
    for(ii1 = 0; ii1 < aaData.length; ii1 += 1) {tmp = aaData[ii1]; tmp[1] = kwargs2.qq[ii1];}
    ii1 = -1;
    fnn.nData.table = jQuery(fnn.nData).dataTable(
      {
        'aaData': aaData,
        'aoColumnDefs': [
          {'fnRender': fnn.fnRender, 'aTargets': ['_all']},
          {'sTitle': '#', 'aTargets': [ii1 += 1]},
          {'sTitle': 'stock', 'aTargets': [ii1 += 1]},
          {'sTitle': 'timeframe (days)', 'aTargets': [ii1 += 1]},
          {'sTitle': 'avg price ($)', 'aTargets': [ii1 += 1]},
          {'sTitle': 'amplitude ($)', 'aTargets': [ii1 += 1]},
          {'sTitle': 'periodicity (days)', 'aTargets': [ii1 += 1]},
          {'sTitle': 'high (days)', 'aTargets': [ii1 += 1]},
          {'sTitle': 'low (days)', 'aTargets': [ii1 += 1]},],
        'bDeferRender': true,
        'bDestroy': true,
        'bProcessing': true,
        'iDisplayLength': 100});
    fnn.nData.width = '100%'; if(fnn.INIT) {return;} fnn.INIT = true;
};
  fnn.xhrGetStock = function() {
    var kwargs; kwargs = {'fnc': fnn._xhrGetStock};
    kwargs.qq = fnn.input[0].value.toUpperCase().split(/[^\w.]+/).filter(my.echo);
    kwargs.beg = my.htmlDateValidate(fnn.input[1].value); if(!kwargs.beg) {return;}
    kwargs.end = my.htmlDateValidate(fnn.input[2].value); if(!kwargs.end) {return;}
    kwargs.beg = my.tmDate2Int(kwargs.beg); kwargs.end = my.tmDate2Int(kwargs.end);
    my.xhrGetStock(kwargs);};
  fnn.onchange = function(evt) {
    fnn.xhrGetStock();
  };
  //// global event
  document.onchange = document.onchange || function(evt) {
    client.evt = evt;
    switch(evt.target.id) {
      case 'textFile': my.htmlTextareaLoadFile(client.textStdin, evt.target.files[0]); break;}};
  document.onclick = function(evt) {
    client.evt = evt;
    switch(evt.target.id) {
      case 'btnExec':
        //// JSLINT_IGNORE_BEG
        window.eval(my.parseBraket(my.htmlTextareaRead(client.textStdin))); break;
        //// JSLINT_IGNORE_END
      case 'btnBraket':
        client.textStdout.value = my.parseBraket(my.htmlTextareaRead(client.textStdin)); break;
      case 'btnJslint':
        my.printJslint(my.parseBraket(my.htmlTextareaRead(client.textStdin))); break;
}};
window.onload = function() {
  fnn.xhrGetStock();
  my.mathTest(client.cnvOut);
}; }()); }());
