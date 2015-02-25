"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var loaderUtils = require("loader-utils");
var autoprefixer = require("autoprefixer-core");
var camelizeStyleName = require("../src/camelizeStyleName");
var assign = require("../src/Object.assign");
var _ = require("lodash");

module.exports = function (source) {
    var lines = eval(source);
    var output = prefixAll(lines);

    return "module.exports = " + JSON.stringify(output);
};

function prefixAll(obj) {
    var output = {};

    Object.keys(obj).forEach(function (prop) {
        if (_.isObject(obj[prop])) {
            output[prop] = prefixAll(obj[prop]);
        } else {
            var prefixed = autoprefixer.process(format(prop, obj[prop])).css.split(";");

            if (prefixed.length > 1) {

                prefixed.forEach(function (statement) {
                    var _statement$split = statement.split(":");

                    var _statement$split2 = _slicedToArray(_statement$split, 2);

                    var prop = _statement$split2[0];
                    var value = _statement$split2[1];

                    assign(output, _defineProperty({}, camelizeStyleName(prop), value));
                });
            } else if (prefixed.length === 1) {
                var _prefixed$shift$split = prefixed.shift().split(":");

                var _prefixed$shift$split2 = _slicedToArray(_prefixed$shift$split, 2);

                var _prop = _prefixed$shift$split2[0];
                var value = _prefixed$shift$split2[1];

                assign(output, _defineProperty({}, camelizeStyleName(_prop), value));
            }
        }
    });

    return output;
}

function format(property, value) {
    return property + ":" + value;
}