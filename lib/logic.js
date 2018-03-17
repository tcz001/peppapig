'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * @param {com.thoughtworks.Slice} slice
 * @transaction
 */
function onSlice(slice) {
    var assetRegistry;
    return getAssetRegistry('com.thoughtworks.Meat')
        .then(function(ar) {
            slice.meats.forEach(function(m){
                assetRegistry = ar;
                var factory = getFactory();
                // Slice the Meat.
                var m = factory.newResource('com.thoughtworks', 'Meat', m.assetId);
                return assetRegistry.add(m);
            })
        });

}
