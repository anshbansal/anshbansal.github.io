d3.select(".main").html(null);

var svg = d3.select(".main").append("svg");
svg.attr('width', 600).attr('height', 400);

var x = d3.scale.log().domain([250, 100000]).range([0, 600]);
var y = d3.scale.linear().domain([15, 90]).range([250, 0]);
var r = d3.scale.sqrt().domain([52070, 1380000000]).range([10, 50]);

var circle = svg.append('circle');

circle.attr('fill', 'red')
    .attr('cx', x(13300))
    .attr('cy', y(77))
    .attr('r', r(1380000000));

//circle is cut off so we change the radius a bit
r = d3.scale.sqrt().domain([52070, 1380000000]).range([10, 40]);
circle.attr('r', r(1380000000));
