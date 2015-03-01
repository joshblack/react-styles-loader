'use strict';

import _ from 'lodash'
import loaderUtils from 'loader-utils';
import Parser from 'react-styles-parser';
import autoprefixer from 'autoprefixer-core';
import camelizeStyleName from './vendor/camelizeStyleName';
import assign from './vendor/Object.assign';

function transform(source) {
    const output = prefixAll(Parser(source));

    return `module.exports=${JSON.stringify(output)}`;
}

export default transform;

function prefixAll(obj) {
    let output = {};

    Object.keys(obj).forEach(function (prop) {
        if (_.isObject(obj[prop])) {
            output[prop] = prefixAll(obj[prop]);
        } else {
            let prefixed = autoprefixer.process(format(prop, obj[prop])).css.split(';');

            if (prefixed.length > 1) {

                prefixed.forEach((statement) => {
                    let [prop, value] = statement.split(':');

                    if (output[camelizeStyleName(prop)]) {

                        if (!Array.isArray(output[prop])) {
                            output[prop] = [output[prop]];
                        }
                        output[prop].push(value);
                    } else {
                        assign(output, {
                            [camelizeStyleName(prop)]: value
                        });
                    }
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
    return `${property}:${value}`;
}