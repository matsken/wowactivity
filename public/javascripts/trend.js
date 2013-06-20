$(document).ready(function () {
	var COLOR_HORDE = "#AA3300";
	var COLOR_ALLIANCE = "#0033AA";

	$.getJSON("guild/trend", function (response) {
		if (response && response.guilds) {
			var days = [
				"日", "月", "火", "水", "木", "金", "土"
			];

			var list = response.guilds;

			var guildData;
			$(list).each(function (idx, guild) {
				if (guild.name == guildName) {
					guildData = guild;
				}
			});

			if (!guildData) {
				alert("データがありません");
				return;
			}

			var series = {
				type : "area",
				name : "Guild Activities",
				pointInterval : 3600 * 1000,
				pointStart : guildData.min,
				data : []
			};

			$(guildData.times).each(function (idx, time) {
				series.data.push(time.count);
			});

			var tz = (new Date()).getTimezoneOffset() / -60;

			var chart = new Highcharts.Chart({
					chart : {
						renderTo : "container",
						zoomType : "x"
					},
					title : {
						text : "Activity trend for " + guildName
					},
					xAxis : {
						title : {
							text : "日時(JST)"
						},
						type : "datetime",
						labels : {
							staggerLines : 1,
							formatter : function () {
								var date = new Date(this.value);
								return date.getUTCDate() + "日(" + days[date.getUTCDay()] + ")" + date.getUTCHours() + "時";
							},
							step : 4,
							rotation : 300,
							y : 40
						},
						tickInterval : 3600 * 1000
					},
					yAxis : {
						title : {
							text : "Activities"
						}
					},
					tooltip : {
						shared : true,
						formatter : function () {
							var date = new Date(this.x);
							return date.getUTCDate() + "日" + date.getUTCHours() + "時台のアクティビティ " + this.y;
						}
					},
					legend : {
						enabled : false
					},
					global : {
						useUTC : true
					},
					plotOptions : {
						area : {
							fillColor : {
								linearGradient : {
									x1 : 0,
									y1 : 0,
									x2 : 0,
									y2 : 1
								},
								stops : [
									[0, Highcharts.getOptions().colors[0]],
									[1, 'rgba(2,0,0,0)']
								]
							},
							lineWidth : 1,
							marker : {
								enabled : false,
								states : {
									hover : {
										enabled : true,
										radius : 5
									}
								}
							},
							shadow : false,
							states : {
								hover : {
									lineWidth : 1
								}
							}
						}
					},
					series : [series]
				});
		}
	});
});
