/*jslint bitwise: true, browser: true, continue: true, es5: true, maxerr: 8, node: true, nomen: true, regexp: true, stupid: true, sub: true, white: true */ /*global $, atob: true, Buffer, btoa: true, chrome, Float64Array: true, jQuery, YUI */ (function() { 'use strict'; var db, debug, HND_II, LN2, my, PI1, PI2, rqd, svr; if(window.my && window.my.IS_NODEJS) { global.window = global.process.window; global.window.global = global.window.window = global.window; } debug = window.debug = window.debug || {}; HND_II = -1; my = window.my = window.my || {}; db = my.db = window.db = my.db || {}; LN2 = window.LN2 = Math.log(2); PI1 = window.PI1 = Math.PI; PI2 = window.PI2 = 2 * PI1; rqd = my.rqd = window.rqd = my.rqd || {}; svr = my.svr = window.svr = my.svr || {}; (function() {
  var tmp;
  //// shared client / server code
  //// Array2 - core
  my.Array2 = my.Array2 || function(kwargs, ll1, ll2, ll3) {
    if(!(this instanceof my.Array2)) {return new my.Array2(kwargs, ll1, ll2, ll3);}
    if(kwargs === undefined) {return;}
    if(typeof kwargs === 'number') {ll1 = ll1 || 1;}
    if(ll1 !== undefined) {
      //// row, col
      if(typeof kwargs === 'number') {
        ll3 = ll2 || 1; ll2 = ll1; ll1 = kwargs;
        kwargs = new Float64Array(ll1 * ll2 * ll3);
        }
      //// arr, row
      kwargs = {'arr': kwargs, 'll1': ll1, 'll2': ll2, 'll3': ll3};
    }
    this.arr = kwargs.arr || []; ll3 = this.ll3 = kwargs.ll3 || 1;
    ll1 = this.ll1 =
      kwargs.ll1 || (kwargs.ll2 ? Math.floor(this.arr.length / (kwargs.ll2 * ll3)) : 1);
    this.ll2 = kwargs.ll2 || Math.floor(this.arr.length / (ll1 * ll3));
    this.offset = kwargs.offset || 0;
    this.stride1 = kwargs.stride1 || this.arr.length / ll1;
    this.stride2 = kwargs.stride2 || ll3;
  };
  my.Array2.rgxEach2 = function() {
    var arr, ii1, ii2, jj1, jj2, ll1, ll2, stride1, stride2; if(this.is0d()) {return this;}
    arr = this.arr; jj1 = this.offset;
    ll1 = this.ll1; ll2 = this.ll2; stride1 = this.stride1; stride2 = this.stride2;
    for(ii1 = 0; ii1 < ll1; ii1 += 1) {
      jj2 = jj1; for(ii2 = 0; ii2 < ll2; ii2 += 1) {jj2 += stride2;} jj1 += stride1;
    }
    return this;
  };
  my.Array2.rgxEach2 =
    /(var [^;]+); (.+?;) (for\(.+?jj2 = jj1;) (.+?)(jj2 \+= stride2;.+?) (jj1 \+= stride1;.+?) return this;/
    .exec(my.Array2.rgxEach2.toString().replace(/\s+/g, ' '));
  my.Cache = my.Cache || function(ll) {
    if(!(this instanceof my.Cache)) {return new my.Cache(ll);}
    this.cc1 = {}; this.cc2 = {}; this.ii = 0; this.ll = ll;
  };
  //// check key for fs security
  my.Cache.checkKey = function(kk) {
    if(/^\W|\/\.|\W$|[^\w\-\.\/]/.test(kk)) {
      my.printj('cacheKkCheck - invalid key', kk); return;
    }
    return kk;
  };
  my.Cache.prototype.clear = function() {
    this.cc1 = {}; this.cc2 = {}; this.ii = 0; return this;
  };
  my.Cache.prototype.delItem = function(kk) {
    return this.setItem(kk, null, 'delItem');
  };
  my.Cache.prototype.getItem = function(kk) {
    return this.setItem(kk, null, 'getItem');
  };
  my.Cache.prototype.keys = function() {
    return my.ooDir(this.cc1);
  };
  my.Cache.prototype.setItem = function(kk, vv, mode) {
    if(!my.Cache.checkKey) {return;}
    //// recycle cache
    if(this.ii >= this.ll) {this.cc1 = this.cc2; this.cc2 = {}; this.ii = 0;}
    switch(mode) {
      case 'delItem': this.cc1[kk] = this.cc2[kk] = null; this.ii += 1; return;
      case 'getItem':
        vv = this.cc1[kk]; if(vv === undefined) {my.printj('cache miss', kk);}
        else if(vv) {this.cc1[kk] = this.cc2[kk] = vv; this.ii += 1;} return vv;
      //// cache setItem
      default: this.cc1[kk] = this.cc2[kk] = vv; this.ii += 1; return vv;
    }
  };
  my.closure = function(args, fnc) {
    fnc.apply(null, args);
  };
  my.count = function() {
    var ii; ii = -1; return function() {return (ii += 1);};
  };
  my.dequePushLeft = function(arr, oo) {
    arr.pop(); arr.unshift(oo);
  };
  my.dequePushRight = function(arr, oo) {
    arr.shift(); arr.push(oo);
  };
  my.echo = function(oo) {
    return oo;
  };
  my.echoArgs = function() {
    return arguments;
  };
  my.echoThis = function() {
    return this;
  };
  my.iiRange = function(ll) {
    var ii, out; out = [];
    for(ii = 0; ii < ll; ii += 1) {out[ii] = ii;} return out;
  };
  my.iiReorder = function(order, vv) {
    var ii, out; out = [];
    for(ii = 0; ii < order.length; ii += 1) {out[ii] = vv[order[ii]];} return out;
  };
  my.iiSort = function(arr, mode) {
    var out; out = my.iiRange(arr.length);
    return out.sort(
      mode === 'reverse' ? function(aa, bb) {return arr[bb] - arr[aa];} :
      function(aa, bb) {return arr[aa] - arr[bb];}
    );
  };
  my.jsonParse = function(ss) {
    try {return JSON.parse(ss);} catch(err) {}
  };
  my.jsonParse64 = function(ss, _) {
    try {return my.jsonParse(atob(ss.replace(/_/g, '/').replace(/-/g, '+')));}
    catch(err) {}
  };
  my.jsonStringify = function(oo, mode) {
    //// OPTIMIZATION - typed var
    var ii, kk, out; if(oo === undefined) {return;}
    if(
      mode !== 'recursed' && oo &&
      typeof oo.jsonStringify === 'function' && oo.jsonStringify !== my.jsonStringify
    ) {
      return oo.jsonStringify(mode);
    }
    if(mode === 'print') {return my.jsonStringify(oo).slice(1, -1).replace(/\\\\/g, '\\');}
    if(typeof oo === 'function') {return '"[Function]"';}
    try {if(mode === 'checkOnly') {JSON.stringify(oo); return oo;} return JSON.stringify(oo);}
    catch(err) {
      if(typeof oo.length === 'number') {
        out = [];
        for(ii = 0; ii < oo.length; ii += 1) {
          try {JSON.stringify(oo[ii]); out[ii] = oo[ii];} catch(errIi) {out[ii] = null;}
        }
      } else {
        out = {};
        for(kk in oo) {
          if(oo.hasOwnProperty(kk)) {
            try {JSON.stringify(oo[kk]); out[kk] = oo[kk];} catch(errKk) {out[kk] = null;}
          }
        }
      }
      return mode === 'checkOnly' ? out : JSON.stringify(out);
    }
  };
  my.jsonStringify64 = function(oo) {
    return (
      btoa(my.jsonStringify(oo))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '')
    );
  };
  my.nop = function() {
  };
  my.ooCopyExcept = function(oo, cll) {
    var kk, out; out = {};
    if(cll && cll.length) {
      for(kk in oo) {if(oo.hasOwnProperty(kk) && cll.indexOf(kk) < 0) {out[kk] = oo[kk];}}
      return out;
    }
    //// OPTIMIZATION - no cll
    for(kk in oo) {if(oo.hasOwnProperty(kk)) {out[kk] = oo[kk];}} return out;
  };
  my.ooDir = function(oo) {
    return Object.keys(oo || my).sort().join(' ');
  };
  my.ooEach = function(arr, fnc) {
    var kk;
    //// object
    for(kk in arr) {if(arr.hasOwnProperty(kk)) {fnc(arr[kk], kk);}} return arr;
  };
  my.ooEachCall = function(arr) {
    my.ooEach(arr, function(fnc) {fnc();});
  };
  my.ooIsEmpty = function(oo) {
    var kk; for(kk in oo) {if(oo.hasOwnProperty(kk)) {return null;}} return true;
  };
  my.ooLen = function(oo) {
    var ii, kk; ii = 0; for(kk in oo) {if(oo.hasOwnProperty(kk)) {ii += 1;}} return ii;
  };
  my.ooPeek = function(oo) {
    var kk; for(kk in oo) {if(oo.hasOwnProperty(kk)) {return oo[kk];}}
  };
  my.ooShuffle = function(arr) {
    var ii, rr, tmp; ii = arr.length;
    while(true) {
      //// OPTIMIZATION - Fisher-Yates algorithm
      ii -= 1; rr = Math.random() * ii | 0; tmp = arr[ii]; arr[ii] = arr[rr]; arr[rr] = tmp;
      if(ii <= 0) {return arr;}
    }
  };
  my.ooUpdateUndefined = function(aa, bb) {
    var kk; for(kk in bb) {if(bb.hasOwnProperty(kk) && aa[kk] === undefined) {aa[kk] = bb[kk];}}
    return aa;
  };
  my.parse = function(ss, fpath, fncData) {
    var backslash, cc, data, dd, fncData2, ii, jj, lineno, out, state;
    data = [['', '', 0, 0], ['', '', 0, 0], ['', '', 0, 0], ['', '', 0, 0]];
    ii = jj = 0; lineno = 0; out = ''; state = ss.slice(0, 1);
    //// debug
    if(fncData === 'debug') {fncData = function() {console.log(data[3]);};}
    //// remove \r
    if(/\r/.test(ss)) {ss = ss.replace(/\r\n/g, '\n').replace(/\r/g, '');}
    //// remove trailing whitespace
    if(/ $/m.test(ss)) {ss = ss.replace(/ +$/gm, '');}
    //// end with newline
    if(ss.slice(-1) !== '\n') {ss += '\n';}
    fncData2 = function() {
      if(!state || ii < jj) {
        my.dequePushRight(data, [state, ss.slice(ii, jj), ii, lineno]); fncData(data);
      }
      ii = jj; cc = state = ss[jj] || ''; dd = ss[1 + jj];
    };
    for(jj = 0; jj < ss.length; jj += 1) {
      cc = ss[jj]; dd = ss[1 + jj];
      //// check parse state
      switch(state) {
        //// state - string "..."
        case '""':
          if(!backslash && cc === '"') {jj += 1; fncData2(); break;}
          if(cc === '\n') {lineno += 1;}
          backslash = cc === '\\' && !backslash ? true : null; continue;
        //// state - string '...'
        case "''":
          if(!backslash && cc === "'") {jj += 1; fncData2(); break;}
          if(cc === '\n') {lineno += 1;}
          backslash = cc === '\\' && !backslash ? true : null; continue;
        //// state - regular expression /.../flag
        case 'rgx':
          if(cc === '\n') {my.throwSyntaxError(ss, fpath, ii, 'illegal regular expression');}
          if(!backslash && cc === '/') {jj += 1; fncData2(); break;}
          backslash = cc === '\\' && !backslash ? true : null; continue;
        //// state - comment #_
        case '#_': if(cc === '\n') {ii = jj; fncData2(); break;} continue;
        //// state - comment //
        case '//': if(cc === '\n') {ii = jj; fncData2(); break;} continue;
        //// state - comment ##
        case '##': if(cc === '\n') {fncData2(); break;} continue;
        //// state - comment ////
        case '////': if(cc === '\n') {fncData2(); break;} continue;
        //// state - comment /*...*/
        case '/*':
          if(cc === '*' && dd === '/') {jj += 2; fncData2(); break;}
          if(cc === '\n') {lineno += 1;} continue;
        //// state - comment <!--...-->
        case '<!--':
          if(cc === '-' && dd === '-' && ss.slice(jj, 3 + jj) === '-->') {
            jj += 3; fncData2(); break;
          }
          if(cc === '\n') {lineno += 1;} continue;
        //// state - xml <pre>...</pre>
        case '<pre>':
          if(cc === '<' && dd === '/' && ss.slice(jj, 6 + jj) === '</pre>') {
            jj += 6; fncData2(); break;
          }
          if(cc === '\n') {lineno += 1;} continue;
        //// state - xml <textarea>...</textarea>
        case '<textarea>':
          if(cc === '<' && dd === '/' && ss.slice(jj, 11 + jj) === '</textarea>') {
            jj += 11; fncData2(); break;
          }
          if(cc === '\n') {lineno += 1;} continue;
        //// state - indent
        case '\n':
          if(cc !== ' ') {fncData2(); break;} continue;
      }
      //// check current character
      switch(cc) {
        //// state - string "..."
        case '"':
          backslash = null; fncData2(); state = '""'; continue;
        //// state - string '...'
        case "'":
          backslash = null; fncData2(); state = "''"; continue;
        //// state - comment #
        case '#':
          switch(dd) {
            //// state - comment #_
            case '\n': fncData2(); state = '#_'; break;
            //// state - comment #_
            case ' ': fncData2(); state = '#_'; break;
            //// state - comment ##
            case '#': fncData2(); state = '##'; break;
          }
          continue;
        case '/':
          switch(dd) {
            //// state - comment //
            case '/':
              fncData2();
              if(ss.slice(jj, 3 + jj) === '// ') {state = '//';}
              else if(ss.slice(jj, 5 + jj) === '//// ') {state = '////';}
              break;
            //// state - comment /*...*/
            case '*': fncData2(); state = '/*'; break;
            //// state - regular expression /.../
            default:
              if(
                /^$|[^\w\\<]/.test(ss.slice(jj - 2, jj).trim().slice(-1)) &&
                /^[^\n]+\//.test(ss.slice(1 + jj))
              ) {backslash = null; fncData2(); state = 'rgx';}
          }
          continue;
        //// xml
        case '<':
          switch(dd) {
            //// state - comment <!--...-->
            case '!': if(ss.slice(jj, 4 + jj) === '<!--') {fncData2(); state = '<!--';} break;
            case 'p': if(ss.slice(jj, 4 + jj) === '<pre') {fncData2(); state = '<pre>';} break;
            case 't':
              if(ss.slice(jj, 9 + jj) === '<textarea') {fncData2(); state = '<textarea>';} break;
          }
          continue;
        //// state - newline
        case '\n':
          lineno += 1; if(ii < jj) {fncData2();} continue;
      }
    }
    jj += 1; fncData2(); fncData2(); fncData2(); fncData2();
  };
  my.parseBraket = function(ss, fpath, mode) {
    var cmmMode, fncCase, fnd, indent, indent0, kets, out, xml, xml0;
    //// illegal tab space
    fnd = /\t/.exec(ss); if(fnd) {
      my.throwSyntaxError(ss, fpath, fnd.index, 'illegal tab space');
    }
    fncCase = function(tp, data) {
      switch(tp) {
        case 'ket':
          while(kets.length && indent <= kets[0][0]) {
            out += mode === 'pretty' ? kets.shift().join('') : kets.shift()[1];
          }
          break;
        case 'cmmErr':
          //// syntax error
          if(data[2][0] !== '\n' && data[2][2]) {
            my.throwSyntaxError(ss, fpath, data[2][2], 'illegal comment');
          }
          break;
        case 'cmmMode':
          //// comment cmmMode
          switch(data[0][0]) {
            case '##':
              switch(cmmMode) {
                case 'c': data[0][1] = '////' + data[0][1].slice(2); break;
                case 'css': data[0][1] = '/*' + data[0][1].slice(2) + ' */'; break;
                case 'js': data[0][1] = '////' + data[0][1].slice(2); break;
                case 'xml': data[0][1] = '<!--' + data[0][1].slice(2) + ' -->'; break;
                case 'vim': data[0][1] = '""' + data[0][1].slice(2); break;
              }
              break;
            case '////':
              switch(cmmMode) {
                case 'css': data[0][1] = '/*' + data[0][1].slice(2) + ' */'; break;
                case 'xml': data[0][1] = '<!--' + data[0][1].slice(2) + ' -->'; break;
              }
              break;
          }
          break;
      }
    };
    indent = indent0 = ''; kets = []; cmmMode = ''; out = ''; xml = xml0 = '';
    //// cmmMode
    cmmMode = /\.(\w+)$/.exec(fpath);
    switch(cmmMode && cmmMode[1]) {
      case 'c': cmmMode = 'c'; break;
      case 'cc': cmmMode = 'c'; break;
      case 'cpp': cmmMode = 'c'; break;
      case 'css': cmmMode = 'css'; break;
      case 'js': cmmMode = 'js'; break;
      case 'js2': cmmMode = 'js'; break;
      case 'json': cmmMode = 'js'; break;
      case 'html': cmmMode = 'xml'; break;
      case 'xml': cmmMode = 'xml'; break;
      case 'vim': cmmMode = 'vim'; break;
      case 'vimrc': cmmMode = 'vim'; break;
    }
    my.parse(
      ss, fpath,
      function(data) {
        //// comment
        switch(data[3][0]) {
          case '': break;
          case '##': fncCase('cmmErr', data); break;
          case '////': fncCase('cmmErr', data); break;
          case '/*': fncCase('cmmErr', data); break;
          case '<!--': fncCase('cmmErr', data); break;
          case '""':
            //// regular expression r'/.../flag'
            if(data[2][1].slice(-1) === 'r') {
              data[2][1] = data[2][1].slice(0, -1); data[3][1] = data[3][1].slice(1, -1);
            }
            break;
          case "''":
            //// regular expression r'/.../flag'
            if(data[2][1].slice(-1) === 'r') {
              data[2][1] = data[2][1].slice(0, -1); data[3][1] = data[3][1].slice(1, -1);
            }
            break;
          }
          //// out
          switch(data[0][0]) {
            case '': break;
            case '##': fncCase('cmmMode', data); break;
            case '////': fncCase('cmmMode', data); break;
            case '\n': indent0 = data[0][1]; break;
        }
        //// xml
        if(data[0][0].length <= 1) {
          xml0 = /<[\/\w]+/.exec(data[0][1]);
          if(xml0) {
            if(xml0[0][1] === '/') {cmmMode = 'xml';}
            else {
              xml = /\w+/.exec(xml0[0])[0];
              switch(xml) {
                case 'html': cmmMode = 'xml'; break;
                case 'style': cmmMode = 'css'; break;
                case 'script': cmmMode = 'js'; break;
              }
            }
          }
        }
        //// braket
        switch(data[1][0]) {
          case '': break;
          case '\n':
            if(data[0][0] === '\n' || data[0][0].length >= 2) {break;}
            data[0][1] = data[0][1].trimRight();
            if(data[0][1].slice(-1) === ':') {
              fncCase('ket'); fnd = /[\(\[\{][\)\]\}].{0,1}:$/.exec(data[0][1]);
              //// indent - bra
              if(fnd) {
                //// set ket before data[0][1] is destroyed
                kets.unshift([indent || '\n', data[0][1].slice(fnd.index + 1, -1)]);
                data[0][1] = data[0][1].slice(0, fnd.index + 1);
                //// indent - bra - xml
              } else if(/>:$/.test(data[0][1])) {
                data[0][1] = data[0][1].slice(0, -1);
                kets.unshift([indent, '</' + xml + '>']);
                cmmMode = 'xml';
              }
            }
            break;
          default: indent = indent0; fncCase('ket');
        }
        out += data[0][1];
      }
    );
    //// append remaining kets
    indent = ''; fncCase('ket');
    return out;
  };
  my.parseNewline = function(ss, rgx) {
    my.rgxEach(
      ss, rgx, function(fnd) {ss = ss.replace(fnd[0], fnd[0].replace(/[^\n]*/g, ''));}
    );
    return ss;
  };
  my['print' + 'd'.toString()] = my.printj = function() {
    var ii, out; out = [];
    for(ii = 0; ii < arguments.length; ii += 1) {
      out[ii] = my.jsonStringify(arguments[ii], 'checkOnly');
    }
    console.log(new Date().toISOString() + ' ' + my.jsonStringify(out));
  };
  my.printe = function(err) {
    console.error(err.stack);
  };
  my.printJslint = function(ss, fpath) {
    var err, ignore, ii, jslint, out; if(!my.jslint) {return;}
    ss = my.parseNewline(ss, /\bJSLINT\x5fIGNORE\x5fBEG[\S\s]+?JSLINT\x5fIGNORE\x5fEND/g);
    //// BUG - ignore css style
    ss = my.parseNewline(ss, /\n<style>[\S\s]+?<\/style>/g);
    //// BUG - ignore #!/bin/bash
    ss = ss.replace(/(^#!)/, '//// #!');
    //// BUG - ignore if(0) {...};
    ss = ss.replace(/\(\d+\)/g, '(this())');
    //// BUG - ignore {;}
    ss = ss.replace(/\{;\}/g, '{this();}');
    //// BUG - ignore arguments
    ss = ss.replace(/\barguments\b/g, 'this()');
    jslint = my.jslint(ss, {'on': true}); if(!jslint.errors.length) {return;}
    ignore = true; out = ''; out += fpath + '\n';
    for(ii = 0; ii < jslint.errors.length; ii += 1) {
      err = jslint.errors[ii];
      if(!err) {continue;}
      switch(err.reason) {
        case '': break;
        default:
          ignore = null; out +=
            ii + ' ' + err.line + ':' + err.character + ': ' + err.reason + '\n  ' +
            (err.evidence || '').trim() + '\n';
      }
    }
    if(!ignore) {console.error(out);}
  };
  my.profile = function(name, fnc, loop) {
    name = name || new Date().toISOString();
    if(typeof loop === 'number') {
      loop = loop || 1; my.printj('profile loop', loop, name);
      return my.profile(
        name, function(fncEnd) {var ii; for(ii = 0; ii < loop; ii += 1) {fnc();} fncEnd();}
      );
    }
    my.profileBeg(name); return fnc(function() {my.profileEnd(name);});
  };
  my.profileBeg = function(name) {
    //// timeout if profiler runs too long
    setInterval(function() {my.profileEnd(name);}, 60 * 1000);
    console.profile(name); console.time(name);
  };
  my.profileEnd = function(name) {
    console.timeEnd(name); console.profileEnd(name);
  };
  my.rgxEach = function(ss, rgx, fnc) {
    var fnd, ii; if(!rgx.global) {return;} ii = -1;
    while(true) {fnd = rgx.exec(ss); if(!fnd) {return;} fnc(fnd, ii += 1);}
  };
  //// client-side template engine
  my.strFormat = function(ss, kwargs) {
    var arr, fnd, flag, ii, jj, out, rgx, vv, vv0; if(!kwargs || !/\{\{/.test(ss)) {return ss;}
    ii = 0; kwargs.my = my; kwargs.process = window.process; out = '';
    rgx = /\{\{([\w\-\.\/]+)([^\}]*)\}\}/g;
    while(true) {
      fnd = rgx.exec(ss); if(!fnd) {break;} out += ss.slice(ii, fnd.index);
      ii = fnd.index + fnd[0].length; vv = kwargs;
      //// get attribute
      arr = fnd[1].replace(/\.\./g, '\\').split('.');
      for(jj = 0; jj < arr.length; jj += 1) {
        vv0 = vv; if((vv = vv[arr[jj].replace(/\\/g, '.')]) === undefined) {break;}
      }
      if(vv === undefined) {out += fnd[0]; continue;}
      //// process flags
      if(fnd[2]) {
        arr = fnd[2].split(' ');
        for(jj = 0; jj < arr.length; jj += 1) {
          flag = arr[jj];
          switch(flag) {
            case '': break;
            case '()': vv = vv.call(vv0); break;
            case 'css':
              vv =
                '<style>\n' + vv.toString().replace(/^(@charset .*)/, '/*$1*/').trim() +
                '\n</style>';
              break;
            case 'dataUri':
              if(svr && svr.mimetype) {
                vv = 'data:' + svr.mimetype(fnd[1]) + ';base64,' + vv.toString('base64');
              }
              break;
            case 'htmlPre': vv = my.htmlPreWrite(vv); break;
            case 'js':
              vv = '<script>\n' + vv.toString().replace(/<\//g, '<\\/').trim() + '\n</script>';
              break;
            case 'singleLine': vv = vv.replace(/\n/g, ' '); break;
            case 'stringify': vv = my.jsonStringify(vv); break;
          }
        }
      }
      out += vv;
    }
    out += ss.slice(ii); return out;
  };
  my.strHex = function(ss) {
    var ii, out; out = '';
    for(ii = 0; ii < ss.length; ii += 1) {out += ss.charCodeAt(ii).toString(16) + ' ';}
    return out;
  };
  my.strUnique = function(ss) {
    var ii, seed; ii = 0; seed = 'zqxj'; for(0; ss.match(seed); ii += 1) {
      seed += my.STR_ALPHANUM[ii % my.STR_ALPHANUM.length];
    }
    return seed;
  };
  my.throwSyntaxError = function(ss, fpath, ii, msg) {
    var fnd, index0, lineno, rgx; index0 = 0; lineno = 1; rgx = /\n/g;
    if(typeof ii === RegExp) {ii = ii.exec(ss).index;}
    //// get offending line
    while(true) {
      fnd = rgx.exec(ss); if(!fnd || rgx.lastIndex > ii) {break;}
      index0 = rgx.lastIndex; lineno += 1;
    }
    throw new SyntaxError(
      msg + '\n    at ' + fpath + ':' +
      lineno + ':' + (ii - index0) + '\n' + ss.slice(index0, rgx.lastIndex)
    );
  };
  my.tm2Date = function(tt) {
    if(!tt) {return new Date();}
    if(tt instanceof Date) {return tt;}
    switch(typeof tt) {
      case 'number':
        tt = tt.toString();
        return new Date(tt.slice(0, 4), Number(tt.slice(4, 6)) - 1, tt.slice(6, 8));
      case 'string': return new Date(tt);
      default: return tt;
    }
  };
  //// convert local date to utc date
  my.tmLocal2Utc = function(ss) {
    return new Date(Date.parse(ss) + my.TIMEZONE_OFFSET).toISOString();
  };
  my.tmDate2Int = function(tt) {
    return tt.getFullYear() * 10000 + (tt.getMonth() + 1) * 100 + tt.getDate();
  };
  my.tmDateAdd = function(tt, dt) {
    return new Date(my.tm2Date(tt).getTime() + dt * 86400000);
  };
  my.tmDateDiff = function(aa, bb) {
    return Math.round(
      Math.abs((my.tm2Date(bb).getTime() - my.tm2Date(aa).getTime()) / (86400000))
    );
  };
  my.tmInt2Date = function(tt) {
    tt = tt.toString();
    return new Date(tt.slice(0, 4), Number(tt.slice(4, 6)) - 1, tt.slice(6, 8));
  };
  my.tmMonth2Int = function(ss) {
    return {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
      'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    }[ss.toLowerCase()];
  };
  my.uuid4 = function(cc) {
    var rr;
    //// OPTIMIZATION - cache callback
    if(cc === undefined) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, my.uuid4);
    }
    rr = Math.random() * 16 | 0; return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
  };
  //// OPTIMIZATION - cache callback
  my._xhrGets = function(data, kwargs2) {
    var kwargs; kwargs = this;
    if(kwargs.fncEnd) {kwargs.fncEnd(data, kwargs2);}
    kwargs.out[kwargs2.xpath] = data; kwargs.outLen += 1;
    if(kwargs.outLen === kwargs.paths.length) {
      if(kwargs.fncEnd2) {kwargs.fncEnd2(kwargs.out, kwargs); } else {console.log(kwargs.out);}
    }
  };
  my.xhrGets = function(kwargs) {
    var ii, fncEnd; if(Array.isArray(kwargs)) {kwargs = {'paths': kwargs};}
    fncEnd = function(data, kwargs2) {my._xhrGets.call(kwargs, data, kwargs2);};
    kwargs.out = {}; kwargs.outLen = 0;
    //// call fncEnd early
    if(kwargs.outLen === kwargs.paths.length) {
      if(kwargs.fncEnd) {kwargs.fncEnd(kwargs.out, kwargs); } else {console.log(kwargs.out);}
      return;
    }
    for(ii = 0; ii < kwargs.paths.length; ii += 1) {
      my.xhrGet(
        {
          'fncEnd': fncEnd,
          'header': kwargs.header,
          'headerJson': kwargs.headerJson,
          'method': kwargs.method,
          'proxy': kwargs.proxy,
          'xpath': kwargs.paths[ii],
          'xss': kwargs.xss
        }
      );
    }
  };
  my.xhrInit = function(kwargs, hdr, json) {
    kwargs.headerJson = kwargs.headerJson || {}; kwargs.headers = kwargs.headers || {};
    if(hdr) {my.ooUpdateUndefined(kwargs.headers, hdr);}
    if(json) {my.ooUpdateUndefined(kwargs.headerJson, json);} return kwargs;
  };
  //// reset CACHE
  my.CACHE = my.Cache(4096);
  //// db
  db.delItem = function(kk) {
    db.setItem({'kk': kk, 'mode': 'delItem'});
  };
  db.getItem = function(kk, fncEnd) {
    db.setItem({'fncEnd': fncEnd, 'kk': kk, 'mode': 'getItem'});
  };
  db.setItem = function(kwargs, vv) {
    var kk; if(typeof kwargs === 'string') {kwargs = {'kk': kwargs, 'vv': vv};}
    if(!my.Cache.checkKey(kwargs.kk)) {return;} my.xhrInit(kwargs);
    kwargs.mode = kwargs.mode || 'setItem';
    kwargs.xpath = '/admin/db/' + kwargs.mode + '/' + kwargs.kk;
    if(kwargs.mode === 'setItem') {
      kwargs.headerJson.kk = kwargs.kk; kwargs.headerJson.vv = kwargs.vv;
    }
    //// local
    if(my.IS_NODEJS && my.SERVER_DB === my.SERVER_LOCAL) {
      kk = kwargs.kk; vv = kwargs.vv;
      switch(kwargs.mode) {
        case 'delItem':
          my.printj('db.delItem', kk); rqd.fs.unlink(my.FS_TMP + '/db/' + kk + '.json');
          return;
        case 'getItem':
          rqd.fs.readFile(
            my.FS_TMP + '/db/' + kk + '.json', 'utf8',
            function(err, data) {(kwargs.fncEnd || console.log)(data);}
          );
          return;
        //// setItem
        default: my.fsWriteFileAtomic(my.FS_TMP + '/db/' + kk + '.json', vv); return;
      }
    }
    if(my.IS_NODEJS) {
      kwargs.headers.authorization =
        kwargs.headers.authorization || 'Basic ' + my.SERVER_BASIC_AUTH;
      kwargs.headers.cookie = kwargs.headers.cookie || 'sessionId=' + my.SESSION_ID;
      kwargs.xpath = my.SERVER_DB + kwargs.xpath;
    }
    my.xhrGet(kwargs);
  };
  my.STR_ALPHANUM = my.STR_ALPHANUM ||
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  my.STR_ASCII = my.STR_ASCII ||
    '\t\n\r !"#$%&\x27()*+,-./0123456789:;<=>?@' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
  my.STR_HEX = my.STR_HEX || '0123456789abcdef';
  my.TIMEZONE_OFFSET = my.TIMEZONE_OFFSET || new Date().getTimezoneOffset() * 60 * 1000;
  if(my.IS_NODEJS) {return;}



  //// client-side code
  my.IS_EXTENSION = window.chrome && chrome.extension;
  if(my.IS_EXTENSION) {my.IS_XSS = true;}
  my.sseReload = function() {
    if(!/\bsseReload=\d+\b/.exec(location.href)) {return;}
    my.SSE_RELOAD = new window.EventSource('/admin/sse/reload');
    my.SSE_RELOAD.addEventListener(
      'error', function(evt) {
        console.log('sseReload error', evt); my.SSE_RELOAD.close();
        my.tmTask(my.sseReload, 8 * 1000);
      }
    );
    my.SSE_RELOAD.addEventListener(
      'message',
      function() {
        console.log('sseReload message');
        location.href = location.href.replace(
          /\bsseReload=(\d+)\b/, function(aa, bb) {return 'sseReload=' + (Number(bb) + 1);}
        );
      }
    );
    my.SSE_RELOAD.addEventListener(
      'open', function(evt) {console.log('sseReload open', evt);}
    );
  };
  my.tmTask = function(fnc, tt) {
    setTimeout(fnc, tt);
  };
  //// OPTIMIZATION - cache callback
  my._xhrGet = function(kwargs) {
    var kk;
    if(my.htmlAjaxBusy) {my.htmlAjaxBusy('inline');}
    switch(kwargs.xhr.readyState) {
      //// after open
      case 1:
        my.printj(kwargs.method, {'xpath': kwargs.xpath, 'headers': kwargs.headers});
        //// send headers
        for(kk in kwargs.headers) {
          if(kwargs.headers.hasOwnProperty(kk)) {
            kwargs.xhr.setRequestHeader(kk, kwargs.headers[kk]);
          }
        }
        //// post blob
        kwargs.xhr.send(kwargs.postData); break;
      //// after send
      case 2: break;
      //// begin load
      case 3: break;
      //// after load
      case 4:
        if(my.htmlAjaxBusy) {my.htmlAjaxBusy('none');}
        if(kwargs.fncEnd) {kwargs.fncEnd(kwargs.xhr.responseText, kwargs); break;}
        console.log(kwargs.xhr.responseText); break;
    }
  };
  my.xhrGet = function(kwargs) {
    if(typeof kwargs === 'string') {kwargs = {'xpath': kwargs};}
    my.xhrInit(kwargs); kwargs.method = kwargs.method || 'GET';
    if(kwargs.proxy) {kwargs.xpath = kwargs.proxy + '/' + kwargs.xpath;}
    if(kwargs.xss && !my.IS_XSS) {kwargs.xpath = '/' + kwargs.xss + '/proxy/' + kwargs.xpath;}
    //// json payload
    if(!my.ooIsEmpty(kwargs.headerJson)) {
      kwargs.headers['x-header-json'] = my.jsonStringify64(kwargs.headerJson);
    }
    kwargs.xhr = new XMLHttpRequest();
    kwargs.xhr.onreadystatechange = function() {my._xhrGet(kwargs);};
    kwargs.xhr.open(kwargs.method, kwargs.xpath); return kwargs;
  };
  console._error = console._error || console.error; console._log = console._log || console.log;
  console.error = function() {
    console._error.apply(console, arguments);
  };
  console.log = function() {
    console._log.apply(console, arguments);
  };
  window.BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder;
  window.Float64Array = Float64Array || Array;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
  my.evalInThisContext = function(ss) {
    //// JSLINT_IGNORE_BEG
    return eval(ss);
    //// JSLINT_IGNORE_END
  };
  my.localStorage = {};
  ['clear', 'key', 'removeItem'].forEach(
    function(kk) {
      my.localStorage[kk] = function() {
        return window.localStorage[kk].apply(window.localStorage, arguments);
      };
    }
  );
  my.localStorage.getItem = function(kk) {
    return my.jsonParse(window.localStorage.getItem(kk));
  };
  //// auto-clear local storage if maximum space exceeded
  my.localStorage.setItem = function(kk, vv) {
    vv = my.jsonStringify(vv);
    try {window.localStorage.setItem(kk, vv);}
    catch (err) {window.localStorage.clear(); window.localStorage.setItem(kk, vv);}
  };
  //// offline
  if(/\boffline=\w/.test(location.href)) {my.CACHE = my.localStorage;}


//// jQuery ui
if(window.jQuery && jQuery.ui) {
  //// tabs view
  jQuery('#myTabs').tabs();
  //// date selector
  jQuery('input.textDate').datepicker({'dateFormat': 'yy-mm-dd'});
  my.nAjaxBusy = document.getElementById('myAjaxBusy');
  if(my.nAjaxBusy) {my.nAjaxBusy.style.display = 'none';}
  my.nOverlay = document.getElementById('myOverlay');
  if(my.nOverlay) {my.nOverlay.style.display = 'none';}
}
}()); }());
