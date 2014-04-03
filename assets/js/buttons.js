// Button Group. We need a button group because it is possible
// to be showing more than 1 type at a time, so it's not sufficient
// to hide markers inside a single button asanother may be set to display them
// The button objects will have to therefore return an array of marker ids
// then this group object can collate the lists into a single inclusive list

/*
	NOTES:
	Example:
		Declare one or more buttons in your html:
		<button
			id="btnGrocery"
			filterProperty="type" 								// the attribute must match filterPropertyName defined for buttonGroup object
			filterValue="Grocery" 								// the attribute must match filterValueName defined for buttonGroup object
			class="categories btn btn-primary" 	 // include the groupClassName; 'categories' for this example...
			onclick="buttons.toggle(this);" >Grocery</button>

		buttons = new buttonGroup({
			groupClassName: 'categories', 				// [Optional] this classname s/b assigned to each button
			activeClassName: 'btn-primary', 			// [Optional] the class that visually distinguishes active/inactive button state.
			grocers: grocers, 										// [REQUIRED] the geoJson object which contains the layers
			filterPropertyName: 'filterProperty', // [Optional] name of tag attribute defined in each button that matches desired property to filter on.
			fitlerValueName: 'filterValue' 			 // [Optional]  name of tag attribute defined in each button that matches desired property value to filter on.
			});

*/

buttonGroup = function(config) {
	this.buttons = [];
	this.groupClassName = 'categories';
	this.activeClassName = 'btn-primary';
	this.filterPropertyName = 'filterProperty';
	this.filterValueName = 'filterValue';
	this.init(config);
}

buttonGroup.prototype = {
	constructor: buttonGroup,
	init: function(config) {
		if (config) {
			for (prop in config) {
				this[prop] = config[prop];
					}
			}
			// populate the buttons array with our category buttons
			this.buttons = document.getElementsByClassName(this.groupClassName);
			// all tag attributes are converted to lowercase by js, so we need to as well...
			this.filterPropertyName = this.filterPropertyName.toLowerCase();
			this.filterValueName = this.filterValueName.toLowerCase();
		},
		toggle: function(btn) {
				if (btn.hasClass(this.activeClassName)) {
					btn.removeClass(this.activeClassName);
				}
				else {
					btn.addClass(this.activeClassName)
				}
				this.updateMarkers();
		},
		updateMarkers: function() {
				// This function will loop over all the layers/markers, then the buttons.
				// initially markers will be flagged to be hidden, but if a filter match
				// is made then they will be flagged to display.  This will ensure
				// an inclusive result so a store can match any of the active categories to be displayed.

				var layers = this.geoJson.getLayers();
				for (var i = 0; i < layers.length; i++) {
					showLayer = false;
					for (var j=0;j < this.buttons.length;j++) {
							if (this.buttons[j].hasClass(this.activeClassName)) {
								// Button is active, see if layer matches, if yes, set it to be displayed...
								filterProperty = this.buttons[j].attributes.getNamedItem(this.filterPropertyName);
								filterValue = this.buttons[j].attributes.getNamedItem(this.filterValueName);
								if (layers[i].feature.properties[filterProperty.value] == filterValue.value) {
									showLayer = true;
								}
							}
					}
					// finished itterating through buttons for this layer, now we either hide or show it...
					if (showLayer == true) {layers[i]._icon.show(); }
					else { layers[i]._icon.hide(); }
				}

		}
};
