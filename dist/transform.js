"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _ = _interopRequire(require("lodash"));

var loaderUtils = _interopRequire(require("loader-utils"));

var Parser = _interopRequire(require("react-styles-parser"));

var autoprefixer = _interopRequire(require("autoprefixer-core"));

var camelizeStyleName = _interopRequire(require("./vendor/camelizeStyleName"));

var assign = _interopRequire(require("./vendor/Object.assign"));

function transform(source) {
    var output = prefixAll(Parser(source));

    return "module.exports=" + JSON.stringify(output);
}

module.exports = transform;

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

                    if (output[camelizeStyleName(prop)]) {

                        if (!Array.isArray(output[prop])) {
                            output[prop] = [output[prop]];
                        }
                        output[prop].push(value);
                    } else {
                        assign(output, _defineProperty({}, camelizeStyleName(prop), value));
                    }
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
    return "" + property + ":" + value;
}