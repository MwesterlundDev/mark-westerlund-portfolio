'use strict'

var SideCircle = function () {

	var HEIGHT = 500,
		WIDTH = 500,
		MIDLINE = HEIGHT / 2;

	var svgMargin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	}

	this.initialize = function () {

		var svg = d3.select("#side-circle-svg");

		svg.attr('height', HEIGHT)
			.attr('width', WIDTH);

		var plotColor = d3.rgb(20, 20, 20);

		// 	var path = d3.path();
		// 	path.moveTo(100, 200);
		// 	path.arcTo(100, 150, 150, 150, 200);

		// svg.append("path")
		//   .attr("d", path.toString())
		//   .attr("stroke", "firebrick")
		//   .attr("stroke-width", 2)
		//   .attr("fill", "none");

		var blueColor = d3.rgb(120, 200, 255);
		var grey = d3.rgb(60, 100, 127);
		var lineColor = d3.rgb(100, 100, 120);

		svg.append("rect")
			.attr('x', 0)
			.attr('y', 0)
			.attr('height', HEIGHT)
			.attr('width', WIDTH)
			.style('fill', plotColor);

		var grad = svg.append('defs')
			.append('linearGradient')
			.attr("id", "gradient")
			.classed('gradients', true)
			.attr('x1', '0%')
			.attr('x2', '100%')
			.attr('y1', '0%')
			.attr('y2', '0%');

		grad.append('stop')
			.attr('offset', '0%')
			.attr('stop-opacity', '1')
			.attr('stop-color', blueColor); // light;

		grad.append('stop')
			.attr("offset", "100%")
			.attr('stop-opacity', '.2')
			.attr('stop-color', grey);


		svg.append('line')
			.attr("x1", MIDLINE)
			.attr('x2', MIDLINE)
			.attr('y1', MIDLINE)
			.attr('y2', MIDLINE)
			.style('stroke', lineColor)
			.transition()
			.delay(500)
			.duration(1000)
			.attr("x1", 0)
			.attr('x2', WIDTH);

		var widths = [20, 12, 40, 30, 50, 17, 35, 23];

		var width = 20;
		var ellipses = svg.selectAll('.ellipses')
			.data(widths)
			.enter()

		ellipses.append("ellipse") // attach an ellipse
			.attr("cx", MIDLINE) // position the x-centre
			.attr("cy", MIDLINE) // position the y-centre
			.attr("rx", function (d) {
				return d * 2;
			}) // set the x radius
			.attr("ry", function (d) {
				return d * 2;
			})
			.style("fill", "transparent")
			.style('stroke', blueColor)
			// .style('stroke-dasharray', function(d, i) {
			// 	return  (d / 5) + ", " + (i % 2 == 0) ? (d / 10) : 0 ;
			// })
			.style('stroke-width', 1)
			.transition()
			.delay(500)
			.duration(1000)
			.attr("rx", function (d) {
				return d;
			})
			.attr("cx", function (d, i) {
				return 100 + i * 30;
			})
			.style('stroke', "url(#gradient)")
			.style('stroke-width', function (d) {
				return d / 10;
			});


		

	}

}