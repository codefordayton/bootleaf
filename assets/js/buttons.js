// Button Group. We need a button group because it is possible
// to be showing more than 1 type at a time, so it's not sufficient
// to hide markers inside a single button asanother may be set to display them
// The button objects will have to therefore return an array of marker ids
// then this group object can collate the lists into a single inclusive list

/*
	NOTES:
		1. This object requires that you create your buttons with the following parameters:
				- a filterProperty, IE a property type from your json, default is filterProperty but can be overrriden
				- a filterValue, IE the value of the property to match
				- You must add a group class to each button, the default is categories.
						This allows this object to identify what buttons it will interact with.
				- Since this is an object, you must create an instance of it, ie buttons = new ButtonGroup();
					if you use it directly, the init() function won't run and it won't be initialized properly.
				- Be sure and pass in grocers object as part of config.  I prefer this to accessing it directly internally

	Example:
		Declare one or more buttons in your html:
		<button
			id="btnGrocery"
			filterProperty="type" // the attribute must match filterPropertyName defined for buttonGroup object
			filterValue="Grocery" // the attribute must match filterValueName defined for buttonGroup object
			class="categories btn btn-primary" // include the groupClassName; 'categories' for this example...
			onclick="buttons.toggle(this);" >Grocery</button>

		buttons = new buttonGroup({
			groupClassName: 'categories', // [Optional] this classname s/b assigned to each button
			activeClassName: 'btn-primary', // [Optional] the class that visually distinguishes active/inactive button state.
			grocers: grocers, // the geoJson object which contains the layers
			filterPropertyName: 'filterProperty', // [Optional] name of tag attribute defined in each button that matches desired property to filter on.
			fitlerValueName: 'filterValue' // [Optional]  name of tag attribute defined in each button that matches desired property value to filter on.
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
				// Loop over layers
				var layers = this.grocers.getLayers();
				//console.log(layers);
				for (var i = 0; i < layers.length; i++) {
					showLayer = false;
					for (var j=0;j < this.buttons.length;j++) {
							if (this.buttons[j].hasClass(this.activeClassName)) {
								// Button is active, see if layer matches, if show toggle it to be displayed...
								filterProperty = this.buttons[j].attributes.getNamedItem(this.filterPropertyName);
								filterValue = this.buttons[j].attributes.getNamedItem(this.filterValueName);
								if (layers[i].feature.properties[filterProperty.value] == filterValue.value) {
									showLayer = true;
								}
							}
					}
					if (showLayer == true) {layers[i]._icon.show(); }
					else { layers[i]._icon.hide(); }
				}

		}

};
