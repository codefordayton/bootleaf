/**
	* Extensions.js - Extend functionality to some html elements for use in buttons object
	*
	* The functions make use of the ability of javascript to extend existing objects
	* functionality using prototyping.  The result is that these functions will
	* automatically be available to all matching elements.
**/


/**
	* removeClass() - remove a class from an element.
	*
	* uses the className string present in all dom elements
	* basically rebuilds a new class string, omiting the class you
	* want to remove, then sets className of object to new string
**/
if (typeof HTMLImageElement.prototype.removeClass !== "function") {
	HTMLElement.prototype.removeClass = function(classname) {
		var newClassName = "";
    var classes = this.className.split(' ');
		for(var i = 0; i < classes.length; i++) {
			if(classes[i] !== classname) {
				if (newClassName.length > 0) {
					newClassName += ' ';
					}
    		newClassName += classes[i];
      	}
    	}
    	this.className = newClassName;
		}
}

/**
	* addClass() - adds a class to an element
	*
	* simply appends the name of the class to the elements existing
	* className attribute.
**/
if (typeof HTMLImageElement.prototype.addClass !== "function") {
	HTMLElement.prototype.addClass = function(classname) {
			this.className +=(" " + classname);
		}
}
/**
	* hasClass() - determine if button has a particular class
	*
	* itterates through className string and determines if class matches
	* what you pass into function
	* @return true/false
	*
**/
HTMLElement.prototype.hasClass = function(classname) {
	var result = false;
	var classes = this.className.split(' ');
	for (var i=0;i < classes.length; i++) {
		if (classes[i] == classname) {
			var result = true;
		}
	}
	return result;
}

/**
	* hide()/Show() - Hide/Show an element
	*
	* these functions makes use of the visibility
	* these functions us the css visbility style.
	* it is worth noting that this will simply make the element invisibile
	* but the space it takes up will still be potentially noticeble.
	* an alternative is to use the css property display instead, however
	* with that property you would need to keep track of what the
	* value was before you hide it since re-showing it later would require
	* having that information.  The reason is that css display is, unlike
	* the visibility attribute not a simple on/off, but has numerous
	* possible values such as none, block, inline, flex etc...
	* so if you want to toggle an element on/off using display
	* you have to know what it' value is when it is initially displayed
	* otherwise re-displaying and choosing a random value such as block
	* might not produce the correct result.
	*
**/
if (typeof HTMLElement.prototype.hide !== "function") {
	HTMLElement.prototype.hide = function() {
		this.style.visibility = 'hidden';
	}
}
if (typeof HTMLElement.prototype.show !== "function") {
	HTMLElement.prototype.show = function() {
		this.style.visibility = 'visible';
	}
}

/**
	* visibility() - returns the value of the visibility stayle attribute.
**/
if (typeof HTMLElement.prototype.visibility !== "function") {
		HTMLElement.prototype.visibility = function() {
			return this.style.visibiliy;
			}
}

/**
	* trim() added to overcome fact that IE < 10.0 do not support a trim() function
	*
	* This adds trim() support for browsers that lack it.
**/
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}

/**
	* updateSidebar() - Updates the sidebar contents for the current layer.
	*
	* This function is called from within the marker popup content, the "More Info..." a link.
	* I would have liked to embed this function within each layer, IE as a prototype function etc
	* however I could not because the More Info Link, when it is created, the layers don't yet exist
	* the solution I came up with was to use a counter and to pass that into this function.
	* The counter syncs up with the array position of the layers, which by the time a user clicks
	* on the link are fully populated.  I then use the grocers object to get the layers and then the
	* specific layer.  In the main.js I previously created a variable _sidebarcontent which has the
	* content in html format for each layer, much like the popup content was created.
**/
function updateSidebar(ctr) {
	layers = grocers.getLayers();
	layer = layers[ctr];
	$("#featureModal").modal("hide");
	properties = layer.feature.properties;
	sidebar.setContent(layer._sidebarcontent);
}

function getFriendlyLabel(label) {
	var result = label;
	var labels = {
				'address' 						 : 'Address',
				'bakery' 							: 'Bakery',
				'convenience_foods' 	 : 'Convenience Foods',
				'deli'								 : 'Deli',
				'hours'								: 'Hours',
				'international'				: 'International',
				'local'								: 'Local',
				'non_perishables'			: 'Non Perishables',
				'notes'								: 'Notes',
				'organic'							: 'Organic',
				'phone'								: 'Phone',
				'prepared_foods'			 : 'Prepared Foods',
				'produce'							: 'Produce',
				'rta_bus_routes'			 : 'RTA Bus Routes',
				'seafood'							: 'Seafood',
				'type'								 : 'Type',
				'wic_stamps_snap'			: 'WIC/Food Stamps/SNAP',
				'wine_beer'						: 'Wine and Beer'
			};
		if (labels[label] != null) {
		result = labels[label]
	};

	return result;
}
