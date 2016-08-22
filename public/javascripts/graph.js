var _data = [];

function moveTooltip() {
  var x0 = x.invert(d3.mouse(this)[0]);
  var i = bisectDate(_data, x0, 1);
  var d0 = _data[i - 1];
  var d1 = _data[i];
  var d = x0 - d0.date > d1.date - x0 ? d1 : d0;

  d3.transition()
    .duration(100)
    .ease("linear")
    .each(function() {
      // Move everything to the right spot
      focus.selectAll("circle, text, .x")
        .transition()
        .attr("transform",
          "translate(" + x(d.date) + "," + y(d.close) + ")");

      // Set the value text
      focus.selectAll("text.value")
        .transition()
        .text(d.close);

      // Set the time text
      focus.selectAll("text.date")
        .transition()
        .text(formatDate(d.date));

      focus.select(".x")
        .transition()
        .attr("y2", height - y(d.close));

      focus.select(".y")
        .transition()
        .attr("transform",
          "translate(" + width * -1 + "," + y(d.close) + ")")
        .attr("x2", width + width);
    });
}

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50};
var width = 1100 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;
var formatDate = d3.time.format("%d-%b");
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
x.axis = d3.svg.axis().scale(x).orient("bottom");
y.axis = d3.svg.axis().scale(y).orient("left");

// Define the line
var line = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.close); });

var area = d3.svg.area()
  .x(function(d) { return x(d.date); })
  .y0(height)
  .y1(function(d) { return y(d.close); });

// Adds the svg canvas
var svg = d3.select(".panel-body").append("svg.graph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var lineSvg = svg.append("g");

var linePath = lineSvg.append('path.line');
var areaPath = lineSvg.append('path.area');

// Add the X Axis
var xAxis = svg.append("g.x.axis")
  .attr("transform", "translate(0," + height + ")");

// Add the Y Axis
var yAxis = svg.append("g.y.axis");

var focus = svg.append("g")
  .style("display", "none")
  .attr('class', 'focus');

// Append the x line
focus.append("line.x")
  .attr("y1", 0)
  .attr("y2", height);

// Append the y line
focus.append("line.y")
  .attr("x1", width)
  .attr("x2", width);

// Append the circle at the intersection
focus.append("circle")
  .attr("r", 4);

// Append the value at the intersection
focus.append("text.value.outline")
  .attr("dx", 8)
  .attr("dy", "-.3em");
focus.append("text")
  .attr("class", "value")
  .attr("dx", 8)
  .attr("dy", "-.3em");

// Append the date at the intersection
focus.append("text.date.outline")
  .attr("dx", 8)
  .attr("dy", "1em");
focus.append("text")
  .attr("class", "date")
  .attr("dx", 8)
  .attr("dy", "1em");

// Append the rectangle to capture mouse
svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", function() { focus.style("display", null); })
  .on("mouseout", function() { focus.style("display", "none"); })
  .on("mousemove", moveTooltip);

// Get the data
d3.csv("data.csv", function(error, data) {
  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.close = +d.close;
  });

  _data = data;

  // Scale the range of the data
  x.domain(d3.extent(_data, function(d) { return d.date; }));
  y.domain([0, d3.max(_data, function(d) { return d.close; })]);

  d3.transition()
    .duration(100)
    .ease('linear')
    .each(function() {
      // Redraw the axes
      xAxis.transition().call(x.axis);
      yAxis.transition().call(y.axis);

      // Redraw line path.
      linePath.transition().attr("d", line(_data));
      areaPath.transition().attr("d", area(_data));
    });
});
