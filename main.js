const C = {
	height: 600,
	width: 800,
	padding: 30,
	chartFilm: {
		id: 'chartFilmChart',
		height: 200,
	},
	durationChart: {
		id: 'durationChart',
		height: 200,
		width: 300,
	}
}

const container = d3.select('#root')

const svg = container.append('svg')
	.attr('height', C.height)
	.attr('width', C.width)
	.attr("font-size", 10)
	.attr("font-family", "sans-serif")
	.attr("text-anchor", "middle");

d3.text('data/data1.csv').then(response => {
	const data = d3.csvParse(response)

	drawFilmChart(data)
	drawDurationChart(data)
})

function drawDurationChart(data) {
	const dataset = {
		children: data
	}

	const width = C.durationChart.width,
		height = C.durationChart.height

	const chartFilm = svg.append('g')
		.attr('id', C.durationChart.id)
		.attr("transform", "translate(" + C.padding + "," + C.padding + ")")

	const bubble = d3.pack(dataset)
		.size([width - 2, height - 2])
		.padding(1.5)

	const nodes = d3.hierarchy(dataset)
		.sum(d => d.Duration)

	console.log(bubble(nodes).descendants())
	const node = chartFilm.selectAll(".node")
		.data(bubble(nodes).descendants())
		.enter()
		.filter(function(d){
			return  !d.children
		})
		.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")"
		})

	node.append("title")
		.text(d => d.Movie);

	node.append("circle")
		.attr("r", d => 10)
		.style("fill", 'blue')
}

function drawFilmChart(data) {
	const width = C.width,
		height = C.chartFilm.height

	const chartFilm = svg.append('g')
		.attr('id', C.chartFilm.id)
		.attr("transform", "translate(" + C.padding + "," + (C.height - height - C.padding) + ")")

	const xExtent = d3.extent(data, d => parseFloat(d.Rating)),
		xScale = d3.scaleLinear()
		.range([0, width - C.padding*2])
		.domain([(xExtent[0]-1), (xExtent[1])+1])

	const yScale = d3.scaleLinear()
		.range([height - C.padding, 0])
		.domain(d3.extent(data, d => parseInt(d.Year)))

	const color = d3.scaleOrdinal(data.map(d => d.Rating), d3.schemeCategory10)

	// -- axis ---
	const axisX = d3.axisBottom(xScale)
			.ticks(10),
		axisY = d3.axisLeft(yScale)
			.tickFormat(d3.format(".0f"))

	chartFilm.append("g")
		.attr("class", "axisX")
		.attr("transform", `translate(${0},${height - C.padding})`)
		.transition()
		.duration(750)
		.call(axisX)

	chartFilm.append("g")
		.attr("class", "axisY")
		.transition()
		.duration(750)
		.call(axisY)

	//-- circle --

	chartFilm.selectAll('dot')
		.data(data)
		.enter()
		.append('circle')
		.attr('class', 'dot')
		.attr('cx', (d) => xScale(d.Rating))
		.attr('cy', (d) => yScale(d.Year))
		.attr('r', 7)
		.attr('fill', d => color(d.Rating))


}

