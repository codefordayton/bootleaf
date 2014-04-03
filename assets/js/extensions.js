// Extensions... Extend functionality to some html elements for use in our filter buttons.

// Extend the button element so it's easier to add/remove closses
// Simply pass in the name of the class you want to add or remove.
// All of these extensions check to be sure there isn't already an
// existing function, which could happen with future HTML changes.

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
if (typeof HTMLImageElement.prototype.addClass !== "function") {
	HTMLElement.prototype.addClass = function(classname) {
			this.className +=(" " + classname);
		}
}
/**
	* hasClass() - determine if button has a particular class
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
