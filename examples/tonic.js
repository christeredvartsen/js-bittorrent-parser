var parser = require('bittorrent-parser'),
    encoder = parser.encoder,
    decoder = parser.decoder;

console.log(parser.version);

console.log(encoder.encode(1));
console.log(encoder.encode('some string'));
console.log(encoder.encode([1, 2, 3]));
console.log(encoder.encode({foo: 'bar'}));

console.log(decoder.decode('i1e'));
console.log(decoder.decode('11:some string'));
console.log(decoder.decode('li1ei2ei3ee'));
console.log(decoder.decode('d3:foo3:bare'));
