var tcsites;
var trafxsites;
var myLineChart;
var myPieChart;
var gdata;
var modes;
var sitelist;

$(document).ready(function() {

	$(function() {
		$("#dialog").dialog({
			autoOpen: false,
            height: 500,
            width: 370
		});
	});

    sitelist = [];
    sitecor = [];

    var map = L.map('map', {
        center: [45.5, -122.65],
        zoom: 11,
        minZoom: 9
        });

    var subDomains = ['gistiles1', 'gistiles2', 'gistiles3', 'gistiles4'];

    var base_simple = new L.TileLayer('http://gis.oregonmetro.gov/ArcGIS/rest/services/metromap/baseSimple/MapServer/tile/{z}/{y}/{x}/?token=GYJZSQrfbb8YrZ_RIn-64Kc1SpybpK4LpW4TenvGQmk.', {
        maxZoom: 19,
        zIndex: 10,
        subdomains: subDomains,
        attribution: '<a href="http://www.oregonmetro.gov/tools-partners/data-resource-center" target="_blank">Metro RLIS</a>'
    }).addTo(map);

    var trails = new L.TileLayer('http://gis.oregonmetro.gov/services/Transit/trailsExisting/{z}/{x}/{y}.png', {
        maxZoom: 19,
        zIndex: 60,
        subdomains: subDomains,
        attribution: '<a href="http://www.oregonmetro.gov/tools-partners/data-resource-center" target="_blank">Metro RLIS</a>'
    });

    var mAerial = new L.TileLayer('//gis.oregonmetro.gov/ArcGIS/rest/services/photo/2014aerialphoto/MapServer/tile/{z}/{y}/{x}/?token=GYJZSQrfbb8YrZ_RIn-64Kc1SpybpK4LpW4TenvGQmk.', {
        maxZoom: 19,
        attribution: '<a href="http://www.oregonmetro.gov/tools-partners/data-resource-center" target="_blank">Metro RLIS</a>'
    });

	//var osmbase = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	//});
    
	var osmbase = new L.tileLayer('http://gis.oregonmetro.gov/ArcGIS/rest/services/metromap/baseAll/MapServer/tile/{z}/{y}/{x}/?token=GYJZSQrfbb8YrZ_RIn-64Kc1SpybpK4LpW4TenvGQmk.', {
        maxZoom: 19,
        attribution: '<a href="http://www.oregonmetro.gov/tools-partners/data-resource-center" target="_blank">Metro RLIS</a>'
	});

    var tcsites = L.geoJson(tc,{
        style: function(feature){
            return {radius: calcPropRadius(feature.properties['avg'])};
        },
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				fillColor: "#708598",
				color: "#537898",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			}).on({
                    mouseover: function(e) {
                        //this.openPopup();
                        this.setStyle({color: 'yellow'});
                    },
                    mouseout: function(e) {
                        //this.closePopup();
                        this.setStyle({color: '#537898'});
                    }
                    //,click: function(e){
                        //alert(e.latlng);
                        //this.setStyle({fillColor: 'white'});
                    //}
                });
		}
		,onEachFeature: openPopup
	}).addTo(map);


    function calcPropRadius(attributeValue) {
        if(attributeValue<1){
            return 2;
        }
        else{
            var scaleFactor = 1.5;
            var size = attributeValue * scaleFactor;
            return Math.sqrt(size/Math.PI)*1.5;
        }
    }

	function openPopup(feature, layer) {
		var popupContent = "Site: " + feature.properties.SITEID;
		layer.bindPopup(popupContent);
        //grab data for graph
        var gdata = "["+feature.properties['we08']+","+feature.properties['we09']+","+feature.properties['we10']+","+feature.properties['we11']+","+feature.properties['we12']+","+feature.properties['we13']+","+feature.properties['we14']+","+feature.properties['we15']+"]";
        var gdata2 = "["+feature.properties['wd08']+","+feature.properties['wd09']+","+feature.properties['wd10']+","+feature.properties['wd11']+","+feature.properties['wd12']+","+feature.properties['wd13']+","+feature.properties['wd14']+","+feature.properties['wd15']+"]";
        var modes = "["+feature.properties['ptb']+","+feature.properties['ptp']+","+feature.properties['po']+"]";
        var genders = "["+feature.properties['pmb']+","+feature.properties['pfb']+","+feature.properties['pmp']+","+feature.properties['pfp']+","+feature.properties['po']+"]";
				var siteavg = "["+feature.properties['avg']+"]";
        //call create graph function
        var siteloc = feature.properties.LOCATION;
        var siteid = feature.properties.SITEID;
        layer.on('click', function(e){cg(siteloc, gdata, gdata2, modes, genders, siteid, siteavg);});
        //sitelist.push({site:siteid,siteloc:sitedesc});
        sitecor.push({site:siteid, sited:siteloc, loc:layer.getLatLng()});

	}

	var baseLayers = {
        "Metro Simple": base_simple,
        "Metro Detailed": osmbase,
        "2014 Metro Aerial": mAerial
	};

    var overlays = {
	"Trail Count Sites": tcsites,
    "Existing Trails": trails
	};

	L.control.layers(baseLayers, overlays).addTo(map);

    function cg(siteloc, gdata, gdata2, modes, genders, siteid){

        $("#dialog").dialog('option','title','Site ' + siteid + " : " + siteloc);
        $("#dialog").dialog("open");
        var adata = JSON.parse(gdata);
        var adata2 = JSON.parse(gdata2);
        var mdata = JSON.parse(modes);
        var gendata = JSON.parse(genders);

        $('#myChart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Peak 2 Hour Site Avg'
            },
            credits: {
                enabled: false
            },
            subtitle: {
                text: 'Metro Trail Counts'
            },
            xAxis: {
                categories: ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Peak 2hr Volume'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Weekend',
                data: adata

            }, {
                name: 'Weekday',
                data: adata2

            }]
        });

        $('#myPieChart').highcharts({
            chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height: 200,
                        type: 'pie'
                    },
                    title: {
                        text: 'Percent Modes (all years)'
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: false
                        }
                    },
                    series: [{
                        name: "Avg Percent",
                        colorByPoint: true,
                        data: [{
                            name: "Percent Bikes",
                            y: Math.round(mdata[0]*100),

                        }, {
                            name: "Percent Peds",
                            y: Math.round(mdata[1]*100),
                        }, {
                            name: "Percent Other",
                            y: Math.round(mdata[2]*100),
                        }],
                        size: '60%',
                        dataLabels: {
                            formatter: function () {
                                return this.y > 5 ? this.point.name : null;
                            },
                            color: '#ffffff',
                            distance: -20
                        }
                    },{
                        name: "Gender Percent",
                        colorByPoint: true,
                        data: [{
                            name: "Male Bike",
                            y: Math.round((gendata[0]*mdata[0])*100),
                            color: '#95CEFF',

                        }, {
                            name: "Female Bike",
                            y: Math.round((gendata[1]*mdata[0])*100),
                            color: '#9ECCF5',
                        }, {
                            name: "Male Ped",
                            y: Math.round((gendata[2]*mdata[1])*100),
                            color: '#5c5c61',
                        }, {
                            name: "Female Ped",
                            y: Math.round((gendata[3]*mdata[1])*100),
                            color: '#68686e',
                        }, {
                            name: "Other",
                            y: gendata[4]*100,
                            color: '#a9ff96',
                        }],
                        size: '80%',
                        innerSize: '70%',
                        dataLabels: {
                            formatter: function () {
                            // display only if larger than 1
                                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                            }
                        }
                    }]
                });


        }

//END OF ON READY
});
