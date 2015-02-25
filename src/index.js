'use strict';

var loaderUtils = require('loader-utils');
var autoprefixer = require('autoprefixer-core');
var camelizeStyleName = require('../src/camelizeStyleName');
var assign = require('../src/Object.assign');
var _ = require('lodash');

module.exports = function (source) {
    var lines = eval(source);
    var output = prefixAll(lines);

    return "module.exports = " + JSON.stringify(output);
}

function prefixAll(obj) {
    var output = {};

    Object.keys(obj).forEach(function (prop) {
        if (_.isObject(obj[prop])) {
            output[prop] = prefixAll(obj[prop]);
        } else {
            let prefixed = autoprefixer.process(format(prop, obj[prop])).css.split(';');

            if (prefixed.length > 1) {

                prefixed.forEach((statement) => {
                    let [prop, value] = statement.split(':');

                    assign(output, {
                        [camelizeStyleName(prop)]: value
                    });
                });

            } else if (prefixed.length === 1) {
                let [prop, value] = prefixed.shift().split(':');

                assign(output, {
                    [camelizeStyleName(prop)]: value
                });
            }
        }
    });

    return output;
}

function format(property, value) {
    return property + ":" + value;
}