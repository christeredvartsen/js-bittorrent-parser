'use strict';

var assert = require('assert');
var encoder = require('../lib/encoder');

var integerValues = [
    { value: -1, encoded: 'i-1e' },
    { value: 0, encoded: 'i0e' },
    { value: 1, encoded: 'i1e' },
    { value: -1234567890, encoded: 'i-1234567890e' },
    { value: 1234567890, encoded: 'i1234567890e' }
];

var stringValues = [
    { value: 'spam', encoded: '4:spam' },
    { value: 'foobar', encoded: '6:foobar' },
    { value: 'foo:bar', encoded: '7:foo:bar' }
];

var listValues = [
    { value: [1, 2, 3], encoded: 'li1ei2ei3ee' },
    { value: [1, 'string', [2]], encoded: 'li1e6:stringli2eee' },
];

var dictionaryValues = [
    { value: { foo: 'bar', list: [1, 2, 3] }, encoded: 'd3:foo3:bar4:listli1ei2ei3eee' },
    { value: { foo: 'bar', spam: 'eggs' }, encoded: 'd3:foo3:bar4:spam4:eggse'},
    { value: { spam: 'eggs', foo: 'bar' }, encoded: 'd3:foo3:bar4:spam4:eggse'}
];

describe('Encode integer', function () {
    it('Correctly encodes integers', function () {
        integerValues.forEach(function (test) {
            assert.strictEqual(encoder.encodeInteger(test.value), test.encoded);
        });
    });

    it('Throws Error on invalid variable type', function () {
        assert.throws(function () { encoder.encodeInteger('some string'); }, Error);
    });
});

describe('Encode string', function () {
    it('Correctly encodes strings', function () {
        stringValues.forEach(function (test) {
            assert.strictEqual(encoder.encodeString(test.value), test.encoded);
        });
    });

    it('Throws Error on invalid variable type', function () {
        assert.throws(function () { encoder.encodeString(1); }, Error);
    });
});

describe('Encode list', function () {
    it('Correctly encodes lists', function () {
        listValues.forEach(function (test)  {
            assert.strictEqual(encoder.encodeList(test.value), test.encoded);
        });
    });

    it('Throws Error on invalid variable type', function () {
        assert.throws(function () { encoder.encodeList(1); }, Error);
    });
});

describe('Encode dictionary', function () {
    it('Correctly encodes dictionaries', function () {
        dictionaryValues.forEach(function (test) {
            assert.strictEqual(encoder.encodeDictionary(test.value), test.encoded);
        });
    });

    it('Throws Error on invalid variable type', function () {
        assert.throws(function () { encoder.encodeDictionary([1, 2, 3]); }, Error);
    });
});

describe('Encode variable', function () {
    it('Correctly encodes variables', function () {
        integerValues.concat(stringValues, listValues, dictionaryValues).forEach(function (test) {
            assert.strictEqual(encoder.encode(test.value), test.encoded);
        });
    });

    it('Throws Error on non-encodable type', function () {
        assert.throws(function () { encoder.encode(new Date()); }, Error);
    });
});
