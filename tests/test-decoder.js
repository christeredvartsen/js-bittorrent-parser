'use strict';

var assert = require('assert');
var decoder = require('../lib/decoder');

var integerValues = [
    { value: 'i-1e', decoded: -1 },
    { value: 'i123e4:spam', decoded: 123 },
    { value: 'i0e', decoded: 0 },
    { value: 'i1e', decoded: 1 },
    { value: 'i-1234567890e', decoded: -1234567890 },
    { value: 'i1234567890e', decoded: 1234567890 }
];

var stringValues = [
    { value: '4:spam', decoded: 'spam' },
    { value: '11:test string', decoded: 'test string' },
    { value: '3:foobar', decoded: 'foo' },
    { value: '7:foo:bar', decoded: 'foo:bar' }
];

var listValues = [
    { value: 'l3:foo4:spame', decoded: ['foo', 'spam'] },
    { value: 'li1ei2ei3ee', decoded: [1, 2, 3] },
    { value: 'li1eli1ei2eee', decoded: [1, [1, 2]] }
];

var dictionaryValues = [
    { value: 'd3:foo3:bar4:listli1ei2ee7:integeri123ee', decoded: { foo: 'bar', list: [1, 2], integer: 123 } }
];

var invalidIntegerValues = [
    'i10',
    'i01e',
    'i-01e',
    'ifoobare',
    '4:spam',
    'li1ei2ei3ee'
];

var invalidStringValues = [
    '4spam',
    '4:foo',
    'foo',
    '-1:foo',
    '0:foo',
    'f:oo'
];

var invalidListValues = [
    'li1ei2e',
    '4:spam',
];

var invalidDictionaryValues = [
    'd3:inti1e',
    '4:spam',
];

describe('Decode integer', function () {
    it('Correctly decodes integers', function () {
        integerValues.forEach(function (test) {
            assert.strictEqual(decoder.decodeInteger(test.value), test.decoded);
        });
    });

    it('Throws Error on invalid integer value', function () {
        invalidIntegerValues.forEach(function(value) {
            assert.throws(function () { decoder.decodeInteger(value); }, Error);
        });
    });
});

describe('Decode string', function () {
    it('Correctly decodes strings', function () {
        stringValues.forEach(function (test) {
            assert.strictEqual(decoder.decodeString(test.value), test.decoded);
        });
    });

    it('Throws Error on invalid string value', function () {
        invalidStringValues.forEach(function(value) {
            assert.throws(function () { decoder.decodeString(value); }, Error);
        });
    });
});

describe('Decode list', function () {
    it('Correctly decodes lists', function () {
        listValues.forEach(function (test) {
            assert.deepEqual(decoder.decodeList(test.value), test.decoded);
        });
    });

    it('Throws Error on invalid list value', function () {
        invalidListValues.forEach(function(value) {
            assert.throws(function () { decoder.decodeList(value); }, Error);
        });
    });
});

describe('Decode dictionary', function () {
    it('Correctly decodes dictionaries', function () {
        dictionaryValues.forEach(function (test) {
            assert.deepEqual(decoder.decodeDictionary(test.value), test.decoded);
        });
    });

    it('Throws Error on invalid dictionary value', function () {
        invalidDictionaryValues.forEach(function(value) {
            assert.throws(function () { decoder.decodeDictionary(value); }, Error);
        });
    });
});

describe('Decode variable', function () {
    it('Correctly decodes variables', function () {
        integerValues.concat(stringValues, listValues, dictionaryValues).forEach(function (test) {
            if (test.decoded instanceof Array || test.decoded instanceof Object) {
                assert.deepEqual(decoder.decode(test.value), test.decoded);
            } else {
                assert.strictEqual(decoder.decode(test.value), test.decoded);
            }
        });
    });

    it('Throws Error on invalue value', function () {
        assert.throws(function () { decoder.decode('foo'); }, Error);
    });
});
