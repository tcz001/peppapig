'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * @param {com.thoughtworks.Slice} slice
 * @transaction
 */
function onSlice(slice) {

  	if(slice.pig.status !== 'Permitted')
      throw new Error('Not Permitted yet');
    var assetRegistry;
  	return getAssetRegistry('com.thoughtworks.Pig')
      .then(function(ar) {
      assetRegistry = ar;
      return assetRegistry.get(slice.pig.assetId);
    })
      .then(function(p) {
      p.status = 'Sliced';
      assetRegistry.update(p);
    }).then(function(){
    	return getAssetRegistry('com.thoughtworks.Meat')
    }).then(function(ar) {
      assetRegistry = ar;
      slice.meats.forEach(function(m){
        var factory = getFactory();
        // Slice the Meat.
        var m = factory.newResource('com.thoughtworks', 'Meat', m.assetId);
        m.checkedBy = '';
        m.status = 'None';
        m.pig = slice.pig;
        return assetRegistry.add(m);
      })
    });
}

/**
 * @param {com.thoughtworks.CheckPig} checkPig
 * @transaction
 */
function onCheckPig(checkPig) {
    var assetRegistry;
  	if (checkPig.pig.status !== 'None')
      throw new Error('Invalid Status : ' + checkPig.pig.status);
    return getAssetRegistry('com.thoughtworks.Pig')
        .then(function(ar) {
      		assetRegistry = ar;
        	return assetRegistry.get(checkPig.pig.assetId);
        })
  		.then(function(p) {
      		p.status = 'Permitted';
      		p.checkedBy = checkPig.checkedBy;
            assetRegistry.update(p);
    	});
}

/**
 * @param {com.thoughtworks.CheckMeat} checkMeat
 * @transaction
 */
function onCheckMeat(checkMeat) {
    var assetRegistry;
  	if (checkMeat.meat.status !== 'None')
      throw new Error('Invalid Status : ' + checkMeat.meat.status);
    return getAssetRegistry('com.thoughtworks.Meat')
        .then(function(ar) {
      		assetRegistry = ar;
        	return assetRegistry.get(checkMeat.meat.assetId);
        })
  		.then(function(p) {
      		p.status = 'Permitted';
      		p.checkedBy = checkMeat.checkedBy;
            assetRegistry.update(p);
    	});
}
