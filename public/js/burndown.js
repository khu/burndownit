Array.prototype.avg = function() {
	var av = 0;
	var cnt = 0;
	var len = this.length;
	for (var i = 0; i < len; i++) {
	var e = +this[i];
	if(!e && this[i] !== 0 && this[i] !== '0') e--;
	if (this[i] == e) {av += e; cnt++;}
	}
	return av/cnt;
}

Array.prototype.sum = function() {
	var result = 0;
	var len = this.length;
	for (var i = 0; i < len; i++) {
		result += this[i];
	}
	return result;
}


function accumulate(arry) {
	var accumulated = [];
	for(var i = 0; i < arry.length; i++) {
		if (i == 0) {
			accumulated[0] = arry[0]
		} else {
			accumulated[i] = arry[i] + accumulated[i-1]
		}
	}
	return accumulated
}

function predict_velocity(finished, length) {
	var predict = [];
	for(var i = 0; i < length; i++) {
		if (i < finished.length) {
 			predict[i] = finished[i];
		} else {
			predict[i] = finished[finished.length - 1]
		}
	}
	return predict	
}


var chart;
jQuery(document).ready(function() {

	var data;
	var holder = document.getElementById('data');
	holder.ondragover = function () { this.className = 'hover'; return false; };
	holder.ondragend = function () { this.className = ''; return false; };
	holder.ondrop = function (e) {
	  this.className = '';
	  e.preventDefault();

	  var file = e.dataTransfer.files[0],
	  reader = new FileReader();
	  reader.onload = function (event) {
			data = event.target.result;
			eval(data)
			// var accumulated_finished = accumulate(finished);
			var accumulated_signoff = accumulate(signoff);
			// var predict_devecomplete = accumulate(predict_velocity(finished, iterations.length))
			var predict_signoff = accumulate(predict_velocity(signoff, iterations.length))
			burndown(planed, signoff, scope, predict_signoff,accumulated_signoff,iterations, title)
	  };
	  reader.readAsText(file);
	  return false;
	};
		

});

function burndown(planed, signoff, scope, predict_signoff, accumulated_signoff, iterations, title) {
	new Highcharts.Chart({
		chart: {
			renderTo: 'container'
		},
		title: {
			text: title
		},
		xAxis: {
			categories: iterations
		},
		tooltip: {
			formatter: function() {
				return  this.x  +': '+ this.y;
			}
		},
		credits: {
			enabled:true,
			text:'',
			href:""
		},
		yAxis: {
			title: {
				text: 'Story Point'
			}
		},
		plotOptions: {
			line: {
				dataLabels: {
					enabled: true
				},
				enableMouseTracking: false
			}
		},
		labels: {
			items: [{
				html: 'Signed off ' + signoff.sum() + ' points in total',
				style: {
					left: '40px',
					top: '8px',
					color: 'black'				
				}
			}]
		},
		series: [{
			type: 'column',
			name: 'Planed',
			color:'green',
			data: planed
		}, {
			type: 'column',
			name: 'Signoff Finished',
			color:'Brown',
			data: signoff,
		}, {
			type: 'line',
			name: 'Scope',
			color:'#FF8C00',
			data: scope
		}, {
			type: 'line',
			name: 'Signoff Prediction',
			dashStyle: 'longdash',
			color: '#AAAAAA',
			data: predict_signoff
		}, {
			type: 'line',
			color: 'brown',
			name: 'Signoff',
			data: accumulated_signoff
		}
		]
	});
}

