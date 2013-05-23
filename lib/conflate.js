/**
 * Conflate
 */
module.exports = function(){
  if(arguments.length < 2){
    throw new Error('Need two objects to conflate.');
  }

  for(var i = 1; i < arguments.length; i++){
    merge(arguments[0], arguments[i]);
  }

  return arguments[0];
}

function merge(obj1, obj2) {
  var keys = Object.keys(obj2);
  for(var i = 0; i < keys.length; i++){
    var k = keys[i];
    if(typeof obj2[k] === 'object' && obj2[k] !== null){
      if(!obj1[k] || typeof obj1[k] !== 'object'){
        obj1[k] = obj2[k];
      } else {
        $hi.utils.mergeObjects(obj1[k], obj2[k]);
      }
    } else {
      obj1[k] = obj2[k];
    }
  }
}