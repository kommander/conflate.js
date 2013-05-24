/**
 * Tests
 */

var expect = require('expect.js');
var conflate = require(__dirname + '/../lib/conflate');

describe('Conflate', function(){

  //
  //
  it('should simply merge two objects', function(){
    var x = { a: 1 };
    var y = { b: '0', c: { d: null } };

    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('d', null);
  });

  //
  //
  it('should simply merge multiple objects', function(){
    var x = { a: 1 };
    var y = { b: '0', c: { d: null } };
    var z = { e: '1' };

    conflate(x, y, z);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('d', null);
    expect(x).to.have.property('e', '1');
  });

  //
  //
  it('should merge existing object values', function(){
    var x = { a: 1, c: { e: true } };
    var y = { b: '0', c: { d: null } };
    
    conflate(x, y);

    expect(x.b).to.be('0');
    expect(x).to.have.property('c');
    expect(x.c).to.have.property('d', null);
    expect(x.c).to.have.property('e', true);
  });

  //
  //
  it('should clone onto new object', function(){
    var x = { a: 1, c: { e: true } };
    var y = { b: '0', c: { d: null } };
    
    var z = conflate({}, x, y);

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
  it('should complain with too little arguments', function(){
    expect(function(){
      conflate({});
    }).to.throwException(function (e) {
      expect(e).to.be.a(Error);
    });
  });
});