/**
 * localStorage package
 *
 * @author alextang
 * @date 2013-10-08 
 * @method update , read,  delete , clear
 **/

if (window.localStorage) {
    var LS = window.localStorage;
}else {
    alert('Your browser does not support localStorage');
}

var Ls = (function () {
    var getJson = function (ns, k) {
        var lsv = LS.getItem(ns) || '{}';
        lsv = JSON.parse(lsv);
        return lsv ;
    };

    var mC = function (ns, k, v) {
        var lsdata = getJson(ns, k);
        lsdata[k] = v ;
        LS.setItem(ns, JSON.stringify(lsdata));
    };

    var mR = function (ns, k) {
        var lsdata = getJson(ns, k);
        return lsdata[k] || '' ;
    };

    var mD = function (ns, k) {
        var lsdata = getJson(ns, k);
        delete lsdata[k];
        LS.setItem(ns, JSON.stringify(lsdata));
    };

    return {
        'create': function (ns, k, v) {
            mC(ns, k, v);
        },
        'update': function (ns, k, v) {
            mC(ns, k,v);
        },
        'read': function (ns, k) {
            return mR(ns, k);
        },
        'delete': function (ns, k) {
            mD(ns, k);
        },
        'clear': function (ns) {
            LS.removeItem(ns);
        }
    } ;
})();
