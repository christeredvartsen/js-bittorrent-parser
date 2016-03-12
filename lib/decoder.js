'use strict';

var encoder = require('./encoder');

function decode(string) {
    var firstChar = string.charAt(0);

    if (firstChar === 'i') {
        return decodeInteger(string);
    } else if (firstChar === 'l') {
        return decodeList(string);
    } else if (firstChar === 'd') {
        return decodeDictionary(string);
    } else if (/^\d+:/.exec(string) !== null) {
        return decodeString(string);
    }

    throw new Error('Parameter is not correctly encoded.');
}

function decodeInteger(integer) {
    var length = integer.length,
        endPos = integer.indexOf('e');

    if (integer.charAt(0) !== 'i' || endPos === -1) {
        throw new Error('Invalid integer (' + integer + '). Integers must start wth "i" and end with "e".');
    }

    integer = integer.substr(1, endPos - 1);
    length = integer.length;

    if ((integer.charAt(0) === '0' && length > 1) || (integer.charAt(0) === '-' && integer.charAt(1) === '0') || isNaN(integer)) {
        throw new Error('Invalid integer value (' + integer + ').');
    }

    return parseInt(integer);
}

function decodeString(string) {
    var colonIndex = string.indexOf(':'),
        parts = [
            string.substr(0, colonIndex),
            string.substr(colonIndex + 1)
        ];

    if (colonIndex === -1 || parts.length !== 2) {
        throw new Error('Invalid string. Strings consist of two parts separated by ":".');
    }

    var prefix = parseInt(parts[0]);

    if (isNaN(prefix) || prefix < 1) {
        throw new Error('Invalid string. The prefix must be a positive number.');
    }

    var prefixLength = parts[0].length,
        actualLength = string.length;

    if ((prefixLength + 1 + prefix) > actualLength) {
        throw new Error('The length of the string does not match the prefix of the encoded data.');
    }

    return string.substr(prefixLength + 1, prefix);
}

function decodeList(list) {
    if (list.charAt(0) !== 'l') {
        throw new Error('Parameter is not an encoded list.');
    }

    var ret = [],
        length = list.length,
        i = 1,
        part,
        decodedPart,
        finished = false;

    while (i < length) {
        if (list.charAt(i) === 'e') {
            finished = true;
            break;
        }

        part = list.substr(i);
        decodedPart = decode(part);
        ret.push(decodedPart);
        i += encoder.encode(decodedPart).length;
    }

    if (!finished) {
        throw new Error('Incomplete encoded data');
    }

    return ret;
}

function decodeDictionary(dictionary) {
    if (dictionary.charAt(0) !== 'd') {
        throw new Error('Parameter is not an encoded dictionary.');
    }

    var length = dictionary.length,
        ret = {},
        i = 1,
        key,
        keyPart,
        keyPartLength,
        value,
        valuePart,
        valuePartLength,
        finished = false;

    while (i < length) {
        if (dictionary.charAt(i) === 'e') {
            finished = true;
            break;
        }

        keyPart = dictionary.substr(i);
        key = decodeString(keyPart);
        keyPartLength = encoder.encodeString(key).length;
        valuePart = dictionary.substr(i + keyPartLength);
        value = decode(valuePart);
        valuePartLength = encoder.encode(value).length;

        ret[key] = value;
        i += (keyPartLength + valuePartLength);
    }

    if (!finished) {
        throw new Error('Incomplete encoded data');
    }

    return ret;
}

module.exports = {
    decode: decode,
    decodeInteger: decodeInteger,
    decodeString: decodeString,
    decodeList: decodeList,
    decodeDictionary: decodeDictionary
};
