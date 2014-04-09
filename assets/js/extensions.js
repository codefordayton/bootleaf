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
