const C = {
	height: 500,
	width: 850,
	padding: 35,
	chartFilm: {
		id: 'chartFilmChart',
		height: 180,
	},
	durationChart: {
		id: 'durationChart',
		height: 280,
		width: 400,
	},
	directorChart: {
		id: 'directorChart',
		height: 240,
		width: 365,
	}
}

const container = d3.select('#root')

let globalData

const svg = container.append('svg')
	.attr('class', 'svg-content-responsive')
	.attr('preserveAspectRatio', 'xMinYMin meet')
	.attr('viewBox', `0 0 ${C.width} ${C.height}`)
	.attr("font-size", 10)
	.attr("font-family", "sans-serif")
	.attr("text-anchor", "middle");

d3.text('data/data1.csv').then(response => {
	const data = d3.csvParse(response)
	globalData = data
	drawFilmChart(data)
	drawDurationChart(data)
	drawDirectorChart(data)
})

function drawDirectorChart(data) {
	const width = C.directorChart.width,
		height = C.directorChart.height,
		radius = Math.min(width, height) / 2,
		marginLeft = C.durationChart.width + C.padding,
		dataset = unique(data.map(d => d.Director))

	const color = d3.scaleOrdinal(dataset, d3.schemeCategory10)

	const chartDirector = svg.append('g')
		.attr("transform", "translate(" + (marginLeft + width / 2) + "," + (C.padding + height / 2) + ")")
		.append('g')
		.attr('id', C.directorChart.id)

	const pie = d3.pie()
		.sort(null)
		.value(d => 1)

	const arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius * 0.3)

	const arcLabel = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius)

	//add pieChart
	const pieChart = chartDirector
		.selectAll('.arc')
		.data(pie(dataset))
		.enter()
		.append('g')
		.attr('class', 'arc')
		.attr('id', d => getIdByName(d.data))
		.on('click', function (e) {
			/*-- select / deselect item*/
			d3.selectAll('.selected')
				.classed("selected", false);

			d3.select(this)
				.attr('class', 'arc selected')

			const pieChart = d3.select('#'+C.directorChart.id),
				angle = 270 - (e.startAngle + e.endAngle) / 2 * 180 / Math.PI

			pieChart
				.transition()
				.duration(750)
				.attr('transform', `rotate(${angle})`)

			/*-- select / deselect reletion --*/
			const directorName = e.data,
				movies = globalData.filter(d =>
					d.Director === directorName
				)

			movies.forEach(movie => {
				//deselet movie

				const movieID = getIdByName(movie.Movie)
				d3.select('#'+movieID)
					.attr('class', 'rect selected')
			})
		})

	pieChart.append('path')
		.attr("fill", (d) => color(d.data))
		.attr('d', arc)

	// Now add the annotation. Use the centroid method to get the best coordinates
	pieChart.append('text')
		.attr("dy", ".2em")
		.attr("dx", d => d.data.length * 0.25 + 0.5 + "em")
		.text(d => d.data)
		.attr("transform", d =>
			`translate(${arcLabel.centroid(d)}) rotate(${90 + (d.startAngle + d.endAngle) / 2 * 180 / Math.PI})`)
		.style("text-anchor", "middle")
		.style("font-size", radius/15)
}

function drawDurationChart(data) {
	const newData = unique(data.map(d => d.Duration))
	const dataset = {
		children: newData
	}

	const width = C.durationChart.width,
		height = C.durationChart.height

	const color = d3.scaleOrdinal(newData, d3.schemeCategory10)

	const chartDuration = svg.append('g')
		.attr('id', C.durationChart.id)
		//.attr("transform", "translate(" + C.padding + "," + C.padding + ")")

	const bubble = d3.pack(dataset)
		.size([width, height])
		.padding(1.5)

	const nodes = d3.hierarchy(dataset)
		.sum(d => d)

	// bubbles
	const node = chartDuration.selectAll(".node")
		.data(bubble(nodes).descendants())
		.enter()
		.filter(function(d){
			return  !d.children
		})
		.append("g")
		.attr("class", "node")
		.attr('id', d => getIdByName(d.data))
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")"
		})

	node.append("circle")
		.attr("r", d => d.r)
		.style("fill", d => color(d.data))

	// header, title
	node.append("text")
		.attr("dy", ".2em")
		.style("text-anchor", "middle")
		.text(d => d.data )
		.attr("font-family", "sans-serif")
		.attr("font-size", d => d.r/2)
		.attr("fill", "white")

	node.append("text")
		.attr("dy", "1.3em")
		.style("text-anchor", "middle")
		.text('min')
		.attr("font-family", "sans-serif")
		.attr("font-size", d => d.r/2)
		.attr("fill", "white")
}

function drawFilmChart(data) {
	const width = C.width,
		height = C.chartFilm.height

	const chartFilm = svg.append('g')
		.attr('id', C.chartFilm.id)
		.attr("transform", "translate(" + C.padding + "," + (C.height - height - C.padding) + ")")

	const xScale = d3.scaleBand()
			.range([0, width - C.padding])
			.domain(data.map(d => d.Movie))
			.padding(0.1)


	const xExtent = d3.extent(data, d => parseFloat(d.Rating)),
		minY = xExtent[0]-1 < 0 ? 0 : xExtent[0]-1,
		maxY = xExtent[1]+1 > 10 ? 10 : xExtent[1]+1,
		yScale = d3.scaleLinear()
		.range([height - C.padding, 0])
		.domain([minY, maxY])

	const color = d3.scaleOrdinal(data.map(d => d.Movie), d3.schemeCategory10)

	// -- axis ---
	const axisX = d3.axisBottom(xScale)
			.ticks(null, 's'),

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
		.append("rect")
		.attr('id', d => getIdByName(d.Movie))
		.attr('class', "rect")
		.attr("x", d => xScale(d.Movie))
		.attr("y", d => yScale(d.Rating))
		.attr("width", xScale.bandwidth())
		.attr("height", d => yScale(minY) - yScale(d.Rating))
		.attr('fill', d => color(d.Movie))
}

/* helper functions */
function unique (arr) {
	let obj = {}

	for (let i = 0; i < arr.length; i++) {
		let str = arr[i]
		obj[str] = true
	}

	return Object.keys(obj)
}

function getIdByName (name) {
	//remove space, (,),? and add random number
	const id = 'i' + name.replace(/\s|\(|\)|\?/g, '', '')
	return id
}

