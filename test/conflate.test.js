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
  it('should handle boolean values', function(){
    var x = { a: false };
    var y = { a: true };

    conflate(x, y);

    expect(x.a).to.be(true);
  });

  //
  //
  it('should handle boolean values (2)', function(){
    var x = { a: false };
    var y = { a: true };

    const result = conflate(x, y);

    expect(result.a).to.be(true);
  });

  //
  //
  it('should handle boolean values (3)', function(){
    var x = { a: false };
    var y = { a: true };

    const result = conflate({}, x, y);

    expect(result.a).to.be(true);
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

  //
  //
  it('should ignore non objects', function(){
    var x = { a: 1, c: { e: true } };

    var z = conflate(x, null);

    expect(z.a).to.be(1);
    expect(z).to.have.property('c');
    expect(z.c).to.have.property('e', true);
  });

  //
  //
  it('should apply conversion function on properties', function(){
    var x = { a: 1, c: 3 };
    var y = { b: 2, d: 4 };

    var z = conflate(x, y, function(key, value){
      if(key == 'b' || key == 'd'){
        return ++value;
      }
    });

    expect(z.b).to.be(3);
    expect(z.d).to.be(5);
  });

  //
  //
  it('should apply multiple conversion functions on properties', function(){
    var x = { a: 1, c: 3 };
    var y = { b: 2, d: 4 };

    var z = conflate(x, y, function(key, value){
      if(key == 'b' || key == 'd'){
        return ++value;
      }
    }, function(key, value){
      if(key == 'b' || key == 'd'){
        return ++value;
      }
    });

    expect(z.b).to.be(4);
    expect(z.d).to.be(6);
  });
});
