const C = {
	height: 600,
	width: 800,
	padding: 30,
	chartFilm: {
		id: 'chartFilmChart',
		height: 200,
	}
}

const container = d3.select('#root')

const svg = container.append('svg')
	.attr('height', C.height)
	.attr('width', C.width)

d3.text('data/data1.csv').then(response => {
	const data = d3.csvParse(response)

	drawFilmChart(data)

})

function drawFilmChart(data) {
	const width = C.width,
		height = C.chartFilm.height

	const chartFilm = svg.append('g')
		.attr('id', C.chartFilm.id)
		.attr("transform", "translate(" + C.padding + "," + (C.height - height - C.padding) + ")")

	const xScale = d3.scaleBand()
		.range([0, width - C.padding*2])
		.domain(data.map(d => d.Year)
			.sort(function(x, y){
				return d3.ascending(x, y)
			})
		)
		.padding(0.2)

	const yScale = d3.scaleLinear()
		.range([height - C.padding, 0])
		.domain([0, 10])

	// -- axis ---
	const axisX = d3.axisBottom(xScale)
			.tickFormat(d3.format(".0f")),
		axisY = d3.axisLeft(yScale)


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

	//-- bar --

	chartFilm.selectAll('bar')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('x', (d) => xScale(d.Year))
		.attr('y', (d) => yScale(d.Rating))
		.attr('height', (d) => 5)
		.attr('width', xScale.bandwidth())

}

function n(number) {
	return
}