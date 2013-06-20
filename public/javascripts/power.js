$(document).ready(function () {
	var COLOR_HORDE = "#AA3300";
	var COLOR_ALLIANCE = "#0033AA";

	$("#sel").change(function (e) {
		var xattr = e.target.value;
		var isPerPerson = ($("#check")[0].checked == true);
		var sel = $("#sel")[0];
		var selLabel = sel.options[sel.selectedIndex].label;
		var xlabel = selLabel + (isPerPerson ? "(一人あたり)" : "");
		$.getJSON("/guild/power", function (response) {
			if (response && response.length > 0) {
				var list = response;
				var series = [];
				series.push({});
				var data = series[0].data = [];

				var maxx = 0;
				var maxy = 0;
				var minx = -1;
				var miny = -1;

				list = list.sort(function (a, b) {
					return a.pop - b.pop;
				});

				$(list).each(function (idx, guild) {
					var factionColor = guild.faction == "Horde" ? COLOR_HORDE : COLOR_ALLIANCE;
					var insanity = guild.thisweek / guild.pop;
					var perperson = guild[xattr] / guild.pop;

					var xval = isPerPerson ? perperson : guild[xattr];

					maxx = Math.max(xval, maxx);
					maxy = Math.max(insanity, maxy);
					minx = minx == -1 ? xval : Math.min(xval, minx);
					miny = miny == -1 ? insanity : Math.min(insanity, miny);

					data.push({
						color : factionColor,
						name : guild.name,
						nameslug : guild.nameslug,
						realm : guild.realm,
						events : {
							click : function (e) {
								window.open("trend?guild=" + this.nameslug);
							}
						},
						marker : {
							radius : guild.pop + 3,
							fillColor : factionColor,
							lineColor : "#FFFFFF",
							lineWidth : 1,
							symbol : "circle",
							states : {
								hover : {
									fillColor : factionColor,
									lineColor : "#FFFFFF",
									lineWidth : 2,
									enabled : true,
									radius : guild.pop + 5
								}
							}
						},
						pop : guild.pop,
						x : xval,
						y : insanity,
						haijin : (insanity > 1000) ? Math.round(insanity / 1000) + "K" : Math.round(insanity),
					});
				});

				series[0].type = "scatter";
				series[0].name = "Guilds";

				var chart = new Highcharts.Chart({
					chart : {
						renderTo : "container",
						type : "scatter",
						zoomType : "xy"
					},
					title : {
						text : "Guilds"
					},
					xAxis : {
						title : {
							text : xlabel
						},
						max : maxx * 1.1,
						min : minx * 0.8
					},
					yAxis : {
						title : {
							text : "廃人度"
						},
						max : maxy * 1.1,
						min : miny * 0.8
					},
					legend : {
						enabled : false
					},
					plotOptions : {
						scatter : {
							tooltip : {
								headerFormat : "",
								pointFormat : "<span>{point.name} - {point.realm}</span><br/><span>廃人度 {point.haijin}</span><br/><span>規模 {point.pop}</span>"
							},
							dataLabels : {
								enabled : true,
								color : "#FFFFFF",
								style : {
									fontSize : 10,
									cursor : "default"
								},
								verticalAlign : "top",
								formatter : function () {
									return this.point.name;
								}
							}
						}
					},
					series : series
				});
			}
		});
	});

	$("#sel").value = "pv";
	$("#sel").trigger("change");

	$("#check").change(function (e) {
		$("#sel").trigger("change");
	});
});
