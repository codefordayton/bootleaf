var map, grocerSearch = [];

// Basemap Layers
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);

var ctr = 0;

var grocers = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        // when we have the icons for different types, we can set a variable for icon url here
        // then use as iconUrl value below...
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/grocer.png",
                iconSize: [24, 28],
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

            Object.getOwnPropertyNames(feature.properties).forEach(function(key, idx, array) {
                //if (!(feature.properties[key] == null || key === "website" || key === "name")) {
                itemValue = feature.properties[key];
                if (itemValue == 'Y') { itemValue = "Yes"; }
                if (itemValue == 'N') { itemValue = "No"; }
                if (itemValue != null && (key == 'address' || key == 'phone' || key == 'website')) {
                      if (key == 'phone') {
                        phone = +itemValue.replace(/\D/g,'');
                        content += "<tr><th>"+key+"</th><td><a href='tel:+" + phone + "'>" + itemValue +"</a></td></tr>";
                        sidebarContent += "<tr><th>"+key+"</th><td><a href='tel:+" + phone + "'>" + itemValue +"</a></td></tr>";
                      } else if (key == 'address') {
                        content += "<tr><th>"+key+"</th><td><a target='_blank' href='http://maps.google.com/?q=" + itemValue + "'>" + itemValue +"</a></td></tr>";
                        sidebarContent += "<tr><th>"+key+"</th><td><a target='_blank' href='http://maps.google.com/?q=" + itemValue + "'>" + itemValue +"</a></td></tr>";
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
                    itemValue = routeValue;
                  }
                  sidebarContent += "<tr><th>" + key + "</th><td>" + itemValue + "</td></tr>";
                }
            });

            content += "<tr><th></th><td><a onclick='updateSidebar(" + ctr + ");sidebar.toggle(); return false;'>More Info...</a></td></tr>";
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
    zoom: 10,
    center: [39.757588, -84.183497],
    layers: [mapquestOSM, grocers]
});


// Larger screens get expanded layer control
if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
};

var baseLayers = {
    "Streets": mapquestOSM,
    "Imagery": mapquestOAM,
    "Hybrid": mapquestHYB
};

var overlays = {
    "Grocers": grocers
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
