'use strict';

var CircleBarChart = function () {

	var HEIGHT = 300,
		WIDTH = 300,
		MIDLINE = HEIGHT / 2;

	var MAX_BAR_HEIGHT = 20,
		MIN_INNER_RADIUS = 50,
		MAX_OUTTER_RADIUS = 140,
		START_COUNT = -20,
		END_COUNT = 50;

	var svgMargin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	};

	var blueColor = d3.rgb(120, 200, 255);
	var grey = d3.rgb(60, 100, 127);
	var lineColor = d3.rgb(100, 100, 120);
	var white = d3.rgb(255, 255, 255);
	var black = d3.rgb(0, 0, 0);
	var orange = d3.rgb(242, 138, 34);

	var radialScale,
		barHeightScale;

	this.initialize = function () {

		var svg = d3.select("#circle-bar-svg");

		svg.attr('height', HEIGHT)
			.attr('width', WIDTH);

		var plotColor = d3.rgb(20, 20, 20);

		svg.append("rect")
			.attr('x', 0)
			.attr('y', 0)
			.attr('height', HEIGHT)
			.attr('width', WIDTH)
			.style('fill', plotColor);

		var grad = svg.append('defs')
			.append('radialGradient')
			.attr("id", "radial-black-orange")
			.classed('gradients', true);
	
		var units = [];

		var demoCount = 15;
		for (var i = 0; i < demoCount; i++) {
			var unit = {
				r: getRandomInt(3, 20),
				theta: getRandomInt(-20, 50),
			};
			units.push(unit);
		}

		initializePlot(MIDLINE, MIDLINE, 80, 90, START_COUNT, END_COUNT);

		var bars = svg.selectAll('.radial-bars')
			.data(units)
			.enter();

		bars.append('line')
			.classed('radial-bars', 1)
			.attr('x1', function (d) {
				console.log('RadialScale: ', radialScale(d));
				return MIDLINE + barHeightScale(0) * Math.cos(radialScale(d.theta));
			})
			.attr('x2', function (d) {
				return MIDLINE + barHeightScale(0) * Math.cos(radialScale(d.theta));
			})
			.attr('y1', function (d) {
				return MIDLINE + barHeightScale(0) * Math.sin(radialScale(d.theta));
			})
			.attr('y2', function (d) {
				return MIDLINE + barHeightScale(0) * Math.sin(radialScale(d.theta));
			})
			.style('stroke', function(d, i) {
				return buildGradient(d, i);
			})
			.style('stroke-width', 2)
			.transition()
			.delay(500)
			.duration(1000)
			.attr('x2', function (d) {
				return MIDLINE + barHeightScale(d.r) * Math.cos(radialScale(d.theta));
			})
			.attr('y2', function (d) {
				return MIDLINE + barHeightScale(d.r) * Math.sin(radialScale(d.theta));
			});
	}

	function initializePlot(cx, cy, rInner, rOutter, start, end) {

		var svg = d3.select("#circle-bar-svg");

		radialScale = d3.scaleLinear()
			.domain([start, end])
			.range([Math.PI / 2 , Math.PI *5 / 2]);

		barHeightScale = d3.scaleLinear()
			.domain([0, MAX_BAR_HEIGHT])
			.range([MIN_INNER_RADIUS, MAX_OUTTER_RADIUS]);

		var ticks = [];
		var numbers = [];
		for (var i = start; i < end; i++) {
			ticks.push(i);
			if (i % 5 === 0) {
				numbers.push(i);
			}
		}

		var arc = d3.arc()
			.innerRadius(rInner)
			.outerRadius(rOutter)
			.startAngle(radialScale(start))
			.endAngle(radialScale(end))

		var tickMarks = svg.selectAll('.radial-ticks')
			.data(ticks)
			.enter();

		tickMarks.append('line')
			.classed('radial-ticks', 1)
			.attr('x1', function (d) {
				return cx + rInner * Math.cos(radialScale(d))
			})
			.attr('x2', function (d) {
				return cx + rOutter * Math.cos(radialScale(d))
			})
			.attr('y1', function (d) {
				return cy + rInner * Math.sin(radialScale(d))
			})
			.attr('y2', function (d) {
				return cy + rOutter * Math.sin(radialScale(d))
			})
			.style("stroke-opacity", 0)
			.style('stroke', lineColor)
			.transition()
			.delay(500)
			.duration(500)
			.styleTween("stroke-opacity", function () {
				return function (t) { return t}
			})

		svg.append('path')
			.attr("id", "start-path")
			.style("fill", orange)
			.style('opacity', .5)
			.transition()
			.duration(500)
			.attrTween("d", function () {
				return interpolateSVGSegment(150, 150, rInner, rOutter, radialScale(start), radialScale(end - .0001));
			})
			.on('end', function() {
				d3.active(this).transition()
				.duration(500)
				.styleTween("opacity", function () {
					console.log("restart transition")
					return function (t) { return 1 - t}
				})
				.on('end', function () {
					d3.select('#start-path').remove();
				})
			})

			// .transition()
			// .duration(1000)
			// .attrTween("d", function () {
			// 	return interpolateSVGSegment(150, 150, rInner, rOutter, radialScale(end), radialScale(start + 1));
			// })


		var numberMarks = svg.selectAll('.radial-numbers')
			.data(numbers)
			.enter();

		numberMarks.append('text')
			.classed('radial-numbers', 1)
			.attr('x', function (d) {
				return cx + (rOutter + 10) * Math.cos(radialScale(d))
			})
			.attr('y', function (d) {
				return cy + (rOutter + 10) * Math.sin(radialScale(d))
			})
			.style('fill', white)
			.style('opacity', 0)
			.style('text-anchor', 'middle')
			.text('')
			.transition()
			.delay(1000)
			.duration(1000)
			.text(function (d) {
				return d;
			})
			.styleTween("opacity", function () {
				return function (t) { return t}
			})


	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.round(Math.random() * (max - min)) + min;
	}

	// helper function to generate the segment as a path
	function generateSVGSegment(x, y, rInner, rOutter, startAngle, endAngle) {

		// convert angles to Radians
		// startAngle *= (Math.PI / 180);
		// endAngle *= (Math.PI / 180);

		var largeArc = endAngle - startAngle <= Math.PI ? 0 : 1; // 1 if angle > 180 degrees
		var sweepFlag = 1; // is arc to be drawn in +ve direction?

		return ['M', x, rInner + y, 'L', x + Math.cos(startAngle) * rInner, y - (Math.sin(startAngle) * rInner),
			'A', rInner, rInner, 0, largeArc, 0, x + Math.cos(endAngle) * rInner, y - (Math.sin(endAngle) * rInner),
			'L', x + Math.cos(endAngle) * rOutter, y - (Math.sin(endAngle) * rOutter),
			'A', rOutter, rOutter, 0, largeArc, 1, x + Math.cos(startAngle) * rInner, y - (Math.sin(startAngle) * rOutter), 
			'Z'
		].join(' ');
	}

	// our custom interpolator, which returns an interpolator function
	// which when called with a time (0-1), generates a segment sized according to time
	function interpolateSVGSegment(x, y, rInner, rOutter, startAngle, endAngle) {
		return function (t) {
			return generateSVGSegment(x, y, rInner, rOutter, startAngle, startAngle + ((endAngle - startAngle) * t));
		};
	}

	function buildGradient(d, i) {
		
		var svgDefs = d3.select("#circle-bar-svg defs");
		
		var grad = svgDefs.append('linearGradient')
			.attr("id", "gradient-" + i)
			.classed('gradients', true)
			// .attr('x1', 0)
			// .attr('x2', Math.abs(Math.sin(radialScale(d.theta))))
			// .attr('y1', 0)
			// .attr('y2', Math.abs(Math.cos(radialScale(d.theta))));
		
		grad.append('stop')
			.attr('offset', '0%')
			.attr('stop-opacity', '.1')
			.attr('stop-color',  black); // light;

		grad.append('stop')
			.attr("offset", "50%")
			.attr('stop-opacity', '1')
			.attr('stop-color', orange);

		return 'url(#gradient-' + i +')';

	}

}