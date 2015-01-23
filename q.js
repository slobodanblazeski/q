(function (factory) {
    if (typeof exports === 'object') {
        module.exports = factory(this);
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        this.Q = factory(this);
    }
}(function () {

    'use strict';
    /**
     * A practical functional library for Javascript programmers.
     *
     * @namespace R
     */
    var Q = {version: '1.0.0'};
    /**
     * Returns a list of numbers from `start` (inclusive) to `end`
     * (exclusive) using tep.
     *
     * @func
     * @memberOf Q
     * @category List
     * @param {Number} end - step more than the last number in the list.
     * @param {Number} start -  first number in the list. Assumed 0 if null
     * @param {Number} step -  difference between two numbers. Assumed 1 if null
     * @return {Array} The list of numbers.
     * @example
     *
     *      Q.lay(5);    //=> [1, 2, 3, 4]
     *      Q.lay(53, 50);  //=> [50, 51, 52]
     *      Q.lay(4, 8, -1);  //=> [8, 7, 6, 5]
     */
    Q.lay = function (end, start, step) {
        start = start || 0;
        step = step == null ? 1 : step;
        var res = [],
            i = start;
        if (step > 0) {
            for (; i < end; i += step)
                res.push(i);
        } else if (step < 0) {
            for (; i > end; i += step)
                res.push(i);
        }
        return res;
    };
    /**
     * Returns the first element of the list which matches the predicate, or `undefined` if no
     * element matches.
     *
     * @func
     * @memberOf Q
     * @category List
     * @param {Function/Object} f The predicate function used to determine if the element is the
     *        desired one. Or specification object
     * @param {Array} list The array to consider.
     * @return {Object} The element found, or `undefined`.
     * @example
     *
     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
     *      Q.single(function(d){ return d.a == 2;}, xs); //=> {a: 2}
     *      Q.single({ a : 2}, xs); //=> {a: 2}
     *      Q.single({a: 4},(xs); //=> undefined
     */
    Q.single = function (f, list) {
        var len = list.length,
            fn = typeof f == 'function' ? f : Q.mold(f);
        for (var i = 0; i < len; ++i) {
            if (fn(list[i]))
                return list[i];
        }
        return undefined;
    };

    /**
     * Returns predicate function that compares object with specification template
     *
     * @func
     * @memberOf Q
     * @category Function
     * @param {Object} spec - The specification object
     * @return {Function} The predicate function.
     * @example
     *
     *      Q.mold({a:1})({a:1,b:1}; //=> true
     *      Q.mold({a:4})({a:1,b:1}; //=> false
     */
    Q.mold = function (spec) {
        return function (obj) {
            for (var key in spec) {
                if (spec[key] != obj[key])
                    return false;
            }
            return true;
        }
    };
    /**
     * Amend left list object with keys from right list objects
     * joining by key
     *
     * @func
     * @memberOf Q
     * @category List
     * @param {List} left - The original list
     * @param {List} right - The extension list
     * @param {String} lKey - The original list key
     * @param {String} rKey - The extension list key, if a omitted assumed equal with lKey
     * @return {Function} The predicate function.
     * @example
     *
     *         var left = [{ id:1, b:2},{ id:2, b:2}];
     *         var right =[{ id:1, d:4},{ id:2, d:5}];
     *         Q.amend(left,right,'id') => [{"id":1,"b":2,"d":4},{"id":2,"b":2,"d":5}]
     */
    Q.amend = function (left, right, lKey, rKey) {
        rKey = rKey || lKey;
        return Q.map(function (l) {
            var found = Q.single(function (r) {
                return l[lKey] == r[rKey];
            }, right);
            return Q.mixin(l, found ? found : {});
        }, left);
    };
    /**
     * Returns a new list containing only those items that match a given predicate function.
     * The predicate function is passed one argument: *(value)*.
     *
     * @func
     * @memberOf Q
     * @category core
     * @category List
     * @param {Function} f The function called per iteration, or functor description.
     * @param {Array} list The collection to iterate over.
     * @return {Array} The new filtered array.
     * @example
     *
     *      var isEven = function(n) {
     *        return n % 2 === 0;
     *      };
     *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
     */
    Q.filter = function (f, list) {
        var res = [],
            len = list.length,
            fn = typeof f == 'function' ? f : Q.mold(f);
        for (var i = 0; i < len; ++i) {
            if (fn(list[i]))
                res.push(list[i]);
        }
        return res;
    };


    /**
     * Determines the smallest of a list of items as determined by pairwise comparisons from the supplied comparator
     *
     * @func
     * @memberOf Q
     * @category math
     * @param {Function/String} f A comparator function or field specifier for elements in the list
     * @param {Array} list A list of comparable elements
     * @see Q.min
     * @return {*} The smallest element in the list. `undefined` if the list is empty.
     * @example
     *
     *      function cmp(obj) { return obj.x; }
     *      var a = {x: 1}, b = {x: 2}, c = {x: 3};
     *      Q.min(cmp, [a, b, c]); //=> {x: 1}
     */
    Q.min = function (f, list) {
        var len = list.length,
            fn = typeof f == 'function' ? f : Q.field(f),
            item = list[0],
            res = fn(list[0]),
            current = NaN;
        for (var i = 0; i < len; ++i) {
            current = fn(list[i]);
            if (current < res) {
                item = list[i];
                res = current
            }
        }
        return item;
    };
    /**
     * Determines the largest of a list of items as determined by pairwise comparisons from the supplied comparator
     *
     * @func
     * @memberOf Q
     * @category math
     * @param {Function/String} f A comparator function or field specifier for elements in the list
     * @param {Array} list A list of comparable elements
     * @see Q.min
     * @return {*} The largest element in the list. `undefined` if the list is empty.
     * @example
     *
     *      function cmp(obj) { return obj.x; }
     *      var a = {x: 1}, b = {x: 2}, c = {x: 3};
     *      Q.max(cmp, [a, b, c]); //=> {x: 3}
     */
    Q.max = function (f, list) {
        var len = list.length,
            fn = typeof f == 'function' ? f : Q.field(f),
            item = list[0],
            res = fn(list[0]),
            current = NaN;
        for (var i = 0; i < len; ++i) {
            current = fn(list[i]);
            if (current > res) {
                item = list[i];
                res = current
            }
        }
        return item;
    };
    /**
     * Returns a function that when supplied an object returns the indicated property of that object, if it exists.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig s -> {s: a} -> a
     * @param {String} property The property name
     * @param {Object} obj The object to query
     * @return {*} The value at obj.p
     * @example
     *
     *      R.prop('x', {x: 100}); //=> 100
     *      R.prop('x', {}); //=> undefined
     *
     *      var fifth = R.prop(4); // indexed from 0, remember
     *      fifth(['Bashful', 'Doc', 'Dopey', 'Grumpy', 'Happy', 'Sleepy', 'Sneezy']);
     *      //=> 'Happy'
     */
    Q.field = function (property, obj) {
        if (arguments.length == 1) {
            return function (obj) {
                return obj[property];
            }
        }
        return obj[property];
    };

    /**
     * A function that does nothing but return the parameter supplied to it. Good as a default
     * or placeholder function.
     *
     * @func
     * @memberOf R
     * @category Core
     * @sig a -> a
     * @param {*} x The value to return.
     * @return {*} The input value, `x`.
     * @example
     *
     *      Q.identity(1); //=> 1
     *
     *      var obj = {};
     *      Q.identity(obj) === obj; //=> true
     */
    Q.identity = function (x) {
        return x;
    };


    /**
     * Splits a list into sub-lists stored in an object, based on the result of calling a String-returning function
     * on each element, and grouping the results according to values returned.
     *
     * @func
     * @memberOf Q
     * @category List
     * @param {Function} f - function or string
     * @param {Array} list The array to group
     * @return {Object} An object with the output of `f` for keys, mapped to arrays of elements
     *         that produced that key when passed to `f`.
     * @example
     *
     * Q.groupBy(function(num) { return Math.floor(num); },[4.2, 6.1, 6.4]) =>( { '4': [4.2], '6': [6.1, 6.4] })
     */
    Q.group = function (f, list) {
        var fn = typeof f == 'function' ? f : Q.field(f);
        return Q.reduce(function (acc, elt) {
            var key = fn(elt);
            acc[key] = acc[key] ? acc[key].concat(elt) : [elt];
            return acc;
        }, {}, list);
    };

    function _keyValue(fn, list) {
        return Q.map(function(item) {return {key: fn(item), val: item};}, list);
    }

    function _compareKeys(a, b) {
        return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    }
    /**
     * Sorts the list according to a key generated by the supplied function.
     *
     * @func
     * @memberOf R
     * @category relation
     * @sig (a -> String) -> [a] -> [a]
     * @param {Function} f The function mapping `list` items to keys, or property string.
     * @param {Array} list The list to sort.
     * @return {Array} A new list sorted by the keys generated by `f`.
     * @example
     *
     * var entries = [{ name: 'ALICE', age: 101 }, {name: 'Bob',age: -400},{name: 'clara',age: 314.159}];
     * Q.sort(function(d){ return Math.abs(d.age);},entries)
     * => [{"name":"ALICE","age":101},{"name":"clara","age":314.159},{"name":"Bob","age":-400}]
     *  Q.sort("age", [{ name: 'ALICE', age: 101 }, {name: 'Bob',age: -400},{name: 'clara',age: 314.159}])
     * => [{"name":"Bob","age":-400},{"name":"ALICE","age":101},{"name":"clara","age":314.159}]
     *  Q.sort("-age", [{ name: 'ALICE', age: 101 }, {name: 'Bob',age: -400},{name: 'clara',age: 314.159}])
     * =>[{"name":"clara","age":314.159},{"name":"ALICE","age":101},{"name":"Bob","age":-400}]
     */
    Q.sort = function (f, list) {
        var fn = typeof f == 'function' ? f
            : f[0] == '-' ? function (d) {
            return -1 * d[f.substring(1)]
        } : Q.field(f);
        // TODO finish implementation of sort
        return Q.pluck('val', _keyValue(fn, list).sort(_compareKeys));
    };

    /**
     * Returns a new list by plucking the same named property off all objects in the list supplied.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig String -> {*} -> [*]
     * @param {Number|String} key The key name to pluck off of each object.
     * @param {Array} list The array to consider.
     * @return {Array} The list of values for the given key.
     * @example
     *
     *     Q.pluck('a',[{a: 1}, {a: 2}]); //=> [1, 2]
     *     Q.pluck(0,[[1, 2], [3, 4]]);   //=> [1, 3]
     */
    Q.pluck = function(key, list) {
        return Q.map(Q.field(key), list);
    };

    /**
     * Returns a new list by collecting into list results of applying the function to all object key value pairs
     *
     * @func
     * @memberOf R
     * @category Obj
     * @param {Number|String} f The function executed for each key value pair
     * @param {Object} obj The obj to consider.
     * @return {Array} The list of results of applying the function to all key value pairs
     * @example
     *
     *     Q.collect(Math.sqrt,{ a:4,b:9,c:16}); //=> [2, 3, 4]
     */
    Q.collect = function (f, obj) {
        var res = [];
        for (var key in obj)
            res.push(f(obj[key], key));
        return res;
    };
    /**
     * Returns a new list, constructed by applying the supplied function to every element of the
     * supplied list.
     *
     * @func
     * @memberOf Q
     * @category core
     * @category List
     * @sig (a -> b) -> [a] -> [b]
     * @param {Function} f The function to be called on every element of the input `list`.
     * @param {Array} list The list to be iterated over.
     * @return {Array} The new list.
     * @example
     *
     *      Q.map(function(x) { return x * 2; }, [1, 2, 3]); //=> [2, 4, 6]
     */
    Q.map = function (f, list) {
        var len = list.length,
            res = new Array(len);
        for (var i = 0; i < len; ++i)
            res[i] =f(list[i], i);
        return res;
    };

    /**
     * Returns a single item by iterating through the obj, successively calling the iterator
     * function and passing it an accumulator value, the object value for the current key, and the current key
     * then passing the result to the next call.
     *
     * The iterator function receives two values: *(acc, value)*
     *
     * @func
     * @memberOf Q
     * @category core
     * @category List
     * @sig (a,b -> a) -> a -> [b] -> a
     * @param {Function} f The iterator function. Receives three values, the accumulator,
     *  the object value for the current key, and the current key
     * @param {*} acc The accumulator value.
     * @param {Object} obj The object to iterate over.
     * @return {*} The final, accumulated value.
     * @example
     *
     *  Q.taper(function(acc, val) { return acc+ val; }, 10,  {a: 2, b : 4}); //=> 16
     *  Q.taper(function(acc, val,key){return acc.concat( val,key);},[1,"e"], {a: 2, b : 4});//=>[[1,"e", 2,"a",4,"b"]
     */
    Q.taper = function (f, acc, obj) {
        for (var key in obj)
            acc = f(acc, obj[key],key);
        return acc;
    };

    Q.mapValues = function (f, obj) {
        var res = {};
        for (var key in obj)
            res[key] = f(obj[key]);
        return res;
    };

    Q.abate = function (f, obj) {
        var res = [];
        for (var key in obj)
            res = res.concat(f(obj[key], key));
        return res;
    };

    Q.expand = function (fn, arr) {
        return Q.map(function (d) {
            return Q.mixin(d, fn(d));
        }, arr);
    };

    Q.reduce = function (fn, res, arr) {
        for (var i = 0; i < arr.length; ++i) {
            res = fn(res, arr[i]);
        }
        return res;
    };



    Q.mixin = function mixin(left, right) {
        var res = {}, key;
        for (key in left)
            res[key] = left[key];
        for (key in right)
            res[key] = right[key];
        return res;
    };

    return Q;
}));
