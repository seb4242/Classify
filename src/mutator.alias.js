/**
 * @module mutator.alias
 */
// mutator for adding aliased function properties to a class
addMutator("alias", {
	// the special identifier is "$$alias$$"
	onCreate : function(klass) {
		var mutatorPrefix = this.propPrefix;
		// shortcut method for adding aliased properties
		/**
		 * Adds a aliased property to the object's prototype based on a existing prototype method
		 * @param {String} name The name of the alias for the new property
		 * @param {String} property The name of the property alias
		 * @static
		 * @for Classify.Class
		 * @method addAliasedProperty
		 * @return {Class}
		 */
		klass.addAliasedProperty = function(name, property) {
			return klass.addProperty(name, property, mutatorPrefix);
		};
	},
	onPropAdd : function(klass, parent, name, property) {
		// alias properties are simply function wrappers
		return function() {
			return this[property].apply(this, arguments);
		};
	}
});
