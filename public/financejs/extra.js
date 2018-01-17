/*jslint bitwise: true, browser: true, continue: true, es5: true, maxerr: 8, node: true, nomen: true, regexp: true, stupid: true, sub: true, white: true */ /*global $, atob: true, Buffer, btoa: true, chrome, Float64Array: true, jQuery, YUI */ (function() { 'use strict'; var db, debug, HND_II, LN2, my, PI1, PI2, rqd, svr; if(window.my && window.my.IS_NODEJS) { global.window = global.process.window; global.window.global = global.window.window = global.window; } debug = window.debug = window.debug || {}; HND_II = -1; my = window.my = window.my || {}; db = my.db = window.db = my.db || {}; LN2 = window.LN2 = Math.log(2); PI1 = window.PI1 = Math.PI; PI2 = window.PI2 = 2 * PI1; rqd = my.rqd = window.rqd = my.rqd || {}; svr = my.svr = window.svr = my.svr || {}; (function() {
  //// Array2 - extra
  my.Array2.concat = function(args, ll2) {
    var arr, ii, jj, ll1, out, scale, tmp; ll1 = 0; ll2 = ll2 || args[0].length;
    scale = args[0].length / ll2 || 1;
    for(ii = 0; ii < args.length; ii += 1) {
      arr = args[ii];
      if(Array.isArray(arr)) {ll1 += 1; continue;}
      if(typeof arr !== 'object') {ll1 += 1; continue;}
      ll1 += arr.ll1;}
    out = my.Array2(ll1, ll2); jj = 0;
    for(ii = 0; ii < args.length; ii += 1) {
      arr = args[ii]; tmp = out.slice(jj, jj += arr.ll1 || 1);
      if(typeof arr === 'function') {tmp.fnc(arr, scale); continue;}
      tmp.set(arr);}
    return out;};
  my.Array2.iter0 = function(self, ll2) {
    var arr, jj1, jj2, stride1, stride2; if(self === undefined) {return;}
    if(typeof self === 'function') {return self;} arr = self.arr;
    //// OPTIMIZATION list
    if(typeof self.length === 'number') {
      jj2 = -1; return function() {return self[jj2 = (jj2 + 1) % self.length];};}
    //// OPTIMIZATION - single element array
    if(self.ll1 <= 1 && self.ll2 <= 1) {self = arr[self.offset];}
    if(typeof self === 'number') {return function() {return self;};}
    //// OPTIMIZATION - repeat single col * ll2
    if(self.ll2 <= 1 && 1 < ll2) {
      stride1 = self.stride1; jj1 = self.offset; jj2 = -1;
      return function() {jj2 += 1; if(jj2 >= ll2) {jj1 += stride1; jj2 = 0;} return arr[jj1];};}
    stride2 = self.stride2; jj2 = self.offset - stride2; ll2 = self.offset + self.ll2 * stride2;
    //// OPTIMIZATION - repeat single row
    if(self.ll1 <= 1) {
      return function() {jj2 += stride2; if(jj2 >= ll2) {jj2 = jj1;} return arr[jj2];};}
    //// OPTIMIZATION - one dimensional
    if(self.is1d()) {
      stride2 = self.is1d(); jj2 = self.offset - stride2;
      return function() {jj2 += stride2; return arr[jj2];};}
    stride1 = self.stride1; jj1 = self.offset;
    //// default case
    return function() {
      jj2 += stride2; if(jj2 >= ll2) {jj1 += stride1; jj2 = jj1; ll2 += stride1;}
      return arr[jj2];};};
  my.Array2.iter1 = function(self) {
    var jj1, jj2, ll2, stride1, stride2; stride2 = self.stride2; jj2 = self.offset - stride2;
    //// OPTIMIZATION - one dimensional
    if(self.is1d()) {
      stride2 = self.is1d(); jj2 = self.offset - stride2;
      return function() {jj2 += stride2; return jj2;};}
    stride1 = self.stride1; jj1 = self.offset; ll2 = self.offset + self.ll2 * stride2;
    //// default case
    return function() {
      jj2 += stride2; if(jj2 >= ll2) {jj1 += stride1; jj2 = jj1; ll2 += stride1;} return jj2;};};
  my.Array2.prototype.addCos = function(cff, scale) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, cffNext, aa, pp, ww;
    scale = scale || 1;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    this.addPoly(cff.slice(null, null, 3, null), scale);
    cffNext = my.Array2.iter0(cff.slice(null, null, 0, 3), 1);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      aa = cffNext(); ww = cffNext(); pp = cffNext();
      for(ii2 = 0; ii2 < ll2; ii2 += 1) {
        arr[jj2] += aa * Math.cos((ii2 * scale * ww % PI2) + pp);
      jj2 += stride2;}
    jj1 += stride1; } return this;};
  my.Array2.prototype.addPoly = function(cff, scale) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, cffNext, ii3, ll3, tmp, xx;
    if(cff.is0d()) {return this;}
    scale = scale || 1;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    ll3 = cff.ll2; tmp = new Float64Array(ll3); cffNext = my.Array2.iter0(cff, 1);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      for(ii3 = 0; ii3 < ll3; ii3 += 1) {tmp[ii3] = cffNext();}
      for(ii2 = 0; ii2 < ll2; ii2 += 1) {
        xx = 1;
        for(ii3 = 0; ii3 < ll3; ii3 += 1) {arr[jj2] += tmp[ii3] * xx; xx *= ii2 * scale;}
      jj2 += stride2;}
    jj1 += stride1; } return this;};
  my.Array2.prototype.copy = function(mode) {
    var Arr; Arr = mode === 'list' ? window.Array : Float64Array;
    return my.Array2({'arr': new Arr(this.ll1 * this.ll2), 'll1': this.ll1}).set(this);};
  my.Array2.prototype.fitCos = function(yy) {
    var arr, cff, ii, itp; arr = my.Array2(1, yy.ll2);
    cff = this.slice(null, null, 3, null).fitPoly(yy); yy.subPoly(cff);
    itp = new Float64Array(1 << (Math.ceil(Math.log(yy.ll2) / LN2)));
    for(ii = 0; ii < this.ll1; ii += 1) {
      this.slice(ii, ii + 1, 0, 3).set(my.mathFitCos(arr.set(yy.get(ii)).arr, itp));}
    yy.addPoly(cff); return this;};
  my.Array2.prototype.fitCosTime = function(cff) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, ww;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    this.set(cff.slice(null, null, 0, 3));
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      arr[jj1 + stride2] = PI2 * (ww = 1 / arr[jj1 + stride2]); arr[jj1 + 2 * stride2] *= -ww;
    jj1 += stride1; }
    return this;};
  //// OPTIMIZATION - cache callback
  my.Array2.prototype._fitPoly = function(yy, cff) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, ii3, ll3, tmp, xx, yyNext; ll3 = yy.ll2;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    tmp = []; yyNext = my.Array2.iter0(yy, 1);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      for(ii2 = 0; ii2 < ll2; ii2 += 1) {tmp[ii2] = 0;}
      for(ii3 = 0; ii3 < ll3; ii3 += 1) {
        jj2 = jj1; xx = 1; yy = yyNext();
        for(ii2 = 0; ii2 < ll2; ii2 += 1) {tmp[ii2] += xx * yy; xx *= ii3;}}
      for(ii2 = 0; ii2 < ll2; ii2 += 1) {
        for(ii3 = 0; ii3 < ll2; ii3 += 1) {arr[jj2] += tmp[ii3] * cff[ii3 + ii2 * ll2];}
      jj2 += stride2;}
    jj1 += stride1; } return this;};
  //// linear lsq fit
  my.Array2.prototype.fitPoly = function(yy) {
    switch(this.ll2) {
      case 1: return this.mean1(yy);
      case 2: return this._fitPoly2(yy);
      case 3: return this._fitPoly3(yy);}
    return this;};
  //// OPTIMIZATION - cache callback
  my.Array2.prototype._fitPoly2 = function(yy) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, ii3, ll3, xxMean, yyMean, yyNext, ssxx, ssxy;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    ll3 = yy.ll2; ssxx = 12 / (ll3 * (12 + ll3) - 13);
    xxMean = 0.5 * (ll3 - 1); yyNext = my.Array2.iter0(yy, 1);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      yyMean = 0; ssxy = 0;
      for(ii3 = 0; ii3 < ll3; ii3 += 1) {yy = yyNext(); ssxy += ii3 * yy; yyMean += yy;}
      yyMean /= ll3; arr[jj2 + stride2] = ssxx * (ssxy / ll3 - xxMean * yyMean);
      arr[jj2] = yyMean - arr[jj2 + stride2] * xxMean;
    jj1 += stride1; } return this;};
  //// OPTIMIZATION - cache callback
  my.Array2.prototype._fitPoly3 = function(yy) {
    var x0, x1, x2, x3, x4; x0 = yy.ll2 - 1;
    x1 = 0.5 * x0 * (1 + x0); x2 = x0 / 6 * (1 + x0) * (1 + 2 * x0);
    x3 = 0.5 * x0 * (1 + x0); x3 *= x3;
    x4 = x0 / 30 * (1 + x0) * (1 + 2 * x0) * (3 * x0 * (1 + x0) - 1);
    return this._fitPoly(yy, my.mathInv([1 + x0, x1, x2, x1, x2, x3, x2, x3, x4]));};
  my.Array2.prototype.fnc = function(fnc, scale) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, aaNext, fnc2;
    aaNext = my.Array2.iter0(typeof fnc === 'function' ? [fnc] : fnc); scale = scale || 1;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      fnc2 = aaNext();
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { arr[jj2] = fnc2(ii2 * scale); jj2 += stride2;}
    jj1 += stride1; }
    return this;};
  my.Array2.prototype.get = function(ii1, ii2) {
    if(ii1 < 0) {ii1 += this.ll1;} if(ii2 === undefined) {
      return this.slice(ii1, 1 + ii1, 0, this.ll2);}
    if(ii2 < 0) {ii2 += this.ll2;}
    return this.arr[this.offset + ii1 * this.stride1 + ii2 * this.stride2];};
  my.Array2.prototype.info = function() {
    return {
      'length': this.arr.length,
      'll1': this.ll1, 'll2': this.ll2, 'll3': this.ll3,
      'offset': this.offset,
      'stride1': this.stride1,
      'stride2': this.stride2};};
  my.Array2.prototype.is0d = function() {
    return this.ll1 <= 0 || this.ll2 <= 0;};
  my.Array2.prototype.is1d = function() {
    return (
      this.ll1 <= 1 ? this.stride2 : this.ll2 <= 1 ? this.stride1 :
      this.stride1 >= this.stride2 && this.ll2 * this.ll3 === this.stride1 ? this.ll3 : null);};
  my.Array2.prototype.isTransposed = function() {
    return this.ll3 === this.stride1 && this.stride1 !== this.stride2;};
  my.Array2.prototype.itp2 = function(arr) {
    var ii, jj, ll2, scale; ll2 = this.ll2;
    if(ll2 === arr.ll2) {this.set(arr); return this;}
    //// down sample
    if(ll2 < arr.ll2) {
      scale = (0.5 + arr.ll2) / ll2;
      for(ii = 0; ii < ll2; ii += 1) {
        jj = Math.floor(ii * scale);
        this.slice(null, null, ii, 1 + ii).set(arr.slice(null, null, jj, 1 + jj));}}
    return this;};
  my.Array2.prototype.jsonStringify = function(mode) {
    return (
      mode === 'checkOnly' ?
      this.copy('list') : my.jsonStringify(this.copy('list'), 'recursed'));};
  my.Array2.prototype.mean0 = function() {
    return this.sum0() / this.ll2;};
  my.Array2.prototype.mean1 = function(aa) {
    return this.sum1(aa).mul(1 / aa.ll2);};
  my.Array2.prototype.center = function() {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, sum;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      sum = 0;
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { sum += arr[jj2]; jj2 += stride2;}
      sum *= 1 / ll2; jj2 = jj1;
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { arr[jj2] -= sum; jj2 += stride2;}
    jj2 += stride2;} return this;};
  my.Array2.prototype.plot2d = function(kwargs) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, cnv, ctx, legend, scale, stt, tmp;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    kwargs.colorStep = kwargs.colorStep || (kwargs.legend && ll1 / kwargs.legend.length) || 1;
    //// stack plots
    if(kwargs.stack) {
      tmp = my.Array2(this.arr, ll1 / kwargs.colorStep); tmp.sub(tmp.sink(1).min1(tmp));
      for(ii1 = 1; ii1 < tmp.ll1; ii1 += 1) {
        tmp.get(ii1).add(tmp.get(ii1 - 1).min0() - 0.5 * tmp.get(ii1).max0());}}
    cnv = kwargs.cnv; ctx = cnv.getContext('2d'); ctx.save();
    //// clear canvas
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cnv.width, cnv.height);
    //// transform
    stt = this.stt0(); scale = (cnv.height - 0.5) / (stt.max - stt.min);
    ctx.lineWidth = Math.min(
      (this.ll2 - 0.5) / cnv.width, (stt.max - stt.min) / (cnv.height + 0.5));
    ctx.transform((cnv.width - 0.5) / (this.ll2 - 1), 0, 0, -scale, 0, scale * stt.max);
    //// lineV
    if(kwargs.lineV) {
      for(ii1 = 0; ii1 < kwargs.lineV.length; ii1 += 1) {
        tmp = kwargs.lineV[ii1]; ctx.strokeStyle = tmp[1];
        ctx.beginPath(); ctx.moveTo(tmp[0], stt.min); ctx.lineTo(tmp[0], stt.max); ctx.stroke();}}
    //// plot
    ctx.miterLimit = 1;
    legend = [];
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      if(ii1 % kwargs.colorStep === 0) {
        legend.push(ctx.strokeStyle = my.RGB_LUMA[parseInt(4095 - ii1 * 2048 / ll1, 10)]);}
      ctx.beginPath(); ctx.moveTo(0, arr[jj2]);
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { ctx.lineTo(ii2, arr[jj2]); jj2 += stride2;}
      ctx.stroke();
    jj1 += stride1; } ctx.restore();
    //// legend
    if(kwargs.legend) {
      ctx.save();
      //// clear canvas
      ctx.fillStyle = '#eee'; ctx.fillRect(4, 4, 32, legend.length * 16);
      for(ii1 = 0; ii1 < legend.length; ii1 += 1) {
        ctx.font = '12px Arial';
        ctx.fillStyle = legend[ii1];
        ctx.fillText(kwargs.legend[ii1], 4, 16 + ii1 * 16, 32);}
      ctx.restore();}
    return this;};
  my.Array2.prototype.reshape = function(ll1, ll2, ll3) {
    var out; if(this.isTransposed()) {return this.transpose().reshape(ll2, ll1, ll3).transpose();}
    ll1 = ll1 || 1; ll2 = ll2 || 1; ll3 = ll3 || 1;
    console.assert(
      ll1 * ll2 * ll3 <= this.arr.length - this.offset && !this.isTransposed(),
      [ll1, ll2, ll3, this.arr.length - this.offset, this.stride1, this.ll2]);
    this.ll1 = ll1; this.ll2 = ll2; this.stride1 = ll2 * ll3; this.stride2 = ll3; return this;};
  my.Array2.prototype.reverse = function() {
    var ii1, ii2, ll1, ll2, tmp;
    ll1 = this.offset + this.ll1 * this.stride1;
    for(ii1 = this.offset; ii1 < ll1; ii1 += this.stride1) {
      ll2 = ii1 + (this.ll2 - 1) * this.stride2;
      for(ii2 = ii1; ii2 < ll2; ii2 += this.stride2) {
        tmp = this.arr[ii2]; this.arr[ii2] = this.arr[ll2]; this.arr[ll2] = tmp;
        ll2 -= this.stride2;}}
    return this;};
  my.Array2.prototype.set = function(ii1, ii2, oo) {
    var arr, stride1, stride2;
    switch(arguments.length) {
      //// set all
      case 1: this._set(my.Array2.iter0(ii1, this.ll2)); break;
      //// set row
      case 2: this.get(ii1)._set(ii2); break;
      //// set element
      default:
        if(ii1 < 0) {ii1 += this.ll1;} if(ii2 < 0) {ii2 += this.ll2;}
        this.arr[this.offset + ii1 * this.stride1 + ii2 * this.stride2] = oo;}
    return this;};
  my.Array2.prototype.sink = function(ll2) {
    return my.Array2(this.ll1, ll2);
  };
  my.Array2.prototype.sort = function(arr) {
    return this.reorder(my.iiSort(arr));
  };
  my.Array2.prototype.slice = function(aa, bb, cc, dd, ii3) {
    var out;
    if(this.isTransposed()) {
      this.transpose(); out = this.slice(cc, dd, aa, bb, ii3).transpose();
      this.transpose(); return out;}
    //// ref copy
    out = my.Array2(this);
    //// bounds check
    aa = !aa ? 0 : aa > out.ll1 ? out.ll1 : aa < 0 ? aa + out.ll1 : aa;
    bb = !bb || bb > out.ll1 ? out.ll1 : bb < 0 ? bb + out.ll1 : bb;
    if(aa) {out.offset += aa * out.stride1;} out.ll1 = bb - aa;
    if(cc === undefined) {return out;}
    cc = !cc ? 0 : cc > out.ll2 ? out.ll2 : cc < 0 ? cc + out.ll2 : cc;
    dd = !dd || dd > out.ll2 ? out.ll2 : dd < 0 ? dd + out.ll2 : dd;
    if(cc) {out.offset += cc * out.stride2;} out.ll2 = dd - cc;
    if(ii3) {out.offset += ii3;}
    return out;};
  my.Array2.prototype.toAoa = function() {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, ar, out;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2; out = [];
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      ar = [];
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { ar.push(arr[jj2]); jj2 += stride2;}
      out.push(ar);
    jj1 += stride1; } return out;};
  my.Array2.prototype.toAoo = function() {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, ar, out;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2; out = [];
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      ar = {};
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { ar[ii2] = arr[jj2]; jj2 += stride2;}
      out.push(ar);
    jj1 += stride1; } return out;};
  my.Array2.prototype.transpose = function() {
    var out, tmp; tmp = this.ll1; this.ll1 = this.ll2; this.ll2 = tmp;
    tmp = this.stride1; this.stride1 = this.stride2; this.stride2 = tmp; return this;};
  my.Array2.prototype.zeros = function() {
    return my.Array2(this.ll1, this.ll2);};
  my.Array2.zip = function() {
    var ii1, ii2, jj, out;
    out = my.Array2(arguments.length * arguments[0].ll1, arguments[0].ll2);
    for(ii1 = 0; ii1 < arguments.length; ii1 += 1) {
      for(ii2 = 0; ii2 < arguments[0].ll1; ii2 += 1) {
        out.set(ii1 + ii2 * arguments.length, arguments[ii1].get(ii2));}}
    return out;};
  my.htmlAjaxBusy = function(vv) {
    if(!my.nAjaxBusy) {return;} my.nAjaxBusy.style.display = vv;};
  my.htmlDateValidate = function(tt) {
    tt = new Date(tt); if(!isNaN(tt.getTime())) {return tt;}};
  my.htmlhasParent = function(nn, pp) {
    while(nn) {if(nn === pp) {return true;} nn = nn.parentNode;}};
  my.htmlPreWrite = function(ss) {
    return ss.replace(/</g, '&lt;').replace(/>/g, '&gt;');};
  my.htmlTextareaRead = function(nn) {
    return (
      nn.value.replace(/\u00a0/g, ' ').replace(/\u2018/g, "'").replace(/\u2019/g, "'"));};
  my.htmlTextareaLoadFile = function(nn, fpp) {
    var reader;
    reader = new window.FileReader();
    reader.onload = function() {nn.value = reader.result;};
    reader.onerror = console.log;
    reader.readAsText(fpp);};
  //// slow, fail-safe, discrete fourier transform
  my.mathDft = function(arr, sgn) {
    var ii, inv, jj, tmp, ww, xx, yy; tmp = arr.slice(); ww = sgn * PI1 / arr.length;
    for(ii = 0; ii < arr.length; ii += 2) {
      arr[ii] = arr[1 + ii] = 0;
      for(jj = 0; jj < arr.length; jj += 2) {
        xx = Math.cos(ii * jj * ww); yy = Math.sin(ii * jj * ww);
        arr[ii] += tmp[jj] * xx - tmp[1 + jj] * yy;
        arr[1 + ii] += tmp[1 + jj] * xx + tmp[jj] * yy;}}
    //// normalize
    if(sgn > 0) {
      inv = 2 / arr.length; for(ii = arr.length - 1; ii >= 0; ii -=1) {arr[ii] *= inv;}}
    return arr;};
  //// slow, fail-safe, real-valued, discrete fourier transform
  my.mathDftReal = function(arr, sgn) {
    var ii, inv, jj, tmp, ww; tmp = arr.slice(); ww = sgn * PI1 / arr.length;
    //// forward transform
    if(sgn < 0) {
      for(ii = 0; ii < arr.length; ii += 2) {
        arr[ii] = arr[1 + ii] = 0;
        for(jj = 0; jj < arr.length; jj += 1) {
          arr[ii] += tmp[jj] * Math.cos(ii * jj * ww);
          arr[1 + ii] += tmp[jj] * Math.sin(ii * jj * ww);}}
      //// ll / 2 case
      arr[1] = 0;
      for(jj = 0; jj < arr.length; jj += 2) {arr[1] += tmp[jj];}
      for(jj = 1; jj < arr.length; jj += 2) {arr[1] -= tmp[jj];}
      return arr;}
    //// reverse transform
    for(ii = 0; ii < arr.length; ii += 1) {
      arr[ii] = 0;
      for(jj = 0; jj < arr.length; jj += 2) {
        arr[ii] += tmp[jj] * Math.cos(ii * jj * ww) - tmp[1 + jj] * Math.sin(ii * jj * ww);}}
    //// ll / 2 case
    for(ii = 0; ii < arr.length; ii += 2) {arr[ii] += tmp[1];}
    for(ii = 1; ii < arr.length; ii += 2) {arr[ii] -= tmp[1];}
    //// normalize
    inv = 1 / arr.length; for(ii = 0; ii < arr.length; ii += 1) {arr[ii] *= inv;}
    return arr;};
  //// fast fourier transform - decimation in time
  my.mathFft = function(arr, sgn) {
    var i1, i2, j1, l1, l2, tmpx, tmpy, w1x, w1y, w2x, w2y; l1 = arr.length;
    //// normalize
    if(sgn > 0) {tmpx = 2 / l1; for(i1 = 0; i1 < l1; i1 += 1) {arr[i1] *= tmpx;}}
    //// bit reverse
    j1 = 0;
    for(i1 = 0; i1 < l1; i1 += 2) {
      if (i1 < j1) {
        tmpx = arr[j1]; arr[j1] = arr[i1]; arr[i1] = tmpx;
        tmpx = arr[1 + j1]; arr[1 + j1] = arr[1 + i1]; arr[1 + i1] = tmpx;}
      i2 = l1 >> 1; while (i2 >= 2 && j1 >= i2) {j1 -= i2; i2 >>= 1;} j1 += i2;}
    //// decimation in time algorithm
    for(l2 = 2; l2 < l1; l2 *= 2) {
      w2x = PI1 * sgn / l2; w2y = Math.sin(2 * w2x);
      w2x = Math.sin(w2x); w2x *= -2 * w2x; w1x = 1; w1y = 0;
      for (i1 = 0; i1 < l2; i1 += 2) {
        for (i2 = i1; i2 < l1; i2 += 2 * l2) {
          j1 = i2 + l2;
          tmpx = w1x * arr[j1] - w1y * arr[1 + j1]; tmpy = w1x * arr[1 + j1] + w1y * arr[j1];
          arr[j1] = arr[i2] - tmpx; arr[1 + j1] = arr[1 + i2] - tmpy;
          arr[i2] += tmpx; arr[1 + i2] += tmpy;}
        w1x = (tmpx = w1x) * (1 + w2x) - w1y * w2y; w1y = w1y * (1 + w2x) + tmpx * w2y;}}
    return arr;};
  //// real-valued fast fourier transform
  my.mathFftReal = function(arr, sgn) {
    var aa, bb, cc, dd, i1, i2, ll, tmp, w1x, w1y, w2x, w2y;
    //// forward transform - perform half-fft on even / odd
    if(sgn < 0) {my.mathFft(arr, sgn);}
    ll = arr.length >> 1; w2x = 0.5 * PI1 * sgn / ll; w1y = w2y = Math.sin(2 * w2x);
    w2x = Math.sin(w2x); w2x *= -2 * w2x; w1x = 1 + w2x;
    for(i1 = 2; i1 <= ll - 2; i1 += 2) {
      aa = arr[i1]; bb = arr[1 + i1]; cc = arr[i2 = -i1 + 2 * ll]; dd = arr[1 + i2];
      aa = 0.5 * ((tmp = aa) + cc); cc = 0.5 * sgn * (tmp - cc);
      bb = 0.5 * sgn * ((tmp = bb) + dd); dd = 0.5 * (tmp - dd);
      arr[i1] = aa - bb * w1x - cc * w1y; arr[1 + i1] = dd + cc * w1x - bb * w1y;
      arr[i2] = aa + bb * w1x + cc * w1y; arr[1 + i2] = -dd + cc * w1x - bb * w1y;
      w1x = (tmp = w1x) * (1 + w2x) - w1y * w2y; w1y = w1y * (1 + w2x) + tmp * w2y;}
    //// forward transform
    arr[0] = (tmp = arr[0]) + arr[1]; arr[1] = tmp - arr[1];
    //// reverse transform
    if(sgn > 0) {arr[0] *= 0.5; arr[1] *= 0.5; my.mathFft(arr, sgn);}
    return arr;};
  my.mathFftHist = function(arr) {
    var ii;
    for(ii = 0; ii < arr.length; ii += 2) {
      arr[ii] = arr[ii] * arr[ii] + arr[1 + ii] * arr[1 + ii]; arr[1 + ii] = 0;}
    return arr;};
  my.mathFitCos = function(arr, yy) {
    var aa, cc, hh1, hh2, hh3, ii1, ii2, inv, ll, pp, ss, ww, yy1, yy2; ll = arr.length;
    //// fft
    my.mathFftReal(my.mathItp2(arr, yy), -1);
    //// get initial values
    aa = 0;
    for(ii1 = 2; ii1 < yy.length >> 1; ii1 += 2) {
      pp = yy[ii1] * yy[ii1] + yy[1 + ii1] * yy[1 + ii1];
      if(pp > aa) {aa = pp; ww = ii1;}}
    aa = 2 * Math.sqrt(aa) / yy.length; pp = Math.atan2(yy[1 + ww], yy[ww]); ww *= PI1 / ll;
    //// newton lsq - pp, ww
    inv = 1 / aa;
    for(ii1 = ll >> 1; ii1 > 1; ii1 >>= 1) {
      hh1 = hh2 = hh3 = 0; yy1 = yy2 = 0;
      for(ii2 = 0; ii2 < ll; ii2 += 1) {
        //// pp ww - nonlinear jacobian
        //// ss  ssi  | dp = cs  - ys /a
        //// ssi ssii | dw = csi - ysi/a
        cc = Math.cos(ss = pp + ((ii2 * ww) % PI2)); ss = Math.sin(ss);
        cc = ss * (cc - arr[ii2] * inv); yy1 += cc; yy2 += cc * ii2;
        ss *= ss; hh1 += ss; hh2 += ss * ii2; hh3 += ss * ii2 * ii2;}
      //// solve linear equation
      cc = 1 / (hh1 * hh3 - hh2 * hh2);
      pp += cc * (hh3 * yy1 - hh2 * yy2); pp %= PI2; ww += cc * (-hh2 * yy1 + hh1 * yy2);}
    for(ii1 = ll >> 1; ii1 > 1; ii1 >>= 1) {
      yy1 = yy2 = 0;
      for(ii2 = 0; ii2 < ll; ii2 += 1) {
        //// da = (sum(yc - acc)) / sum(cc)
        cc = Math.cos(ss = pp + ((ii2 * ww) % PI2)); ss = Math.sin(ss);
        yy1 += arr[ii2] * cc; yy2 += cc * cc;}
      aa += (yy1 - aa * yy2) / yy2;}
    return [aa, ww, pp];};
  my.mathInv = function(m) {
    var d;
    switch(m.length) {
      case 4: d=1/(m[0]*m[3]-m[1]*m[2]);return [d*m[3],-d*m[1],-d*m[2],d*m[0]];
      case 9:
        d=1/(m[0]*(m[4]*m[8]-m[5]*m[7])+m[1]*(m[5]*m[6]-m[3]*m[8])+m[2]*(m[3]*m[7]-m[4]*m[6]));
        return [
          d*(m[4]*m[8]-m[5]*m[7]),d*(m[2]*m[7]-m[1]*m[8]),d*(m[1]*m[5]-m[2]*m[4]),
          d*(m[5]*m[6]-m[3]*m[8]),d*(m[0]*m[8]-m[2]*m[6]),d*(m[2]*m[3]-m[0]*m[5]),
          d*(m[3]*m[7]-m[4]*m[6]),d*(m[1]*m[6]-m[0]*m[7]),d*(m[0]*m[4]-m[1]*m[3])];}};
  //// up-sample array
  my.mathItp2 = function(arr, out, ll1) {
    var dy, ii1, ii2, ll2, nn, scale; ll1 = ll1 || arr.length; nn = out.length;
    //// direct copy source to buffer
    if(ll1 === nn) {for(ii1 = 0; ii1 < nn; ii1 += 1) {out[ii1] = arr[ii1];} return out;}
    //// down-sample
    if(ll1 > nn) {
      scale = (0.5 + ll1) / nn;
      for(ii1 = 0; ii1 < nn; ii1 += 1) {out[ii1] = arr[Math.floor(ii1 * scale)];} return out;}
    //// up-sample
    ii2 = 0; scale = (nn + 0.5) / ll1;
    for(ii1 = 0; ii1 < ll1; ii1 += 1) {
      out[ii2] = arr[ii1]; ii2 += 1; if(ii1 + 1 >= ll1) {continue;}
      ll2 = Math.floor((ii1 + 1) * scale);
      dy = (arr[1 + ii1] - arr[ii1]) / (1 + ll2 - ii2);
      for(0; ii2 < ll2; ii2 += 1) {out[ii2] = out[ii2 - 1] + dy;}}
    out[nn - 1] = arr[ll1 - 1]; return out;};
  my.mathTest = function(cnv) {
    var aa, awp, bb, cc, dd, ee, ff, yy;
    aa = [1.1,3.2,2.3,4.4,-1.5,-3.6,-2.7,-4.8,1.8,3.7,2.6,4.5,-1.4,-3.3,-2.2,-4.1];


    my.Array2(aa, 1).center();
    bb = aa.slice(); my.mathItp2(bb, aa, 15); my.Array2(aa, 1).center();
    cc = my.mathDftReal(aa.slice(), -1);
    dd = my.mathFftReal(aa.slice(), -1);
    ee = my.mathFftReal(dd.slice(), 1);
    awp = my.mathFitCos(aa, aa.slice());
    yy = my.Array2.concat(
      [
        bb, aa, ee,
        my.mathFftHist(cc), my.mathFftHist(dd),

        function(ii) {return awp[0] * Math.cos(awp[1] * ii + awp[2]);},
        function(ii) {return awp[0] * Math.cos(awp[1] * ii + awp[2]);}]);
    yy.mul(yy.sink(1).max1(yy).inv());
    yy.plot2d(
      {
        'cnv': cnv,
        'stack': true});};
  my.mathYy = function(arr, fnc) {
    var ii; for(ii = 0; ii < arr.length; ii += 1) {arr[ii] = fnc(ii);} return arr;};
  //// remote access
  my.Remote = my.Remote || function(addr, auth) {
    if(!(this instanceof my.Remote)) {return new my.Remote(addr, auth);}
    this.addr = addr; if(auth) {this.auth = btoa(auth);}};
  my.Remote.prototype.bash = function(kwargs) {
    if(typeof kwargs === 'string') {kwargs = {'postData': kwargs};}
    kwargs.mode = kwargs.mode || 'bash';
    if(kwargs.cwd) {my.xhrInit(kwargs, null, {'cwd': kwargs.cwd});}
    this.eval2(kwargs);};
  my.Remote.prototype.eval2 = function(kwargs, kwargs2) {
    //// OPTIMIZATION - cache callback
    if(kwargs2) {
      console.log(!my.IS_NODEJS && kwargs2.mode === 'eval2' ? my.jsonParse(kwargs) : kwargs);
      return;}
    if(typeof kwargs === 'string') {kwargs = {'postData': kwargs};}
    kwargs.mode = kwargs.mode || 'eval2';
    kwargs.fncEnd = kwargs.fncEnd || this.eval2;
    kwargs.method = kwargs.method || 'POST';
    kwargs.xpath = kwargs.xpath || '/admin/' + kwargs.mode;
    if(my.IS_NODEJS) {
      my.xhrInit(
        kwargs,
        {
          'authorization': this.auth || my.SERVER_BASIC_AUTH,
          'cookie': 'sessionId=' + my.SESSION_ID});
      kwargs.xpath = this.addr + kwargs.xpath;}
    my.xhrGet(kwargs);};
  my.Remote.prototype.exec = function(kwargs) {
    if(typeof kwargs === 'string') {kwargs = {'postData': kwargs};}
    kwargs.mode = kwargs.mode || 'exec2'; this.eval2(kwargs);};
  my.Remote.prototype.update = function() {
    this.exec2({'mode': 'update', 'postData': svr.build('auto')});};
  //// OPTIMIZATION - cache callback
  my._xhrGetStock = function(data, kwargs2) {
    var aa, arr, bb, ii1, ii2, jj1, jj2, kk, kwargs, ll, out, prev, qq, stride2, tt;
    kwargs = this;
    //// setItem
    if(kwargs !== kwargs2) {
      qq = /\bs=(\w+)/.exec(kwargs2.xpath)[1];
      arr = my.jsonParse(
        '[' +
        data
        .replace(
          /^(....).(..).(..),[^,]+,[^,]+,[^,]+,[^,]+,([^,]+),(.+)\n/gm,
          '$4,$5,$1$2$3,$1,')
        .replace(/.+\n/, '').slice(0, -1) +
        ']');
      if(!arr) {return;} arr = arr.reverse(); arr.push(arr[arr.length - 4] + 1);
      aa = arr[0]; out = [];
      for(ii1 = 0; ii1 < arr.length; ii1 += 4) {
        bb = arr[ii1];
        if(bb > aa) {my.CACHE.setItem(qq + '.' + aa, out); aa = bb; out = [];}
        out.push(arr[1 + ii1]); out.push(arr[2 + ii1]); out.push(arr[3 + ii1]);}
      return;}
    //// tt
    ll = my.tm2Date(kwargs.end).getTime() + 43200000; tt = [];
    for(ii1 = my.tm2Date(kwargs.beg).getTime(); ii1 < ll; ii1 += 86400000) {
      tt.push(my.tmDate2Int(new Date(ii1)));}
    tt.ll2 = tt.length; ll += 21600000 * tt.length;
    for(0; ii1 < ll; ii1 += 86400000) {tt.push(my.tmDate2Int(new Date(ii1)));}
    kwargs.end2 = tt[tt.length - 1];
    aa = parseInt(kwargs.beg / 10000, 10); bb = parseInt(kwargs.end2 / 10000, 10);
    //// concat
    out = my.Array2(kwargs.qq.length, tt.length, 2); out.tt = tt;
    stride2 = out.stride2;
    for(ii1 = 0; ii1 < kwargs.qq.length; ii1 += 1) {
      ii2 = 0; jj2 = out.offset + ii1 * out.stride1;
      for(jj1 = aa; jj1 <= bb; jj1 += 1) {
        arr = my.CACHE.getItem(kwargs.qq[ii1] + '.' + jj1) || []; kk = 0; ll = arr.length;
        //// aa
        if(jj1 === aa) {
          for(0; kk < arr.length; kk += 3) {if(arr[kk] >= kwargs.beg) {break;}}
          prev = [arr[1 + kk], arr[2 + kk]];}
        //// bb
        else if(jj1 === bb) {for(0; ll; ll -= 3) {if(arr[ll - 3] <= kwargs.end2) {break;}}}
        for(0; kk < ll; kk += 3) {
          //// fill gaps
          for(0; ii2 < out.ll2 && tt[ii2] < arr[kk]; ii2 += 1) {
            out.arr[jj2] = prev[0]; out.arr[1 + jj2] = prev[1]; jj2 += out.stride2;}
          out.arr[jj2] = prev[0] = arr[1 + kk]; out.arr[1 + jj2] = prev[1] = arr[2 + kk];}}
      //// fill gaps
      for(0; ii2 < out.ll2; ii2 += 1) {
        out.arr[jj2] = prev[0]; out.arr[1 + jj2] = prev[1]; jj2 += out.stride2;}}
    if(kwargs.fnc) {kwargs.fnc(out, kwargs); return;}
    console.log(my.jsonStringify(out, 'checkOnly'));};
  my.xhrGetStock = function(kwargs) {
    var aa, bb, ii, qq;
    if(typeof kwargs === 'string') {kwargs = {'qq': [kwargs]};}
    else if(Array.isArray(kwargs)) {kwargs = {'qq': kwargs};}
    kwargs.fncEnd = function(data, kwargs2) {my._xhrGetStock.call(kwargs, data, kwargs2);};
    kwargs.fncEnd2 = my._xhrGetStock; kwargs.paths = kwargs.paths || []; kwargs.xss = 'public';
    kwargs.end = kwargs.end || my.tmDate2Int(new Date());
    kwargs.beg = kwargs.beg || kwargs.end - 10000;
    if(typeof kwargs.qq === 'string') {kwargs.qq = [kwargs.qq];}
    for(ii = 0; ii < kwargs.qq.length; ii += 1) {
      aa = parseInt(kwargs.beg / 10000, 10); bb = parseInt(kwargs.end / 10000, 10);
      kwargs.qq[ii] = qq = kwargs.qq[ii].toUpperCase();
      while(aa <= bb && my.CACHE.getItem(qq + '.' + aa)) {aa += 1;}
      while(aa <= bb && my.CACHE.getItem(qq + '.' + bb)) {bb -= 1;}
      if(aa <= bb) {
        kwargs.paths.push(
          'http://ichart.finance.yahoo.com/table.csv?s=' + qq +
          '&a=00&b=01&c=' + aa + '&d=11&e=31&f=' + bb);}}
    my.xhrGets(kwargs);};
}()); }());
/*jslint bitwise: true, browser: true, continue: true, es5: true, maxerr: 8, node: true, nomen: true, regexp: true, stupid: true, sub: true, white: true */ /*global $, atob: true, Buffer, btoa: true, chrome, Float64Array: true, jQuery, YUI */ (function() { 'use strict'; var db, debug, HND_II, LN2, my, PI1, PI2, rqd, svr; if(window.my && window.my.IS_NODEJS) { global.window = global.process.window; global.window.global = global.window.window = global.window; } debug = window.debug = window.debug || {}; HND_II = -1; my = window.my = window.my || {}; db = my.db = window.db = my.db || {}; LN2 = window.LN2 = Math.log(2); PI1 = window.PI1 = Math.PI; PI2 = window.PI2 = 2 * PI1; rqd = my.rqd = window.rqd = my.rqd || {}; svr = my.svr = window.svr = my.svr || {}; (function() {
my.RGB_LUMA = ["#fff","#ffe","#ffd","#eff","#ffc","#efe","#ffb","#efd","#ffa","#dff","#efc","#ff9","#dfe","#efb","#ff8","#dfd","#efa","#ff7","#cff","#dfc","#ef9","#ff6","#cfe","#dfb","#fef","#ef8","#ff5","#cfd","#dfa","#fee","#ef7","#ff4","#bff","#cfc","#df9","#fed","#ef6","#ff3","#bfe","#cfb","#eef","#df8","#fec","#ef5","#ff2","#bfd","#cfa","#eee","#df7","#feb","#ef4","#ff1","#aff","#bfc","#cf9","#eed","#df6","#fea","#ef3","#ff0","#afe","#bfb","#def","#cf8","#eec","#df5","#fe9","#ef2","#afd","#bfa","#dee","#cf7","#eeb","#df4","#fe8","#ef1","#9ff","#afc","#bf9","#ded","#cf6","#eea","#df3","#fe7","#ef0","#9fe","#afb","#cef","#bf8","#dec","#cf5","#ee9","#df2","#fe6","#9fd","#afa","#cee","#bf7","#deb","#fdf","#cf4","#ee8","#df1","#fe5","#8ff","#9fc","#af9","#ced","#bf6","#dea","#fde","#cf3","#ee7","#df0","#fe4","#8fe","#9fb","#bef","#af8","#cec","#bf5","#de9","#fdd","#cf2","#ee6","#fe3","#8fd","#9fa","#bee","#af7","#ceb","#edf","#bf4","#de8","#fdc","#cf1","#ee5","#fe2","#7ff","#8fc","#9f9","#bed","#af6","#cea","#ede","#bf3","#de7","#fdb","#cf0","#ee4","#fe1","#7fe","#8fb","#aef","#9f8","#bec","#af5","#ce9","#edd","#bf2","#de6","#fda","#ee3","#fe0","#7fd","#8fa","#aee","#9f7","#beb","#ddf","#af4","#ce8","#edc","#bf1","#de5","#fd9","#ee2","#6ff","#7fc","#8f9","#aed","#9f6","#bea","#dde","#af3","#ce7","#edb","#bf0","#de4","#fd8","#ee1","#6fe","#7fb","#9ef","#8f8","#aec","#9f5","#be9","#ddd","#af2","#ce6","#eda","#de3","#fd7","#ee0","#6fd","#7fa","#9ee","#8f7","#aeb","#cdf","#9f4","#be8","#ddc","#af1","#ce5","#ed9","#de2","#fd6","#5ff","#6fc","#7f9","#9ed","#8f6","#aea","#cde","#9f3","#be7","#ddb","#fcf","#af0","#ce4","#ed8","#de1","#fd5","#5fe","#6fb","#8ef","#7f8","#9ec","#8f5","#ae9","#cdd","#9f2","#be6","#dda","#fce","#ce3","#ed7","#de0","#fd4","#5fd","#6fa","#8ee","#7f7","#9eb","#bdf","#8f4","#ae8","#cdc","#9f1","#be5","#dd9","#fcd","#ce2","#ed6","#fd3","#4ff","#5fc","#6f9","#8ed","#7f6","#9ea","#bde","#8f3","#ae7","#cdb","#ecf","#9f0","#be4","#dd8","#fcc","#ce1","#ed5","#fd2","#4fe","#5fb","#7ef","#6f8","#8ec","#7f5","#9e9","#bdd","#8f2","#ae6","#cda","#ece","#be3","#dd7","#fcb","#ce0","#ed4","#fd1","#4fd","#5fa","#7ee","#6f7","#8eb","#adf","#7f4","#9e8","#bdc","#8f1","#ae5","#cd9","#ecd","#be2","#dd6","#fca","#ed3","#fd0","#3ff","#4fc","#5f9","#7ed","#6f6","#8ea","#ade","#7f3","#9e7","#bdb","#dcf","#8f0","#ae4","#cd8","#ecc","#be1","#dd5","#fc9","#ed2","#3fe","#4fb","#6ef","#5f8","#7ec","#6f5","#8e9","#add","#7f2","#9e6","#bda","#dce","#ae3","#cd7","#ecb","#be0","#dd4","#fc8","#ed1","#3fd","#4fa","#6ee","#5f7","#7eb","#9df","#6f4","#8e8","#adc","#7f1","#9e5","#bd9","#dcd","#ae2","#cd6","#eca","#dd3","#fc7","#ed0","#2ff","#3fc","#4f9","#6ed","#5f6","#7ea","#9de","#6f3","#8e7","#adb","#ccf","#7f0","#9e4","#bd8","#dcc","#ae1","#cd5","#ec9","#dd2","#fc6","#2fe","#3fb","#5ef","#4f8","#6ec","#5f5","#7e9","#9dd","#6f2","#8e6","#ada","#cce","#9e3","#bd7","#dcb","#fbf","#ae0","#cd4","#ec8","#dd1","#fc5","#2fd","#3fa","#5ee","#4f7","#6eb","#8df","#5f4","#7e8","#9dc","#6f1","#8e5","#ad9","#ccd","#9e2","#bd6","#dca","#fbe","#cd3","#ec7","#dd0","#fc4","#1ff","#2fc","#3f9","#5ed","#4f6","#6ea","#8de","#5f3","#7e7","#9db","#bcf","#6f0","#8e4","#ad8","#ccc","#9e1","#bd5","#dc9","#fbd","#cd2","#ec6","#fc3","#1fe","#2fb","#4ef","#3f8","#5ec","#4f5","#6e9","#8dd","#5f2","#7e6","#9da","#bce","#8e3","#ad7","#ccb","#ebf","#9e0","#bd4","#dc8","#fbc","#cd1","#ec5","#fc2","#1fd","#2fa","#4ee","#3f7","#5eb","#7df","#4f4","#6e8","#8dc","#5f1","#7e5","#9d9","#bcd","#8e2","#ad6","#cca","#ebe","#bd3","#dc7","#fbb","#cd0","#ec4","#fc1","#0ff","#1fc","#2f9","#4ed","#3f6","#5ea","#7de","#4f3","#6e7","#8db","#acf","#5f0","#7e4","#9d8","#bcc","#8e1","#ad5","#cc9","#ebd","#bd2","#dc6","#fba","#ec3","#fc0","#0fe","#1fb","#3ef","#2f8","#4ec","#3f5","#5e9","#7dd","#4f2","#6e6","#8da","#ace","#7e3","#9d7","#bcb","#dbf","#8e0","#ad4","#cc8","#ebc","#bd1","#dc5","#fb9","#ec2","#0fd","#1fa","#3ee","#2f7","#4eb","#6df","#3f4","#5e8","#7dc","#4f1","#6e5","#8d9","#acd","#7e2","#9d6","#bca","#dbe","#ad3","#cc7","#ebb","#bd0","#dc4","#fb8","#ec1","#0fc","#1f9","#3ed","#2f6","#4ea","#6de","#3f3","#5e7","#7db","#9cf","#4f0","#6e4","#8d8","#acc","#7e1","#9d5","#bc9","#dbd","#ad2","#cc6","#eba","#dc3","#fb7","#ec0","#0fb","#2ef","#1f8","#3ec","#2f5","#4e9","#6dd","#3f2","#5e6","#7da","#9ce","#6e3","#8d7","#acb","#cbf","#7e0","#9d4","#bc8","#dbc","#ad1","#cc5","#eb9","#dc2","#fb6","#0fa","#2ee","#1f7","#3eb","#5df","#2f4","#4e8","#6dc","#3f1","#5e5","#7d9","#9cd","#6e2","#8d6","#aca","#cbe","#9d3","#bc7","#dbb","#faf","#ad0","#cc4","#eb8","#dc1","#fb5","#0f9","#2ed","#1f6","#3ea","#5de","#2f3","#4e7","#6db","#8cf","#3f0","#5e4","#7d8","#9cc","#6e1","#8d5","#ac9","#cbd","#9d2","#bc6","#dba","#fae","#cc3","#eb7","#dc0","#fb4","#1ef","#0f8","#2ec","#1f5","#3e9","#5dd","#2f2","#4e6","#6da","#8ce","#5e3","#7d7","#9cb","#bbf","#6e0","#8d4","#ac8","#cbc","#9d1","#bc5","#db9","#fad","#cc2","#eb6","#fb3","#1ee","#0f7","#2eb","#4df","#1f4","#3e8","#5dc","#2f1","#4e5","#6d9","#8cd","#5e2","#7d6","#9ca","#bbe","#8d3","#ac7","#cbb","#eaf","#9d0","#bc4","#db8","#fac","#cc1","#eb5","#fb2","#1ed","#0f6","#2ea","#4de","#1f3","#3e7","#5db","#7cf","#2f0","#4e4","#6d8","#8cc","#5e1","#7d5","#9c9","#bbd","#8d2","#ac6","#cba","#eae","#bc3","#db7","#fab","#cc0","#eb4","#fb1","#0ef","#1ec","#0f5","#2e9","#4dd","#1f2","#3e6","#5da","#7ce","#4e3","#6d7","#8cb","#abf","#5e0","#7d4","#9c8","#bbc","#8d1","#ac5","#cb9","#ead","#bc2","#db6","#faa","#eb3","#fb0","#0ee","#1eb","#3df","#0f4","#2e8","#4dc","#1f1","#3e5","#5d9","#7cd","#4e2","#6d6","#8ca","#abe","#7d3","#9c7","#bbb","#daf","#8d0","#ac4","#cb8","#eac","#bc1","#db5","#fa9","#eb2","#0ed","#1ea","#3de","#0f3","#2e7","#4db","#6cf","#1f0","#3e4","#5d8","#7cc","#4e1","#6d5","#8c9","#abd","#7d2","#9c6","#bba","#dae","#ac3","#cb7","#eab","#bc0","#db4","#fa8","#eb1","#0ec","#1e9","#3dd","#0f2","#2e6","#4da","#6ce","#3e3","#5d7","#7cb","#9bf","#4e0","#6d4","#8c8","#abc","#7d1","#9c5","#bb9","#dad","#ac2","#cb6","#eaa","#db3","#fa7","#eb0","#0eb","#2df","#1e8","#3dc","#0f1","#2e5","#4d9","#6cd","#3e2","#5d6","#7ca","#9be","#6d3","#8c7","#abb","#caf","#7d0","#9c4","#bb8","#dac","#ac1","#cb5","#ea9","#db2","#fa6","#0ea","#2de","#1e7","#3db","#5cf","#0f0","#2e4","#4d8","#6cc","#3e1","#5d5","#7c9","#9bd","#6d2","#8c6","#aba","#cae","#9c3","#bb7","#dab","#f9f","#ac0","#cb4","#ea8","#db1","#fa5","#0e9","#2dd","#1e6","#3da","#5ce","#2e3","#4d7","#6cb","#8bf","#3e0","#5d4","#7c8","#9bc","#6d1","#8c5","#ab9","#cad","#9c2","#bb6","#daa","#f9e","#cb3","#ea7","#db0","#fa4","#1df","#0e8","#2dc","#1e5","#3d9","#5cd","#2e2","#4d6","#6ca","#8be","#5d3","#7c7","#9bb","#baf","#6d0","#8c4","#ab8","#cac","#9c1","#bb5","#da9","#f9d","#cb2","#ea6","#fa3","#1de","#0e7","#2db","#4cf","#1e4","#3d8","#5cc","#2e1","#4d5","#6c9","#8bd","#5d2","#7c6","#9ba","#bae","#8c3","#ab7","#cab","#e9f","#9c0","#bb4","#da8","#f9c","#cb1","#ea5","#fa2","#1dd","#0e6","#2da","#4ce","#1e3","#3d7","#5cb","#7bf","#2e0","#4d4","#6c8","#8bc","#5d1","#7c5","#9b9","#bad","#8c2","#ab6","#caa","#e9e","#bb3","#da7","#f9b","#cb0","#ea4","#fa1","#0df","#1dc","#0e5","#2d9","#4cd","#1e2","#3d6","#5ca","#7be","#4d3","#6c7","#8bb","#aaf","#5d0","#7c4","#9b8","#bac","#8c1","#ab5","#ca9","#e9d","#bb2","#da6","#f9a","#ea3","#fa0","#0de","#1db","#3cf","#0e4","#2d8","#4cc","#1e1","#3d5","#5c9","#7bd","#4d2","#6c6","#8ba","#aae","#7c3","#9b7","#bab","#d9f","#8c0","#ab4","#ca8","#e9c","#bb1","#da5","#f99","#ea2","#0dd","#1da","#3ce","#0e3","#2d7","#4cb","#6bf","#1e0","#3d4","#5c8","#7bc","#4d1","#6c5","#8b9","#aad","#7c2","#9b6","#baa","#d9e","#ab3","#ca7","#e9b","#bb0","#da4","#f98","#ea1","#0dc","#1d9","#3cd","#0e2","#2d6","#4ca","#6be","#3d3","#5c7","#7bb","#9af","#4d0","#6c4","#8b8","#aac","#7c1","#9b5","#ba9","#d9d","#ab2","#ca6","#e9a","#da3","#f97","#ea0","#0db","#2cf","#1d8","#3cc","#0e1","#2d5","#4c9","#6bd","#3d2","#5c6","#7ba","#9ae","#6c3","#8b7","#aab","#c9f","#7c0","#9b4","#ba8","#d9c","#ab1","#ca5","#e99","#da2","#f96","#0da","#2ce","#1d7","#3cb","#5bf","#0e0","#2d4","#4c8","#6bc","#3d1","#5c5","#7b9","#9ad","#6c2","#8b6","#aaa","#c9e","#9b3","#ba7","#d9b","#f8f","#ab0","#ca4","#e98","#da1","#f95","#0d9","#2cd","#1d6","#3ca","#5be","#2d3","#4c7","#6bb","#8af","#3d0","#5c4","#7b8","#9ac","#6c1","#8b5","#aa9","#c9d","#9b2","#ba6","#d9a","#f8e","#ca3","#e97","#da0","#f94","#1cf","#0d8","#2cc","#1d5","#3c9","#5bd","#2d2","#4c6","#6ba","#8ae","#5c3","#7b7","#9ab","#b9f","#6c0","#8b4","#aa8","#c9c","#9b1","#ba5","#d99","#f8d","#ca2","#e96","#f93","#1ce","#0d7","#2cb","#4bf","#1d4","#3c8","#5bc","#2d1","#4c5","#6b9","#8ad","#5c2","#7b6","#9aa","#b9e","#8b3","#aa7","#c9b","#e8f","#9b0","#ba4","#d98","#f8c","#ca1","#e95","#f92","#1cd","#0d6","#2ca","#4be","#1d3","#3c7","#5bb","#7af","#2d0","#4c4","#6b8","#8ac","#5c1","#7b5","#9a9","#b9d","#8b2","#aa6","#c9a","#e8e","#ba3","#d97","#f8b","#ca0","#e94","#f91","#0cf","#1cc","#0d5","#2c9","#4bd","#1d2","#3c6","#5ba","#7ae","#4c3","#6b7","#8ab","#a9f","#5c0","#7b4","#9a8","#b9c","#8b1","#aa5","#c99","#e8d","#ba2","#d96","#f8a","#e93","#f90","#0ce","#1cb","#3bf","#0d4","#2c8","#4bc","#1d1","#3c5","#5b9","#7ad","#4c2","#6b6","#8aa","#a9e","#7b3","#9a7","#b9b","#d8f","#8b0","#aa4","#c98","#e8c","#ba1","#d95","#f89","#e92","#0cd","#1ca","#3be","#0d3","#2c7","#4bb","#6af","#1d0","#3c4","#5b8","#7ac","#4c1","#6b5","#8a9","#a9d","#7b2","#9a6","#b9a","#d8e","#aa3","#c97","#e8b","#ba0","#d94","#f88","#e91","#0cc","#1c9","#3bd","#0d2","#2c6","#4ba","#6ae","#3c3","#5b7","#7ab","#99f","#4c0","#6b4","#8a8","#a9c","#7b1","#9a5","#b99","#d8d","#aa2","#c96","#e8a","#d93","#f87","#e90","#0cb","#2bf","#1c8","#3bc","#0d1","#2c5","#4b9","#6ad","#3c2","#5b6","#7aa","#99e","#6b3","#8a7","#a9b","#c8f","#7b0","#9a4","#b98","#d8c","#aa1","#c95","#e89","#d92","#f86","#0ca","#2be","#1c7","#3bb","#5af","#0d0","#2c4","#4b8","#6ac","#3c1","#5b5","#7a9","#99d","#6b2","#8a6","#a9a","#c8e","#9a3","#b97","#d8b","#f7f","#aa0","#c94","#e88","#d91","#f85","#0c9","#2bd","#1c6","#3ba","#5ae","#2c3","#4b7","#6ab","#89f","#3c0","#5b4","#7a8","#99c","#6b1","#8a5","#a99","#c8d","#9a2","#b96","#d8a","#f7e","#c93","#e87","#d90","#f84","#1bf","#0c8","#2bc","#1c5","#3b9","#5ad","#2c2","#4b6","#6aa","#89e","#5b3","#7a7","#99b","#b8f","#6b0","#8a4","#a98","#c8c","#9a1","#b95","#d89","#f7d","#c92","#e86","#f83","#1be","#0c7","#2bb","#4af","#1c4","#3b8","#5ac","#2c1","#4b5","#6a9","#89d","#5b2","#7a6","#99a","#b8e","#8a3","#a97","#c8b","#e7f","#9a0","#b94","#d88","#f7c","#c91","#e85","#f82","#1bd","#0c6","#2ba","#4ae","#1c3","#3b7","#5ab","#79f","#2c0","#4b4","#6a8","#89c","#5b1","#7a5","#999","#b8d","#8a2","#a96","#c8a","#e7e","#b93","#d87","#f7b","#c90","#e84","#f81","#0bf","#1bc","#0c5","#2b9","#4ad","#1c2","#3b6","#5aa","#79e","#4b3","#6a7","#89b","#a8f","#5b0","#7a4","#998","#b8c","#8a1","#a95","#c89","#e7d","#b92","#d86","#f7a","#e83","#f80","#0be","#1bb","#3af","#0c4","#2b8","#4ac","#1c1","#3b5","#5a9","#79d","#4b2","#6a6","#89a","#a8e","#7a3","#997","#b8b","#d7f","#8a0","#a94","#c88","#e7c","#b91","#d85","#f79","#e82","#0bd","#1ba","#3ae","#0c3","#2b7","#4ab","#69f","#1c0","#3b4","#5a8","#79c","#4b1","#6a5","#899","#a8d","#7a2","#996","#b8a","#d7e","#a93","#c87","#e7b","#b90","#d84","#f78","#e81","#0bc","#1b9","#3ad","#0c2","#2b6","#4aa","#69e","#3b3","#5a7","#79b","#98f","#4b0","#6a4","#898","#a8c","#7a1","#995","#b89","#d7d","#a92","#c86","#e7a","#d83","#f77","#e80","#0bb","#2af","#1b8","#3ac","#0c1","#2b5","#4a9","#69d","#3b2","#5a6","#79a","#98e","#6a3","#897","#a8b","#c7f","#7a0","#994","#b88","#d7c","#a91","#c85","#e79","#d82","#f76","#0ba","#2ae","#1b7","#3ab","#59f","#0c0","#2b4","#4a8","#69c","#3b1","#5a5","#799","#98d","#6a2","#896","#a8a","#c7e","#993","#b87","#d7b","#f6f","#a90","#c84","#e78","#d81","#f75","#0b9","#2ad","#1b6","#3aa","#59e","#2b3","#4a7","#69b","#88f","#3b0","#5a4","#798","#98c","#6a1","#895","#a89","#c7d","#992","#b86","#d7a","#f6e","#c83","#e77","#d80","#f74","#1af","#0b8","#2ac","#1b5","#3a9","#59d","#2b2","#4a6","#69a","#88e","#5a3","#797","#98b","#b7f","#6a0","#894","#a88","#c7c","#991","#b85","#d79","#f6d","#c82","#e76","#f73","#1ae","#0b7","#2ab","#49f","#1b4","#3a8","#59c","#2b1","#4a5","#699","#88d","#5a2","#796","#98a","#b7e","#893","#a87","#c7b","#e6f","#990","#b84","#d78","#f6c","#c81","#e75","#f72","#1ad","#0b6","#2aa","#49e","#1b3","#3a7","#59b","#78f","#2b0","#4a4","#698","#88c","#5a1","#795","#989","#b7d","#892","#a86","#c7a","#e6e","#b83","#d77","#f6b","#c80","#e74","#f71","#0af","#1ac","#0b5","#2a9","#49d","#1b2","#3a6","#59a","#78e","#4a3","#697","#88b","#a7f","#5a0","#794","#988","#b7c","#891","#a85","#c79","#e6d","#b82","#d76","#f6a","#e73","#f70","#0ae","#1ab","#39f","#0b4","#2a8","#49c","#1b1","#3a5","#599","#78d","#4a2","#696","#88a","#a7e","#793","#987","#b7b","#d6f","#890","#a84","#c78","#e6c","#b81","#d75","#f69","#e72","#0ad","#1aa","#39e","#0b3","#2a7","#49b","#68f","#1b0","#3a4","#598","#78c","#4a1","#695","#889","#a7d","#792","#986","#b7a","#d6e","#a83","#c77","#e6b","#b80","#d74","#f68","#e71","#0ac","#1a9","#39d","#0b2","#2a6","#49a","#68e","#3a3","#597","#78b","#97f","#4a0","#694","#888","#a7c","#791","#985","#b79","#d6d","#a82","#c76","#e6a","#d73","#f67","#e70","#0ab","#29f","#1a8","#39c","#0b1","#2a5","#499","#68d","#3a2","#596","#78a","#97e","#693","#887","#a7b","#c6f","#790","#984","#b78","#d6c","#a81","#c75","#e69","#d72","#f66","#0aa","#29e","#1a7","#39b","#58f","#0b0","#2a4","#498","#68c","#3a1","#595","#789","#97d","#692","#886","#a7a","#c6e","#983","#b77","#d6b","#f5f","#a80","#c74","#e68","#d71","#f65","#0a9","#29d","#1a6","#39a","#58e","#2a3","#497","#68b","#87f","#3a0","#594","#788","#97c","#691","#885","#a79","#c6d","#982","#b76","#d6a","#f5e","#c73","#e67","#d70","#f64","#19f","#0a8","#29c","#1a5","#399","#58d","#2a2","#496","#68a","#87e","#593","#787","#97b","#b6f","#690","#884","#a78","#c6c","#981","#b75","#d69","#f5d","#c72","#e66","#f63","#19e","#0a7","#29b","#48f","#1a4","#398","#58c","#2a1","#495","#689","#87d","#592","#786","#97a","#b6e","#883","#a77","#c6b","#e5f","#980","#b74","#d68","#f5c","#c71","#e65","#f62","#19d","#0a6","#29a","#48e","#1a3","#397","#58b","#77f","#2a0","#494","#688","#87c","#591","#785","#979","#b6d","#882","#a76","#c6a","#e5e","#b73","#d67","#f5b","#c70","#e64","#f61","#09f","#19c","#0a5","#299","#48d","#1a2","#396","#58a","#77e","#493","#687","#87b","#a6f","#590","#784","#978","#b6c","#881","#a75","#c69","#e5d","#b72","#d66","#f5a","#e63","#f60","#09e","#19b","#38f","#0a4","#298","#48c","#1a1","#395","#589","#77d","#492","#686","#87a","#a6e","#783","#977","#b6b","#d5f","#880","#a74","#c68","#e5c","#b71","#d65","#f59","#e62","#09d","#19a","#38e","#0a3","#297","#48b","#67f","#1a0","#394","#588","#77c","#491","#685","#879","#a6d","#782","#976","#b6a","#d5e","#a73","#c67","#e5b","#b70","#d64","#f58","#e61","#09c","#199","#38d","#0a2","#296","#48a","#67e","#393","#587","#77b","#96f","#490","#684","#878","#a6c","#781","#975","#b69","#d5d","#a72","#c66","#e5a","#d63","#f57","#e60","#09b","#28f","#198","#38c","#0a1","#295","#489","#67d","#392","#586","#77a","#96e","#683","#877","#a6b","#c5f","#780","#974","#b68","#d5c","#a71","#c65","#e59","#d62","#f56","#09a","#28e","#197","#38b","#57f","#0a0","#294","#488","#67c","#391","#585","#779","#96d","#682","#876","#a6a","#c5e","#973","#b67","#d5b","#f4f","#a70","#c64","#e58","#d61","#f55","#099","#28d","#196","#38a","#57e","#293","#487","#67b","#86f","#390","#584","#778","#96c","#681","#875","#a69","#c5d","#972","#b66","#d5a","#f4e","#c63","#e57","#d60","#f54","#18f","#098","#28c","#195","#389","#57d","#292","#486","#67a","#86e","#583","#777","#96b","#b5f","#680","#874","#a68","#c5c","#971","#b65","#d59","#f4d","#c62","#e56","#f53","#18e","#097","#28b","#47f","#194","#388","#57c","#291","#485","#679","#86d","#582","#776","#96a","#b5e","#873","#a67","#c5b","#e4f","#970","#b64","#d58","#f4c","#c61","#e55","#f52","#18d","#096","#28a","#47e","#193","#387","#57b","#76f","#290","#484","#678","#86c","#581","#775","#969","#b5d","#872","#a66","#c5a","#e4e","#b63","#d57","#f4b","#c60","#e54","#f51","#08f","#18c","#095","#289","#47d","#192","#386","#57a","#76e","#483","#677","#86b","#a5f","#580","#774","#968","#b5c","#871","#a65","#c59","#e4d","#b62","#d56","#f4a","#e53","#f50","#08e","#18b","#37f","#094","#288","#47c","#191","#385","#579","#76d","#482","#676","#86a","#a5e","#773","#967","#b5b","#d4f","#870","#a64","#c58","#e4c","#b61","#d55","#f49","#e52","#08d","#18a","#37e","#093","#287","#47b","#66f","#190","#384","#578","#76c","#481","#675","#869","#a5d","#772","#966","#b5a","#d4e","#a63","#c57","#e4b","#b60","#d54","#f48","#e51","#08c","#189","#37d","#092","#286","#47a","#66e","#383","#577","#76b","#95f","#480","#674","#868","#a5c","#771","#965","#b59","#d4d","#a62","#c56","#e4a","#d53","#f47","#e50","#08b","#27f","#188","#37c","#091","#285","#479","#66d","#382","#576","#76a","#95e","#673","#867","#a5b","#c4f","#770","#964","#b58","#d4c","#a61","#c55","#e49","#d52","#f46","#08a","#27e","#187","#37b","#56f","#090","#284","#478","#66c","#381","#575","#769","#95d","#672","#866","#a5a","#c4e","#963","#b57","#d4b","#f3f","#a60","#c54","#e48","#d51","#f45","#089","#27d","#186","#37a","#56e","#283","#477","#66b","#85f","#380","#574","#768","#95c","#671","#865","#a59","#c4d","#962","#b56","#d4a","#f3e","#c53","#e47","#d50","#f44","#17f","#088","#27c","#185","#379","#56d","#282","#476","#66a","#85e","#573","#767","#95b","#b4f","#670","#864","#a58","#c4c","#961","#b55","#d49","#f3d","#c52","#e46","#f43","#17e","#087","#27b","#46f","#184","#378","#56c","#281","#475","#669","#85d","#572","#766","#95a","#b4e","#863","#a57","#c4b","#e3f","#960","#b54","#d48","#f3c","#c51","#e45","#f42","#17d","#086","#27a","#46e","#183","#377","#56b","#75f","#280","#474","#668","#85c","#571","#765","#959","#b4d","#862","#a56","#c4a","#e3e","#b53","#d47","#f3b","#c50","#e44","#f41","#07f","#17c","#085","#279","#46d","#182","#376","#56a","#75e","#473","#667","#85b","#a4f","#570","#764","#958","#b4c","#861","#a55","#c49","#e3d","#b52","#d46","#f3a","#e43","#f40","#07e","#17b","#36f","#084","#278","#46c","#181","#375","#569","#75d","#472","#666","#85a","#a4e","#763","#957","#b4b","#d3f","#860","#a54","#c48","#e3c","#b51","#d45","#f39","#e42","#07d","#17a","#36e","#083","#277","#46b","#65f","#180","#374","#568","#75c","#471","#665","#859","#a4d","#762","#956","#b4a","#d3e","#a53","#c47","#e3b","#b50","#d44","#f38","#e41","#07c","#179","#36d","#082","#276","#46a","#65e","#373","#567","#75b","#94f","#470","#664","#858","#a4c","#761","#955","#b49","#d3d","#a52","#c46","#e3a","#d43","#f37","#e40","#07b","#26f","#178","#36c","#081","#275","#469","#65d","#372","#566","#75a","#94e","#663","#857","#a4b","#c3f","#760","#954","#b48","#d3c","#a51","#c45","#e39","#d42","#f36","#07a","#26e","#177","#36b","#55f","#080","#274","#468","#65c","#371","#565","#759","#94d","#662","#856","#a4a","#c3e","#953","#b47","#d3b","#f2f","#a50","#c44","#e38","#d41","#f35","#079","#26d","#176","#36a","#55e","#273","#467","#65b","#84f","#370","#564","#758","#94c","#661","#855","#a49","#c3d","#952","#b46","#d3a","#f2e","#c43","#e37","#d40","#f34","#16f","#078","#26c","#175","#369","#55d","#272","#466","#65a","#84e","#563","#757","#94b","#b3f","#660","#854","#a48","#c3c","#951","#b45","#d39","#f2d","#c42","#e36","#f33","#16e","#077","#26b","#45f","#174","#368","#55c","#271","#465","#659","#84d","#562","#756","#94a","#b3e","#853","#a47","#c3b","#e2f","#950","#b44","#d38","#f2c","#c41","#e35","#f32","#16d","#076","#26a","#45e","#173","#367","#55b","#74f","#270","#464","#658","#84c","#561","#755","#949","#b3d","#852","#a46","#c3a","#e2e","#b43","#d37","#f2b","#c40","#e34","#f31","#06f","#16c","#075","#269","#45d","#172","#366","#55a","#74e","#463","#657","#84b","#a3f","#560","#754","#948","#b3c","#851","#a45","#c39","#e2d","#b42","#d36","#f2a","#e33","#f30","#06e","#16b","#35f","#074","#268","#45c","#171","#365","#559","#74d","#462","#656","#84a","#a3e","#753","#947","#b3b","#d2f","#850","#a44","#c38","#e2c","#b41","#d35","#f29","#e32","#06d","#16a","#35e","#073","#267","#45b","#64f","#170","#364","#558","#74c","#461","#655","#849","#a3d","#752","#946","#b3a","#d2e","#a43","#c37","#e2b","#b40","#d34","#f28","#e31","#06c","#169","#35d","#072","#266","#45a","#64e","#363","#557","#74b","#93f","#460","#654","#848","#a3c","#751","#945","#b39","#d2d","#a42","#c36","#e2a","#d33","#f27","#e30","#06b","#25f","#168","#35c","#071","#265","#459","#64d","#362","#556","#74a","#93e","#653","#847","#a3b","#c2f","#750","#944","#b38","#d2c","#a41","#c35","#e29","#d32","#f26","#06a","#25e","#167","#35b","#54f","#070","#264","#458","#64c","#361","#555","#749","#93d","#652","#846","#a3a","#c2e","#943","#b37","#d2b","#f1f","#a40","#c34","#e28","#d31","#f25","#069","#25d","#166","#35a","#54e","#263","#457","#64b","#83f","#360","#554","#748","#93c","#651","#845","#a39","#c2d","#942","#b36","#d2a","#f1e","#c33","#e27","#d30","#f24","#15f","#068","#25c","#165","#359","#54d","#262","#456","#64a","#83e","#553","#747","#93b","#b2f","#650","#844","#a38","#c2c","#941","#b35","#d29","#f1d","#c32","#e26","#f23","#15e","#067","#25b","#44f","#164","#358","#54c","#261","#455","#649","#83d","#552","#746","#93a","#b2e","#843","#a37","#c2b","#e1f","#940","#b34","#d28","#f1c","#c31","#e25","#f22","#15d","#066","#25a","#44e","#163","#357","#54b","#73f","#260","#454","#648","#83c","#551","#745","#939","#b2d","#842","#a36","#c2a","#e1e","#b33","#d27","#f1b","#c30","#e24","#f21","#05f","#15c","#065","#259","#44d","#162","#356","#54a","#73e","#453","#647","#83b","#a2f","#550","#744","#938","#b2c","#841","#a35","#c29","#e1d","#b32","#d26","#f1a","#e23","#f20","#05e","#15b","#34f","#064","#258","#44c","#161","#355","#549","#73d","#452","#646","#83a","#a2e","#743","#937","#b2b","#d1f","#840","#a34","#c28","#e1c","#b31","#d25","#f19","#e22","#05d","#15a","#34e","#063","#257","#44b","#63f","#160","#354","#548","#73c","#451","#645","#839","#a2d","#742","#936","#b2a","#d1e","#a33","#c27","#e1b","#b30","#d24","#f18","#e21","#05c","#159","#34d","#062","#256","#44a","#63e","#353","#547","#73b","#92f","#450","#644","#838","#a2c","#741","#935","#b29","#d1d","#a32","#c26","#e1a","#d23","#f17","#e20","#05b","#24f","#158","#34c","#061","#255","#449","#63d","#352","#546","#73a","#92e","#643","#837","#a2b","#c1f","#740","#934","#b28","#d1c","#a31","#c25","#e19","#d22","#f16","#05a","#24e","#157","#34b","#53f","#060","#254","#448","#63c","#351","#545","#739","#92d","#642","#836","#a2a","#c1e","#933","#b27","#d1b","#f0f","#a30","#c24","#e18","#d21","#f15","#059","#24d","#156","#34a","#53e","#253","#447","#63b","#82f","#350","#544","#738","#92c","#641","#835","#a29","#c1d","#932","#b26","#d1a","#f0e","#c23","#e17","#d20","#f14","#14f","#058","#24c","#155","#349","#53d","#252","#446","#63a","#82e","#543","#737","#92b","#b1f","#640","#834","#a28","#c1c","#931","#b25","#d19","#f0d","#c22","#e16","#f13","#14e","#057","#24b","#43f","#154","#348","#53c","#251","#445","#639","#82d","#542","#736","#92a","#b1e","#833","#a27","#c1b","#e0f","#930","#b24","#d18","#f0c","#c21","#e15","#f12","#14d","#056","#24a","#43e","#153","#347","#53b","#72f","#250","#444","#638","#82c","#541","#735","#929","#b1d","#832","#a26","#c1a","#e0e","#b23","#d17","#f0b","#c20","#e14","#f11","#04f","#14c","#055","#249","#43d","#152","#346","#53a","#72e","#443","#637","#82b","#a1f","#540","#734","#928","#b1c","#831","#a25","#c19","#e0d","#b22","#d16","#f0a","#e13","#f10","#04e","#14b","#33f","#054","#248","#43c","#151","#345","#539","#72d","#442","#636","#82a","#a1e","#733","#927","#b1b","#d0f","#830","#a24","#c18","#e0c","#b21","#d15","#f09","#e12","#04d","#14a","#33e","#053","#247","#43b","#62f","#150","#344","#538","#72c","#441","#635","#829","#a1d","#732","#926","#b1a","#d0e","#a23","#c17","#e0b","#b20","#d14","#f08","#e11","#04c","#149","#33d","#052","#246","#43a","#62e","#343","#537","#72b","#91f","#440","#634","#828","#a1c","#731","#925","#b19","#d0d","#a22","#c16","#e0a","#d13","#f07","#e10","#04b","#23f","#148","#33c","#051","#245","#439","#62d","#342","#536","#72a","#91e","#633","#827","#a1b","#c0f","#730","#924","#b18","#d0c","#a21","#c15","#e09","#d12","#f06","#04a","#23e","#147","#33b","#52f","#050","#244","#438","#62c","#341","#535","#729","#91d","#632","#826","#a1a","#c0e","#923","#b17","#d0b","#a20","#c14","#e08","#d11","#f05","#049","#23d","#146","#33a","#52e","#243","#437","#62b","#81f","#340","#534","#728","#91c","#631","#825","#a19","#c0d","#922","#b16","#d0a","#c13","#e07","#d10","#f04","#13f","#048","#23c","#145","#339","#52d","#242","#436","#62a","#81e","#533","#727","#91b","#b0f","#630","#824","#a18","#c0c","#921","#b15","#d09","#c12","#e06","#f03","#13e","#047","#23b","#42f","#144","#338","#52c","#241","#435","#629","#81d","#532","#726","#91a","#b0e","#823","#a17","#c0b","#920","#b14","#d08","#c11","#e05","#f02","#13d","#046","#23a","#42e","#143","#337","#52b","#71f","#240","#434","#628","#81c","#531","#725","#919","#b0d","#822","#a16","#c0a","#b13","#d07","#c10","#e04","#f01","#03f","#13c","#045","#239","#42d","#142","#336","#52a","#71e","#433","#627","#81b","#a0f","#530","#724","#918","#b0c","#821","#a15","#c09","#b12","#d06","#e03","#f00","#03e","#13b","#32f","#044","#238","#42c","#141","#335","#529","#71d","#432","#626","#81a","#a0e","#723","#917","#b0b","#820","#a14","#c08","#b11","#d05","#e02","#03d","#13a","#32e","#043","#237","#42b","#61f","#140","#334","#528","#71c","#431","#625","#819","#a0d","#722","#916","#b0a","#a13","#c07","#b10","#d04","#e01","#03c","#139","#32d","#042","#236","#42a","#61e","#333","#527","#71b","#90f","#430","#624","#818","#a0c","#721","#915","#b09","#a12","#c06","#d03","#e00","#03b","#22f","#138","#32c","#041","#235","#429","#61d","#332","#526","#71a","#90e","#623","#817","#a0b","#720","#914","#b08","#a11","#c05","#d02","#03a","#22e","#137","#32b","#51f","#040","#234","#428","#61c","#331","#525","#719","#90d","#622","#816","#a0a","#913","#b07","#a10","#c04","#d01","#039","#22d","#136","#32a","#51e","#233","#427","#61b","#80f","#330","#524","#718","#90c","#621","#815","#a09","#912","#b06","#c03","#d00","#12f","#038","#22c","#135","#329","#51d","#232","#426","#61a","#80e","#523","#717","#90b","#620","#814","#a08","#911","#b05","#c02","#12e","#037","#22b","#41f","#134","#328","#51c","#231","#425","#619","#80d","#522","#716","#90a","#813","#a07","#910","#b04","#c01","#12d","#036","#22a","#41e","#133","#327","#51b","#70f","#230","#424","#618","#80c","#521","#715","#909","#812","#a06","#b03","#c00","#02f","#12c","#035","#229","#41d","#132","#326","#51a","#70e","#423","#617","#80b","#520","#714","#908","#811","#a05","#b02","#02e","#12b","#31f","#034","#228","#41c","#131","#325","#519","#70d","#422","#616","#80a","#713","#907","#810","#a04","#b01","#02d","#12a","#31e","#033","#227","#41b","#60f","#130","#324","#518","#70c","#421","#615","#809","#712","#906","#a03","#b00","#02c","#129","#31d","#032","#226","#41a","#60e","#323","#517","#70b","#420","#614","#808","#711","#905","#a02","#02b","#21f","#128","#31c","#031","#225","#419","#60d","#322","#516","#70a","#613","#807","#710","#904","#a01","#02a","#21e","#127","#31b","#50f","#030","#224","#418","#60c","#321","#515","#709","#612","#806","#903","#a00","#029","#21d","#126","#31a","#50e","#223","#417","#60b","#320","#514","#708","#611","#805","#902","#11f","#028","#21c","#125","#319","#50d","#222","#416","#60a","#513","#707","#610","#804","#901","#11e","#027","#21b","#40f","#124","#318","#50c","#221","#415","#609","#512","#706","#803","#900","#11d","#026","#21a","#40e","#123","#317","#50b","#220","#414","#608","#511","#705","#802","#01f","#11c","#025","#219","#40d","#122","#316","#50a","#413","#607","#510","#704","#801","#01e","#11b","#30f","#024","#218","#40c","#121","#315","#509","#412","#606","#703","#800","#01d","#11a","#30e","#023","#217","#40b","#120","#314","#508","#411","#605","#702","#01c","#119","#30d","#022","#216","#40a","#313","#507","#410","#604","#701","#01b","#20f","#118","#30c","#021","#215","#409","#312","#506","#603","#700","#01a","#20e","#117","#30b","#020","#214","#408","#311","#505","#602","#019","#20d","#116","#30a","#213","#407","#310","#504","#601","#10f","#018","#20c","#115","#309","#212","#406","#503","#600","#10e","#017","#20b","#114","#308","#211","#405","#502","#10d","#016","#20a","#113","#307","#210","#404","#501","#00f","#10c","#015","#209","#112","#306","#403","#500","#00e","#10b","#014","#208","#111","#305","#402","#00d","#10a","#013","#207","#110","#304","#401","#00c","#109","#012","#206","#303","#400","#00b","#108","#011","#205","#302","#00a","#107","#010","#204","#301","#009","#106","#203","#300","#008","#105","#202","#007","#104","#201","#006","#103","#200","#005","#102","#004","#101","#003","#100","#002","#001","#000"];
my.Array2.prototype.abs = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.abs(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.abs(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.acos = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.acos(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.acos(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.asin = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.asin(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.asin(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.atan = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.atan(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.atan(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.ceil = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.ceil(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.ceil(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.cos = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.cos(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.cos(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.exp = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.exp(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.exp(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.floor = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.floor(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.floor(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.log = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.log(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.log(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.random = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.random(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.random(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.round = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.round(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.round(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.sin = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.sin(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.sin(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.sqrt = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.sqrt(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.sqrt(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.tan = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.tan(arr[jj2]);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.tan(arr[jj2]);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.atan2 = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.atan2(arr[jj2], aaNext());} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.atan2(arr[jj2], aaNext());} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.pow = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.pow(arr[jj2], aaNext());} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = Math.pow(arr[jj2], aaNext());} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.inv = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = 1 / arr[jj2];} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = 1 / arr[jj2];} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.neg = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = -arr[jj2];} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = -arr[jj2];} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.sgn = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = (arr[jj2] !== 0) && ((arr[jj2] > 0) || -1);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = (arr[jj2] !== 0) && ((arr[jj2] > 0) || -1);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.sqd = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] *= arr[jj2];} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] *= arr[jj2];} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.sqdSgn = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, tmp; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {tmp = arr[jj2]; arr[jj2] = tmp < 0 ? -tmp * tmp : tmp * tmp;} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {tmp = arr[jj2]; arr[jj2] = tmp < 0 ? -tmp * tmp : tmp * tmp;} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.sqrtSgn = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, tmp; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {tmp = arr[jj2]; arr[jj2] = tmp < 0 ? -Math.sqrt(-tmp) : Math.sqrt(tmp);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {tmp = arr[jj2]; arr[jj2] = tmp < 0 ? -Math.sqrt(-tmp) : Math.sqrt(tmp);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.compare = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, tmp, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {tmp = aaNext(); arr[jj2] = (arr[jj2] !== tmp) && ((arr[jj2] > tmp) || -1);} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {tmp = aaNext(); arr[jj2] = (arr[jj2] !== tmp) && ((arr[jj2] > tmp) || -1);} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.eq = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] === aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] === aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.gt = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] > aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] > aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.gte = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] >= aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] >= aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.inv2 = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext() / arr[jj2];} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext() / arr[jj2];} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.add = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] += aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] += aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.div = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] /= aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] /= aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.lt = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] < aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] < aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.lte = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] <= aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] <= aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.maxMag = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, tmp, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {tmp = aaNext(); if(Math.abs(tmp) > Math.abs(arr[jj2])) {arr[jj2] = tmp;}} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {tmp = aaNext(); if(Math.abs(tmp) > Math.abs(arr[jj2])) {arr[jj2] = tmp;}} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.minMag = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, tmp, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {tmp = aaNext(); if(Math.abs(tmp) < Math.abs(arr[jj2])) {arr[jj2] = tmp;}} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {tmp = aaNext(); if(Math.abs(tmp) < Math.abs(arr[jj2])) {arr[jj2] = tmp;}} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.mod = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] %= aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] %= aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.modInv = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext() % arr[jj2];} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext() % arr[jj2];} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.mul = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] *= aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] *= aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype._set = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.sub = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] -= aaNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] -= aaNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.subInv = function(aa) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext() - arr[jj2];} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = aaNext() - arr[jj2];} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.addMul = function(aa, bb) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, bbNext = my.Array2.iter0(bb, this.ll2), aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = (arr[jj2] + aaNext()) * bbNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = (arr[jj2] + aaNext()) * bbNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.mulAdd = function(aa, bb) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, bbNext = my.Array2.iter0(bb, this.ll2), aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] * aaNext() + bbNext();} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {arr[jj2] = arr[jj2] * aaNext() + bbNext();} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.selectIf = function(aa, bb) {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, bbNext = my.Array2.iter0(bb, this.ll2), aaNext = my.Array2.iter0(aa, this.ll2); arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {if(aaNext()) {arr[jj2] = bbNext();}} return this;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {if(aaNext()) {arr[jj2] = bbNext();}} mm2 += stride1;
    }
    return this;
  };
my.Array2.prototype.max0 = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, out; out = -Infinity; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {if(arr[jj2] > out) {out = arr[jj2];}} return out;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {if(arr[jj2] > out) {out = arr[jj2];}} mm2 += stride1;
    }
    return out;
  };
my.Array2.prototype.min0 = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, out; out = Infinity; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {if(arr[jj2] < out) {out = arr[jj2];}} return out;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {if(arr[jj2] < out) {out = arr[jj2];}} mm2 += stride1;
    }
    return out;
  };
my.Array2.prototype.sum0 = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, out; out = 0; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {out += arr[jj2];} return out;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {out += arr[jj2];} mm2 += stride1;
    }
    return out;
  };
my.Array2.prototype.stt0 = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, tmp, out; out = {"max": -Infinity, "min": Infinity, "sum": 0}; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {tmp = arr[jj2]; if(out.max < tmp) {out.max = tmp;}if(out.min > tmp) {out.min = tmp;} out.sum += tmp;} return out;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {tmp = arr[jj2]; if(out.max < tmp) {out.max = tmp;}if(out.min > tmp) {out.min = tmp;} out.sum += tmp;} mm2 += stride1;
    }
    return out;
  };
my.Array2.prototype.var0 = function() {
    var arr, jj1, jj2, mm1, mm2, stride1, stride2, dv, ii, mean, out, vv; ii = mean = out = 0; arr = this.arr;
    //// OPTIMIZATION - one dimensional
    if(this.is1d()) {
      stride2 = this.is1d(); mm2 = this.offset + this.ll1 * this.ll2 * stride2;
      for(jj2 = this.offset; jj2 < mm2; jj2 += stride2) {vv = arr[jj2]; dv = vv - mean; mean += dv / (1 + ii); out += dv * (vv - mean); ii += 1;} return out;
    }
    stride1 = this.stride1; mm1 = this.offset + this.ll1 * stride1;
    stride2 = this.stride2; mm2 = this.offset + this.ll2 * stride2;
    for(jj1 = this.offset; jj1 < mm1; jj1 += stride1) {
      for(jj2 = jj1; jj2 < mm2; jj2 += stride2) {vv = arr[jj2]; dv = vv - mean; mean += dv / (1 + ii); out += dv * (vv - mean); ii += 1;} mm2 += stride1;
    }
    return out;
  };
my.Array2.prototype.max1 = function (aa, mode) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, next, sum;
    if(mode !== 'inverted') {return aa.max1(this, 'inverted');}
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2; next = my.Array2.iter1(aa);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      sum = -Infinity;
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { sum = Math.max(arr[jj2], sum); jj2 += stride2;}
      aa.arr[next()] = sum;
    jj1 += stride1; } return aa;};
my.Array2.prototype.min1 = function (aa, mode) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, next, sum;
    if(mode !== 'inverted') {return aa.min1(this, 'inverted');}
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2; next = my.Array2.iter1(aa);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      sum = Infinity;
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { sum = Math.min(arr[jj2], sum); jj2 += stride2;}
      aa.arr[next()] = sum;
    jj1 += stride1; } return aa;};
my.Array2.prototype.sum1 = function (aa, mode) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, next, sum;
    if(mode !== 'inverted') {return aa.sum1(this, 'inverted');}
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2; next = my.Array2.iter1(aa);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      sum = 0;
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { sum += arr[jj2]; jj2 += stride2;}
      aa.arr[next()] = sum;
    jj1 += stride1; } return aa;};
my.Array2.prototype.var1 = function (aa, mode) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, next, sum, dv, mean, vv; mean = 0;
    if(mode !== 'inverted') {return aa.var1(this, 'inverted');}
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2; next = my.Array2.iter1(aa);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      sum = 0;
      for(ii2 = 0; ii2 < ll2; ii2 += 1) { vv = arr[jj2]; dv = vv - mean; mean += dv / (1 + ii2); sum += dv * (vv - mean); jj2 += stride2;}
      aa.arr[next()] = sum;
    jj1 += stride1; } return aa.mul(1 / (-1 + ll2));};
my.Array2.prototype.subCos = function (cff, scale) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, cffNext, aa, pp, ww;
    scale = scale || 1;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    this.subPoly(cff.slice(null, null, 3, null), scale);
    cffNext = my.Array2.iter0(cff.slice(null, null, 0, 3), 1);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      aa = cffNext(); ww = cffNext(); pp = cffNext();
      for(ii2 = 0; ii2 < ll2; ii2 += 1) {
        arr[jj2] -= aa * Math.cos((ii2 * scale * ww % PI2) + pp);
      jj2 += stride2;}
    jj1 += stride1; } return this;};
my.Array2.prototype.subPoly = function (cff, scale) {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2, cffNext, ii3, ll3, tmp, xx;
    if(cff.is0d()) {return this;}
    scale = scale || 1;
    if(this.is0d()) {return this;} arr = this.arr; jj1 = this.offset; ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    ll3 = cff.ll2; tmp = new Float64Array(ll3); cffNext = my.Array2.iter0(cff, 1);
    for(ii1 = 0; ii1 < ll1; ii1 += 1) { jj2 = jj1;
      for(ii3 = 0; ii3 < ll3; ii3 += 1) {tmp[ii3] = cffNext();}
      for(ii2 = 0; ii2 < ll2; ii2 += 1) {
        xx = 1;
        for(ii3 = 0; ii3 < ll3; ii3 += 1) {arr[jj2] -= tmp[ii3] * xx; xx *= ii2 * scale;}
      jj2 += stride2;}
    jj1 += stride1; } return this;};
//// JSLINT_IGNORE_BEG
my.jslint = function (ss, options) {




























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































// jslint.js
// 2012-05-09

// Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// The Software shall be used for Good, not Evil.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// WARNING: JSLint will hurt your feelings.

// JSLINT is a global function. It takes two parameters.

//     var myResult = JSLINT(source, option);

// The first parameter is either a string or an array of strings. If it is a
// string, it will be split on '\n' or '\r'. If it is an array of strings, it
// is assumed that each string represents one line. The source can be a
// JavaScript text, or HTML text, or a JSON text, or a CSS text.

// The second parameter is an optional object of options that control the
// operation of JSLINT. Most of the options are booleans: They are all
// optional and have a default value of false. One of the options, predef,
// can be an array of names, which will be used to declare global variables,
// or an object whose keys are used as global names, with a boolean value
// that determines if they are assignable.

// If it checks out, JSLINT returns true. Otherwise, it returns false.

// If false, you can inspect JSLINT.errors to find out the problems.
// JSLINT.errors is an array of objects containing these properties:

//  {
//      line      : The line (relative to 0) at which the lint was found
//      character : The character (relative to 0) at which the lint was found
//      reason    : The problem
//      evidence  : The text line in which the problem occurred
//      raw       : The raw message before the details were inserted
//      a         : The first detail
//      b         : The second detail
//      c         : The third detail
//      d         : The fourth detail
//  }

// If a stopping error was found, a null will be the last element of the
// JSLINT.errors array. A stopping error means that JSLint was not confident
// enough to continue. It does not necessarily mean that the error was
// especially heinous.

// You can request a data structure that contains JSLint's results.

//     var myData = JSLINT.data();

// It returns a structure with this form:

//     {
//         errors: [
//             {
//                 line: NUMBER,
//                 character: NUMBER,
//                 reason: STRING,
//                 evidence: STRING
//             }
//         ],
//         functions: [
//             {
//                 name: STRING,
//                 line: NUMBER,
//                 last: NUMBER,
//                 params: [
//                     {
//                         string: STRING
//                     }
//                 ],
//                 closure: [
//                     STRING
//                 ],
//                 var: [
//                     STRING
//                 ],
//                 exception: [
//                     STRING
//                 ],
//                 outer: [
//                     STRING
//                 ],
//                 unused: [
//                     STRING
//                 ],
//                 undef: [
//                     STRING
//                 ],
//                 global: [
//                     STRING
//                 ],
//                 label: [
//                     STRING
//                 ]
//             }
//         ],
//         globals: [
//             STRING
//         ],
//         member: {
//             STRING: NUMBER
//         },
//         urls: [
//             STRING
//         ],
//         json: BOOLEAN
//     }

// Empty arrays will not be included.

// You can request a Function Report, which shows all of the functions
// and the parameters and vars that they use. This can be used to find
// implied global variables and other problems. The report is in HTML and
// can be inserted in an HTML <body>. It should be given the result of the
// JSLINT.data function.

//     var myReport = JSLINT.report(data);

// You can request an HTML error report.

//     var myErrorReport = JSLINT.error_report(data);

// You can request a properties report, which produces a list of the program's
// properties in the form of a /*properties*/ declaration.

//      var myPropertyReport = properties_report(JSLINT.property);

// You can obtain the parse tree that JSLint constructed while parsing. The
// latest tree is kept in JSLINT.tree. A nice stringication can be produced
// with

//     JSON.stringify(JSLINT.tree, [
//         'string',  'arity', 'name',  'first',
//         'second', 'third', 'block', 'else'
//     ], 4));

// JSLint provides three directives. They look like slashstar comments, and
// allow for setting options, declaring global variables, and establishing a
// set of allowed property names.

// These directives respect function scope.

// The jslint directive is a special comment that can set one or more options.
// The current option set is

//     anon       true, if the space may be omitted in anonymous function declarations
//     bitwise    true, if bitwise operators should be allowed
//     browser    true, if the standard browser globals should be predefined
//     cap        true, if upper case HTML should be allowed
//     'continue' true, if the continuation statement should be tolerated
//     css        true, if CSS workarounds should be tolerated
//     debug      true, if debugger statements should be allowed
//     devel      true, if logging should be allowed (console, alert, etc.)
//     eqeq       true, if == should be allowed
//     es5        true, if ES5 syntax should be allowed
//     evil       true, if eval should be allowed
//     forin      true, if for in statements need not filter
//     fragment   true, if HTML fragments should be allowed
//     indent     the indentation factor
//     maxerr     the maximum number of errors to allow
//     maxlen     the maximum length of a source line
//     newcap     true, if constructor names capitalization is ignored
//     node       true, if Node.js globals should be predefined
//     nomen      true, if names may have dangling _
//     on         true, if HTML event handlers should be allowed
//     passfail   true, if the scan should stop on first error
//     plusplus   true, if increment/decrement should be allowed
//     properties true, if all property names must be declared with /*properties*/
//     regexp     true, if the . should be allowed in regexp literals
//     rhino      true, if the Rhino environment globals should be predefined
//     undef      true, if variables can be declared out of order
//     unparam    true, if unused parameters should be tolerated
//     sloppy     true, if the 'use strict'; pragma is optional
//     stupid     true, if really stupid practices are tolerated
//     sub        true, if all forms of subscript notation are tolerated
//     vars       true, if multiple var statements per function should be allowed
//     white      true, if sloppy whitespace is tolerated
//     windows    true, if MS Windows-specific globals should be predefined

// For example:

/*jslint
    evil: true, nomen: true, regexp: true
*/

// The properties directive declares an exclusive list of property names.
// Any properties named in the program that are not in the list will
// produce a warning.

// For example:

/*properties
    '\b', '\t', '\n', '\f', '\r', '!', '!=', '!==', '"', '%', '\'',
    '(arguments)', '(begin)', '(breakage)', '(context)', '(error)',
    '(identifier)', '(line)', '(loopage)', '(name)', '(params)', '(scope)',
    '(token)', '(vars)', '(verb)', '*', '+', '-', '/', '<', '<=', '==', '===',
    '>', '>=', ADSAFE, Array, Date, Function, Object, '\\', a, a_label,
    a_not_allowed, a_not_defined, a_scope, abbr, acronym, address, adsafe,
    adsafe_a, adsafe_autocomplete, adsafe_bad_id, adsafe_div, adsafe_fragment,
    adsafe_go, adsafe_html, adsafe_id, adsafe_id_go, adsafe_lib,
    adsafe_lib_second, adsafe_missing_id, adsafe_name_a, adsafe_placement,
    adsafe_prefix_a, adsafe_script, adsafe_source, adsafe_subscript_a,
    adsafe_tag, all, already_defined, and, anon, applet, apply, approved, area,
    arity, article, aside, assign, assign_exception,
    assignment_function_expression, at, attribute_case_a, audio, autocomplete,
    avoid_a, b, background, 'background-attachment', 'background-color',
    'background-image', 'background-position', 'background-repeat',
    bad_assignment, bad_color_a, bad_constructor, bad_entity, bad_html, bad_id_a,
    bad_in_a, bad_invocation, bad_name_a, bad_new, bad_number, bad_operand,
    bad_style, bad_type, bad_url_a, bad_wrap, base, bdo, big, bitwise, block,
    blockquote, body, border, 'border-bottom', 'border-bottom-color',
    'border-bottom-left-radius', 'border-bottom-right-radius',
    'border-bottom-style', 'border-bottom-width', 'border-collapse',
    'border-color', 'border-left', 'border-left-color', 'border-left-style',
    'border-left-width', 'border-radius', 'border-right', 'border-right-color',
    'border-right-style', 'border-right-width', 'border-spacing', 'border-style',
    'border-top', 'border-top-color', 'border-top-left-radius',
    'border-top-right-radius', 'border-top-style', 'border-top-width',
    'border-width', bottom, 'box-shadow', br, braille, browser, button, c, call,
    canvas, cap, caption, 'caption-side', center, charAt, charCodeAt, character,
    cite, clear, clip, closure, cm, code, col, colgroup, color, combine_var,
    command, conditional_assignment, confusing_a, confusing_regexp,
    constructor_name_a, content, continue, control_a, 'counter-increment',
    'counter-reset', create, css, cursor, d, dangerous_comment, dangling_a, data,
    datalist, dd, debug, del, deleted, details, devel, dfn, dialog, dir,
    direction, display, disrupt, div, dl, dt, duplicate_a, edge, edition, else,
    em, embed, embossed, empty, 'empty-cells', empty_block, empty_case,
    empty_class, entityify, eqeq, error_report, errors, es5, eval, evidence,
    evil, ex, exception, exec, expected_a, expected_a_at_b_c, expected_a_b,
    expected_a_b_from_c_d, expected_at_a, expected_attribute_a,
    expected_attribute_value_a, expected_class_a, expected_fraction_a,
    expected_id_a, expected_identifier_a, expected_identifier_a_reserved,
    expected_lang_a, expected_linear_a, expected_media_a, expected_name_a,
    expected_nonstandard_style_attribute, expected_number_a, expected_operator_a,
    expected_percent_a, expected_positive_a, expected_pseudo_a,
    expected_selector_a, expected_small_a, expected_space_a_b, expected_string_a,
    expected_style_attribute, expected_style_pattern, expected_tagname_a,
    expected_type_a, f, fieldset, figure, filter, first, flag, float, floor,
    font, 'font-family', 'font-size', 'font-size-adjust', 'font-stretch',
    'font-style', 'font-variant', 'font-weight', footer, forEach, for_if, forin,
    form, fragment, frame, frameset, from, fromCharCode, fud, funct, function,
    function_block, function_eval, function_loop, function_statement,
    function_strict, functions, global, globals, h1, h2, h3, h4, h5, h6,
    handheld, hasOwnProperty, head, header, height, hgroup, hr,
    'hta:application', html, html_confusion_a, html_handlers, i, id, identifier,
    identifier_function, iframe, img, immed, implied_evil, in, indent, indexOf,
    infix_in, init, input, ins, insecure_a, isAlpha, isArray, isDigit, isNaN,
    join, jslint, json, kbd, keygen, keys, label, labeled, lang, lbp,
    leading_decimal_a, led, left, legend, length, 'letter-spacing', li, lib,
    line, 'line-height', link, 'list-style', 'list-style-image',
    'list-style-position', 'list-style-type', map, margin, 'margin-bottom',
    'margin-left', 'margin-right', 'margin-top', mark, 'marker-offset', match,
    'max-height', 'max-width', maxerr, maxlen, menu, message, meta, meter,
    'min-height', 'min-width', missing_a, missing_a_after_b, missing_option,
    missing_property, missing_space_a_b, missing_url, missing_use_strict, mixed,
    mm, mode, move_invocation, move_var, n, name, name_function, nav,
    nested_comment, newcap, node, noframes, nomen, noscript, not,
    not_a_constructor, not_a_defined, not_a_function, not_a_label, not_a_scope,
    not_greater, nud, number, object, octal_a, ol, on, opacity, open, optgroup,
    option, outer, outline, 'outline-color', 'outline-style', 'outline-width',
    output, overflow, 'overflow-x', 'overflow-y', p, padding, 'padding-bottom',
    'padding-left', 'padding-right', 'padding-top', 'page-break-after',
    'page-break-before', param, parameter_a_get_b, parameter_arguments_a,
    parameter_set_a, params, paren, parent, passfail, pc, plusplus, pop,
    position, postscript, pre, predef, print, progress, projection, properties,
    properties_report, property, prototype, pt, push, px, q, quote, quotes, r,
    radix, range, raw, read_only, reason, redefinition_a, regexp, replace,
    report, reserved, reserved_a, rhino, right, rp, rt, ruby, safe, samp,
    scanned_a_b, screen, script, search, second, section, select, shift,
    slash_equal, slice, sloppy, small, sort, source, span, speech, split, src,
    statement_block, stopping, strange_loop, strict, string, strong, stupid,
    style, styleproperty, sub, subscript, substr, sup, supplant, sync_a, t,
    table, 'table-layout', tag_a_in_b, tbody, td, test, 'text-align',
    'text-decoration', 'text-indent', 'text-shadow', 'text-transform', textarea,
    tfoot, th, thead, third, thru, time, title, toLowerCase, toString,
    toUpperCase, token, too_long, too_many, top, tr, trailing_decimal_a, tree,
    tt, tty, tv, type, u, ul, unclosed, unclosed_comment, unclosed_regexp, undef,
    undefined, unescaped_a, unexpected_a, unexpected_char_a_b,
    unexpected_comment, unexpected_else, unexpected_label_a,
    unexpected_property_a, unexpected_space_a_b, 'unicode-bidi',
    unnecessary_initialize, unnecessary_use, unparam, unreachable_a_b,
    unrecognized_style_attribute_a, unrecognized_tag_a, unsafe, unused, url,
    urls, use_array, use_braces, use_charAt, use_object, use_or, use_param,
    used_before_a, var, var_a_not, vars, 'vertical-align', video, visibility,
    was, weird_assignment, weird_condition, weird_new, weird_program,
    weird_relation, weird_ternary, white, 'white-space', width, windows,
    'word-spacing', 'word-wrap', wrap, wrap_immediate, wrap_regexp,
    write_is_wrong, writeable, 'z-index'
*/

// The global directive is used to declare global variables that can
// be accessed by the program. If a declaration is true, then the variable
// is writeable. Otherwise, it is read-only.

// We build the application inside a function so that we produce only a single
// global variable. That function will be invoked immediately, and its return
// value is the JSLINT function itself. That function is also an object that
// can contain data and other functions.

var JSLINT = (function () {
    'use strict';

    function array_to_object(array, value) {

// Make an object from an array of keys and a common value.

        var i, length = array.length, object = {};
        for (i = 0; i < length; i += 1) {
            object[array[i]] = value;
        }
        return object;
    }


    var adsafe_id,      // The widget's ADsafe id.
        adsafe_may,     // The widget may load approved scripts.
        adsafe_top,     // At the top of the widget script.
        adsafe_went,    // ADSAFE.go has been called.
        allowed_option = {
            anon      : true,
            bitwise   : true,
            browser   : true,
            cap       : true,
            'continue': true,
            css       : true,
            debug     : true,
            devel     : true,
            eqeq      : true,
            es5       : true,
            evil      : true,
            forin     : true,
            fragment  : true,
            indent    :   10,
            maxerr    : 1000,
            maxlen    :  256,
            newcap    : true,
            node      : true,
            nomen     : true,
            on        : true,
            passfail  : true,
            plusplus  : true,
            properties: true,
            regexp    : true,
            rhino     : true,
            undef     : true,
            unparam   : true,
            sloppy    : true,
            stupid    : true,
            sub       : true,
            vars      : true,
            white     : true,
            windows   : true
        },
        anonname,       // The guessed name for anonymous functions.
        approved,       // ADsafe approved urls.

// These are operators that should not be used with the ! operator.

        bang = {
            '<'  : true,
            '<=' : true,
            '==' : true,
            '===': true,
            '!==': true,
            '!=' : true,
            '>'  : true,
            '>=' : true,
            '+'  : true,
            '-'  : true,
            '*'  : true,
            '/'  : true,
            '%'  : true
        },

// These are property names that should not be permitted in the safe subset.

        banned = array_to_object([
            'arguments', 'callee', 'caller', 'constructor', 'eval', 'prototype',
            'stack', 'unwatch', 'valueOf', 'watch'
        ], true),
        begin,          // The root token

// browser contains a set of global names that are commonly provided by a
// web browser environment.

        browser = array_to_object([
            'clearInterval', 'clearTimeout', 'document', 'event', 'FormData',
            'frames', 'history', 'Image', 'localStorage', 'location', 'name',
            'navigator', 'Option', 'parent', 'screen', 'sessionStorage',
            'setInterval', 'setTimeout', 'Storage', 'window', 'XMLHttpRequest'
        ], false),

// bundle contains the text messages.

        bundle = {
            a_label: "'{a}' is a statement label.",
            a_not_allowed: "'{a}' is not allowed.",
            a_not_defined: "'{a}' is not defined.",
            a_scope: "'{a}' used out of scope.",
            adsafe_a: "ADsafe violation: '{a}'.",
            adsafe_autocomplete: "ADsafe autocomplete violation.",
            adsafe_bad_id: "ADSAFE violation: bad id.",
            adsafe_div: "ADsafe violation: Wrap the widget in a div.",
            adsafe_fragment: "ADSAFE: Use the fragment option.",
            adsafe_go: "ADsafe violation: Misformed ADSAFE.go.",
            adsafe_html: "Currently, ADsafe does not operate on whole HTML " +
                "documents. It operates on <div> fragments and .js files.",
            adsafe_id: "ADsafe violation: id does not match.",
            adsafe_id_go: "ADsafe violation: Missing ADSAFE.id or ADSAFE.go.",
            adsafe_lib: "ADsafe lib violation.",
            adsafe_lib_second: "ADsafe: The second argument to lib must be a function.",
            adsafe_missing_id: "ADSAFE violation: missing ID_.",
            adsafe_name_a: "ADsafe name violation: '{a}'.",
            adsafe_placement: "ADsafe script placement violation.",
            adsafe_prefix_a: "ADsafe violation: An id must have a '{a}' prefix",
            adsafe_script: "ADsafe script violation.",
            adsafe_source: "ADsafe unapproved script source.",
            adsafe_subscript_a: "ADsafe subscript '{a}'.",
            adsafe_tag: "ADsafe violation: Disallowed tag '{a}'.",
            already_defined: "'{a}' is already defined.",
            and: "The '&&' subexpression should be wrapped in parens.",
            assign_exception: "Do not assign to the exception parameter.",
            assignment_function_expression: "Expected an assignment or " +
                "function call and instead saw an expression.",
            attribute_case_a: "Attribute '{a}' not all lower case.",
            avoid_a: "Avoid '{a}'.",
            bad_assignment: "Bad assignment.",
            bad_color_a: "Bad hex color '{a}'.",
            bad_constructor: "Bad constructor.",
            bad_entity: "Bad entity.",
            bad_html: "Bad HTML string",
            bad_id_a: "Bad id: '{a}'.",
            bad_in_a: "Bad for in variable '{a}'.",
            bad_invocation: "Bad invocation.",
            bad_name_a: "Bad name: '{a}'.",
            bad_new: "Do not use 'new' for side effects.",
            bad_number: "Bad number '{a}'.",
            bad_operand: "Bad operand.",
            bad_style: "Bad style.",
            bad_type: "Bad type.",
            bad_url_a: "Bad url '{a}'.",
            bad_wrap: "Do not wrap function literals in parens unless they " +
                "are to be immediately invoked.",
            combine_var: "Combine this with the previous 'var' statement.",
            conditional_assignment: "Expected a conditional expression and " +
                "instead saw an assignment.",
            confusing_a: "Confusing use of '{a}'.",
            confusing_regexp: "Confusing regular expression.",
            constructor_name_a: "A constructor name '{a}' should start with " +
                "an uppercase letter.",
            control_a: "Unexpected control character '{a}'.",
            css: "A css file should begin with @charset 'UTF-8';",
            dangling_a: "Unexpected dangling '_' in '{a}'.",
            dangerous_comment: "Dangerous comment.",
            deleted: "Only properties should be deleted.",
            duplicate_a: "Duplicate '{a}'.",
            empty_block: "Empty block.",
            empty_case: "Empty case.",
            empty_class: "Empty class.",
            es5: "This is an ES5 feature.",
            evil: "eval is evil.",
            expected_a: "Expected '{a}'.",
            expected_a_b: "Expected '{a}' and instead saw '{b}'.",
            expected_a_b_from_c_d: "Expected '{a}' to match '{b}' from line " +
                "{c} and instead saw '{d}'.",
            expected_at_a: "Expected an at-rule, and instead saw @{a}.",
            expected_a_at_b_c: "Expected '{a}' at column {b}, not column {c}.",
            expected_attribute_a: "Expected an attribute, and instead saw [{a}].",
            expected_attribute_value_a: "Expected an attribute value and " +
                "instead saw '{a}'.",
            expected_class_a: "Expected a class, and instead saw .{a}.",
            expected_fraction_a: "Expected a number between 0 and 1 and " +
                "instead saw '{a}'",
            expected_id_a: "Expected an id, and instead saw #{a}.",
            expected_identifier_a: "Expected an identifier and instead saw '{a}'.",
            expected_identifier_a_reserved: "Expected an identifier and " +
                "instead saw '{a}' (a reserved word).",
            expected_linear_a: "Expected a linear unit and instead saw '{a}'.",
            expected_lang_a: "Expected a lang code, and instead saw :{a}.",
            expected_media_a: "Expected a CSS media type, and instead saw '{a}'.",
            expected_name_a: "Expected a name and instead saw '{a}'.",
            expected_nonstandard_style_attribute: "Expected a non-standard " +
                "style attribute and instead saw '{a}'.",
            expected_number_a: "Expected a number and instead saw '{a}'.",
            expected_operator_a: "Expected an operator and instead saw '{a}'.",
            expected_percent_a: "Expected a percentage and instead saw '{a}'",
            expected_positive_a: "Expected a positive number and instead saw '{a}'",
            expected_pseudo_a: "Expected a pseudo, and instead saw :{a}.",
            expected_selector_a: "Expected a CSS selector, and instead saw {a}.",
            expected_small_a: "Expected a small positive integer and instead saw '{a}'",
            expected_space_a_b: "Expected exactly one space between '{a}' and '{b}'.",
            expected_string_a: "Expected a string and instead saw {a}.",
            expected_style_attribute: "Excepted a style attribute, and instead saw '{a}'.",
            expected_style_pattern: "Expected a style pattern, and instead saw '{a}'.",
            expected_tagname_a: "Expected a tagName, and instead saw {a}.",
            expected_type_a: "Expected a type, and instead saw {a}.",
            for_if: "The body of a for in should be wrapped in an if " +
                "statement to filter unwanted properties from the prototype.",
            function_block: "Function statements should not be placed in blocks. " +
                "Use a function expression or move the statement to the top of " +
                "the outer function.",
            function_eval: "The Function constructor is eval.",
            function_loop: "Don't make functions within a loop.",
            function_statement: "Function statements are not invocable. " +
                "Wrap the whole function invocation in parens.",
            function_strict: "Use the function form of 'use strict'.",
            html_confusion_a: "HTML confusion in regular expression '<{a}'.",
            html_handlers: "Avoid HTML event handlers.",
            identifier_function: "Expected an identifier in an assignment " +
                "and instead saw a function invocation.",
            implied_evil: "Implied eval is evil. Pass a function instead of a string.",
            infix_in: "Unexpected 'in'. Compare with undefined, or use the " +
                "hasOwnProperty method instead.",
            insecure_a: "Insecure '{a}'.",
            isNaN: "Use the isNaN function to compare with NaN.",
            lang: "lang is deprecated.",
            leading_decimal_a: "A leading decimal point can be confused with a dot: '.{a}'.",
            missing_a: "Missing '{a}'.",
            missing_a_after_b: "Missing '{a}' after '{b}'.",
            missing_option: "Missing option value.",
            missing_property: "Missing property name.",
            missing_space_a_b: "Missing space between '{a}' and '{b}'.",
            missing_url: "Missing url.",
            missing_use_strict: "Missing 'use strict' statement.",
            mixed: "Mixed spaces and tabs.",
            move_invocation: "Move the invocation into the parens that " +
                "contain the function.",
            move_var: "Move 'var' declarations to the top of the function.",
            name_function: "Missing name in function statement.",
            nested_comment: "Nested comment.",
            not: "Nested not.",
            not_a_constructor: "Do not use {a} as a constructor.",
            not_a_defined: "'{a}' has not been fully defined yet.",
            not_a_function: "'{a}' is not a function.",
            not_a_label: "'{a}' is not a label.",
            not_a_scope: "'{a}' is out of scope.",
            not_greater: "'{a}' should not be greater than '{b}'.",
            octal_a: "Don't use octal: '{a}'. Use '\\u....' instead.",
            parameter_arguments_a: "Do not mutate parameter '{a}' when using 'arguments'.",
            parameter_a_get_b: "Unexpected parameter '{a}' in get {b} function.",
            parameter_set_a: "Expected parameter (value) in set {a} function.",
            radix: "Missing radix parameter.",
            read_only: "Read only.",
            redefinition_a: "Redefinition of '{a}'.",
            reserved_a: "Reserved name '{a}'.",
            scanned_a_b: "{a} ({b}% scanned).",
            slash_equal: "A regular expression literal can be confused with '/='.",
            statement_block: "Expected to see a statement and instead saw a block.",
            stopping: "Stopping. ",
            strange_loop: "Strange loop.",
            strict: "Strict violation.",
            subscript: "['{a}'] is better written in dot notation.",
            sync_a: "Unexpected sync method: '{a}'.",
            tag_a_in_b: "A '<{a}>' must be within '<{b}>'.",
            too_long: "Line too long.",
            too_many: "Too many errors.",
            trailing_decimal_a: "A trailing decimal point can be confused " +
                "with a dot: '.{a}'.",
            type: "type is unnecessary.",
            unclosed: "Unclosed string.",
            unclosed_comment: "Unclosed comment.",
            unclosed_regexp: "Unclosed regular expression.",
            unescaped_a: "Unescaped '{a}'.",
            unexpected_a: "Unexpected '{a}'.",
            unexpected_char_a_b: "Unexpected character '{a}' in {b}.",
            unexpected_comment: "Unexpected comment.",
            unexpected_else: "Unexpected 'else' after 'return'.",
            unexpected_label_a: "Unexpected label '{a}'.",
            unexpected_property_a: "Unexpected /*property*/ '{a}'.",
            unexpected_space_a_b: "Unexpected space between '{a}' and '{b}'.",
            unnecessary_initialize: "It is not necessary to initialize '{a}' " +
                "to 'undefined'.",
            unnecessary_use: "Unnecessary 'use strict'.",
            unreachable_a_b: "Unreachable '{a}' after '{b}'.",
            unrecognized_style_attribute_a: "Unrecognized style attribute '{a}'.",
            unrecognized_tag_a: "Unrecognized tag '<{a}>'.",
            unsafe: "Unsafe character.",
            url: "JavaScript URL.",
            use_array: "Use the array literal notation [].",
            use_braces: "Spaces are hard to count. Use {{a}}.",
            use_charAt: "Use the charAt method.",
            use_object: "Use the object literal notation {}.",
            use_or: "Use the || operator.",
            use_param: "Use a named parameter.",
            used_before_a: "'{a}' was used before it was defined.",
            var_a_not: "Variable {a} was not declared correctly.",
            weird_assignment: "Weird assignment.",
            weird_condition: "Weird condition.",
            weird_new: "Weird construction. Delete 'new'.",
            weird_program: "Weird program.",
            weird_relation: "Weird relation.",
            weird_ternary: "Weird ternary.",
            wrap_immediate: "Wrap an immediate function invocation in parentheses " +
                "to assist the reader in understanding that the expression " +
                "is the result of a function, and not the function itself.",
            wrap_regexp: "Wrap the /regexp/ literal in parens to " +
                "disambiguate the slash operator.",
            write_is_wrong: "document.write can be a form of eval."
        },
        comments_off,
        css_attribute_data,
        css_any,

        css_colorData = array_to_object([
            "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
            "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
            "burlywood", "cadetblue", "chartreuse", "chocolate", "coral",
            "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue",
            "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki",
            "darkmagenta", "darkolivegreen", "darkorange", "darkorchid",
            "darkred", "darksalmon", "darkseagreen", "darkslateblue",
            "darkslategray", "darkturquoise", "darkviolet", "deeppink",
            "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite",
            "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold",
            "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink",
            "indianred", "indigo", "ivory", "khaki", "lavender",
            "lavenderblush", "lawngreen", "lemonchiffon", "lightblue",
            "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen",
            "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
            "lightslategray", "lightsteelblue", "lightyellow", "lime",
            "limegreen", "linen", "magenta", "maroon", "mediumaquamarine",
            "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
            "mediumslateblue", "mediumspringgreen", "mediumturquoise",
            "mediumvioletred", "midnightblue", "mintcream", "mistyrose",
            "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab",
            "orange", "orangered", "orchid", "palegoldenrod", "palegreen",
            "paleturquoise", "palevioletred", "papayawhip", "peachpuff",
            "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown",
            "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen",
            "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray",
            "snow", "springgreen", "steelblue", "tan", "teal", "thistle",
            "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke",
            "yellow", "yellowgreen",

            "activeborder", "activecaption", "appworkspace", "background",
            "buttonface", "buttonhighlight", "buttonshadow", "buttontext",
            "captiontext", "graytext", "highlight", "highlighttext",
            "inactiveborder", "inactivecaption", "inactivecaptiontext",
            "infobackground", "infotext", "menu", "menutext", "scrollbar",
            "threeddarkshadow", "threedface", "threedhighlight",
            "threedlightshadow", "threedshadow", "window", "windowframe",
            "windowtext"
        ], true),

        css_border_style,
        css_break,

        css_lengthData = {
            '%': true,
            'cm': true,
            'em': true,
            'ex': true,
            'in': true,
            'mm': true,
            'pc': true,
            'pt': true,
            'px': true
        },

        css_media,
        css_overflow,

        descapes = {
            'b': '\b',
            't': '\t',
            'n': '\n',
            'f': '\f',
            'r': '\r',
            '"': '"',
            '/': '/',
            '\\': '\\',
            '!': '!'
        },

        devel = array_to_object([
            'alert', 'confirm', 'console', 'Debug', 'opera', 'prompt', 'WSH'
        ], false),
        directive,
        escapes = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '\'': '\\\'',
            '"' : '\\"',
            '/' : '\\/',
            '\\': '\\\\'
        },

        funct,          // The current function, including the labels used in
                        // the function, as well as (breakage),
                        // (context), (loopage), (name), (params), (token),
                        // (vars), (verb)

        functionicity = [
            'closure', 'exception', 'global', 'label', 'outer', 'undef',
            'unused', 'var'
        ],

        functions,      // All of the functions
        global_funct,   // The global body
        global_scope,   // The global scope
        html_tag = {
            a:        {},
            abbr:     {},
            acronym:  {},
            address:  {},
            applet:   {},
            area:     {empty: true, parent: ' map '},
            article:  {},
            aside:    {},
            audio:    {},
            b:        {},
            base:     {empty: true, parent: ' head '},
            bdo:      {},
            big:      {},
            blockquote: {},
            body:     {parent: ' html noframes '},
            br:       {empty: true},
            button:   {},
            canvas:   {parent: ' body p div th td '},
            caption:  {parent: ' table '},
            center:   {},
            cite:     {},
            code:     {},
            col:      {empty: true, parent: ' table colgroup '},
            colgroup: {parent: ' table '},
            command:  {parent: ' menu '},
            datalist: {},
            dd:       {parent: ' dl '},
            del:      {},
            details:  {},
            dialog:   {},
            dfn:      {},
            dir:      {},
            div:      {},
            dl:       {},
            dt:       {parent: ' dl '},
            em:       {},
            embed:    {},
            fieldset: {},
            figure:   {},
            font:     {},
            footer:   {},
            form:     {},
            frame:    {empty: true, parent: ' frameset '},
            frameset: {parent: ' html frameset '},
            h1:       {},
            h2:       {},
            h3:       {},
            h4:       {},
            h5:       {},
            h6:       {},
            head:     {parent: ' html '},
            header:   {},
            hgroup:   {},
            hr:       {empty: true},
            'hta:application':
                      {empty: true, parent: ' head '},
            html:     {parent: '*'},
            i:        {},
            iframe:   {},
            img:      {empty: true},
            input:    {empty: true},
            ins:      {},
            kbd:      {},
            keygen:   {},
            label:    {},
            legend:   {parent: ' details fieldset figure '},
            li:       {parent: ' dir menu ol ul '},
            link:     {empty: true, parent: ' head '},
            map:      {},
            mark:     {},
            menu:     {},
            meta:     {empty: true, parent: ' head noframes noscript '},
            meter:    {},
            nav:      {},
            noframes: {parent: ' html body '},
            noscript: {parent: ' body head noframes '},
            object:   {},
            ol:       {},
            optgroup: {parent: ' select '},
            option:   {parent: ' optgroup select '},
            output:   {},
            p:        {},
            param:    {empty: true, parent: ' applet object '},
            pre:      {},
            progress: {},
            q:        {},
            rp:       {},
            rt:       {},
            ruby:     {},
            samp:     {},
            script:   {empty: true, parent: ' body div frame head iframe p pre span '},
            section:  {},
            select:   {},
            small:    {},
            span:     {},
            source:   {},
            strong:   {},
            style:    {parent: ' head ', empty: true},
            sub:      {},
            sup:      {},
            table:    {},
            tbody:    {parent: ' table '},
            td:       {parent: ' tr '},
            textarea: {},
            tfoot:    {parent: ' table '},
            th:       {parent: ' tr '},
            thead:    {parent: ' table '},
            time:     {},
            title:    {parent: ' head '},
            tr:       {parent: ' table tbody thead tfoot '},
            tt:       {},
            u:        {},
            ul:       {},
            'var':    {},
            video:    {}
        },

        ids,            // HTML ids
        in_block,
        indent,
        itself,         // JSLint itself
        json_mode,
        lex,            // the tokenizer
        lines,
        lookahead,
        node = array_to_object([
            'Buffer', 'clearInterval', 'clearTimeout', 'console', 'exports',
            'global', 'module', 'process', 'querystring', 'require',
            'setInterval', 'setTimeout', '__dirname', '__filename'
        ], false),
        node_js,
        numbery = array_to_object(['indexOf', 'lastIndexOf', 'search'], true),
        next_token,
        option,
        predefined,     // Global variables defined by option
        prereg,
        prev_token,
        property,
        regexp_flag = array_to_object(['g', 'i', 'm'], true),
        return_this = function return_this() {
            return this;
        },
        rhino = array_to_object([
            'defineClass', 'deserialize', 'gc', 'help', 'load', 'loadClass',
            'print', 'quit', 'readFile', 'readUrl', 'runCommand', 'seal',
            'serialize', 'spawn', 'sync', 'toint32', 'version'
        ], false),

        scope,      // An object containing an object for each variable in scope
        semicolon_coda = array_to_object([';', '"', '\'', ')'], true),
        src,
        stack,

// standard contains the global names that are provided by the
// ECMAScript standard.

        standard = array_to_object([
            'Array', 'Boolean', 'Date', 'decodeURI', 'decodeURIComponent',
            'encodeURI', 'encodeURIComponent', 'Error', 'eval', 'EvalError',
            'Function', 'isFinite', 'isNaN', 'JSON', 'Math', 'Number',
            'Object', 'parseInt', 'parseFloat', 'RangeError', 'ReferenceError',
            'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError'
        ], false),

        strict_mode,
        syntax = {},
        tab,
        token,
        urls,
        var_mode,
        warnings,

        windows = array_to_object([
            'ActiveXObject', 'CScript', 'Debug', 'Enumerator', 'System',
            'VBArray', 'WScript', 'WSH'
        ], false),

//  xmode is used to adapt to the exceptions in html parsing.
//  It can have these states:
//      ''      .js script file
//      'html'
//      'outer'
//      'script'
//      'style'
//      'scriptstring'
//      'styleproperty'

        xmode,
        xquote,

// Regular expressions. Some of these are stupidly long.

// unsafe comment or string
        ax = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i,
// carriage return, carriage return linefeed, or linefeed
        crlfx = /\r\n?|\n/,
// unsafe characters that are silently deleted by one or more browsers
        cx = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
// query characters for ids
        dx = /[\[\]\/\\"'*<>.&:(){}+=#]/,
// html token
        hx = /^\s*(['"=>\/&#]|<(?:\/|\!(?:--)?)?|[a-zA-Z][a-zA-Z0-9_\-:]*|[0-9]+|--)/,
// identifier
        ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/,
// javascript url
        jx = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i,
// star slash
        lx = /\*\/|\/\*/,
// characters in strings that need escapement
        nx = /[\u0000-\u001f'\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
// outer html token
        ox = /[>&]|<[\/!]?|--/,
// attributes characters
        qx = /[^a-zA-Z0-9+\-_\/. ]/,
// style
        sx = /^\s*([{}:#%.=,>+\[\]@()"';]|[*$\^~]=|[a-zA-Z_][a-zA-Z0-9_\-]*|[0-9]+|<\/|\/\*)/,
        ssx = /^\s*([@#!"'};:\-%.=,+\[\]()*_]|[a-zA-Z][a-zA-Z0-9._\-]*|\/\*?|\d+(?:\.\d+)?|<\/)/,
// token
        tx = /^\s*([(){}\[\]\?.,:;'"~#@`]|={1,3}|\/(\*(jslint|properties|property|members?|globals?)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|[\^%]=?|&[&=]?|\|[|=]?|>{1,3}=?|<(?:[\/=!]|\!(\[|--)?|<=?)?|\!={0,2}|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+(?:[xX][0-9a-fA-F]+|\.[0-9]*)?(?:[eE][+\-]?[0-9]+)?)/,
// url badness
        ux = /&|\+|\u00AD|\.\.|\/\*|%[^;]|base64|url|expression|data|mailto|script/i,

        rx = {
            outer: hx,
            html: hx,
            style: sx,
            styleproperty: ssx
        };


    function F() {}     // Used by Object.create

// Provide critical ES5 functions to ES3.

    if (typeof Array.prototype.filter !== 'function') {
        Array.prototype.filter = function (f) {
            var i, length = this.length, result = [], value;
            for (i = 0; i < length; i += 1) {
                try {
                    value = this[i];
                    if (f(value)) {
                        result.push(value);
                    }
                } catch (ignore) {
                }
            }
            return result;
        };
    }

    if (typeof Array.prototype.forEach !== 'function') {
        Array.prototype.forEach = function (f) {
            var i, length = this.length;
            for (i = 0; i < length; i += 1) {
                try {
                    f(this[i]);
                } catch (ignore) {
                }
            }
        };
    }

    if (typeof Array.isArray !== 'function') {
        Array.isArray = function (o) {
            return Object.prototype.toString.apply(o) === '[object Array]';
        };
    }

    if (!Object.prototype.hasOwnProperty.call(Object, 'create')) {
        Object.create = function (o) {
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = function (o) {
            var array = [], key;
            for (key in o) {
                if (Object.prototype.hasOwnProperty.call(o, key)) {
                    array.push(key);
                }
            }
            return array;
        };
    }

    if (typeof String.prototype.entityify !== 'function') {
        String.prototype.entityify = function () {
            return this
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
    }

    if (typeof String.prototype.isAlpha !== 'function') {
        String.prototype.isAlpha = function () {
            return (this >= 'a' && this <= 'z\uffff') ||
                (this >= 'A' && this <= 'Z\uffff');
        };
    }

    if (typeof String.prototype.isDigit !== 'function') {
        String.prototype.isDigit = function () {
            return (this >= '0' && this <= '9');
        };
    }

    if (typeof String.prototype.supplant !== 'function') {
        String.prototype.supplant = function (o) {
            return this.replace(/\{([^{}]*)\}/g, function (a, b) {
                var replacement = o[b];
                return typeof replacement === 'string' ||
                    typeof replacement === 'number' ? replacement : a;
            });
        };
    }


    function sanitize(a) {

//  Escapify a troublesome character.

        return escapes[a] ||
            '\\u' + ('0000' + a.charCodeAt().toString(16)).slice(-4);
    }


    function add_to_predefined(group) {
        Object.keys(group).forEach(function (name) {
            predefined[name] = group[name];
        });
    }


    function assume() {
        if (!option.safe) {
            if (option.rhino) {
                add_to_predefined(rhino);
                option.rhino = false;
            }
            if (option.devel) {
                add_to_predefined(devel);
                option.devel = false;
            }
            if (option.browser) {
                add_to_predefined(browser);
                option.browser = false;
            }
            if (option.windows) {
                add_to_predefined(windows);
                option.windows = false;
            }
            if (option.node) {
                add_to_predefined(node);
                option.node = false;
                node_js = true;
            }
        }
    }


// Produce an error warning.

    function artifact(tok) {
        if (!tok) {
            tok = next_token;
        }
        return tok.number || tok.string;
    }

    function quit(message, line, character) {
        throw {
            name: 'JSLintError',
            line: line,
            character: character,
            message: bundle.scanned_a_b.supplant({
                a: message,
                b: Math.floor((line / lines.length) * 100)
            })
        };
    }

    function warn(message, offender, a, b, c, d) {
        var character, line, warning;
        offender = offender || next_token;  // ~~
        line = offender.line || 0;
        character = offender.from || 0;
        warning = {
            id: '(error)',
            raw: bundle[message] || message,
            evidence: lines[line - 1] || '',
            line: line,
            character: character,
            a: a || (offender.id === '(number)'
                ? String(offender.number)
                : offender.string),
            b: b,
            c: c,
            d: d
        };
        warning.reason = warning.raw.supplant(warning);
        JSLINT.errors.push(warning);
        if (option.passfail) {
            quit(bundle.stopping, line, character);
        }
        warnings += 1;
        if (warnings >= option.maxerr) {
            quit(bundle.too_many, line, character);
        }
        return warning;
    }

    function warn_at(message, line, character, a, b, c, d) {
        return warn(message, {
            line: line,
            from: character
        }, a, b, c, d);
    }

    function stop(message, offender, a, b, c, d) {
        var warning = warn(message, offender, a, b, c, d);
        quit(bundle.stopping, warning.line, warning.character);
    }

    function stop_at(message, line, character, a, b, c, d) {
        return stop(message, {
            line: line,
            from: character
        }, a, b, c, d);
    }

    function expected_at(at) {
        if (!option.white && next_token.from !== at) {
            warn('expected_a_at_b_c', next_token, '', at,
                next_token.from);
        }
    }

    function aint(it, name, expected) {
        if (it[name] !== expected) {
            warn('expected_a_b', it, expected, it[name]);
            return true;
        }
        return false;
    }


// lexical analysis and token construction

    lex = (function lex() {
        var character, c, from, length, line, pos, source_row;

// Private lex methods

        function next_line() {
            var at;
            if (line >= lines.length) {
                return false;
            }
            character = 1;
            source_row = lines[line];
            line += 1;
            at = source_row.search(/ \t/);
            if (at >= 0) {
                warn_at('mixed', line, at + 1);
            }
            source_row = source_row.replace(/\t/g, tab);
            at = source_row.search(cx);
            if (at >= 0) {
                warn_at('unsafe', line, at);
            }
            if (option.maxlen && option.maxlen < source_row.length) {
                warn_at('too_long', line, source_row.length);
            }
            return true;
        }

// Produce a token object.  The token inherits from a syntax symbol.

        function it(type, value) {
            var id, the_token;
            if (type === '(string)' || type === '(range)') {
                if (jx.test(value)) {
                    warn_at('url', line, from);
                }
            }
            the_token = Object.create(syntax[(
                type === '(punctuator)' || (type === '(identifier)' &&
                        Object.prototype.hasOwnProperty.call(syntax, value))
                    ? value
                    : type
            )] || syntax['(error)']);
            if (type === '(identifier)') {
                the_token.identifier = true;
                if (value === '__iterator__' || value === '__proto__') {
                    stop_at('reserved_a', line, from, value);
                } else if (!option.nomen &&
                        (value.charAt(0) === '_' ||
                        value.charAt(value.length - 1) === '_')) {
                    warn_at('dangling_a', line, from, value);
                }
            }
            if (type === '(number)') {
                the_token.number = +value;
            } else if (value !== undefined) {
                the_token.string = String(value);
            }
            the_token.line = line;
            the_token.from = from;
            the_token.thru = character;
            id = the_token.id;
            prereg = id && (
                ('(,=:[!&|?{};'.indexOf(id.charAt(id.length - 1)) >= 0) ||
                id === 'return' || id === 'case'
            );
            return the_token;
        }

        function match(x) {
            var exec = x.exec(source_row), first;
            if (exec) {
                length = exec[0].length;
                first = exec[1];
                c = first.charAt(0);
                source_row = source_row.slice(length);
                from = character + length - first.length;
                character += length;
                return first;
            }
        }

        function string(x) {
            var c, pos = 0, r = '', result;

            function hex(n) {
                var i = parseInt(source_row.substr(pos + 1, n), 16);
                pos += n;
                if (i >= 32 && i <= 126 &&
                        i !== 34 && i !== 92 && i !== 39) {
                    warn_at('unexpected_a', line, character, '\\');
                }
                character += n;
                c = String.fromCharCode(i);
            }

            if (json_mode && x !== '"') {
                warn_at('expected_a', line, character, '"');
            }

            if (xquote === x || (xmode === 'scriptstring' && !xquote)) {
                return it('(punctuator)', x);
            }

            for (;;) {
                while (pos >= source_row.length) {
                    pos = 0;
                    if (xmode !== 'html' || !next_line()) {
                        stop_at('unclosed', line, from);
                    }
                }
                c = source_row.charAt(pos);
                if (c === x) {
                    character += 1;
                    source_row = source_row.slice(pos + 1);
                    result = it('(string)', r);
                    result.quote = x;
                    return result;
                }
                if (c < ' ') {
                    if (c === '\n' || c === '\r') {
                        break;
                    }
                    warn_at('control_a', line, character + pos,
                        source_row.slice(0, pos));
                } else if (c === xquote) {
                    warn_at('bad_html', line, character + pos);
                } else if (c === '<') {
                    if (option.safe && xmode === 'html') {
                        warn_at('adsafe_a', line, character + pos, c);
                    } else if (source_row.charAt(pos + 1) === '/' && (xmode || option.safe)) {
                        warn_at('expected_a_b', line, character,
                            '<\\/', '</');
                    } else if (source_row.charAt(pos + 1) === '!' && (xmode || option.safe)) {
                        warn_at('unexpected_a', line, character, '<!');
                    }
                } else if (c === '\\') {
                    if (xmode === 'html') {
                        if (option.safe) {
                            warn_at('adsafe_a', line, character + pos, c);
                        }
                    } else if (xmode === 'styleproperty') {
                        pos += 1;
                        character += 1;
                        c = source_row.charAt(pos);
                        if (c !== x) {
                            warn_at('unexpected_a', line, character, '\\');
                        }
                    } else {
                        pos += 1;
                        character += 1;
                        c = source_row.charAt(pos);
                        switch (c) {
                        case '':
                            if (!option.es5) {
                                warn_at('es5', line, character);
                            }
                            next_line();
                            pos = -1;
                            break;
                        case xquote:
                            warn_at('bad_html', line, character + pos);
                            break;
                        case '\'':
                            if (json_mode) {
                                warn_at('unexpected_a', line, character, '\\\'');
                            }
                            break;
                        case 'u':
                            hex(4);
                            break;
                        case 'v':
                            if (json_mode) {
                                warn_at('unexpected_a', line, character, '\\v');
                            }
                            c = '\v';
                            break;
                        case 'x':
                            if (json_mode) {
                                warn_at('unexpected_a', line, character, '\\x');
                            }
                            hex(2);
                            break;
                        default:
                            if (typeof descapes[c] !== 'string') {
                                warn_at(c >= '0' && c <= '7' ? 'octal_a' : 'unexpected_a',
                                    line, character, '\\' + c);
                            } else {
                                c = descapes[c];
                            }
                        }
                    }
                }
                r += c;
                character += 1;
                pos += 1;
            }
        }

        function number(snippet) {
            var digit;
            if (xmode !== 'style' && xmode !== 'styleproperty' &&
                    source_row.charAt(0).isAlpha()) {
                warn_at('expected_space_a_b',
                    line, character, c, source_row.charAt(0));
            }
            if (c === '0') {
                digit = snippet.charAt(1);
                if (digit.isDigit()) {
                    if (token.id !== '.' && xmode !== 'styleproperty') {
                        warn_at('unexpected_a', line, character, snippet);
                    }
                } else if (json_mode && (digit === 'x' || digit === 'X')) {
                    warn_at('unexpected_a', line, character, '0x');
                }
            }
            if (snippet.slice(snippet.length - 1) === '.') {
                warn_at('trailing_decimal_a', line, character, snippet);
            }
            if (xmode !== 'style') {
                digit = +snippet;
                if (!isFinite(digit)) {
                    warn_at('bad_number', line, character, snippet);
                }
                snippet = digit;
            }
            return it('(number)', snippet);
        }

        function comment(snippet) {
            if (comments_off || src || (xmode && xmode !== 'script' &&
                    xmode !== 'style' && xmode !== 'styleproperty')) {
                warn_at('unexpected_comment', line, character);
            } else if (xmode === 'script' && /<\//i.test(source_row)) {
                warn_at('unexpected_a', line, character, '<\/');
            } else if (option.safe && ax.test(snippet)) {
                warn_at('dangerous_comment', line, character);
            }
        }

        function regexp() {
            var b,
                bit,
                captures = 0,
                depth = 0,
                flag = '',
                high,
                letter,
                length = 0,
                low,
                potential,
                quote,
                result;
            for (;;) {
                b = true;
                c = source_row.charAt(length);
                length += 1;
                switch (c) {
                case '':
                    stop_at('unclosed_regexp', line, from);
                    return;
                case '/':
                    if (depth > 0) {
                        warn_at('unescaped_a', line, from + length, '/');
                    }
                    c = source_row.slice(0, length - 1);
                    potential = Object.create(regexp_flag);
                    for (;;) {
                        letter = source_row.charAt(length);
                        if (potential[letter] !== true) {
                            break;
                        }
                        potential[letter] = false;
                        length += 1;
                        flag += letter;
                    }
                    if (source_row.charAt(length).isAlpha()) {
                        stop_at('unexpected_a', line, from, source_row.charAt(length));
                    }
                    character += length;
                    source_row = source_row.slice(length);
                    quote = source_row.charAt(0);
                    if (quote === '/' || quote === '*') {
                        stop_at('confusing_regexp', line, from);
                    }
                    result = it('(regexp)', c);
                    result.flag = flag;
                    return result;
                case '\\':
                    c = source_row.charAt(length);
                    if (c < ' ') {
                        warn_at('control_a', line, from + length, String(c));
                    } else if (c === '<') {
                        warn_at(bundle.unexpected_a, line, from + length, '\\');
                    }
                    length += 1;
                    break;
                case '(':
                    depth += 1;
                    b = false;
                    if (source_row.charAt(length) === '?') {
                        length += 1;
                        switch (source_row.charAt(length)) {
                        case ':':
                        case '=':
                        case '!':
                            length += 1;
                            break;
                        default:
                            warn_at(bundle.expected_a_b, line, from + length,
                                ':', source_row.charAt(length));
                        }
                    } else {
                        captures += 1;
                    }
                    break;
                case '|':
                    b = false;
                    break;
                case ')':
                    if (depth === 0) {
                        warn_at('unescaped_a', line, from + length, ')');
                    } else {
                        depth -= 1;
                    }
                    break;
                case ' ':
                    pos = 1;
                    while (source_row.charAt(length) === ' ') {
                        length += 1;
                        pos += 1;
                    }
                    if (pos > 1) {
                        warn_at('use_braces', line, from + length, pos);
                    }
                    break;
                case '[':
                    c = source_row.charAt(length);
                    if (c === '^') {
                        length += 1;
                        if (!option.regexp) {
                            warn_at('insecure_a', line, from + length, c);
                        } else if (source_row.charAt(length) === ']') {
                            stop_at('unescaped_a', line, from + length, '^');
                        }
                    }
                    bit = false;
                    if (c === ']') {
                        warn_at('empty_class', line, from + length - 1);
                        bit = true;
                    }
klass:              do {
                        c = source_row.charAt(length);
                        length += 1;
                        switch (c) {
                        case '[':
                        case '^':
                            warn_at('unescaped_a', line, from + length, c);
                            bit = true;
                            break;
                        case '-':
                            if (bit) {
                                bit = false;
                            } else {
                                warn_at('unescaped_a', line, from + length, '-');
                                bit = true;
                            }
                            break;
                        case ']':
                            if (!bit) {
                                warn_at('unescaped_a', line, from + length - 1, '-');
                            }
                            break klass;
                        case '\\':
                            c = source_row.charAt(length);
                            if (c < ' ') {
                                warn_at(bundle.control_a, line, from + length, String(c));
                            } else if (c === '<') {
                                warn_at(bundle.unexpected_a, line, from + length, '\\');
                            }
                            length += 1;
                            bit = true;
                            break;
                        case '/':
                            warn_at('unescaped_a', line, from + length - 1, '/');
                            bit = true;
                            break;
                        case '<':
                            if (xmode === 'script') {
                                c = source_row.charAt(length);
                                if (c === '!' || c === '/') {
                                    warn_at(bundle.html_confusion_a, line,
                                        from + length, c);
                                }
                            }
                            bit = true;
                            break;
                        default:
                            bit = true;
                        }
                    } while (c);
                    break;
                case '.':
                    if (!option.regexp) {
                        warn_at('insecure_a', line, from + length, c);
                    }
                    break;
                case ']':
                case '?':
                case '{':
                case '}':
                case '+':
                case '*':
                    warn_at('unescaped_a', line, from + length, c);
                    break;
                case '<':
                    if (xmode === 'script') {
                        c = source_row.charAt(length);
                        if (c === '!' || c === '/') {
                            warn_at(bundle.html_confusion_a, line, from + length, c);
                        }
                    }
                    break;
                }
                if (b) {
                    switch (source_row.charAt(length)) {
                    case '?':
                    case '+':
                    case '*':
                        length += 1;
                        if (source_row.charAt(length) === '?') {
                            length += 1;
                        }
                        break;
                    case '{':
                        length += 1;
                        c = source_row.charAt(length);
                        if (c < '0' || c > '9') {
                            warn_at(bundle.expected_number_a, line,
                                from + length, c);
                        }
                        length += 1;
                        low = +c;
                        for (;;) {
                            c = source_row.charAt(length);
                            if (c < '0' || c > '9') {
                                break;
                            }
                            length += 1;
                            low = +c + (low * 10);
                        }
                        high = low;
                        if (c === ',') {
                            length += 1;
                            high = Infinity;
                            c = source_row.charAt(length);
                            if (c >= '0' && c <= '9') {
                                length += 1;
                                high = +c;
                                for (;;) {
                                    c = source_row.charAt(length);
                                    if (c < '0' || c > '9') {
                                        break;
                                    }
                                    length += 1;
                                    high = +c + (high * 10);
                                }
                            }
                        }
                        if (source_row.charAt(length) !== '}') {
                            warn_at(bundle.expected_a_b, line, from + length,
                                '}', c);
                        } else {
                            length += 1;
                        }
                        if (source_row.charAt(length) === '?') {
                            length += 1;
                        }
                        if (low > high) {
                            warn_at(bundle.not_greater, line, from + length,
                                low, high);
                        }
                        break;
                    }
                }
            }
            c = source_row.slice(0, length - 1);
            character += length;
            source_row = source_row.slice(length);
            return it('(regexp)', c);
        }

// Public lex methods

        return {
            init: function (source) {
                if (typeof source === 'string') {
                    lines = source.split(crlfx);
                } else {
                    lines = source;
                }
                line = 0;
                next_line();
                from = 1;
            },

            range: function (begin, end) {
                var c, value = '';
                from = character;
                if (source_row.charAt(0) !== begin) {
                    stop_at('expected_a_b', line, character, begin,
                        source_row.charAt(0));
                }
                for (;;) {
                    source_row = source_row.slice(1);
                    character += 1;
                    c = source_row.charAt(0);
                    switch (c) {
                    case '':
                        stop_at('missing_a', line, character, c);
                        break;
                    case end:
                        source_row = source_row.slice(1);
                        character += 1;
                        return it('(range)', value);
                    case xquote:
                    case '\\':
                        warn_at('unexpected_a', line, character, c);
                        break;
                    }
                    value += c;
                }
            },

// token -- this is called by advance to get the next token.

            token: function () {
                var c, i, snippet;

                for (;;) {
                    while (!source_row) {
                        if (!next_line()) {
                            return it('(end)');
                        }
                    }
                    while (xmode === 'outer') {
                        i = source_row.search(ox);
                        if (i === 0) {
                            break;
                        } else if (i > 0) {
                            character += 1;
                            source_row = source_row.slice(i);
                            break;
                        } else {
                            if (!next_line()) {
                                return it('(end)', '');
                            }
                        }
                    }
                    snippet = match(rx[xmode] || tx);
                    if (!snippet) {
                        if (source_row) {
                            if (source_row.charAt(0) === ' ') {
                                if (!option.white) {
                                    warn_at('unexpected_a', line, character,
                                        '(space)');
                                }
                                character += 1;
                                source_row = '';
                            } else {
                                stop_at('unexpected_a', line, character,
                                    source_row.charAt(0));
                            }
                        }
                    } else {

//      identifier

                        c = snippet.charAt(0);
                        if (c.isAlpha() || c === '_' || c === '$') {
                            return it('(identifier)', snippet);
                        }

//      number

                        if (c.isDigit()) {
                            return number(snippet);
                        }
                        switch (snippet) {

//      string

                        case '"':
                        case "'":
                            return string(snippet);

//      // comment

                        case '//':
                            comment(source_row);
                            source_row = '';
                            break;

//      /* comment

                        case '/*':
                            for (;;) {
                                i = source_row.search(lx);
                                if (i >= 0) {
                                    break;
                                }
                                comment(source_row);
                                if (!next_line()) {
                                    stop_at('unclosed_comment', line, character);
                                }
                            }
                            comment(source_row.slice(0, i));
                            character += i + 2;
                            if (source_row.charAt(i) === '/') {
                                stop_at('nested_comment', line, character);
                            }
                            source_row = source_row.slice(i + 2);
                            break;

                        case '':
                            break;
//      /
                        case '/':
                            if (token.id === '/=') {
                                stop_at(
                                    bundle.slash_equal,
                                    line,
                                    from
                                );
                            }
                            return prereg
                                ? regexp()
                                : it('(punctuator)', snippet);

//      punctuator

                        case '<!--':
                            length = line;
//                            c = character;
                            for (;;) {
                                i = source_row.indexOf('--');
                                if (i >= 0) {
                                    break;
                                }
                                i = source_row.indexOf('<!');
                                if (i >= 0) {
                                    stop_at('nested_comment',
                                        line, character + i);
                                }
                                if (!next_line()) {
                                    stop_at('unclosed_comment', length, c);
                                }
                            }
                            length = source_row.indexOf('<!');
                            if (length >= 0 && length < i) {
                                stop_at('nested_comment',
                                    line, character + length);
                            }
                            character += i;
                            if (source_row.charAt(i + 2) !== '>') {
                                stop_at('expected_a', line, character, '-->');
                            }
                            character += 3;
                            source_row = source_row.slice(i + 3);
                            break;
                        case '#':
                            if (xmode === 'html' || xmode === 'styleproperty') {
                                for (;;) {
                                    c = source_row.charAt(0);
                                    if ((c < '0' || c > '9') &&
                                            (c < 'a' || c > 'f') &&
                                            (c < 'A' || c > 'F')) {
                                        break;
                                    }
                                    character += 1;
                                    source_row = source_row.slice(1);
                                    snippet += c;
                                }
                                if (snippet.length !== 4 && snippet.length !== 7) {
                                    warn_at('bad_color_a', line,
                                        from + length, snippet);
                                }
                                return it('(color)', snippet);
                            }
                            return it('(punctuator)', snippet);

                        default:
                            if (xmode === 'outer' && c === '&') {
                                character += 1;
                                source_row = source_row.slice(1);
                                for (;;) {
                                    c = source_row.charAt(0);
                                    character += 1;
                                    source_row = source_row.slice(1);
                                    if (c === ';') {
                                        break;
                                    }
                                    if (!((c >= '0' && c <= '9') ||
                                            (c >= 'a' && c <= 'z') ||
                                            c === '#')) {
                                        stop_at('bad_entity', line, from + length,
                                            character);
                                    }
                                }
                                break;
                            }
                            return it('(punctuator)', snippet);
                        }
                    }
                }
            }
        };
    }());


    function add_label(token, kind, name) {

// Define the symbol in the current function in the current scope.

        name = name || token.string;

// Global variables cannot be created in the safe subset. If a global variable
// already exists, do nothing. If it is predefined, define it.

        if (funct === global_funct) {
            if (option.safe) {
                warn('adsafe_a', token, name);
            }
            if (typeof global_funct[name] !== 'string') {
                token.writeable = typeof predefined[name] === 'boolean'
                    ? predefined[name]
                    : true;
                token.funct = funct;
                global_scope[name] = token;
            }
            if (kind === 'becoming') {
                kind = 'var';
            }

// Ordinary variables.

        } else {

// Warn if the variable already exists.

            if (typeof funct[name] === 'string') {
                if (funct[name] === 'undef') {
                    if (!option.undef) {
                        warn('used_before_a', token, name);
                    }
                    kind = 'var';
                } else {
                    warn('already_defined', token, name);
                }
            } else {

// Add the symbol to the current function.

                token.funct = funct;
                token.writeable = true;
                scope[name] = token;
            }
        }
        funct[name] = kind;
    }


    function peek(distance) {

// Peek ahead to a future token. The distance is how far ahead to look. The
// default is the next token.

        var found, slot = 0;

        distance = distance || 0;
        while (slot <= distance) {
            found = lookahead[slot];
            if (!found) {
                found = lookahead[slot] = lex.token();
            }
            slot += 1;
        }
        return found;
    }


    function advance(id, match) {

// Produce the next token, also looking for programming errors.

        if (indent) {

// If indentation checking was requested, then inspect all of the line breakings.
// The var statement is tricky because the names might be aligned or not. We
// look at the first line break after the var to determine the programmer's
// intention.

            if (var_mode && next_token.line !== token.line) {
                if ((var_mode !== indent || !next_token.edge) &&
                        next_token.from === indent.at -
                        (next_token.edge ? option.indent : 0)) {
                    var dent = indent;
                    for (;;) {
                        dent.at -= option.indent;
                        if (dent === var_mode) {
                            break;
                        }
                        dent = dent.was;
                    }
                    dent.open = false;
                }
                var_mode = null;
            }
            if (next_token.id === '?' && indent.mode === ':' &&
                    token.line !== next_token.line) {
                indent.at -= option.indent;
            }
            if (indent.open) {

// If the token is an edge.

                if (next_token.edge) {
                    if (next_token.edge === 'label') {
                        expected_at(1);
                    } else if (next_token.edge === 'case' || indent.mode === 'statement') {
                        expected_at(indent.at - option.indent);
                    } else if (indent.mode !== 'array' || next_token.line !== token.line) {
                        expected_at(indent.at);
                    }

// If the token is not an edge, but is the first token on the line.

                } else if (next_token.line !== token.line) {
                    if (next_token.from < indent.at + (indent.mode ===
                            'expression' ? 0 : option.indent)) {
                        expected_at(indent.at + option.indent);
                    }
                    indent.wrap = true;
                }
            } else if (next_token.line !== token.line) {
                if (next_token.edge) {
                    expected_at(indent.at);
                } else {
                    indent.wrap = true;
                    if (indent.mode === 'statement' || indent.mode === 'var') {
                        expected_at(indent.at + option.indent);
                    } else if (next_token.from < indent.at + (indent.mode ===
                            'expression' ? 0 : option.indent)) {
                        expected_at(indent.at + option.indent);
                    }
                }
            }
        }

        switch (token.id) {
        case '(number)':
            if (next_token.id === '.') {
                warn('trailing_decimal_a');
            }
            break;
        case '-':
            if (next_token.id === '-' || next_token.id === '--') {
                warn('confusing_a');
            }
            break;
        case '+':
            if (next_token.id === '+' || next_token.id === '++') {
                warn('confusing_a');
            }
            break;
        }
        if (token.id === '(string)' || token.identifier) {
            anonname = token.string;
        }

        if (id && next_token.id !== id) {
            if (match) {
                warn('expected_a_b_from_c_d', next_token, id,
                    match.id, match.line, artifact());
            } else if (!next_token.identifier || next_token.string !== id) {
                warn('expected_a_b', next_token, id, artifact());
            }
        }
        prev_token = token;
        token = next_token;
        next_token = lookahead.shift() || lex.token();
    }


    function advance_identifier(string) {
        if (next_token.identifier && next_token.string === string) {
            advance();
        } else {
            warn('expected_a_b', next_token, string, artifact());
        }
    }


    function do_safe() {
        if (option.adsafe) {
            option.safe = true;
        }
        if (option.safe) {
            option.browser     =
                option['continue'] =
                option.css     =
                option.debug   =
                option.devel   =
                option.evil    =
                option.forin   =
                option.newcap  =
                option.nomen   =
                option.on      =
                option.rhino   =
                option.sloppy  =
                option.sub     =
                option.undef   =
                option.windows = false;


            delete predefined.Array;
            delete predefined.Date;
            delete predefined.Function;
            delete predefined.Object;
            delete predefined['eval'];

            add_to_predefined({
                ADSAFE: false,
                lib: false
            });
        }
    }


    function do_globals() {
        var name, writeable;
        for (;;) {
            if (next_token.id !== '(string)' && !next_token.identifier) {
                return;
            }
            name = next_token.string;
            advance();
            writeable = false;
            if (next_token.id === ':') {
                advance(':');
                switch (next_token.id) {
                case 'true':
                    writeable = predefined[name] !== false;
                    advance('true');
                    break;
                case 'false':
                    advance('false');
                    break;
                default:
                    stop('unexpected_a');
                }
            }
            predefined[name] = writeable;
            if (next_token.id !== ',') {
                return;
            }
            advance(',');
        }
    }


    function do_jslint() {
        var name, value;
        while (next_token.id === '(string)' || next_token.identifier) {
            name = next_token.string;
            if (!allowed_option[name]) {
                stop('unexpected_a');
            }
            advance();
            if (next_token.id !== ':') {
                stop('expected_a_b', next_token, ':', artifact());
            }
            advance(':');
            if (typeof allowed_option[name] === 'number') {
                value = next_token.number;
                if (value > allowed_option[name] || value <= 0 ||
                        Math.floor(value) !== value) {
                    stop('expected_small_a');
                }
                option[name] = value;
            } else {
                if (next_token.id === 'true') {
                    option[name] = true;
                } else if (next_token.id === 'false') {
                    option[name] = false;
                } else {
                    stop('unexpected_a');
                }
            }
            advance();
            if (next_token.id === ',') {
                advance(',');
            }
        }
        assume();
    }


    function do_properties() {
        var name;
        option.properties = true;
        for (;;) {
            if (next_token.id !== '(string)' && !next_token.identifier) {
                return;
            }
            name = next_token.string;
            advance();
            if (next_token.id === ':') {
                for (;;) {
                    advance();
                    if (next_token.id !== '(string)' && !next_token.identifier) {
                        break;
                    }
                }
            }
            property[name] = 0;
            if (next_token.id !== ',') {
                return;
            }
            advance(',');
        }
    }


    directive = function directive() {
        var command = this.id,
            old_comments_off = comments_off,
            old_indent = indent;
        comments_off = true;
        indent = null;
        if (next_token.line === token.line && next_token.from === token.thru) {
            warn('missing_space_a_b', next_token, artifact(token), artifact());
        }
        if (lookahead.length > 0) {
            warn('unexpected_a', this);
        }
        switch (command) {
        case '/*properties':
        case '/*property':
        case '/*members':
        case '/*member':
            do_properties();
            break;
        case '/*jslint':
            if (option.safe) {
                warn('adsafe_a', this);
            }
            do_jslint();
            break;
        case '/*globals':
        case '/*global':
            if (option.safe) {
                warn('adsafe_a', this);
            }
            do_globals();
            break;
        default:
            stop('unexpected_a', this);
        }
        comments_off = old_comments_off;
        advance('*/');
        indent = old_indent;
    };


// Indentation intention

    function edge(mode) {
        next_token.edge = indent ? indent.open && (mode || 'edge') : '';
    }


    function step_in(mode) {
        var open;
        if (typeof mode === 'number') {
            indent = {
                at: +mode,
                open: true,
                was: indent
            };
        } else if (!indent) {
            indent = {
                at: 1,
                mode: 'statement',
                open: true
            };
        } else if (mode === 'statement') {
            indent = {
                at: indent.at,
                open: true,
                was: indent
            };
        } else {
            open = mode === 'var' || next_token.line !== token.line;
            indent = {
                at: (open || mode === 'control'
                    ? indent.at + option.indent
                    : indent.at) + (indent.wrap ? option.indent : 0),
                mode: mode,
                open: open,
                was: indent
            };
            if (mode === 'var' && open) {
                var_mode = indent;
            }
        }
    }

    function step_out(id, symbol) {
        if (id) {
            if (indent && indent.open) {
                indent.at -= option.indent;
                edge();
            }
            advance(id, symbol);
        }
        if (indent) {
            indent = indent.was;
        }
    }

// Functions for conformance of whitespace.

    function one_space(left, right) {
        left = left || token;
        right = right || next_token;
        if (right.id !== '(end)' && !option.white &&
                (token.line !== right.line ||
                token.thru + 1 !== right.from)) {
            warn('expected_space_a_b', right, artifact(token), artifact(right));
        }
    }

    function one_space_only(left, right) {
        left = left || token;
        right = right || next_token;
        if (right.id !== '(end)' && (left.line !== right.line ||
                (!option.white && left.thru + 1 !== right.from))) {
            warn('expected_space_a_b', right, artifact(left), artifact(right));
        }
    }

    function no_space(left, right) {
        left = left || token;
        right = right || next_token;
        if ((!option.white || xmode === 'styleproperty' || xmode === 'style') &&
                left.thru !== right.from && left.line === right.line) {
            warn('unexpected_space_a_b', right, artifact(left), artifact(right));
        }
    }

    function no_space_only(left, right) {
        left = left || token;
        right = right || next_token;
        if (right.id !== '(end)' && (left.line !== right.line ||
                (!option.white && left.thru !== right.from))) {
            warn('unexpected_space_a_b', right, artifact(left), artifact(right));
        }
    }

    function spaces(left, right) {
        if (!option.white) {
            left = left || token;
            right = right || next_token;
            if (left.thru === right.from && left.line === right.line) {
                warn('missing_space_a_b', right, artifact(left), artifact(right));
            }
        }
    }

    function comma() {
        if (next_token.id !== ',') {
            warn_at('expected_a_b', token.line, token.thru, ',', artifact());
        } else {
            if (!option.white) {
                no_space_only();
            }
            advance(',');
            spaces();
        }
    }


    function semicolon() {
        if (next_token.id !== ';') {
            warn_at('expected_a_b', token.line, token.thru, ';', artifact());
        } else {
            if (!option.white) {
                no_space_only();
            }
            advance(';');
            if (semicolon_coda[next_token.id] !== true) {
                spaces();
            }
        }
    }

    function use_strict() {
        if (next_token.string === 'use strict') {
            if (strict_mode) {
                warn('unnecessary_use');
            }
            edge();
            advance();
            semicolon();
            strict_mode = true;
            option.undef = false;
            return true;
        }
        return false;
    }


    function are_similar(a, b) {
        if (a === b) {
            return true;
        }
        if (Array.isArray(a)) {
            if (Array.isArray(b) && a.length === b.length) {
                var i;
                for (i = 0; i < a.length; i += 1) {
                    if (!are_similar(a[i], b[i])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        if (Array.isArray(b)) {
            return false;
        }
        if (a.id === '(number)' && b.id === '(number)') {
            return a.number === b.number;
        }
        if (a.arity === b.arity && a.string === b.string) {
            switch (a.arity) {
            case 'prefix':
            case 'suffix':
            case undefined:
                return a.id === b.id && are_similar(a.first, b.first);
            case 'infix':
                return are_similar(a.first, b.first) &&
                    are_similar(a.second, b.second);
            case 'ternary':
                return are_similar(a.first, b.first) &&
                    are_similar(a.second, b.second) &&
                    are_similar(a.third, b.third);
            case 'function':
            case 'regexp':
                return false;
            default:
                return true;
            }
        } else {
            if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
                return a.second.string === b.second.string && b.second.id === '(string)';
            }
            if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
                return a.second.string === b.second.string && a.second.id === '(string)';
            }
        }
        return false;
    }


// This is the heart of JSLINT, the Pratt parser. In addition to parsing, it
// is looking for ad hoc lint patterns. We add .fud to Pratt's model, which is
// like .nud except that it is only used on the first token of a statement.
// Having .fud makes it much easier to define statement-oriented languages like
// JavaScript. I retained Pratt's nomenclature.

// .nud     Null denotation
// .fud     First null denotation
// .led     Left denotation
//  lbp     Left binding power
//  rbp     Right binding power

// They are elements of the parsing method called Top Down Operator Precedence.

    function expression(rbp, initial) {

// rbp is the right binding power.
// initial indicates that this is the first expression of a statement.

        var left;
        if (next_token.id === '(end)') {
            stop('unexpected_a', token, next_token.id);
        }
        advance();
        if (option.safe && scope[token.string] &&
                scope[token.string] === global_scope[token.string] &&
                (next_token.id !== '(' && next_token.id !== '.')) {
            warn('adsafe_a', token);
        }
        if (initial) {
            anonname = 'anonymous';
            funct['(verb)'] = token.string;
        }
        if (initial === true && token.fud) {
            left = token.fud();
        } else {
            if (token.nud) {
                left = token.nud();
            } else {
                if (next_token.id === '(number)' && token.id === '.') {
                    warn('leading_decimal_a', token, artifact());
                    advance();
                    return token;
                }
                stop('expected_identifier_a', token, token.id);
            }
            while (rbp < next_token.lbp) {
                advance();
                if (token.led) {
                    left = token.led(left);
                } else {
                    stop('expected_operator_a', token, token.id);
                }
            }
        }
        return left;
    }


// Functional constructors for making the symbols that will be inherited by
// tokens.

    function symbol(s, p) {
        var x = syntax[s];
        if (!x || typeof x !== 'object') {
            syntax[s] = x = {
                id: s,
                lbp: p || 0,
                string: s
            };
        }
        return x;
    }

    function postscript(x) {
        x.postscript = true;
        return x;
    }

    function ultimate(s) {
        var x = symbol(s, 0);
        x.from = 1;
        x.thru = 1;
        x.line = 0;
        x.edge = 'edge';
        s.string = s;
        return postscript(x);
    }


    function stmt(s, f) {
        var x = symbol(s);
        x.identifier = x.reserved = true;
        x.fud = f;
        return x;
    }

    function labeled_stmt(s, f) {
        var x = stmt(s, f);
        x.labeled = true;
    }

    function disrupt_stmt(s, f) {
        var x = stmt(s, f);
        x.disrupt = true;
    }


    function reserve_name(x) {
        var c = x.id.charAt(0);
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            x.identifier = x.reserved = true;
        }
        return x;
    }


    function prefix(s, f) {
        var x = symbol(s, 150);
        reserve_name(x);
        x.nud = typeof f === 'function'
            ? f
            : function () {
                if (s === 'typeof') {
                    one_space();
                } else {
                    no_space_only();
                }
                this.first = expression(150);
                this.arity = 'prefix';
                if (this.id === '++' || this.id === '--') {
                    if (!option.plusplus) {
                        warn('unexpected_a', this);
                    } else if ((!this.first.identifier || this.first.reserved) &&
                            this.first.id !== '.' && this.first.id !== '[') {
                        warn('bad_operand', this);
                    }
                }
                return this;
            };
        return x;
    }


    function type(s, t, nud) {
        var x = symbol(s);
        x.arity = t;
        if (nud) {
            x.nud = nud;
        }
        return x;
    }


    function reserve(s, f) {
        var x = symbol(s);
        x.identifier = x.reserved = true;
        if (typeof f === 'function') {
            x.nud = f;
        }
        return x;
    }


    function constant(name) {
        var x = reserve(name);
        x.string = name;
        x.nud = return_this;
        return x;
    }


    function reservevar(s, v) {
        return reserve(s, function () {
            if (typeof v === 'function') {
                v(this);
            }
            return this;
        });
    }


    function infix(s, p, f, w) {
        var x = symbol(s, p);
        reserve_name(x);
        x.led = function (left) {
            this.arity = 'infix';
            if (!w) {
                spaces(prev_token, token);
                spaces();
            }
            if (!option.bitwise && this.bitwise) {
                warn('unexpected_a', this);
            }
            if (typeof f === 'function') {
                return f(left, this);
            }
            this.first = left;
            this.second = expression(p);
            return this;
        };
        return x;
    }

    function expected_relation(node, message) {
        if (node.assign) {
            warn(message || bundle.conditional_assignment, node);
        }
        return node;
    }

    function expected_condition(node, message) {
        switch (node.id) {
        case '[':
        case '-':
            if (node.arity !== 'infix') {
                warn(message || bundle.weird_condition, node);
            }
            break;
        case 'false':
        case 'function':
        case 'Infinity':
        case 'NaN':
        case 'null':
        case 'true':
        case 'undefined':
        case 'void':
        case '(number)':
        case '(regexp)':
        case '(string)':
        case '{':
            warn(message || bundle.weird_condition, node);
            break;
        case '(':
            if (node.first.id === '.' && numbery[node.first.second.string] === true) {
                warn(message || bundle.weird_condition, node);
            }
            break;
        }
        return node;
    }

    function check_relation(node) {
        switch (node.arity) {
        case 'prefix':
            switch (node.id) {
            case '{':
            case '[':
                warn('unexpected_a', node);
                break;
            case '!':
                warn('confusing_a', node);
                break;
            }
            break;
        case 'function':
        case 'regexp':
            warn('unexpected_a', node);
            break;
        default:
            if (node.id  === 'NaN') {
                warn('isNaN', node);
            }
        }
        return node;
    }


    function relation(s, eqeq) {
        return infix(s, 100, function (left, that) {
            check_relation(left);
            if (eqeq && !option.eqeq) {
                warn('expected_a_b', that, eqeq, that.id);
            }
            var right = expression(100);
            if (are_similar(left, right) ||
                    ((left.id === '(string)' || left.id === '(number)') &&
                    (right.id === '(string)' || right.id === '(number)'))) {
                warn('weird_relation', that);
            }
            that.first = left;
            that.second = check_relation(right);
            return that;
        });
    }


    function assignop(s, op) {
        var x = infix(s, 20, function (left, that) {
            var l;
            that.first = left;
            if (left.identifier) {
                if (scope[left.string]) {
                    if (scope[left.string].writeable === false) {
                        warn('read_only', left);
                    }
                } else {
                    stop('read_only');
                }
                if (funct['(params)']) {
                    funct['(params)'].forEach(function (value) {
                        if (value.string === left.string) {
                            value.assign = true;
                        }
                    });
                }
            } else if (option.safe) {
                l = left;
                do {
                    if (typeof predefined[l.string] === 'boolean') {
                        warn('adsafe_a', l);
                    }
                    l = l.first;
                } while (l);
            }
            if (left === syntax['function']) {
                warn('identifier_function', token);
            }
            if (left.id === '.' || left.id === '[') {
                if (!left.first || left.first.string === 'arguments') {
                    warn('bad_assignment', that);
                }
            } else if (left.identifier) {
                if (!left.reserved && funct[left.string] === 'exception') {
                    warn('assign_exception', left);
                }
            } else {
                warn('bad_assignment', that);
            }
            that.second = expression(19);
            if (that.id === '=' && are_similar(that.first, that.second)) {
                warn('weird_assignment', that);
            }
            return that;
        });
        x.assign = true;
        if (op) {
            if (syntax[op].bitwise) {
                x.bitwise = true;
            }
        }
        return x;
    }


    function bitwise(s, p) {
        var x = infix(s, p, 'number');
        x.bitwise = true;
        return x;
    }


    function suffix(s) {
        var x = symbol(s, 150);
        x.led = function (left) {
            no_space_only(prev_token, token);
            if (!option.plusplus) {
                warn('unexpected_a', this);
            } else if ((!left.identifier || left.reserved) &&
                    left.id !== '.' && left.id !== '[') {
                warn('bad_operand', this);
            }
            this.first = left;
            this.arity = 'suffix';
            return this;
        };
        return x;
    }


    function optional_identifier() {
        if (next_token.identifier) {
            advance();
            if (option.safe && banned[token.string]) {
                warn('adsafe_a', token);
            } else if (token.reserved && !option.es5) {
                warn('expected_identifier_a_reserved', token);
            }
            return token.string;
        }
    }


    function identifier() {
        var i = optional_identifier();
        if (!i) {
            stop(token.id === 'function' && next_token.id === '('
                ? 'name_function'
                : 'expected_identifier_a');
        }
        return i;
    }


    function statement() {

        var label, old_scope = scope, the_statement;

// We don't like the empty statement.

        if (next_token.id === ';') {
            warn('unexpected_a');
            semicolon();
            return;
        }

// Is this a labeled statement?

        if (next_token.identifier && !next_token.reserved && peek().id === ':') {
            edge('label');
            label = next_token;
            advance();
            advance(':');
            scope = Object.create(old_scope);
            add_label(label, 'label');
            if (next_token.labeled !== true || funct === global_funct) {
                stop('unexpected_label_a', label);
            } else if (jx.test(label.string + ':')) {
                warn('url', label);
            }
            next_token.label = label;
        }

// Parse the statement.

        if (token.id !== 'else') {
            edge();
        }
        step_in('statement');
        the_statement = expression(0, true);
        if (the_statement) {

// Look for the final semicolon.

            if (the_statement.arity === 'statement') {
                if (the_statement.id === 'switch' ||
                        (the_statement.block && the_statement.id !== 'do')) {
                    spaces();
                } else {
                    semicolon();
                }
            } else {

// If this is an expression statement, determine if it is acceptable.
// We do not like
//      new Blah();
// statments. If it is to be used at all, new should only be used to make
// objects, not side effects. The expression statements we do like do
// assignment or invocation or delete.

                if (the_statement.id === '(') {
                    if (the_statement.first.id === 'new') {
                        warn('bad_new');
                    }
                } else if (!the_statement.assign &&
                        the_statement.id !== 'delete' &&
                        the_statement.id !== '++' &&
                        the_statement.id !== '--') {
                    warn('assignment_function_expression', token);
                }
                semicolon();
            }
        }
        step_out();
        scope = old_scope;
        return the_statement;
    }


    function statements() {
        var array = [], disruptor, the_statement;

// A disrupt statement may not be followed by any other statement.
// If the last statement is disrupt, then the sequence is disrupt.

        while (next_token.postscript !== true) {
            if (next_token.id === ';') {
                warn('unexpected_a', next_token);
                semicolon();
            } else {
                if (next_token.string === 'use strict') {
                    if ((!node_js && xmode !== 'script') || funct !== global_funct || array.length > 0) {
                        warn('function_strict');
                    }
                    use_strict();
                }
                if (disruptor) {
                    warn('unreachable_a_b', next_token, next_token.string,
                        disruptor.string);
                    disruptor = null;
                }
                the_statement = statement();
                if (the_statement) {
                    array.push(the_statement);
                    if (the_statement.disrupt) {
                        disruptor = the_statement;
                        array.disrupt = true;
                    }
                }
            }
        }
        return array;
    }


    function block(ordinary) {

// array block is array sequence of statements wrapped in braces.
// ordinary is false for function bodies and try blocks.
// ordinary is true for if statements, while, etc.

        var array,
            curly = next_token,
            old_in_block = in_block,
            old_scope = scope,
            old_strict_mode = strict_mode;

        in_block = ordinary;
        scope = Object.create(scope);
        spaces();
        if (next_token.id === '{') {
            advance('{');
            step_in();
            if (!ordinary && !use_strict() && !old_strict_mode &&
                    !option.sloppy && funct['(context)'] === global_funct) {
                warn('missing_use_strict');
            }
            array = statements();
            strict_mode = old_strict_mode;
            step_out('}', curly);
        } else if (!ordinary) {
            stop('expected_a_b', next_token, '{', artifact());
        } else {
            warn('expected_a_b', next_token, '{', artifact());
            array = [statement()];
            array.disrupt = array[0].disrupt;
        }
        funct['(verb)'] = null;
        scope = old_scope;
        in_block = old_in_block;
        if (ordinary && array.length === 0) {
            warn('empty_block');
        }
        return array;
    }


    function tally_property(name) {
        if (option.properties && typeof property[name] !== 'number') {
            warn('unexpected_property_a', token, name);
        }
        if (typeof property[name] === 'number') {
            property[name] += 1;
        } else {
            property[name] = 1;
        }
    }


// ECMAScript parser

    syntax['(identifier)'] = {
        id: '(identifier)',
        lbp: 0,
        identifier: true,
        nud: function () {
            var name = this.string,
                variable = scope[name],
                site,
                writeable;

// If the variable is not in scope, then we may have an undeclared variable.
// Check the predefined list. If it was predefined, create the global
// variable.

            if (typeof variable !== 'object') {
                writeable = predefined[name];
                if (typeof writeable === 'boolean') {
                    global_scope[name] = variable = {
                        string:    name,
                        writeable: writeable,
                        funct:     global_funct
                    };
                    global_funct[name] = 'var';

// But if the variable is not in scope, and is not predefined, and if we are not
// in the global scope, then we have an undefined variable error.

                } else {
                    if (!option.undef) {
                        warn('used_before_a', token);
                    }
                    scope[name] = variable = {
                        string: name,
                        writeable: true,
                        funct: funct
                    };
                    funct[name] = 'undef';
                }

            }
            site = variable.funct;

// The name is in scope and defined in the current function.

            if (funct === site) {

//      Change 'unused' to 'var', and reject labels.

                switch (funct[name]) {
                case 'becoming':
                    warn('unexpected_a', token);
                    funct[name] = 'var';
                    break;
                case 'unused':
                    funct[name] = 'var';
                    break;
                case 'unparam':
                    funct[name] = 'parameter';
                    break;
                case 'unction':
                    funct[name] = 'function';
                    break;
                case 'label':
                    warn('a_label', token, name);
                    break;
                }

// If the name is already defined in the current
// function, but not as outer, then there is a scope error.

            } else {
                switch (funct[name]) {
                case 'closure':
                case 'function':
                case 'var':
                case 'unused':
                    warn('a_scope', token, name);
                    break;
                case 'label':
                    warn('a_label', token, name);
                    break;
                case 'outer':
                case 'global':
                    break;
                default:

// If the name is defined in an outer function, make an outer entry, and if
// it was unused, make it var.

                    switch (site[name]) {
                    case 'becoming':
                    case 'closure':
                    case 'function':
                    case 'parameter':
                    case 'unction':
                    case 'unused':
                    case 'var':
                        site[name] = 'closure';
                        funct[name] = site === global_funct
                            ? 'global'
                            : 'outer';
                        break;
                    case 'unparam':
                        site[name] = 'parameter';
                        funct[name] = 'outer';
                        break;
                    case 'undef':
                        funct[name] = 'undef';
                        break;
                    case 'label':
                        warn('a_label', token, name);
                        break;
                    }
                }
            }
            return this;
        },
        led: function () {
            stop('expected_operator_a');
        }
    };

// Build the syntax table by declaring the syntactic elements.

    type('(array)', 'array');
    type('(color)', 'color');
    type('(function)', 'function');
    type('(number)', 'number', return_this);
    type('(object)', 'object');
    type('(string)', 'string', return_this);
    type('(boolean)', 'boolean', return_this);
    type('(range)', 'range');
    type('(regexp)', 'regexp', return_this);

    ultimate('(begin)');
    ultimate('(end)');
    ultimate('(error)');
    postscript(symbol('</'));
    symbol('<!');
    symbol('<!--');
    symbol('-->');
    postscript(symbol('}'));
    symbol(')');
    symbol(']');
    postscript(symbol('"'));
    postscript(symbol('\''));
    symbol(';');
    symbol(':');
    symbol(',');
    symbol('#');
    symbol('@');
    symbol('*/');
    postscript(reserve('case'));
    reserve('catch');
    postscript(reserve('default'));
    reserve('else');
    reserve('finally');

    reservevar('arguments', function (x) {
        if (strict_mode && funct === global_funct) {
            warn('strict', x);
        } else if (option.safe) {
            warn('adsafe_a', x);
        }
        funct['(arguments)'] = true;
    });
    reservevar('eval', function (x) {
        if (option.safe) {
            warn('adsafe_a', x);
        }
    });
    constant('false', 'boolean');
    constant('Infinity', 'number');
    constant('NaN', 'number');
    constant('null', '');
    reservevar('this', function (x) {
        if (option.safe) {
            warn('adsafe_a', x);
        } else if (strict_mode && funct['(token)'] &&
                (funct['(token)'].arity === 'statement' &&
                funct['(name)'].charAt(0) > 'Z')) {
            warn('strict', x);
        }
    });
    constant('true', 'boolean');
    constant('undefined', '');

    infix('?', 30, function (left, that) {
        step_in('?');
        that.first = expected_condition(expected_relation(left));
        that.second = expression(0);
        spaces();
        step_out();
        var colon = next_token;
        advance(':');
        step_in(':');
        spaces();
        that.third = expression(10);
        that.arity = 'ternary';
        if (are_similar(that.second, that.third)) {
            warn('weird_ternary', colon);
        } else if (are_similar(that.first, that.second)) {
            warn('use_or', that);
        }
        step_out();
        return that;
    });

    infix('||', 40, function (left, that) {
        function paren_check(that) {
            if (that.id === '&&' && !that.paren) {
                warn('and', that);
            }
            return that;
        }

        that.first = paren_check(expected_condition(expected_relation(left)));
        that.second = paren_check(expected_relation(expression(40)));
        if (are_similar(that.first, that.second)) {
            warn('weird_condition', that);
        }
        return that;
    });

    infix('&&', 50, function (left, that) {
        that.first = expected_condition(expected_relation(left));
        that.second = expected_relation(expression(50));
        if (are_similar(that.first, that.second)) {
            warn('weird_condition', that);
        }
        return that;
    });

    prefix('void', function () {
        this.first = expression(0);
        this.arity = 'prefix';
        if (option.es5) {
            warn('expected_a_b', this, 'undefined', 'void');
        } else if (this.first.number !== 0) {
            warn('expected_a_b', this.first, '0', artifact(this.first));
        }
        return this;
    });

    bitwise('|', 70);
    bitwise('^', 80);
    bitwise('&', 90);

    relation('==', '===');
    relation('===');
    relation('!=', '!==');
    relation('!==');
    relation('<');
    relation('>');
    relation('<=');
    relation('>=');

    bitwise('<<', 120);
    bitwise('>>', 120);
    bitwise('>>>', 120);

    infix('in', 120, function (left, that) {
        warn('infix_in', that);
        that.left = left;
        that.right = expression(130);
        return that;
    });
    infix('instanceof', 120);
    infix('+', 130, function (left, that) {
        if (left.id === '(number)') {
            if (left.number === 0) {
                warn('unexpected_a', left, '0');
            }
        } else if (left.id === '(string)') {
            if (left.string === '') {
                warn('expected_a_b', left, 'String', '\'\'');
            }
        }
        var right = expression(130);
        if (right.id === '(number)') {
            if (right.number === 0) {
                warn('unexpected_a', right, '0');
            }
        } else if (right.id === '(string)') {
            if (right.string === '') {
                warn('expected_a_b', right, 'String', '\'\'');
            }
        }
        if (left.id === right.id) {
            if (left.id === '(string)' || left.id === '(number)') {
                if (left.id === '(string)') {
                    left.string += right.string;
                    if (jx.test(left.string)) {
                        warn('url', left);
                    }
                } else {
                    left.number += right.number;
                }
                left.thru = right.thru;
                return left;
            }
        }
        that.first = left;
        that.second = right;
        return that;
    });
    prefix('+', 'num');
    prefix('+++', function () {
        warn('confusing_a', token);
        this.first = expression(150);
        this.arity = 'prefix';
        return this;
    });
    infix('+++', 130, function (left) {
        warn('confusing_a', token);
        this.first = left;
        this.second = expression(130);
        return this;
    });
    infix('-', 130, function (left, that) {
        if ((left.id === '(number)' && left.number === 0) || left.id === '(string)') {
            warn('unexpected_a', left);
        }
        var right = expression(130);
        if ((right.id === '(number)' && right.number === 0) || right.id === '(string)') {
            warn('unexpected_a', right);
        }
        if (left.id === right.id && left.id === '(number)') {
            left.number -= right.number;
            left.thru = right.thru;
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    prefix('-');
    prefix('---', function () {
        warn('confusing_a', token);
        this.first = expression(150);
        this.arity = 'prefix';
        return this;
    });
    infix('---', 130, function (left) {
        warn('confusing_a', token);
        this.first = left;
        this.second = expression(130);
        return this;
    });
    infix('*', 140, function (left, that) {
        if ((left.id === '(number)' && (left.number === 0 || left.number === 1)) || left.id === '(string)') {
            warn('unexpected_a', left);
        }
        var right = expression(140);
        if ((right.id === '(number)' && (right.number === 0 || right.number === 1)) || right.id === '(string)') {
            warn('unexpected_a', right);
        }
        if (left.id === right.id && left.id === '(number)') {
            left.number *= right.number;
            left.thru = right.thru;
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    infix('/', 140, function (left, that) {
        if ((left.id === '(number)' && left.number === 0) || left.id === '(string)') {
            warn('unexpected_a', left);
        }
        var right = expression(140);
        if ((right.id === '(number)' && (right.number === 0 || right.number === 1)) || right.id === '(string)') {
            warn('unexpected_a', right);
        }
        if (left.id === right.id && left.id === '(number)') {
            left.number /= right.number;
            left.thru = right.thru;
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    infix('%', 140, function (left, that) {
        if ((left.id === '(number)' && (left.number === 0 || left.number === 1)) || left.id === '(string)') {
            warn('unexpected_a', left);
        }
        var right = expression(140);
        if ((right.id === '(number)' && right.number === 0) || right.id === '(string)') {
            warn('unexpected_a', right);
        }
        if (left.id === right.id && left.id === '(number)') {
            left.number %= right.number;
            left.thru = right.thru;
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });

    suffix('++');
    prefix('++');

    suffix('--');
    prefix('--');
    prefix('delete', function () {
        one_space();
        var p = expression(0);
        if (!p || (p.id !== '.' && p.id !== '[')) {
            warn('deleted');
        }
        this.first = p;
        return this;
    });


    prefix('~', function () {
        no_space_only();
        if (!option.bitwise) {
            warn('unexpected_a', this);
        }
        expression(150);
        return this;
    });
    prefix('!', function () {
        no_space_only();
        this.first = expected_condition(expression(150));
        this.arity = 'prefix';
        if (bang[this.first.id] === true || this.first.assign) {
            warn('confusing_a', this);
        }
        return this;
    });
    prefix('typeof', null);
    prefix('new', function () {
        one_space();
        var c = expression(160), n, p, v;
        this.first = c;
        if (c.id !== 'function') {
            if (c.identifier) {
                switch (c.string) {
                case 'Object':
                    warn('use_object', token);
                    break;
                case 'Array':
                    if (next_token.id === '(') {
                        p = next_token;
                        p.first = this;
                        advance('(');
                        if (next_token.id !== ')') {
                            n = expression(0);
                            p.second = [n];
                            if (n.id !== '(number)' || next_token.id === ',') {
                                warn('use_array', p);
                            }
                            while (next_token.id === ',') {
                                advance(',');
                                p.second.push(expression(0));
                            }
                        } else {
                            warn('use_array', token);
                        }
                        advance(')', p);
                        return p;
                    }
                    warn('use_array', token);
                    break;
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Math':
                case 'JSON':
                    warn('not_a_constructor', c);
                    break;
                case 'Function':
                    if (!option.evil) {
                        warn('function_eval');
                    }
                    break;
                case 'Date':
                case 'RegExp':
                case 'this':
                    break;
                default:
                    if (c.id !== 'function') {
                        v = c.string.charAt(0);
                        if (!option.newcap && (v < 'A' || v > 'Z')) {
                            warn('constructor_name_a', token);
                        }
                    }
                }
            } else {
                if (c.id !== '.' && c.id !== '[' && c.id !== '(') {
                    warn('bad_constructor', token);
                }
            }
        } else {
            warn('weird_new', this);
        }
        if (next_token.id !== '(') {
            warn('missing_a', next_token, '()');
        }
        return this;
    });

    infix('(', 160, function (left, that) {
        var p;
        if (indent && indent.mode === 'expression') {
            no_space(prev_token, token);
        } else {
            no_space_only(prev_token, token);
        }
        if (!left.immed && left.id === 'function') {
            warn('wrap_immediate');
        }
        p = [];
        if (left.identifier) {
            if (left.string.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
                if (left.string !== 'Number' && left.string !== 'String' &&
                        left.string !== 'Boolean' && left.string !== 'Date') {
                    if (left.string === 'Math' || left.string === 'JSON') {
                        warn('not_a_function', left);
                    } else if (left.string === 'Object') {
                        warn('use_object', token);
                    } else if (left.string === 'Array' || !option.newcap) {
                        warn('missing_a', left, 'new');
                    }
                }
            }
        } else if (left.id === '.') {
            if (option.safe && left.first.string === 'Math' &&
                    left.second === 'random') {
                warn('adsafe_a', left);
            } else if (left.second.string === 'split' &&
                    left.first.id === '(string)') {
                warn('use_array', left.second);
            }
        }
        step_in();
        if (next_token.id !== ')') {
            no_space();
            for (;;) {
                edge();
                p.push(expression(10));
                if (next_token.id !== ',') {
                    break;
                }
                comma();
            }
        }
        no_space();
        step_out(')', that);
        if (typeof left === 'object') {
            if (left.string === 'parseInt' && p.length === 1) {
                warn('radix', left);
            }
            if (!option.evil) {
                if (left.string === 'eval' || left.string === 'Function' ||
                        left.string === 'execScript') {
                    warn('evil', left);
                } else if (p[0] && p[0].id === '(string)' &&
                        (left.string === 'setTimeout' ||
                        left.string === 'setInterval')) {
                    warn('implied_evil', left);
                }
            }
            if (!left.identifier && left.id !== '.' && left.id !== '[' &&
                    left.id !== '(' && left.id !== '&&' && left.id !== '||' &&
                    left.id !== '?') {
                warn('bad_invocation', left);
            }
        }
        that.first = left;
        that.second = p;
        return that;
    }, true);

    prefix('(', function () {
        step_in('expression');
        no_space();
        edge();
        if (next_token.id === 'function') {
            next_token.immed = true;
        }
        var value = expression(0);
        value.paren = true;
        no_space();
        step_out(')', this);
        if (value.id === 'function') {
            switch (next_token.id) {
            case '(':
                warn('move_invocation');
                break;
            case '.':
            case '[':
                warn('unexpected_a');
                break;
            default:
                warn('bad_wrap', this);
            }
        }
        return value;
    });

    infix('.', 170, function (left, that) {
        no_space(prev_token, token);
        no_space();
        var name = identifier();
        if (typeof name === 'string') {
            tally_property(name);
        }
        that.first = left;
        that.second = token;
        if (left && left.string === 'arguments' &&
                (name === 'callee' || name === 'caller')) {
            warn('avoid_a', left, 'arguments.' + name);
        } else if (!option.evil && left && left.string === 'document' &&
                (name === 'write' || name === 'writeln')) {
            warn('write_is_wrong', left);
        } else if (!option.stupid && name.indexOf('Sync') > 0) {
            warn('sync_a', token);
        } else if (option.adsafe) {
            if (!adsafe_top && left.string === 'ADSAFE') {
                if (name === 'id' || name === 'lib') {
                    warn('adsafe_a', that);
                } else if (name === 'go') {
                    if (xmode !== 'script') {
                        warn('adsafe_a', that);
                    } else if (adsafe_went || next_token.id !== '(' ||
                            peek(0).id !== '(string)' ||
                            peek(0).string !== adsafe_id ||
                            peek(1).id !== ',') {
                        stop('adsafe_a', that, 'go');
                    }
                    adsafe_went = true;
                    adsafe_may = false;
                }
            }
            adsafe_top = false;
        }
        if (!option.evil && (name === 'eval' || name === 'execScript')) {
            warn('evil');
        } else if (option.safe) {
            for (;;) {
                if (banned[name] === true) {
                    warn('adsafe_a', token, name);
                }
                if (typeof predefined[left.string] !== 'boolean' ||    //// check for writeable
                        next_token.id === '(') {
                    break;
                }
                if (next_token.id !== '.') {
                    warn('adsafe_a', that);
                    break;
                }
                advance('.');
                token.first = that;
                token.second = name;
                that = token;
                name = identifier();
                if (typeof name === 'string') {
                    tally_property(name);
                }
            }
        }
        return that;
    }, true);

    infix('[', 170, function (left, that) {
        var e, s;
        no_space_only(prev_token, token);
        no_space();
        step_in();
        edge();
        e = expression(0);
        switch (e.id) {
        case '(number)':
            if (e.id === '(number)' && left.id === 'arguments') {
                warn('use_param', left);
            }
            break;
        case '(string)':
            if (option.safe && (banned[e.string] ||
                    e.string.charAt(0) === '_' || e.string.slice(-1) === '_')) {
                warn('adsafe_subscript_a', e);
            } else if (!option.evil &&
                    (e.string === 'eval' || e.string === 'execScript')) {
                warn('evil', e);
            } else if (!option.sub && ix.test(e.string)) {
                s = syntax[e.string];
                if (!s || !s.reserved) {
                    warn('subscript', e);
                }
            }
            tally_property(e.string);
            break;
        default:
            if (option.safe) {
                if ((e.id !== '+' || e.arity !== 'prefix') &&
                        e.id !== '-' && e.id !== '*') {
                    warn('adsafe_subscript_a', e);
                }
            }
        }
        step_out(']', that);
        no_space(prev_token, token);
        that.first = left;
        that.second = e;
        return that;
    }, true);

    prefix('[', function () {
        this.arity = 'prefix';
        this.first = [];
        step_in('array');
        while (next_token.id !== '(end)') {
            while (next_token.id === ',') {
                warn('unexpected_a', next_token);
                advance(',');
            }
            if (next_token.id === ']') {
                break;
            }
            indent.wrap = false;
            edge();
            this.first.push(expression(10));
            if (next_token.id === ',') {
                comma();
                if (next_token.id === ']' && !option.es5) {
                    warn('unexpected_a', token);
                    break;
                }
            } else {
                break;
            }
        }
        step_out(']', this);
        return this;
    }, 170);


    function property_name() {
        var id = optional_identifier(true);
        if (!id) {
            if (next_token.id === '(string)') {
                id = next_token.string;
                if (option.safe) {
                    if (banned[id]) {
                        warn('adsafe_a');
                    } else if (id.charAt(0) === '_' ||
                            id.charAt(id.length - 1) === '_') {
                        warn('dangling_a');
                    }
                }
                advance();
            } else if (next_token.id === '(number)') {
                id = next_token.number.toString();
                advance();
            }
        }
        return id;
    }


    function function_params() {
        var id, paren = next_token, params = [];
        advance('(');
        step_in();
        no_space();
        if (next_token.id === ')') {
            no_space();
            step_out(')', paren);
            return params;
        }
        for (;;) {
            edge();
            id = identifier();
            params.push(token);
            add_label(token, option.unparam ? 'parameter' : 'unparam');
            if (next_token.id === ',') {
                comma();
            } else {
                no_space();
                step_out(')', paren);
                return params;
            }
        }
    }



    function do_function(func, name) {
        var old_funct      = funct,
            old_option     = option,
            old_scope      = scope;
        funct = {
            '(name)'     : name || '\'' + (anonname || '').replace(nx, sanitize) + '\'',
            '(line)'     : next_token.line,
            '(context)'  : old_funct,
            '(breakage)' : 0,
            '(loopage)'  : 0,
            '(scope)'    : scope,
            '(token)'    : func
        };
        option = Object.create(old_option);
        scope = Object.create(old_scope);
        functions.push(funct);
        func.name = name;
        if (name) {
            add_label(func, 'function', name);
        }
        func.writeable = false;
        func.first = funct['(params)'] = function_params();
        one_space();
        func.block = block(false);
        if (funct['(arguments)']) {
            func.first.forEach(function (value) {
                if (value.assign) {
                    warn('parameter_arguments_a', value, value.string);
                }
            });
        }
        funct      = old_funct;
        option     = old_option;
        scope      = old_scope;
    }


    assignop('=');
    assignop('+=', '+');
    assignop('-=', '-');
    assignop('*=', '*');
    assignop('/=', '/').nud = function () {
        stop('slash_equal');
    };
    assignop('%=', '%');
    assignop('&=', '&');
    assignop('|=', '|');
    assignop('^=', '^');
    assignop('<<=', '<<');
    assignop('>>=', '>>');
    assignop('>>>=', '>>>');


    prefix('{', function () {
        var get, i, j, name, p, set, seen = {};
        this.arity = 'prefix';
        this.first = [];
        step_in();
        while (next_token.id !== '}') {
            indent.wrap = false;

// JSLint recognizes the ES5 extension for get/set in object literals,
// but requires that they be used in pairs.

            edge();
            if (next_token.string === 'get' && peek().id !== ':') {
                if (!option.es5) {
                    warn('es5');
                }
                get = next_token;
                advance('get');
                one_space_only();
                name = next_token;
                i = property_name();
                if (!i) {
                    stop('missing_property');
                }
                get.string = '';
                do_function(get);
                if (funct['(loopage)']) {
                    warn('function_loop', get);
                }
                p = get.first;
                if (p && p.length) {
                    warn('parameter_a_get_b', p[0], p[0].string, i);
                }
                comma();
                set = next_token;
                spaces();
                edge();
                advance('set');
                set.string = '';
                one_space_only();
                j = property_name();
                if (i !== j) {
                    stop('expected_a_b', token, i, j || next_token.string);
                }
                do_function(set);
                if (set.block.length === 0) {
                    warn('missing_a', token, 'throw');
                }
                p = set.first;
                if (!p || p.length !== 1) {
                    stop('parameter_set_a', set, 'value');
                } else if (p[0].string !== 'value') {
                    stop('expected_a_b', p[0], 'value', p[0].string);
                }
                name.first = [get, set];
            } else {
                name = next_token;
                i = property_name();
                if (typeof i !== 'string') {
                    stop('missing_property');
                }
                advance(':');
                spaces();
                name.first = expression(10);
            }
            this.first.push(name);
            if (seen[i] === true) {
                warn('duplicate_a', next_token, i);
            }
            seen[i] = true;
            tally_property(i);
            if (next_token.id !== ',') {
                break;
            }
            for (;;) {
                comma();
                if (next_token.id !== ',') {
                    break;
                }
                warn('unexpected_a', next_token);
            }
            if (next_token.id === '}' && !option.es5) {
                warn('unexpected_a', token);
            }
        }
        step_out('}', this);
        return this;
    });

    stmt('{', function () {
        warn('statement_block');
        this.arity = 'statement';
        this.block = statements();
        this.disrupt = this.block.disrupt;
        advance('}', this);
        return this;
    });

    stmt('/*global', directive);
    stmt('/*globals', directive);
    stmt('/*jslint', directive);
    stmt('/*member', directive);
    stmt('/*members', directive);
    stmt('/*property', directive);
    stmt('/*properties', directive);

    stmt('var', function () {

// JavaScript does not have block scope. It only has function scope. So,
// declaring a variable in a block can have unexpected consequences.

// var.first will contain an array, the array containing name tokens
// and assignment tokens.

        var assign, id, name;

        if (funct['(vars)'] && !option.vars) {
            warn('combine_var');
        } else if (funct !== global_funct) {
            funct['(vars)'] = true;
        }
        this.arity = 'statement';
        this.first = [];
        step_in('var');
        for (;;) {
            name = next_token;
            id = identifier();
            add_label(name, 'becoming');

            if (next_token.id === '=') {
                assign = next_token;
                assign.first = name;
                spaces();
                advance('=');
                spaces();
                if (next_token.id === 'undefined') {
                    warn('unnecessary_initialize', token, id);
                }
                if (peek(0).id === '=' && next_token.identifier) {
                    stop('var_a_not');
                }
                assign.second = expression(0);
                assign.arity = 'infix';
                this.first.push(assign);
            } else {
                this.first.push(name);
            }
            if (funct[id] === 'becoming') {
                funct[id] = 'unused';
            }
            if (next_token.id !== ',') {
                break;
            }
            comma();
            indent.wrap = false;
            if (var_mode && next_token.line === token.line &&
                    this.first.length === 1) {
                var_mode = null;
                indent.open = false;
                indent.at -= option.indent;
            }
            spaces();
            edge();
        }
        var_mode = null;
        step_out();
        return this;
    });

    stmt('function', function () {
        one_space();
        if (in_block) {
            warn('function_block', token);
        }
        var name = next_token, id = identifier();
        add_label(name, 'unction');
        no_space();
        this.arity = 'statement';
        do_function(this, id);
        if (next_token.id === '(' && next_token.line === token.line) {
            stop('function_statement');
        }
        return this;
    });

    prefix('function', function () {
        if (!option.anon) {
            one_space();
        }
        var id = optional_identifier();
        if (id) {
            no_space();
        } else {
            id = '';
        }
        do_function(this, id);
        if (funct['(loopage)']) {
            warn('function_loop');
        }
        switch (next_token.id) {
        case ';':
        case '(':
        case ')':
        case ',':
        case ']':
        case '}':
        case ':':
            break;
        case '.':
            if (peek().string !== 'bind' || peek(1).id !== '(') {
                warn('unexpected_a');
            }
            break;
        default:
            stop('unexpected_a');
        }
        this.arity = 'function';
        return this;
    });

    stmt('if', function () {
        var paren = next_token;
        one_space();
        advance('(');
        step_in('control');
        no_space();
        edge();
        this.arity = 'statement';
        this.first = expected_condition(expected_relation(expression(0)));
        no_space();
        step_out(')', paren);
        one_space();
        this.block = block(true);
        if (next_token.id === 'else') {
            one_space();
            advance('else');
            one_space();
            this['else'] = next_token.id === 'if' || next_token.id === 'switch'
                ? statement(true)
                : block(true);
            if (this['else'].disrupt && this.block.disrupt) {
                this.disrupt = true;
            }
        }
        return this;
    });

    stmt('try', function () {

// try.first    The catch variable
// try.second   The catch clause
// try.third    The finally clause
// try.block    The try block

        var exception_variable, old_scope, paren;
        if (option.adsafe) {
            warn('adsafe_a', this);
        }
        one_space();
        this.arity = 'statement';
        this.block = block(false);
        if (next_token.id === 'catch') {
            one_space();
            advance('catch');
            one_space();
            paren = next_token;
            advance('(');
            step_in('control');
            no_space();
            edge();
            old_scope = scope;
            scope = Object.create(old_scope);
            exception_variable = next_token.string;
            this.first = exception_variable;
            if (!next_token.identifier) {
                warn('expected_identifier_a', next_token);
            } else {
                add_label(next_token, 'exception');
            }
            advance();
            no_space();
            step_out(')', paren);
            one_space();
            this.second = block(false);
            scope = old_scope;
        }
        if (next_token.id === 'finally') {
            one_space();
            advance('finally');
            one_space();
            this.third = block(false);
        } else if (!this.second) {
            stop('expected_a_b', next_token, 'catch', artifact());
        }
        return this;
    });

    labeled_stmt('while', function () {
        one_space();
        var paren = next_token;
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        step_in('control');
        no_space();
        edge();
        this.arity = 'statement';
        this.first = expected_relation(expression(0));
        if (this.first.id !== 'true') {
            expected_condition(this.first, bundle.unexpected_a);
        }
        no_space();
        step_out(')', paren);
        one_space();
        this.block = block(true);
        if (this.block.disrupt) {
            warn('strange_loop', prev_token);
        }
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    reserve('with');

    labeled_stmt('switch', function () {

// switch.first         the switch expression
// switch.second        the array of cases. A case is 'case' or 'default' token:
//    case.first        the array of case expressions
//    case.second       the array of statements
// If all of the arrays of statements are disrupt, then the switch is disrupt.

        var cases = [],
            old_in_block = in_block,
            particular,
            the_case = next_token,
            unbroken = true;

        function find_duplicate_case(value) {
            if (are_similar(particular, value)) {
                warn('duplicate_a', value);
            }
        }

        funct['(breakage)'] += 1;
        one_space();
        advance('(');
        no_space();
        step_in();
        this.arity = 'statement';
        this.first = expected_condition(expected_relation(expression(0)));
        no_space();
        step_out(')', the_case);
        one_space();
        advance('{');
        step_in();
        in_block = true;
        this.second = [];
        while (next_token.id === 'case') {
            the_case = next_token;
            cases.forEach(find_duplicate_case);
            the_case.first = [];
            the_case.arity = 'case';
            spaces();
            edge('case');
            advance('case');
            for (;;) {
                one_space();
                particular = expression(0);
                cases.forEach(find_duplicate_case);
                cases.push(particular);
                the_case.first.push(particular);
                if (particular.id === 'NaN') {
                    warn('unexpected_a', particular);
                }
                no_space_only();
                advance(':');
                if (next_token.id !== 'case') {
                    break;
                }
                spaces();
                edge('case');
                advance('case');
            }
            spaces();
            the_case.second = statements();
            if (the_case.second && the_case.second.length > 0) {
                particular = the_case.second[the_case.second.length - 1];
                if (particular.disrupt) {
                    if (particular.id === 'break') {
                        unbroken = false;
                    }
                } else {
                    warn('missing_a_after_b', next_token, 'break', 'case');
                }
            } else {
                warn('empty_case');
            }
            this.second.push(the_case);
        }
        if (this.second.length === 0) {
            warn('missing_a', next_token, 'case');
        }
        if (next_token.id === 'default') {
            spaces();
            the_case = next_token;
            the_case.arity = 'case';
            edge('case');
            advance('default');
            no_space_only();
            advance(':');
            spaces();
            the_case.second = statements();
            if (the_case.second && the_case.second.length > 0) {
                particular = the_case.second[the_case.second.length - 1];
                if (unbroken && particular.disrupt && particular.id !== 'break') {
                    this.disrupt = true;
                }
            }
            this.second.push(the_case);
        }
        funct['(breakage)'] -= 1;
        spaces();
        step_out('}', this);
        in_block = old_in_block;
        return this;
    });

    stmt('debugger', function () {
        if (!option.debug) {
            warn('unexpected_a', this);
        }
        this.arity = 'statement';
        return this;
    });

    labeled_stmt('do', function () {
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        one_space();
        this.arity = 'statement';
        this.block = block(true);
        if (this.block.disrupt) {
            warn('strange_loop', prev_token);
        }
        one_space();
        advance('while');
        var paren = next_token;
        one_space();
        advance('(');
        step_in();
        no_space();
        edge();
        this.first = expected_condition(expected_relation(expression(0)), bundle.unexpected_a);
        no_space();
        step_out(')', paren);
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    labeled_stmt('for', function () {

        var blok, filter, ok = false, paren = next_token, value;
        this.arity = 'statement';
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        if (next_token.id === ';') {
            no_space();
            advance(';');
            no_space();
            advance(';');
            no_space();
            advance(')');
            blok = block(true);
        } else {
            step_in('control');
            spaces(this, paren);
            no_space();
            if (next_token.id === 'var') {
                stop('move_var');
            }
            edge();
            if (peek(0).id === 'in') {
                this.forin = true;
                value = next_token;
                switch (funct[value.string]) {
                case 'unused':
                    funct[value.string] = 'var';
                    break;
                case 'closure':
                case 'var':
                    break;
                default:
                    warn('bad_in_a', value);
                }
                advance();
                advance('in');
                this.first = value;
                this.second = expression(20);
                step_out(')', paren);
                blok = block(true);
                if (!option.forin) {
                    if (blok.length === 1 && typeof blok[0] === 'object' &&
                            blok[0].string === 'if' && !blok[0]['else']) {
                        filter = blok[0].first;
                        while (filter.id === '&&') {
                            filter = filter.first;
                        }
                        switch (filter.id) {
                        case '===':
                        case '!==':
                            ok = filter.first.id === '['
                                ? filter.first.first.string === this.second.string &&
                                    filter.first.second.string === this.first.string
                                : filter.first.id === 'typeof' &&
                                    filter.first.first.id === '[' &&
                                    filter.first.first.first.string === this.second.string &&
                                    filter.first.first.second.string === this.first.string;
                            break;
                        case '(':
                            ok = filter.first.id === '.' && ((
                                filter.first.first.string === this.second.string &&
                                filter.first.second.string === 'hasOwnProperty' &&
                                filter.second[0].string === this.first.string
                            ) || (
                                filter.first.first.string === 'ADSAFE' &&
                                filter.first.second.string === 'has' &&
                                filter.second[0].string === this.second.string &&
                                filter.second[1].string === this.first.string
                            ) || (
                                filter.first.first.id === '.' &&
                                filter.first.first.first.id === '.' &&
                                filter.first.first.first.first.string === 'Object' &&
                                filter.first.first.first.second.string === 'prototype' &&
                                filter.first.first.second.string === 'hasOwnProperty' &&
                                filter.first.second.string === 'call' &&
                                filter.second[0].string === this.second.string &&
                                filter.second[1].string === this.first.string
                            ));
                            break;
                        }
                    }
                    if (!ok) {
                        warn('for_if', this);
                    }
                }
            } else {
                edge();
                this.first = [];
                for (;;) {
                    this.first.push(expression(0, 'for'));
                    if (next_token.id !== ',') {
                        break;
                    }
                    comma();
                }
                semicolon();
                edge();
                this.second = expected_relation(expression(0));
                if (this.second.id !== 'true') {
                    expected_condition(this.second, bundle.unexpected_a);
                }
                semicolon(token);
                if (next_token.id === ';') {
                    stop('expected_a_b', next_token, ')', ';');
                }
                this.third = [];
                edge();
                for (;;) {
                    this.third.push(expression(0, 'for'));
                    if (next_token.id !== ',') {
                        break;
                    }
                    comma();
                }
                no_space();
                step_out(')', paren);
                one_space();
                blok = block(true);
            }
        }
        if (blok.disrupt) {
            warn('strange_loop', prev_token);
        }
        this.block = blok;
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    disrupt_stmt('break', function () {
        var label = next_token.string;
        this.arity = 'statement';
        if (funct['(breakage)'] === 0) {
            warn('unexpected_a', this);
        }
        if (next_token.identifier && token.line === next_token.line) {
            one_space_only();
            if (funct[label] !== 'label') {
                warn('not_a_label', next_token);
            } else if (scope[label].funct !== funct) {
                warn('not_a_scope', next_token);
            }
            this.first = next_token;
            advance();
        }
        return this;
    });

    disrupt_stmt('continue', function () {
        if (!option['continue']) {
            warn('unexpected_a', this);
        }
        var label = next_token.string;
        this.arity = 'statement';
        if (funct['(breakage)'] === 0) {
            warn('unexpected_a', this);
        }
        if (next_token.identifier && token.line === next_token.line) {
            one_space_only();
            if (funct[label] !== 'label') {
                warn('not_a_label', next_token);
            } else if (scope[label].funct !== funct) {
                warn('not_a_scope', next_token);
            }
            this.first = next_token;
            advance();
        }
        return this;
    });

    disrupt_stmt('return', function () {
        if (funct === global_funct && xmode !== 'scriptstring') {
            warn('unexpected_a', this);
        }
        this.arity = 'statement';
        if (next_token.id !== ';' && next_token.line === token.line) {
            one_space_only();
            if (next_token.id === '/' || next_token.id === '(regexp)') {
                warn('wrap_regexp');
            }
            this.first = expression(20);
        }
        if (peek(0).id === '}' && peek(1).id === 'else') {
            warn('unexpected_else', this);
        }
        return this;
    });

    disrupt_stmt('throw', function () {
        this.arity = 'statement';
        one_space_only();
        this.first = expression(20);
        return this;
    });


//  Superfluous reserved words

    reserve('class');
    reserve('const');
    reserve('enum');
    reserve('export');
    reserve('extends');
    reserve('import');
    reserve('super');

// Harmony reserved words

    reserve('implements');
    reserve('interface');
    reserve('let');
    reserve('package');
    reserve('private');
    reserve('protected');
    reserve('public');
    reserve('static');
    reserve('yield');


// Parse JSON

    function json_value() {

        function json_object() {
            var brace = next_token, object = {};
            advance('{');
            if (next_token.id !== '}') {
                while (next_token.id !== '(end)') {
                    while (next_token.id === ',') {
                        warn('unexpected_a', next_token);
                        advance(',');
                    }
                    if (next_token.id !== '(string)') {
                        warn('expected_string_a');
                    }
                    if (object[next_token.string] === true) {
                        warn('duplicate_a');
                    } else if (next_token.string === '__proto__') {
                        warn('dangling_a');
                    } else {
                        object[next_token.string] = true;
                    }
                    advance();
                    advance(':');
                    json_value();
                    if (next_token.id !== ',') {
                        break;
                    }
                    advance(',');
                    if (next_token.id === '}') {
                        warn('unexpected_a', token);
                        break;
                    }
                }
            }
            advance('}', brace);
        }

        function json_array() {
            var bracket = next_token;
            advance('[');
            if (next_token.id !== ']') {
                while (next_token.id !== '(end)') {
                    while (next_token.id === ',') {
                        warn('unexpected_a', next_token);
                        advance(',');
                    }
                    json_value();
                    if (next_token.id !== ',') {
                        break;
                    }
                    advance(',');
                    if (next_token.id === ']') {
                        warn('unexpected_a', token);
                        break;
                    }
                }
            }
            advance(']', bracket);
        }

        switch (next_token.id) {
        case '{':
            json_object();
            break;
        case '[':
            json_array();
            break;
        case 'true':
        case 'false':
        case 'null':
        case '(number)':
        case '(string)':
            advance();
            break;
        case '-':
            advance('-');
            no_space_only();
            advance('(number)');
            break;
        default:
            stop('unexpected_a');
        }
    }


// CSS parsing.

    function css_name() {
        if (next_token.identifier) {
            advance();
            return true;
        }
    }


    function css_number() {
        if (next_token.id === '-') {
            advance('-');
            no_space_only();
        }
        if (next_token.id === '(number)') {
            advance('(number)');
            return true;
        }
    }


    function css_string() {
        if (next_token.id === '(string)') {
            advance();
            return true;
        }
    }

    function css_color() {
        var i, number, paren, value;
        if (next_token.identifier) {
            value = next_token.string;
            if (value === 'rgb' || value === 'rgba') {
                advance();
                paren = next_token;
                advance('(');
                for (i = 0; i < 3; i += 1) {
                    if (i) {
                        comma();
                    }
                    number = next_token.number;
                    if (next_token.id !== '(number)' || number < 0) {
                        warn('expected_positive_a', next_token);
                        advance();
                    } else {
                        advance();
                        if (next_token.id === '%') {
                            advance('%');
                            if (number > 100) {
                                warn('expected_percent_a', token, number);
                            }
                        } else {
                            if (number > 255) {
                                warn('expected_small_a', token, number);
                            }
                        }
                    }
                }
                if (value === 'rgba') {
                    comma();
                    number = next_token.number;
                    if (next_token.id !== '(number)' || number < 0 || number > 1) {
                        warn('expected_fraction_a', next_token);
                    }
                    advance();
                    if (next_token.id === '%') {
                        warn('unexpected_a');
                        advance('%');
                    }
                }
                advance(')', paren);
                return true;
            }
            if (css_colorData[next_token.string] === true) {
                advance();
                return true;
            }
        } else if (next_token.id === '(color)') {
            advance();
            return true;
        }
        return false;
    }


    function css_length() {
        if (next_token.id === '-') {
            advance('-');
            no_space_only();
        }
        if (next_token.id === '(number)') {
            advance();
            if (next_token.id !== '(string)' &&
                    css_lengthData[next_token.string] === true) {
                no_space_only();
                advance();
            } else if (+token.number !== 0) {
                warn('expected_linear_a');
            }
            return true;
        }
        return false;
    }


    function css_line_height() {
        if (next_token.id === '-') {
            advance('-');
            no_space_only();
        }
        if (next_token.id === '(number)') {
            advance();
            if (next_token.id !== '(string)' &&
                    css_lengthData[next_token.string] === true) {
                no_space_only();
                advance();
            }
            return true;
        }
        return false;
    }


    function css_width() {
        if (next_token.identifier) {
            switch (next_token.string) {
            case 'thin':
            case 'medium':
            case 'thick':
                advance();
                return true;
            }
        } else {
            return css_length();
        }
    }


    function css_margin() {
        if (next_token.identifier) {
            if (next_token.string === 'auto') {
                advance();
                return true;
            }
        } else {
            return css_length();
        }
    }

    function css_attr() {
        if (next_token.identifier && next_token.string === 'attr') {
            advance();
            advance('(');
            if (!next_token.identifier) {
                warn('expected_name_a');
            }
            advance();
            advance(')');
            return true;
        }
        return false;
    }


    function css_comma_list() {
        while (next_token.id !== ';') {
            if (!css_name() && !css_string()) {
                warn('expected_name_a');
            }
            if (next_token.id !== ',') {
                return true;
            }
            comma();
        }
    }


    function css_counter() {
        if (next_token.identifier && next_token.string === 'counter') {
            advance();
            advance('(');
            advance();
            if (next_token.id === ',') {
                comma();
                if (next_token.id !== '(string)') {
                    warn('expected_string_a');
                }
                advance();
            }
            advance(')');
            return true;
        }
        if (next_token.identifier && next_token.string === 'counters') {
            advance();
            advance('(');
            if (!next_token.identifier) {
                warn('expected_name_a');
            }
            advance();
            if (next_token.id === ',') {
                comma();
                if (next_token.id !== '(string)') {
                    warn('expected_string_a');
                }
                advance();
            }
            if (next_token.id === ',') {
                comma();
                if (next_token.id !== '(string)') {
                    warn('expected_string_a');
                }
                advance();
            }
            advance(')');
            return true;
        }
        return false;
    }


    function css_radius() {
        return css_length() && (next_token.id !== '(number)' || css_length());
    }


    function css_shadow() {
        for (;;) {
            if (next_token.string === 'inset') {
                advance();
            }
            for (;;) {
                if (!css_length()) {
                    break;
                }
            }
            css_color();
            if (next_token.id !== ',') {
                break;
            }
            advance(',');
        }
        return true;
    }


    function css_shape() {
        var i;
        if (next_token.identifier && next_token.string === 'rect') {
            advance();
            advance('(');
            for (i = 0; i < 4; i += 1) {
                if (!css_length()) {
                    warn('expected_number_a');
                    break;
                }
            }
            advance(')');
            return true;
        }
        return false;
    }


    function css_url() {
        var c, url;
        if (next_token.identifier && next_token.string === 'url') {
            next_token = lex.range('(', ')');
            url = next_token.string;
            c = url.charAt(0);
            if (c === '"' || c === '\'') {
                if (url.slice(-1) !== c) {
                    warn('bad_url_a');
                } else {
                    url = url.slice(1, -1);
                    if (url.indexOf(c) >= 0) {
                        warn('bad_url_a');
                    }
                }
            }
            if (!url) {
                warn('missing_url');
            }
            if (ux.test(url)) {
                stop('bad_url_a');
            }
            urls.push(url);
            advance();
            return true;
        }
        return false;
    }


    css_any = [css_url, function () {
        for (;;) {
            if (next_token.identifier) {
                switch (next_token.string.toLowerCase()) {
                case 'url':
                    css_url();
                    break;
                case 'expression':
                    warn('unexpected_a');
                    advance();
                    break;
                default:
                    advance();
                }
            } else {
                if (next_token.id === ';' || next_token.id === '!'  ||
                        next_token.id === '(end)' || next_token.id === '}') {
                    return true;
                }
                advance();
            }
        }
    }];


    function font_face() {
        advance_identifier('font-family');
        advance(':');
        if (!css_name() && !css_string()) {
            stop('expected_name_a');
        }
        semicolon();
        advance_identifier('src');
        advance(':');
        while (true) {
            if (next_token.string === 'local') {
                advance_identifier('local');
                advance('(');
                if (ux.test(next_token.string)) {
                    stop('bad_url_a');
                }

                if (!css_name() && !css_string()) {
                    stop('expected_name_a');
                }
                advance(')');
            } else if (!css_url()) {
                stop('expected_a_b', next_token, 'url', artifact());
            }
            if (next_token.id !== ',') {
                break;
            }
            comma();
        }
        semicolon();
    }


    css_border_style = [
        'none', 'dashed', 'dotted', 'double', 'groove',
        'hidden', 'inset', 'outset', 'ridge', 'solid'
    ];

    css_break = [
        'auto', 'always', 'avoid', 'left', 'right'
    ];

    css_media = {
        'all': true,
        'braille': true,
        'embossed': true,
        'handheld': true,
        'print': true,
        'projection': true,
        'screen': true,
        'speech': true,
        'tty': true,
        'tv': true
    };

    css_overflow = [
        'auto', 'hidden', 'scroll', 'visible'
    ];

    css_attribute_data = {
        background: [
            true, 'background-attachment', 'background-color',
            'background-image', 'background-position', 'background-repeat'
        ],
        'background-attachment': ['scroll', 'fixed'],
        'background-color': ['transparent', css_color],
        'background-image': ['none', css_url],
        'background-position': [
            2, [css_length, 'top', 'bottom', 'left', 'right', 'center']
        ],
        'background-repeat': [
            'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
        ],
        'border': [true, 'border-color', 'border-style', 'border-width'],
        'border-bottom': [
            true, 'border-bottom-color', 'border-bottom-style',
            'border-bottom-width'
        ],
        'border-bottom-color': css_color,
        'border-bottom-left-radius': css_radius,
        'border-bottom-right-radius': css_radius,
        'border-bottom-style': css_border_style,
        'border-bottom-width': css_width,
        'border-collapse': ['collapse', 'separate'],
        'border-color': ['transparent', 4, css_color],
        'border-left': [
            true, 'border-left-color', 'border-left-style', 'border-left-width'
        ],
        'border-left-color': css_color,
        'border-left-style': css_border_style,
        'border-left-width': css_width,
        'border-radius': function () {
            function count(separator) {
                var n = 1;
                if (separator) {
                    advance(separator);
                }
                if (!css_length()) {
                    return false;
                }
                while (next_token.id === '(number)') {
                    if (!css_length()) {
                        return false;
                    }
                    n += 1;
                }
                if (n > 4) {
                    warn('bad_style');
                }
                return true;
            }

            return count() && (next_token.id !== '/' || count('/'));
        },
        'border-right': [
            true, 'border-right-color', 'border-right-style',
            'border-right-width'
        ],
        'border-right-color': css_color,
        'border-right-style': css_border_style,
        'border-right-width': css_width,
        'border-spacing': [2, css_length],
        'border-style': [4, css_border_style],
        'border-top': [
            true, 'border-top-color', 'border-top-style', 'border-top-width'
        ],
        'border-top-color': css_color,
        'border-top-left-radius': css_radius,
        'border-top-right-radius': css_radius,
        'border-top-style': css_border_style,
        'border-top-width': css_width,
        'border-width': [4, css_width],
        bottom: [css_length, 'auto'],
        'box-shadow': ['none', css_shadow],
        'caption-side' : ['bottom', 'left', 'right', 'top'],
        clear: ['both', 'left', 'none', 'right'],
        clip: [css_shape, 'auto'],
        color: css_color,
        content: [
            'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote',
            css_string, css_url, css_counter, css_attr
        ],
        'counter-increment': [
            css_name, 'none'
        ],
        'counter-reset': [
            css_name, 'none'
        ],
        cursor: [
            css_url, 'auto', 'crosshair', 'default', 'e-resize', 'help', 'move',
            'n-resize', 'ne-resize', 'nw-resize', 'pointer', 's-resize',
            'se-resize', 'sw-resize', 'w-resize', 'text', 'wait'
        ],
        direction: ['ltr', 'rtl'],
        display: [
            'block', 'compact', 'inline', 'inline-block', 'inline-table',
            'list-item', 'marker', 'none', 'run-in', 'table', 'table-caption',
            'table-cell', 'table-column', 'table-column-group',
            'table-footer-group', 'table-header-group', 'table-row',
            'table-row-group'
        ],
        'empty-cells': ['show', 'hide'],
        'float': ['left', 'none', 'right'],
        font: [
            'caption', 'icon', 'menu', 'message-box', 'small-caption',
            'status-bar', true, 'font-size', 'font-style', 'font-weight',
            'font-family'
        ],
        'font-family': css_comma_list,
        'font-size': [
            'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large',
            'xx-large', 'larger', 'smaller', css_length
        ],
        'font-size-adjust': ['none', css_number],
        'font-stretch': [
            'normal', 'wider', 'narrower', 'ultra-condensed',
            'extra-condensed', 'condensed', 'semi-condensed',
            'semi-expanded', 'expanded', 'extra-expanded'
        ],
        'font-style': [
            'normal', 'italic', 'oblique'
        ],
        'font-variant': [
            'normal', 'small-caps'
        ],
        'font-weight': [
            'normal', 'bold', 'bolder', 'lighter', css_number
        ],
        height: [css_length, 'auto'],
        left: [css_length, 'auto'],
        'letter-spacing': ['normal', css_length],
        'line-height': ['normal', css_line_height],
        'list-style': [
            true, 'list-style-image', 'list-style-position', 'list-style-type'
        ],
        'list-style-image': ['none', css_url],
        'list-style-position': ['inside', 'outside'],
        'list-style-type': [
            'circle', 'disc', 'square', 'decimal', 'decimal-leading-zero',
            'lower-roman', 'upper-roman', 'lower-greek', 'lower-alpha',
            'lower-latin', 'upper-alpha', 'upper-latin', 'hebrew', 'katakana',
            'hiragana-iroha', 'katakana-oroha', 'none'
        ],
        margin: [4, css_margin],
        'margin-bottom': css_margin,
        'margin-left': css_margin,
        'margin-right': css_margin,
        'margin-top': css_margin,
        'marker-offset': [css_length, 'auto'],
        'max-height': [css_length, 'none'],
        'max-width': [css_length, 'none'],
        'min-height': css_length,
        'min-width': css_length,
        opacity: css_number,
        outline: [true, 'outline-color', 'outline-style', 'outline-width'],
        'outline-color': ['invert', css_color],
        'outline-style': [
            'dashed', 'dotted', 'double', 'groove', 'inset', 'none',
            'outset', 'ridge', 'solid'
        ],
        'outline-width': css_width,
        overflow: css_overflow,
        'overflow-x': css_overflow,
        'overflow-y': css_overflow,
        padding: [4, css_length],
        'padding-bottom': css_length,
        'padding-left': css_length,
        'padding-right': css_length,
        'padding-top': css_length,
        'page-break-after': css_break,
        'page-break-before': css_break,
        position: ['absolute', 'fixed', 'relative', 'static'],
        quotes: [8, css_string],
        right: [css_length, 'auto'],
        'table-layout': ['auto', 'fixed'],
        'text-align': ['center', 'justify', 'left', 'right'],
        'text-decoration': [
            'none', 'underline', 'overline', 'line-through', 'blink'
        ],
        'text-indent': css_length,
        'text-shadow': ['none', 4, [css_color, css_length]],
        'text-transform': ['capitalize', 'uppercase', 'lowercase', 'none'],
        top: [css_length, 'auto'],
        'unicode-bidi': ['normal', 'embed', 'bidi-override'],
        'vertical-align': [
            'baseline', 'bottom', 'sub', 'super', 'top', 'text-top', 'middle',
            'text-bottom', css_length
        ],
        visibility: ['visible', 'hidden', 'collapse'],
        'white-space': [
            'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'inherit'
        ],
        width: [css_length, 'auto'],
        'word-spacing': ['normal', css_length],
        'word-wrap': ['break-word', 'normal'],
        'z-index': ['auto', css_number]
    };

    function style_attribute() {
        var v;
        while (next_token.id === '*' || next_token.id === '#' ||
                next_token.string === '_') {
            if (!option.css) {
                warn('unexpected_a');
            }
            advance();
        }
        if (next_token.id === '-') {
            if (!option.css) {
                warn('unexpected_a');
            }
            advance('-');
            if (!next_token.identifier) {
                warn('expected_nonstandard_style_attribute');
            }
            advance();
            return css_any;
        }
        if (!next_token.identifier) {
            warn('expected_style_attribute');
        } else {
            if (Object.prototype.hasOwnProperty.call(css_attribute_data,
                    next_token.string)) {
                v = css_attribute_data[next_token.string];
            } else {
                v = css_any;
                if (!option.css) {
                    warn('unrecognized_style_attribute_a');
                }
            }
        }
        advance();
        return v;
    }


    function style_value(v) {
        var i = 0,
            n,
            once,
            match,
            round,
            start = 0,
            vi;
        switch (typeof v) {
        case 'function':
            return v();
        case 'string':
            if (next_token.identifier && next_token.string === v) {
                advance();
                return true;
            }
            return false;
        }
        for (;;) {
            if (i >= v.length) {
                return false;
            }
            vi = v[i];
            i += 1;
            if (typeof vi === 'boolean') {
                break;
            } else if (typeof vi === 'number') {
                n = vi;
                vi = v[i];
                i += 1;
            } else {
                n = 1;
            }
            match = false;
            while (n > 0) {
                if (style_value(vi)) {
                    match = true;
                    n -= 1;
                } else {
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        start = i;
        once = [];
        for (;;) {
            round = false;
            for (i = start; i < v.length; i += 1) {
                if (!once[i]) {
                    if (style_value(css_attribute_data[v[i]])) {
                        match = true;
                        round = true;
                        once[i] = true;
                        break;
                    }
                }
            }
            if (!round) {
                return match;
            }
        }
    }

    function style_child() {
        if (next_token.id === '(number)') {
            advance();
            if (next_token.string === 'n' && next_token.identifier) {
                no_space_only();
                advance();
                if (next_token.id === '+') {
                    no_space_only();
                    advance('+');
                    no_space_only();
                    advance('(number)');
                }
            }
            return;
        }
        if (next_token.identifier &&
                (next_token.string === 'odd' || next_token.string === 'even')) {
            advance();
            return;
        }
        warn('unexpected_a');
    }

    function substyle() {
        var v;
        for (;;) {
            if (next_token.id === '}' || next_token.id === '(end)' ||
                    (xquote && next_token.id === xquote)) {
                return;
            }
            v = style_attribute();
            advance(':');
            if (next_token.identifier && next_token.string === 'inherit') {
                advance();
            } else {
                if (!style_value(v)) {
                    warn('unexpected_a');
                    advance();
                }
            }
            if (next_token.id === '!') {
                advance('!');
                no_space_only();
                if (next_token.identifier && next_token.string === 'important') {
                    advance();
                } else {
                    warn('expected_a_b',
                        next_token, 'important', artifact());
                }
            }
            if (next_token.id === '}' || next_token.id === xquote) {
                warn('expected_a_b', next_token, ';', artifact());
            } else {
                semicolon();
            }
        }
    }

    function style_selector() {
        if (next_token.identifier) {
            if (!Object.prototype.hasOwnProperty.call(html_tag, option.cap
                    ? next_token.string.toLowerCase()
                    : next_token.string)) {
                warn('expected_tagname_a');
            }
            advance();
        } else {
            switch (next_token.id) {
            case '>':
            case '+':
                advance();
                style_selector();
                break;
            case ':':
                advance(':');
                switch (next_token.string) {
                case 'active':
                case 'after':
                case 'before':
                case 'checked':
                case 'disabled':
                case 'empty':
                case 'enabled':
                case 'first-child':
                case 'first-letter':
                case 'first-line':
                case 'first-of-type':
                case 'focus':
                case 'hover':
                case 'last-child':
                case 'last-of-type':
                case 'link':
                case 'only-of-type':
                case 'root':
                case 'target':
                case 'visited':
                    advance_identifier(next_token.string);
                    break;
                case 'lang':
                    advance_identifier('lang');
                    advance('(');
                    if (!next_token.identifier) {
                        warn('expected_lang_a');
                    }
                    advance(')');
                    break;
                case 'nth-child':
                case 'nth-last-child':
                case 'nth-last-of-type':
                case 'nth-of-type':
                    advance_identifier(next_token.string);
                    advance('(');
                    style_child();
                    advance(')');
                    break;
                case 'not':
                    advance_identifier('not');
                    advance('(');
                    if (next_token.id === ':' && peek(0).string === 'not') {
                        warn('not');
                    }
                    style_selector();
                    advance(')');
                    break;
                default:
                    warn('expected_pseudo_a');
                }
                break;
            case '#':
                advance('#');
                if (!next_token.identifier) {
                    warn('expected_id_a');
                }
                advance();
                break;
            case '*':
                advance('*');
                break;
            case '.':
                advance('.');
                if (!next_token.identifier) {
                    warn('expected_class_a');
                }
                advance();
                break;
            case '[':
                advance('[');
                if (!next_token.identifier) {
                    warn('expected_attribute_a');
                }
                advance();
                if (next_token.id === '=' || next_token.string === '~=' ||
                        next_token.string === '$=' ||
                        next_token.string === '|=' ||
                        next_token.id === '*=' ||
                        next_token.id === '^=') {
                    advance();
                    if (next_token.id !== '(string)') {
                        warn('expected_string_a');
                    }
                    advance();
                }
                advance(']');
                break;
            default:
                stop('expected_selector_a');
            }
        }
    }

    function style_pattern() {
        if (next_token.id === '{') {
            warn('expected_style_pattern');
        }
        for (;;) {
            style_selector();
            if (next_token.id === '</' || next_token.id === '{' ||
                    next_token.id === '}' || next_token.id === '(end)') {
                return '';
            }
            if (next_token.id === ',') {
                comma();
            }
        }
    }

    function style_list() {
        while (next_token.id !== '}' && next_token.id !== '</' &&
                next_token.id !== '(end)') {
            style_pattern();
            xmode = 'styleproperty';
            if (next_token.id === ';') {
                semicolon();
            } else {
                advance('{');
                substyle();
                xmode = 'style';
                advance('}');
            }
        }
    }

    function styles() {
        var i;
        while (next_token.id === '@') {
            i = peek();
            advance('@');
            switch (next_token.string) {
            case 'import':
                advance_identifier('import');
                if (!css_url()) {
                    warn('expected_a_b',
                        next_token, 'url', artifact());
                    advance();
                }
                semicolon();
                break;
            case 'media':
                advance_identifier('media');
                for (;;) {
                    if (!next_token.identifier || css_media[next_token.string] !== true) {
                        stop('expected_media_a');
                    }
                    advance();
                    if (next_token.id !== ',') {
                        break;
                    }
                    comma();
                }
                advance('{');
                style_list();
                advance('}');
                break;
            case 'font-face':
                advance_identifier('font-face');
                advance('{');
                font_face();
                advance('}');
                break;
            default:
                stop('expected_at_a');
            }
        }
        style_list();
    }


// Parse HTML

    function do_begin(n) {
        if (n !== 'html' && !option.fragment) {
            if (n === 'div' && option.adsafe) {
                stop('adsafe_fragment');
            } else {
                stop('expected_a_b', token, 'html', n);
            }
        }
        if (option.adsafe) {
            if (n === 'html') {
                stop('adsafe_html', token);
            }
            if (option.fragment) {
                if (n !== 'div') {
                    stop('adsafe_div', token);
                }
            } else {
                stop('adsafe_fragment', token);
            }
        }
        option.browser = true;
    }

    function do_attribute(a, v) {
        var u, x;
        if (a === 'id') {
            u = typeof v === 'string' ? v.toUpperCase() : '';
            if (ids[u] === true) {
                warn('duplicate_a', next_token, v);
            }
            if (!/^[A-Za-z][A-Za-z0-9._:\-]*$/.test(v)) {
                warn('bad_id_a', next_token, v);
            } else if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warn('adsafe_prefix_a', next_token, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warn('adsafe_bad_id');
                    }
                } else {
                    adsafe_id = v;
                    if (!/^[A-Z]+_$/.test(v)) {
                        warn('adsafe_bad_id');
                    }
                }
            }
            x = v.search(dx);
            if (x >= 0) {
                warn('unexpected_char_a_b', token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'class' || a === 'type' || a === 'name') {
            x = v.search(qx);
            if (x >= 0) {
                warn('unexpected_char_a_b', token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'href' || a === 'background' ||
                a === 'content' || a === 'data' ||
                a.indexOf('src') >= 0 || a.indexOf('url') >= 0) {
            if (option.safe && ux.test(v)) {
                stop('bad_url_a', next_token, v);
            }
            urls.push(v);
        } else if (a === 'for') {
            if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warn('adsafe_prefix_a', next_token, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warn('adsafe_bad_id');
                    }
                } else {
                    warn('adsafe_bad_id');
                }
            }
        } else if (a === 'name') {
            if (option.adsafe && v.indexOf('_') >= 0) {
                warn('adsafe_name_a', next_token, v);
            }
        }
    }

    function do_tag(name, attribute) {
        var i, tag = html_tag[name], script, x;
        src = false;
        if (!tag) {
            stop(
                bundle.unrecognized_tag_a,
                next_token,
                name === name.toLowerCase()
                    ? name
                    : name + ' (capitalization error)'
            );
        }
        if (stack.length > 0) {
            if (name === 'html') {
                stop('unexpected_a', token, name);
            }
            x = tag.parent;
            if (x) {
                if (x.indexOf(' ' + stack[stack.length - 1].name + ' ') < 0) {
                    stop('tag_a_in_b', token, name, x);
                }
            } else if (!option.adsafe && !option.fragment) {
                i = stack.length;
                do {
                    if (i <= 0) {
                        stop('tag_a_in_b', token, name, 'body');
                    }
                    i -= 1;
                } while (stack[i].name !== 'body');
            }
        }
        switch (name) {
        case 'div':
            if (option.adsafe && stack.length === 1 && !adsafe_id) {
                warn('adsafe_missing_id');
            }
            break;
        case 'script':
            xmode = 'script';
            advance('>');
            if (attribute.lang) {
                warn('lang', token);
            }
            if (option.adsafe && stack.length !== 1) {
                warn('adsafe_placement', token);
            }
            if (attribute.src) {
                if (option.adsafe && (!adsafe_may || !approved[attribute.src])) {
                    warn('adsafe_source', token);
                }
            } else {
                step_in(next_token.from);
                edge();
                use_strict();
                adsafe_top = true;
                script = statements();

// JSLint is also the static analyzer for ADsafe. See www.ADsafe.org.

                if (option.adsafe) {
                    if (adsafe_went) {
                        stop('adsafe_script', token);
                    }
                    if (script.length !== 1 ||
                            aint(script[0],             'id',     '(') ||
                            aint(script[0].first,       'id',     '.') ||
                            aint(script[0].first.first, 'string', 'ADSAFE') ||
                            aint(script[0].second[0],   'string', adsafe_id)) {
                        stop('adsafe_id_go');
                    }
                    switch (script[0].first.second.string) {
                    case 'id':
                        if (adsafe_may || adsafe_went ||
                                script[0].second.length !== 1) {
                            stop('adsafe_id', next_token);
                        }
                        adsafe_may = true;
                        break;
                    case 'go':
                        if (adsafe_went) {
                            stop('adsafe_go');
                        }
                        if (script[0].second.length !== 2 ||
                                aint(script[0].second[1], 'id', 'function') ||
                                !script[0].second[1].first ||
                                aint(script[0].second[1].first[0], 'string', 'dom') ||
                                script[0].second[1].first.length > 2 ||
                                (script[0].second[1].first.length === 2 &&
                                aint(script[0].second[1].first[1], 'string', 'lib'))) {
                            stop('adsafe_go', next_token);
                        }
                        adsafe_went = true;
                        break;
                    default:
                        stop('adsafe_id_go');
                    }
                }
                indent = null;
            }
            xmode = 'html';
            advance('</');
            advance_identifier('script');
            xmode = 'outer';
            break;
        case 'style':
            xmode = 'style';
            advance('>');
            styles();
            xmode = 'html';
            advance('</');
            advance_identifier('style');
            break;
        case 'input':
            switch (attribute.type) {
            case 'button':
            case 'checkbox':
            case 'radio':
            case 'reset':
            case 'submit':
                break;
            case 'file':
            case 'hidden':
            case 'image':
            case 'password':
            case 'text':
                if (option.adsafe && attribute.autocomplete !== 'off') {
                    warn('adsafe_autocomplete');
                }
                break;
            default:
                warn('bad_type');
            }
            break;
        case 'applet':
        case 'body':
        case 'embed':
        case 'frame':
        case 'frameset':
        case 'head':
        case 'iframe':
        case 'noembed':
        case 'noframes':
        case 'object':
        case 'param':
            if (option.adsafe) {
                warn('adsafe_tag', next_token, name);
            }
            break;
        }
    }


    function closetag(name) {
        return '</' + name + '>';
    }

    function html() {
        var attribute, attributes, is_empty, name, old_white = option.white,
            quote, tag_name, tag, wmode;
        xmode = 'html';
        xquote = '';
        stack = null;
        for (;;) {
            switch (next_token.string) {
            case '<':
                xmode = 'html';
                advance('<');
                attributes = {};
                tag_name = next_token;
                name = tag_name.string;
                advance_identifier(name);
                if (option.cap) {
                    name = name.toLowerCase();
                }
                tag_name.name = name;
                if (!stack) {
                    stack = [];
                    do_begin(name);
                }
                tag = html_tag[name];
                if (typeof tag !== 'object') {
                    stop('unrecognized_tag_a', tag_name, name);
                }
                is_empty = tag.empty;
                tag_name.type = name;
                for (;;) {
                    if (next_token.id === '/') {
                        advance('/');
                        if (next_token.id !== '>') {
                            warn('expected_a_b', next_token, '>', artifact());
                        }
                        break;
                    }
                    if (next_token.id && next_token.id.charAt(0) === '>') {
                        break;
                    }
                    if (!next_token.identifier) {
                        if (next_token.id === '(end)' || next_token.id === '(error)') {
                            warn('expected_a_b', next_token, '>', artifact());
                        }
                        warn('bad_name_a');
                    }
                    option.white = false;
                    spaces();
                    attribute = next_token.string;
                    option.white = old_white;
                    advance();
                    if (!option.cap && attribute !== attribute.toLowerCase()) {
                        warn('attribute_case_a', token);
                    }
                    attribute = attribute.toLowerCase();
                    xquote = '';
                    if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
                        warn('duplicate_a', token, attribute);
                    }
                    if (attribute.slice(0, 2) === 'on') {
                        if (!option.on) {
                            warn('html_handlers');
                        }
                        xmode = 'scriptstring';
                        advance('=');
                        quote = next_token.id;
                        if (quote !== '"' && quote !== '\'') {
                            stop('expected_a_b', next_token, '"', artifact());
                        }
                        xquote = quote;
                        wmode = option.white;
                        option.white = true;
                        advance(quote);
                        use_strict();
                        statements();
                        option.white = wmode;
                        if (next_token.id !== quote) {
                            stop('expected_a_b', next_token, quote, artifact());
                        }
                        xmode = 'html';
                        xquote = '';
                        advance(quote);
                        tag = false;
                    } else if (attribute === 'style') {
                        xmode = 'scriptstring';
                        advance('=');
                        quote = next_token.id;
                        if (quote !== '"' && quote !== '\'') {
                            stop('expected_a_b', next_token, '"', artifact());
                        }
                        xmode = 'styleproperty';
                        xquote = quote;
                        advance(quote);
                        substyle();
                        xmode = 'html';
                        xquote = '';
                        advance(quote);
                        tag = false;
                    } else {
                        if (next_token.id === '=') {
                            advance('=');
                            tag = next_token.string;
                            if (!next_token.identifier &&
                                    next_token.id !== '"' &&
                                    next_token.id !== '\'' &&
                                    next_token.id !== '(string)' &&
                                    next_token.id !== '(number)' &&
                                    next_token.id !== '(color)') {
                                warn('expected_attribute_value_a', token, attribute);
                            }
                            advance();
                        } else {
                            tag = true;
                        }
                    }
                    attributes[attribute] = tag;
                    do_attribute(attribute, tag);
                }
                do_tag(name, attributes);
                if (!is_empty) {
                    stack.push(tag_name);
                }
                xmode = 'outer';
                advance('>');
                break;
            case '</':
                xmode = 'html';
                advance('</');
                if (!next_token.identifier) {
                    warn('bad_name_a');
                }
                name = next_token.string;
                if (option.cap) {
                    name = name.toLowerCase();
                }
                advance();
                if (!stack) {
                    stop('unexpected_a', next_token, closetag(name));
                }
                tag_name = stack.pop();
                if (!tag_name) {
                    stop('unexpected_a', next_token, closetag(name));
                }
                if (tag_name.name !== name) {
                    stop('expected_a_b',
                        next_token, closetag(tag_name.name), closetag(name));
                }
                if (next_token.id !== '>') {
                    stop('expected_a_b', next_token, '>', artifact());
                }
                xmode = 'outer';
                advance('>');
                break;
            case '<!':
                if (option.safe) {
                    warn('adsafe_a');
                }
                xmode = 'html';
                for (;;) {
                    advance();
                    if (next_token.id === '>' || next_token.id === '(end)') {
                        break;
                    }
                    if (next_token.string.indexOf('--') >= 0) {
                        stop('unexpected_a', next_token, '--');
                    }
                    if (next_token.string.indexOf('<') >= 0) {
                        stop('unexpected_a', next_token, '<');
                    }
                    if (next_token.string.indexOf('>') >= 0) {
                        stop('unexpected_a', next_token, '>');
                    }
                }
                xmode = 'outer';
                advance('>');
                break;
            case '(end)':
                if (stack.length !== 0) {
                    warn('missing_a', next_token, '</' + stack.pop().string + '>');
                }
                return;
            default:
                if (next_token.id === '(end)') {
                    stop('missing_a', next_token,
                        '</' + stack[stack.length - 1].string + '>');
                } else {
                    advance();
                }
            }
            if (stack && stack.length === 0 && (option.adsafe ||
                    !option.fragment || next_token.id === '(end)')) {
                break;
            }
        }
        if (next_token.id !== '(end)') {
            stop('unexpected_a');
        }
    }


// The actual JSLINT function itself.

    itself = function JSLint(the_source, the_option) {

        var i, predef, tree;
        JSLINT.errors = [];
        JSLINT.tree = '';
        JSLINT.properties = '';
        begin = prev_token = token = next_token =
            Object.create(syntax['(begin)']);
        predefined = {};
        add_to_predefined(standard);
        property = {};
        if (the_option) {
            option = Object.create(the_option);
            predef = option.predef;
            if (predef) {
                if (Array.isArray(predef)) {
                    for (i = 0; i < predef.length; i += 1) {
                        predefined[predef[i]] = true;
                    }
                } else if (typeof predef === 'object') {
                    add_to_predefined(predef);
                }
            }
            do_safe();
        } else {
            option = {};
        }
        option.indent = +option.indent || 4;
        option.maxerr = +option.maxerr || 50;
        adsafe_id = '';
        adsafe_may = adsafe_top = adsafe_went = false;
        approved = {};
        if (option.approved) {
            for (i = 0; i < option.approved.length; i += 1) {
                approved[option.approved[i]] = option.approved[i];
            }
        } else {
            approved.test = 'test';
        }
        tab = '';
        for (i = 0; i < option.indent; i += 1) {
            tab += ' ';
        }
        global_scope = scope = {};
        global_funct = funct = {
            '(scope)': scope,
            '(breakage)': 0,
            '(loopage)': 0
        };
        functions = [funct];

        comments_off = false;
        ids = {};
        in_block = false;
        indent = null;
        json_mode = false;
        lookahead = [];
        node_js = false;
        prereg = true;
        src = false;
        stack = null;
        strict_mode = false;
        urls = [];
        var_mode = null;
        warnings = 0;
        xmode = '';
        lex.init(the_source);

        assume();

        try {
            advance();
            if (next_token.id === '(number)') {
                stop('unexpected_a');
            } else if (next_token.string.charAt(0) === '<') {
                html();
                if (option.adsafe && !adsafe_went) {
                    warn('adsafe_go', this);
                }
            } else {
                switch (next_token.id) {
                case '{':
                case '[':
                    json_mode = true;
                    json_value();
                    break;
                case '@':
                case '*':
                case '#':
                case '.':
                case ':':
                    xmode = 'style';
                    advance();
                    if (token.id !== '@' || !next_token.identifier ||
                            next_token.string !== 'charset' || token.line !== 1 ||
                            token.from !== 1) {
                        stop('css');
                    }
                    advance();
                    if (next_token.id !== '(string)' &&
                            next_token.string !== 'UTF-8') {
                        stop('css');
                    }
                    advance();
                    semicolon();
                    styles();
                    break;

                default:
                    if (option.adsafe && option.fragment) {
                        stop('expected_a_b',
                            next_token, '<div>', artifact());
                    }

// If the first token is a semicolon, ignore it. This is sometimes used when
// files are intended to be appended to files that may be sloppy. A sloppy
// file may be depending on semicolon insertion on its last line.

                    step_in(1);
                    if (next_token.id === ';' && !node_js) {
                        semicolon();
                    }
                    adsafe_top = true;
                    tree = statements();
                    begin.first = tree;
                    itself.tree = begin;
                    if (option.adsafe && (tree.length !== 1 ||
                            aint(tree[0], 'id', '(') ||
                            aint(tree[0].first, 'id', '.') ||
                            aint(tree[0].first.first, 'string', 'ADSAFE') ||
                            aint(tree[0].first.second, 'string', 'lib') ||
                            tree[0].second.length !== 2 ||
                            tree[0].second[0].id !== '(string)' ||
                            aint(tree[0].second[1], 'id', 'function'))) {
                        stop('adsafe_lib');
                    }
                    if (tree.disrupt) {
                        warn('weird_program', prev_token);
                    }
                }
            }
            indent = null;
            advance('(end)');
            itself.property = property;
        } catch (e) {
            if (e) {        // ~~
                JSLINT.errors.push({
                    reason    : e.message,
                    line      : e.line || next_token.line,
                    character : e.character || next_token.from
                }, null);
            }
        }
        return JSLINT.errors.length === 0;
    };


// Data summary.

    itself.data = function () {
        var data = {functions: []},
            function_data,
            globals,
            i,
            j,
            kind,
            name,
            the_function,
            undef = [],
            unused = [];
        if (itself.errors.length) {
            data.errors = itself.errors;
        }

        if (json_mode) {
            data.json = true;
        }

        if (urls.length > 0) {
            data.urls = urls;
        }

        globals = Object.keys(global_scope).filter(function (value) {
            return value.charAt(0) !== '(' && typeof standard[value] !== 'boolean';
        });
        if (globals.length > 0) {
            data.globals = globals;
        }

        for (i = 1; i < functions.length; i += 1) {
            the_function = functions[i];
            function_data = {};
            for (j = 0; j < functionicity.length; j += 1) {
                function_data[functionicity[j]] = [];
            }
            for (name in the_function) {
                if (Object.prototype.hasOwnProperty.call(the_function, name)) {
                    if (name.charAt(0) !== '(') {
                        kind = the_function[name];
                        if (kind === 'unction' || kind === 'unparam') {
                            kind = 'unused';
                        }
                        if (Array.isArray(function_data[kind])) {
                            function_data[kind].push(name);
                            if (kind === 'unused') {
                                unused.push({
                                    name: name,
                                    line: the_function['(line)'],
                                    'function': the_function['(name)']
                                });
                            } else if (kind === 'undef') {
                                undef.push({
                                    name: name,
                                    line: the_function['(line)'],
                                    'function': the_function['(name)']
                                });
                            }
                        }
                    }
                }
            }
            for (j = 0; j < functionicity.length; j += 1) {
                if (function_data[functionicity[j]].length === 0) {
                    delete function_data[functionicity[j]];
                }
            }
            function_data.name = the_function['(name)'];
            function_data.params = the_function['(params)'];
            function_data.line = the_function['(line)'];
            data.functions.push(function_data);
        }

        if (unused.length > 0) {
            data.unused = unused;
        }
        if (undef.length > 0) {
            data['undefined'] = undef;
        }
        return data;
    };

    itself.error_report = function (data) {
        var evidence, i, output = [], snippets, warning;
        if (data.errors) {
            for (i = 0; i < data.errors.length; i += 1) {
                warning = data.errors[i];
                if (warning) {
                    evidence = warning.evidence || '';
                    output.push('<cite>');
                    if (isFinite(warning.line)) {
                        output.push('<address>line ' +
                            String(warning.line) +
                            ' character ' + String(warning.character) +
                            '</address>');
                    }
                    output.push(warning.reason.entityify() + '</cite>');
                    if (evidence) {
                        output.push('<pre>' + evidence.entityify() + '</pre>');
                    }
                }
            }
        }
        if (data.unused || data['undefined']) {
            output.push('<dl>');
            if (data['undefined']) {
                output.push('<dt>undefined</dt><dd>');
                snippets = [];
                for (i = 0; i < data['undefined'].length; i += 1) {
                    snippets[i] = '<code>' + data['undefined'][i].name +
                        '</code>&nbsp;<address>' +
                        data['undefined'][i]['function']  + ' ' +
                        String(data['undefined'][i].line) + '</address>';
                }
                output.push(snippets.join(', '));
                output.push('</dd>');
            }
            if (data.unused) {
                output.push('<dt>unused</dt><dd>');
                snippets = [];
                for (i = 0; i < data.unused.length; i += 1) {
                    snippets[i] = '<code>' + data.unused[i].name + '</code>&nbsp;<address>' +
                        data.unused[i]['function']  + ' ' +
                        String(data.unused[i].line) + '</address>';
                }
                output.push(snippets.join(', '));
                output.push('</dd>');
            }
            output.push('</dl>');
        }
        if (data.json) {
            output.push('<p>JSON: bad.</p>');
        }
        return output.join('');
    };


    itself.report = function (data) {
        var dl, err, i, j, names, output = [], the_function;

        function detail(h, value) {
            var comma_needed, singularity;
            if (Array.isArray(value)) {
                output.push('<dt>' + h + '</dt><dd>');
                value.sort().forEach(function (item) {
                    if (item !== singularity) {
                        singularity = item;
                        output.push((comma_needed ? ', ' : '') + singularity);
                        comma_needed = true;
                    }
                });
                output.push('</dd>');
            } else if (value) {
                output.push('<dt>' + h + '</dt><dd>', value, '</dd>');
            }
        }

        output.push('<dl>');
        if (data.urls) {
            detail("url", data.urls);
            dl = true;
        }
        if (data.globals) {
            detail('global', data.globals);
            dl = true;
        } else if (xmode === 'style') {
            output.push('<p>CSS.</p>');
        } else if (data.json && !err) {
            output.push('<p>JSON: good.</p>');
        } else {
            output.push('<div><i>No new global variables introduced.</i></div>');
        }
        if (dl) {
            output.push('</dl>');
        } else {
            output[0] = '';
        }

        for (i = 0; i < data.functions.length; i += 1) {
            the_function = data.functions[i];
            names = [];
            if (the_function.params) {
                for (j = 0; j < the_function.params.length; j += 1) {
                    names[j] = the_function.params[j].string;
                }
            }
            output.push('<dl><address>line ' +
                String(the_function.line) + '</address>' +
                the_function.name.entityify() +
                '(' + names.join(', ') + ')');
            detail('undefined', the_function['undefined']);
            detail('unused', the_function.unused);
            detail('closure', the_function.closure);
            detail('variable', the_function['var']);
            detail('exception', the_function.exception);
            detail('outer', the_function.outer);
            detail('global', the_function.global);
            detail('label', the_function.label);
            output.push('</dl>');
        }
        return output.join('');
    };

    itself.properties_report = function (property) {
        if (!property) {
            return '';
        }
        var i,
            key,
            keys = Object.keys(property).sort(),
            length,
            output = ['/*properties'],
            mem = '    ',
            name,
            not_first = false;
        for (i = 0; i < keys.length; i += 1) {
            key = keys[i];
            if (property[key] > 0) {
                if (not_first) {
                    mem += ', ';
                }
                name = ix.test(key)
                    ? key
                    : '\'' + key.replace(nx, sanitize) + '\'';
                length += name.length + 2;
                if (mem.length + name.length > 80) {
                    output.push(mem);
                    mem = '    ';
                }
                mem += name;
                not_first = true;
            }
        }
        output.push(mem, '*/\n');
        return output.join('\n');
    };

    itself.jslint = itself;

    itself.edition = '2012-05-09';

    return itself;
}());

JSLINT(ss, options);
return JSLINT;
}
//// JSLINT_IGNORE_END
}()); }());
