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

var focus = svg.append("g")
  .style("display", "none")
  .attr('class', 'focus');

// Get the data
d3.csv("data.csv", function(error, data) {
  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.close = +d.close;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Add the line path.
  lineSvg.append("path.line")
      .attr("d", line(data));
  lineSvg.append("path.area")
      .attr("d", area(data));

  // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(x.axis);

  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(y.axis);

 // append the x line
  focus.append("line")
      .attr("class", "x")
      .attr("y1", 0)
      .attr("y2", height);

  // append the y line
  focus.append("line")
      .attr("class", "y")
      .attr("x1", width)
      .attr("x2", width);

  // append the circle at the intersection
  focus.append("circle")
      .attr("class", "y")
      .attr("r", 4);

  // place the value at the intersection
  focus.append("text")
      .attr("class", "value outline")
      .attr("dx", 8)
      .attr("dy", "-.3em");
  focus.append("text")
      .attr("class", "value")
      .attr("dx", 8)
      .attr("dy", "-.3em");

  // place the date at the intersection
  focus.append("text")
      .attr("class", "date outline")
      .attr("dx", 8)
      .attr("dy", "1em");
  focus.append("text")
      .attr("class", "date")
      .attr("dx", 8)
      .attr("dy", "1em");

  // append the rectangle to capture mouse
  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisectDate(data, x0, 1);
    var d0 = data[i - 1];
    var d1 = data[i];
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
});
