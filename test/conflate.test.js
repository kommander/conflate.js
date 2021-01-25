/**
 * Tests
 */

const expect = require('expect.js');
const conflate = require(__dirname + '/../lib/conflate'); // eslint-disable-line

describe('Conflate', () => {
  //
  //
  it('merges two objects', () => {
    const x = { a: 1 };
    const y = { b: '0', c: { d: null } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('d', null);
  });

  //
  //
  it('handles boolean values', () => {
    const x = { a: false };
    const y = { a: true };

    conflate(x, y);

    expect(x.a).to.be(true);
  });

  //
  //
  it('handles boolean values (2)', () => {
    const x = { a: false };
    const y = { a: true };

    const result = conflate(x, y);

    expect(result.a).to.be(true);
  });

  //
  //
  it('handles boolean values (3)', () => {
    const x = { a: false };
    const y = { a: true };

    const result = conflate({}, x, y);

    expect(result.a).to.be(true);
  });

  //
  //
  it('merges multiple objects', () => {
    const x = { a: 1 };
    const y = { b: '0', c: { d: null } };
    const z = { e: '1' };

    conflate(x, y, z);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('d', null);
    expect(x).to.have.property('e', '1');
  });

  //
  //
  it('merges existing object values', () => {
    const x = { a: 1, c: { e: true } };
    const y = { b: '0', c: { d: null } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('d', null);
    expect(x.c).to.have.property('e', true);
  });

  //
  //
  it('overrides existing deep object values', () => {
    const x = { a: 1, c: { e: true } };
    const y = { b: '0', c: { e: null } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e', null);
  });

  //
  //
  it('merges arrays', () => {
    const x = { a: 1, c: { e: ['1', '2'] } };
    const y = { b: '0', c: { e: ['3'] } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e');
    expect(x.c.e).to.have.property('length', 3);
  });

  //
  //
  it('merges to unique values in arrays', () => {
    const x = { a: 1, c: { e: ['1', '2'] } };
    const y = { b: '0', c: { e: ['2', '3'] } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e');
    expect(x.c.e).to.have.property('length', 3);
  });

  //
  //
  it('overrides with array', () => {
    const x = { a: 1, c: { e: null } };
    const y = { b: '0', c: { e: ['2', '3'] } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e');
    expect(x.c.e).to.have.property('length', 2);
  });

  //
  //
  it('overrides object left with array', () => {
    const x = { a: 1, c: { e: {} } };
    const y = { b: '0', c: { e: ['2', '3'] } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e');
    expect(x.c.e).to.have.property('length', 2);
  });

  //
  //
  it('allows to ignore certain keys', () => {
    const x = { a: 1, c: { e: 0 } };
    const y = { b: '0', c: { e: ['2', '3'] } };

    conflate(x, y, ['e']);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e', 0);
  });

  //
  //
  it('does not add the keys of an array in root', () => {
    const x = { a: 1, c: { e: 0 } };
    const y = { b: '0', c: { e: ['2', '3'] } };

    conflate(x, y, ['e']);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x).to.not.have.property('0');
    expect(x.c).to.have.property('e', 0);
  });

  //
  //
  it('allows multiple ignore specs', () => {
    const x = { a: 1, c: { e: 0 }, f: 0 };
    const y = { b: '0', c: { e: ['2', '3'] }, f: 1 };

    conflate(x, y, ['e'], ['f']);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x).to.have.property('f', 0);
    expect(x.c).to.have.property('e', 0);
  });

  //
  //
  it('allows to whitelist keys', () => {
    const x = { a: 1, c: { e: 0 } };
    const y = { b: '0', c: { e: ['2', '3'] } };

    conflate(x, y, 'a,c');

    expect(x).to.not.have.property('b');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e', 0);
  });

  //
  //
  it('allows multiple whitelists', () => {
    const x = { a: 1, c: { e: 0 }, g: 0 };
    const y = { b: '0', c: { e: ['2', '3'] }, f: 1, g: 1, h: 1 };

    conflate(x, y, 'a,c', 'f,g');

    expect(x).to.not.have.property('b');
    expect(x).to.not.have.property('h');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('e', 0);
    expect(x).to.have.property('g', 1);
    expect(x).to.have.property('f', 1);
  });

  //
  //
  it('clones onto new object', () => {
    const x = { a: 1, c: { e: true } };
    const y = { b: '0', c: { d: null } };

    const z = conflate({}, x, y);

    x.a = 2;
    y.b = '1';

    expect(z.a).to.be(1);
    expect(z.b).to.be('0');
    expect(z).to.have.property('c');
    expect(z.c).to.have.property('d', null);
    expect(z.c).to.have.property('e', true);
  });

  //
  //
  it('complains with too little arguments', () => {
    expect(() => {
      conflate({});
    }).to.throwException((e) => {
      expect(e).to.be.a(Error);
    });
  });

  //
  //
  it('ignores non objects', () => {
    const x = { a: 1, c: { e: true } };

    const z = conflate(x, null);

    expect(z.a).to.be(1);
    expect(z).to.have.property('c');
    expect(z.c).to.have.property('e', true);
  });

  //
  //
  it('applies conversion function on properties', () => {
    const x = { a: 1, c: 3 };
    const y = { b: 2, d: 4 };

    const z = conflate(x, y, (key, value) => {
      if (key === 'b' || key === 'd') {
        return ++value; // eslint-disable-line
      }
      return value;
    });

    expect(z.b).to.be(3);
    expect(z.d).to.be(5);
  });

  //
  //
  it('applies multiple conversion functions on properties', () => {
    const x = { a: 1, c: 3 };
    const y = { b: 2, d: 4 };

    const z = conflate(x, y, (key, value) => {
      if (key === 'b' || key === 'd') {
        return ++value; // eslint-disable-line
      }
      return value;
    }, (key, value) => {
      if (key === 'b' || key === 'd') {
        return ++value; // eslint-disable-line
      }
      return value;
    });

    expect(z.b).to.be(4);
    expect(z.d).to.be(6);
  });

  //
  //
  it('applies conversions to nested objects');
  //
  //
  it('prevent prototype pollution', () => {
    const x = {};
    const y = JSON.parse('{"__proto__": {"polluted": true}}');

    const r = conflate(x, y);

    expect(r.polluted).to.equal(undefined);
    expect({}.polluted).to.not.equal(true);
    expect({}.polluted).to.equal(undefined);
  });
});
