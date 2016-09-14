/*
    *@author  Code for Dayton
    *Date: 2014
    *The grocer web application provides information regarding fresh food(organic, locally grown, etc.)
    *in Dayton, Ohio.  Four types of stores are displayed with four diffeerent map markers.
    *This allows users to map their way to various fresh food option.
    *
*/

var map, grocerSearch = [];

// Basemap Layers

var osm = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var ctr = 0;

var grocers = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        // when we have the icons for different types, we can set a variable for icon url here
        // then use as iconUrl value below...
        var iconHtml = "<img src='assets/img/grocery.svg'>";
        if (feature.properties.type == 'CSA') {
          iconHtml = "<img src='assets/img/csa.svg'>";
        }
        if (feature.properties.type == 'Convenience') {
          iconHtml = "<img src='assets/img/convenience.svg'>";
        }
        if (feature.properties.type == 'Specialty') {
          iconHtml = "<img src='assets/img/specialty.svg'>";
        }
        if (feature.properties.type == 'Farmers Market') {
          iconHtml = "<img src='assets/img/farmersmarket.svg'>";
        }
        return L.marker(latlng, {
            icon: L.divIcon({
                html: iconHtml,
                iconSize: [30, 30],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.name,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content =   "<table class='table table-striped table-bordered table-condensed'>"+
                                "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>";
            var sidebarContent = "<H2>" + feature.properties.name + "</H2>" +
                                "<table class='table table-striped table-bordered table-condensed'>";
            var itemValue = "";
            var itemKey = "";
            Object.getOwnPropertyNames(feature.properties).forEach(function(key, idx, array) {
                //if (!(feature.properties[key] == null || key === "website" || key === "name")) {
                itemValue = feature.properties[key];
                var itemKey = getFriendlyLabel(key);
                if (itemValue != null && (key == 'address' || key == 'phone' || key == 'website')) {
                      if (key == 'phone') {
                        phone = +itemValue.replace(/\D/g,'');
                        content += "<tr><th>"+itemKey+"</th><td><a href='tel:+" + phone + "'>" + itemValue +"</a></td></tr>";
                        sidebarContent += "<tr><th>"+itemKey+"</th><td><a href='tel:+" + phone + "'>" + itemValue +"</a></td></tr>";
                      } else if (key == 'address') {
                        content += "<tr><th>"+itemKey+"</th><td><a target='_blank' href='http://maps.google.com/?q=" + itemValue + "'>" + itemValue +"</a></td></tr>";
                        sidebarContent += "<tr><th>"+itemKey+"</th><td><a target='_blank' href='http://maps.google.com/?q=" + itemValue + "'>" + itemValue +"</a></td></tr>";
                    } else if (key == 'website') {
                      var website = feature.properties.website;
                      if (website.split('://').length == 1) {
                          website = "http://" + website;
                      }
                      content += "<tr><th>Website</th><td><a class='url-break' href='" + website + "' target='_blank'>" + feature.properties.website + "</a></td></tr>";
                      sidebarContent += "<tr><th>Website</th><td><a class='url-break' href='" + website + "' target='_blank'>" + feature.properties.website + "</a></td></tr>";


                      }
                }
                else {
                  if (itemValue == null) { itemValue = ''; }
                  if (itemValue == 'Y') { itemValue = "Yes"; }
                  if (itemValue == 'N') { itemValue = "No"; }
                  if (itemValue.toUpperCase() == 'Y*') {itemValue = 'Yes*'; }
                  // Only items displayed in sidebar will be handled here...
                  if (key == 'rta_bus_routes') {
                    var routeValue = '';
                    var routesArr = itemValue.split(',');
                    var route = '0';
                    for (var i=0;i < routesArr.length;i++) {
                      route = routesArr[i].trim();
                      if (routeValue != '') routeValue += ',';
                      routeValue += '<a class="url-break" target="_blank" href="http://www.i-riderta.org/route_' + route + '.aspx">' + route + '</a>';
                    }
                    if (itemValue != 'NA') {
                      itemValue = routeValue;
                    }

                  }
                  if (key != 'name') {
                    // Name is already displayed as <h2> tag at top, no need to display in table
                    sidebarContent += "<tr><th>" + itemKey + "</th><td>" + itemValue + "</td></tr>";
                    }
                }
            });

            content += "<tr><th></th><td><a onclick='updateSidebar(" + ctr + ");sidebar.show(); return false;'>More Info...</a></td></tr>";
            content += "<table>";
            layer._content = content;
            layer._sidebarcontent = sidebarContent;
            layer._index = ctr;
            ctr += 1;
            if (document.body.clientWidth <= 767) {
                layer.on({
                    click: function(e) {
                        $("#feature-title").html(feature.properties.name);
                        $("#feature-info").html(content);
                        $("#featureModal").modal("show");
                    }
                });

            } else {
                layer.on({
                  click: function() {
                    updateSidebar(this._index);
                  }
                })
                layer.bindPopup(content, {
                    maxWidth: "450",
                    closeButton: false
                });
            };
            grocerSearch.push({
                name: layer.feature.properties.name,
                source: "Grocers",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
$.getJSON("data/vendors.geojson", function (data) {
    grocers.addData(data);
});



map = L.map("map", {
    zoom: 12,
    center: [39.757588, -84.183497],
    layers: [osm, grocers]
});


// Larger screens get expanded layer control
if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
};

var baseLayers = {
    "Streets": osm
};

var overlays = {
    // "Grocers": grocers
};

var layerControl = L.control.layers(baseLayers, overlays, {
    collapsed: isCollapsed
}).addTo(map);

var sidebar = L.control.sidebar("sidebar", {
    closeButton: true,
    position: "left"
}).addTo(map);

// Highlight search box text on click
$("#searchbox").click(function () {
    $(this).select();
});

// Typeahead search functionality
$(document).one("ajaxStop", function () {

    //map.fitBounds(grocers.getBounds());
    $("#loading").hide();

    var grocersBH = new Bloodhound({
        name: "Grocers",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: grocerSearch,
        limit: 10
    });

    grocersBH.initialize();


    // instantiate the typeahead UI
    $("#searchbox").typeahead({
        minLength: 3,
        highlight: true,
        hint: false
    }, {
        name: "Grocers",
        displayKey: "name",
        source: grocersBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>Grocers</h4>"
        }
    }).on("typeahead:selected", function (obj, datum) {
        if (datum.source === "Grocers") {
            if (!map.hasLayer(grocers)) {
                map.addLayer(grocers);
            };
            map.setView([datum.lat, datum.lng], 17);
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            };
        };
        if ($(".navbar-collapse").height() > 50) {
            $(".navbar-collapse").collapse("hide");
        };
    }).on("typeahead:opened", function () {
        $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
        $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
    }).on("typeahead:closed", function () {
        $(".navbar-collapse.in").css("max-height", "");
        $(".navbar-collapse.in").css("height", "");
    });
    $(".twitter-typeahead").css("position", "static");
    $(".twitter-typeahead").css("display", "block");
});

// Placeholder hack for IE
if (navigator.appName == "Microsoft Internet Explorer") {
    $("input").each( function () {
        if ($(this).val() == "" && $(this).attr("placeholder") != "") {
            $(this).val($(this).attr("placeholder"));
            $(this).focus(function () {
                if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
            });
            $(this).blur(function () {
                if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
            });
        }
    });
}
