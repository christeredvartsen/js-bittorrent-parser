'use strict';

var isPlainObject = require('is-plain-object');

function encode(variable) {
    var type = typeof variable;

    if (type === 'number') {
        return encodeInteger(variable);
    } else if (type === 'string') {
        return encodeString(variable);
    } else if (variable instanceof Array) {
        return encodeList(variable);
    } else if (isPlainObject(variable)) {
        return encodeDictionary(variable);
    }

    throw new Error('Variables of type ' + type + ' can not be encoded.');
}

function encodeInteger(integer) {
    if (typeof integer !== 'number') {
        throw new Error('Expected an integer');
    }

    return 'i' + integer + 'e';
}

function encodeString(string) {
    if (typeof string !== 'string') {
        throw new Error('Expected a string');
    }

    return string.length + ':' + string;
}

function encodeList(list) {
    if (!(list instanceof Array)) {
        throw new Error('Expected an Array');
    }

    var result = 'l';

    list.forEach(function (value) {
        result += encode(value);
    });

    return result + 'e';
}

function orderObject(object) {
    var ordered = {};

    Object.keys(object).sort().forEach(function (key) {
        ordered[key] = object[key];
    });

    return ordered;
}

function encodeDictionary(dictionary) {
    if (!isPlainObject(dictionary)) {
        throw new Error('Expected a plain Object');
    }

    var ordered = orderObject(dictionary),
        result = 'd';

    for (var key in ordered) {
        result += encodeString(key) + encode(ordered[key]);
    }

    return result + 'e';
}

module.exports = {
    encode: encode,
    encodeInteger: encodeInteger,
    encodeString: encodeString,
    encodeList: encodeList,
    encodeDictionary: encodeDictionary
};
