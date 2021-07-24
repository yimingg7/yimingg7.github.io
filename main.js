
var tooltip = d3.select("#scene1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

var showTooltip = function (d) {
    tooltip
        .transition()
        .duration(200)
    tooltip
        .style("opacity", 1)
        .html("Month: " + d.month + "<br>value:" + d.value)
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var moveTooltip = function (d) {
    tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var hideTooltip = function (d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}



var margin = { top: 50, right: 60, bottom: 50, left: 70 },
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#scene1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var carriers = [];
var datas = [];
d3.csv("airline_delay_causes_2020_1_c.csv").then(function (csv) {
    for (var i = 0; i < csv.length; i++) {
        if (carriers.indexOf(csv[i].carrier) == -1) {
            carriers.push(csv[i].carrier);
        }
    }

    for (var i = 1; i < 13; i++) {
        var obj = { month: i };
        for (var k = 0; k < carriers.length; k++) {
            var d = csv.filter(o => Number(o.month) == i && o.carrier == carriers[k]);
            if (d.length > 0) {
                obj[carriers[k]] = Number(d[0].arr_flights)
            }
        }
        datas.push(obj);
    }

    var dataReady = carriers.map(function (grpName) {
        return {
            name: grpName,
            values: datas.map(function (d) {
                return { month: d.month, value: +d[grpName] };
            })
        };
    });

    var myColor = d3.scaleOrdinal()
        .domain(carriers)
        .range(d3.schemeSet2);

    var x = d3.scaleLinear()
        .domain([0, 12])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, d3.max(datas.map(o => o["TOTAL"]))])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    var line = d3.line()
        .x(function (d) { return x(+d.month) })
        .y(function (d) { return y(+d.value) })
    svg.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("class", d => d.name)
        .attr("d", function (d) { return line(d.values) })
        .attr("stroke", function (d) { return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none");

    svg
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append('g')
        .attr("class", d => d.name)
        .style("fill", function (d) { return myColor(d.name) })
        .selectAll("myPoints")
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.month) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 5)
        .attr("stroke", "white")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)

    svg
        .selectAll("myLabels")
        .data(dataReady)
        .enter()
        .append('g')
        .append("text")
        .attr("class", d => d.name)
        .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; })
        .attr("transform", function (d) { return "translate(" + x(d.value.month) + "," + y(d.value.value) + ")"; })
        .attr("x", 12)
        .text(function (d) { return d.name; })
        .style("fill", function (d) { return myColor(d.name) })
        .style("font-size", 15);

    svg.append("text")
        .text("month")
        .attr("x", width)
        .attr("y", height + 35)

    svg.append("text")
        .attr("id","max1")
        .text("Max Value:" + d3.max(datas.map(o => o.TOTAL)))
        .attr("x", width - 100)
        .attr("y", -10)

    svg.append("text")
        .attr("id", "min1")
        .text("Min Value:" + d3.min(datas.map(o => o.TOTAL)))
        .attr("x", width - 100)
        .attr("y", 25)
})






var tooltip2 = d3.select("#scene2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

var showTooltip2 = function (d) {
    tooltip2
        .transition()
        .duration(200)
    tooltip2
        .style("opacity", 1)
        .html("Month: " + d.month + "<br>value:" + d.value + "%")
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var moveTooltip2 = function (d) {
    tooltip2
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var hideTooltip2 = function (d) {
    tooltip2
        .transition()
        .duration(200)
        .style("opacity", 0)
}

function show1(name) {
    hideAll("TOTAL");
    hideAll("AA");
    hideAll("AS");
    hideAll("B6");
    hideAll("DL");
    var ts = document.getElementsByClassName(name);
    for (var i = 0; i < ts.length; i++) {
        ts[i].style.display = "block";
    }
    document.getElementById("max1").innerHTML = "Max Value:" + d3.max(datas.map(o => o[name]));
    document.getElementById("min1").innerHTML = "Min Value:" + d3.min(datas.map(o => o[name]));
}

function hideAll(name) {
    var names = document.getElementsByClassName(name);
    for (var i = 0; i < names.length; i++) {
        names[i].style.display = "none";
    }
}

function show2(name) {
    hideAll("TOTAL_AVG_2");
    hideAll("AA_2");
    hideAll("AS_2");
    hideAll("B6_2");
    hideAll("DL_2");
    var ts = document.getElementsByClassName(name);
    for (var i = 0; i < ts.length; i++) {
        ts[i].style.display = "block";
    }
    console.log(name);
    document.getElementById("max2").innerHTML = "Max Value:" + d3.max(datas2.map(o => o[name.replace("_2", "")])) +"%";
    document.getElementById("min2").innerHTML = "Min Value:" + d3.min(datas2.map(o => o[name.replace("_2", "")])) +"%";

}


var svg2 = d3.select("#scene2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var datas2 = [];
d3.csv("airline_delay_causes_2020_2_c.csv").then(function (csv) {
    carriers = [];
     datas2 = [];
    for (var i = 0; i < csv.length; i++) {
        csv[i].delay_percent = Number(csv[i].delay_percent.replace("%", ""));
        csv[i].month = Number(csv[i].month);
        if (carriers.indexOf(csv[i].carrier) == -1) {
            carriers.push(csv[i].carrier);
        }
    }

    for (var i = 1; i < 13; i++) {
        var obj = { month: i };
        for (var k = 0; k < carriers.length; k++) {
            var d = csv.filter(o => Number(o.month) == i && o.carrier == carriers[k]);
            if (d.length > 0) {
                obj[carriers[k]] = Number(d[0].delay_percent)
            }
        }
        datas2.push(obj);
    }

    var dataReady = carriers.map(function (grpName) {
        return {
            name: grpName,
            values: datas2.map(function (d) {
                return { month: d.month, value: +d[grpName] };
            })
        };
    });

    var myColor = d3.scaleOrdinal()
        .domain(carriers)
        .range(d3.schemeSet2);

    var x = d3.scaleLinear()
        .domain([0, 12])
        .range([0, width]);
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, d3.max(datas2.map(o => o["AA"]))])
        .range([height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y).tickFormat(o => o + "%"));
    var line = d3.line()
        .x(function (d) { return x(+d.month) })
        .y(function (d) { return y(+d.value) })
    svg2.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("class", d => d.name + "_2")
        .attr("d", function (d) { return line(d.values) })
        .attr("stroke", function (d) { return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none");

    svg2
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append('g')
        .attr("class", d => d.name + "_2")
        .style("fill", function (d) { return myColor(d.name) })
        .selectAll("myPoints")
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.month) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 5)
        .attr("stroke", "white")
        .on("mouseover", showTooltip2)
        .on("mousemove", moveTooltip2)
        .on("mouseleave", hideTooltip2);

    svg2
        .selectAll("myLabels")
        .data(dataReady)
        .enter()
        .append('g')
        .append("text")
        .attr("class", d => d.name + "_2")
        .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; })
        .attr("transform", function (d) { return "translate(" + x(d.value.month) + "," + y(d.value.value) + ")"; })
        .attr("x", 12)
        .text(function (d) { return d.name; })
        .style("fill", function (d) { return myColor(d.name) })
        .style("font-size", 15);

    svg2.append("text")
        .text("month")
        .attr("x", width)
        .attr("y", height + 35)

    svg2.append("text")
        .attr("id", "max2")
        .text("Max Value:" + d3.max(datas2.map(o => o.AA)) + "%")
        .attr("x", width - 100)
        .attr("y", -10)

    svg2.append("text")
        .attr("id", "min2")
        .text("Min Value:" + d3.min(datas2.map(o => o.TOTAL_AVG)) + "%")
        .attr("x", width - 100)
        .attr("y", 25)
})

var csv3, alls;
var tes = [
    "carrier_ct: Number of flights delayed due to air carrier",
    "weather_ct: Number of flights delayed due to weather",
    "nas_ct: Number of flights delayed due to National Aviation System",
    "security_ct: Number of flights delayed due to security",
    "late_aircraft_ct: Number of flights delayed due to a previous flight"
];
d3.csv("airline_delay_causes_2020_3_c.csv").then(function (pieData) {

    csv3 = pieData;
    // set the dimensions and margins of the graph
    var width3 = 1000
    height3 = 500
    margin3 = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width3, height3) / 2 - margin3

    // append the svg object to the div called 'my_dataviz'
    var svg3 = d3.select("#scene3")
        .append("svg")
        .attr("width", width3)
        .attr("height", height3)
        .append("g")
        .attr("transform", "translate(" + width3 / 4 + "," + height3 / 2 + ")");

    // Create dummy data
    var ds = csv3[0];

    alls = Number(ds.carrier_ct) + Number(ds.weather_ct) + Number(ds.nas_ct) + Number(ds.security_ct) + Number(ds.late_aircraft_ct);
    var data = {
        carrier_ct: ds.carrier_ct,
        weather_ct: ds.weather_ct,
        nas_ct: ds.nas_ct,
        security_ct: ds.security_ct,
        late_aircraft_ct: ds.late_aircraft_ct
    };

    var color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeSet2);

    var pie = d3.pie()
        .value(function (d) { return d.value; })
    var data_ready = pie(d3.entries(data))

    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    svg3
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", showTooltip3)
        .on("mousemove", moveTooltip3)
        .on("mouseleave", hideTooltip3);


    svg3
        .selectAll('legend')
        .data(data_ready)
        .enter()
        .append('rect')
        .attr('width', 35)
        .attr('height', 25)
        .attr('x', 225)
        .attr('y', (d, i) => -225 + i * 50)
        .attr('fill', function (d) { return (color(d.data.key)) })

    svg3
        .selectAll('texts')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data.key)
        .attr('x', 275)
        .attr('y', (d, i) => -205 + i * 50)
        .attr('fill', d => "black")

    svg3
        .selectAll('texts')
        .data(tes)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 205)
        .attr('y', (d, i) => 55 + i * 30)
        .attr('fill', d => "black")
});

function changeMonth(m) {
   
    var ds = csv3.filter(o => o.month == m)[0];

    document.getElementById("scene3").innerHTML = "";
    tooltip3 = d3.select("#scene3")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")
    // set the dimensions and margins of the graph
    var width3 = 1000
    height3 = 500
    margin3 = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width3, height3) / 2 - margin3

    // append the svg object to the div called 'my_dataviz'
    var svg3 = d3.select("#scene3")
        .append("svg")
        .attr("width", width3)
        .attr("height", height3)
        .append("g")
        .attr("transform", "translate(" + width3 / 4 + "," + height3 / 2 + ")");

    var data = {
        carrier_ct: ds.carrier_ct,
        weather_ct: ds.weather_ct,
        nas_ct: ds.nas_ct,
        security_ct: ds.security_ct,
        late_aircraft_ct: ds.late_aircraft_ct
    };
    alls = Number(ds.carrier_ct) + Number(ds.weather_ct) + Number(ds.nas_ct) + Number(ds.security_ct) + Number(ds.late_aircraft_ct);
    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; })
    var data_ready = pie(d3.entries(data))
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg3
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", showTooltip3)
        .on("mousemove", moveTooltip3)
        .on("mouseleave", hideTooltip3);


    svg3
        .selectAll('legend')
        .data(data_ready)
        .enter()
        .append('rect')
        .attr('width', 35)
        .attr('height', 25)
        .attr('x', 225)
        .attr('y', (d, i) => -225 + i * 50)
        .attr('fill', function (d) { return (color(d.data.key)) })

    svg3
        .selectAll('texts')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data.key)
        .attr('x', 275)
        .attr('y', (d, i) => -205 + i * 50)
        .attr('fill', d => "black")

    svg3
        .selectAll('texts')
        .data(tes)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 205)
        .attr('y', (d, i) => 55 + i * 30)
        .attr('fill', d => "black")
}

var tooltip3 = d3.select("#scene3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

var showTooltip3 = function (d) {

    tooltip3
        .transition()
        .duration(200)
    tooltip3
        .style("opacity", 1)
        .html("Name: " + d.data.key + "<br>value:" + d.value + "<br>percentage:" + ((d.value / alls) * 100).toFixed(2) + "%")
        .style("left", (d3.mouse(this)[0] + 330) + "px")
        .style("top", (d3.mouse(this)[1] + 230) + "px")
}
var moveTooltip3 = function (d) {
    tooltip
        .style("left", (d3.mouse(this)[0] + 330) + "px")
        .style("top", (d3.mouse(this)[1] + 230) + "px")
}
var hideTooltip3 = function (d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}