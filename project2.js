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
		height: 320,
		width: 450,
	},
	directorChart: {
		id: 'directorChart',
		height: 240,
		width: 365,
	},
	colors: [
		'#a50026',
		'#d73027',
		'#f46d43',
		'#fdae61',
		'#fee08b',
		'#d9ef8b',
		'#a6d96a',
		'#66bd63',
		'#1a9850',
		'#006837',
	]
}



const tooltipCont = d3.select('#tooltip')

let globalData,
	hideMode = true

const svg = d3.select('#root').append('svg')
	.attr('class', 'svg-content-responsive')
	.attr('preserveAspectRatio', 'xMinYMin meet')
	.attr('viewBox', `0 0 600 320`)
	.on('click', function (e) {
		if (d3.event.target.tagName !== 'svg')
			return

		svg.selectAll('.selected')
			.classed('selected', false)

		svg.selectAll('.rect, .node, .arc')
			.classed('hide', false)
			.classed('transparent', false)
	})

d3.text('data/data2.csv').then(response => {
	const data = d3.csvParse(response)

	//show Movie circle
	const width = 200,
		height = 200,
		radius = Math.min(width, height) / 2

	const circle = svg.append('g')
		.attr("transform", "translate(" + (40 + width / 2) + "," + (15 + height / 2) + ")")
		.append('g')
		.attr('id', "circle")

	const pie = d3.pie()
		.sort(null)
		.value(d => 1)

	const arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius * 0.6)

	const arc2 = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius)

	//add pieChart
	const pieChart = circle
		.selectAll('.arc')
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', 'arc')
		.attr('id', d => getIdByName(d.data.movie_title))
		.on('click', function (e) {
			// if (d3.select(this).classed('hide'))
			// 	return
			//
			// //what already select?
			// const alreadySelected = d3.selectAll('.selected.arc')
			// 	.data()
			// 	.map(d => d.data)
			//
			// //that node already selected?
			// const directorName = e.data,
			// 	include = alreadySelected.indexOf(directorName),
			// 	willSelect = (include < 0) ?
			// 		alreadySelected.concat(directorName) :
			// 		[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]
			//
			//
			// const movies = globalData.filter(d =>
			// 	willSelect.includes(d.Director)
			// )
			//
			// /*-- select --*/
			// selectMovie(movies)
		})

	pieChart.append('path')
		.attr("fill", "#bf5600")
		.attr("stroke-width", "1px")
		.attr("stroke", "white")
		.attr('d', arc)

	// Now add the annotation. Use the centroid method to get the best coordinates
	pieChart.append('text')
		.attr("dy", ".2em")
		.attr("dx", d => {
			const angle = (d.startAngle + d.endAngle) / 2 * 180 / Math.PI
			const result = angle > 180 ? 0.2 : -5.4
			return result + "em"
		})
		.text(d => {
			const text = d.data.movie_title.length > 18 ?
				(d.data.movie_title.slice(0, 15) + '..') :
				d.data.movie_title
			return text
		})
		.attr("transform", d => {
			const angle = (d.startAngle + d.endAngle) / 2 * 180 / Math.PI
			return "translate(" + arc2.centroid(d) + ") "
				+ "rotate(" + (angle > 180 ? angle + 90 : angle - 90) + ")"
		})
		.style("text-anchor", "start")
		.attr("font-family", "sans-serif")
		.style("font-size", 7)


	/*  -- show  budget --  */

	const iniqBudget = unique(data.map(d => d.budget))
	const datasetBudget = {
		children: iniqBudget
	}
	const color2 = d3.scaleOrdinal(iniqBudget, d3.schemeCategory10)

	const budgetGraph = svg.append('g')
		.attr('id', 'budjetGraph')
		.attr("transform", "translate(" + 300 + "," + 5 + ")")

	const bubbleBudget = d3.pack(datasetBudget)
		.size([300, 230])
		.padding(10)

	const nodesBudget = d3.hierarchy(datasetBudget)
		.sum(d => d)

	// bubbles
	const nodeBudget = budgetGraph.selectAll(".budget")
		.data( bubbleBudget(nodesBudget).descendants())
		.enter()
		.filter(function(d){
			return  !d.children
		})
		.append("g")
		.attr("class", "budget")
		.attr('id', d => getIdByName(d.data))
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")"
		})
		.on('click', function (e) {
			// if (d3.select(this).classed('hide'))
			// 	return
			//
			// //what already select?
			// const alreadySelected = d3.selectAll('.selected.node')
			// 	.data()
			// 	.map(d => d.data)
			//
			// //that node already selected?
			// const duration = e.data,
			// 	include = alreadySelected.indexOf(duration),
			// 	willSelect = (include < 0) ?
			// 		alreadySelected.concat(duration) :
			// 		[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]
			//
			// const movies = globalData.filter(d =>
			// 	willSelect.includes(d.Duration)
			// )
			//
			// /*-- select --*/
			// selectMovie(movies)
		})

	nodeBudget.append("circle")
		.attr("r", d => d.r)
		.style("fill", d => color2(d.data))

	// header, title
	nodeBudget.append("text")
		.attr("dy", ".0em")
		.style("text-anchor", "middle")
		.text(d => {
			const roundBudget = d.data/1000000

			return roundBudget
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", d => d.r/1.5)
		.attr("fill", "black")

	nodeBudget.append("text")
		.attr("dy", "1.0em")
		.style("text-anchor", "middle")
		.text("million")
		.attr("font-family", "sans-serif")
		.attr("font-size", d => d.r/2)
		.attr("fill", "black")


	/*  -- show  rating --  */

	const iniqScore = unique(data.map(d => d.imdb_score))

	const dataScore = iniqScore.map(imdb_score => {
		const movies = data.filter(movie => movie.imdb_score === imdb_score),
			averageBudget = movies.reduce((accumulator, currentValue) => {
				return +currentValue.budget + accumulator
			}, 0) / movies.length
		 return {
			 imdb_score,
			 averageBudget
		 }
	})

	const chartRating = svg.append('g')
		.attr('id', 'chartRating')
		.attr("transform", "translate(100,240)")

	const xExtent = d3.extent(dataScore, d => parseFloat(d.imdb_score)),
		xScale = d3.scaleLinear()
			.range([0, 400])
			.domain([(xExtent[0]-0.1), (xExtent[1])+0.1])

	const yScale = d3.scaleLinear()
		.range([60, 0])
		.domain(d3.extent(dataScore, d => d.averageBudget))

	const color3 = d3.scaleOrdinal(dataScore.map(d => d.imdb_score), d3.schemeCategory10)

	// -- axis ---
	const axisX = d3.axisBottom(xScale)
			.ticks(10),
		axisY = d3.axisLeft(yScale)
			.tickFormat(d3.format("~s"))
			.ticks(5)

	chartRating.append("g")
		.attr("class", "axisX")
		.attr("transform", `translate(${0},${60})`)
		.transition()
		.duration(750)
		.call(axisX)

	chartRating.append("g")
		.attr("class", "axisY")
		.transition()
		.duration(750)
		.call(axisY)


	//-- circle --

	chartRating.selectAll('dot')
		.data(dataScore)
		.enter()
		.append('circle')
		.attr('class', 'dot')
		.attr('cx', (d) => xScale(d.imdb_score))
		.attr('cy', (d) => yScale(d.averageBudget))
		.attr('r', 7)
		.attr('fill', d => color3(d.imdb_score))

	// Axis labels
	chartRating
		.append('text')
		.attr('x', 430)
		.attr('y', 65)
		.attr('text-anchor', 'middle')
		.attr('font-size', '12px')
		.text('imdb score')

	chartRating
		.append('text')
		.attr('transform', 'translate(-40, 30) rotate(-90)')
		.attr('text-anchor', 'middle')
		.attr('font-size', '12px')
		.text('average budget')

})



const showMovieCirlce = movie => {
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
			if (d3.select(this).classed('hide'))
				return

			//what already select?
			const alreadySelected = d3.selectAll('.selected.arc')
				.data()
				.map(d => d.data)

			//that node already selected?
			const directorName = e.data,
				include = alreadySelected.indexOf(directorName),
				willSelect = (include < 0) ?
					alreadySelected.concat(directorName) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]


			const movies = globalData.filter(d =>
				willSelect.includes(d.Director)
			)

			/*-- select --*/
			selectMovie(movies)
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
		.padding(10)

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
		.on('click', function (e) {
			if (d3.select(this).classed('hide'))
				return

			//what already select?
			const alreadySelected = d3.selectAll('.selected.node')
				.data()
				.map(d => d.data)

			//that node already selected?
			const duration = e.data,
				include = alreadySelected.indexOf(duration),
				willSelect = (include < 0) ?
					alreadySelected.concat(duration) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			const movies = globalData.filter(d =>
				willSelect.includes(d.Duration)
			)

			/*-- select --*/
			selectMovie(movies)
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

	const sortedData = data.sort((a, b) => {
		return  +b.Rating - +a.Rating
	})


	const chartFilm = svg.append('g')
		.attr('id', C.chartFilm.id)
		.attr("transform", "translate(" + C.padding + "," + (C.height - height - C.padding) + ")")

	const xScale = d3.scaleBand()
			.range([0, width - C.padding*2])
			.domain(sortedData.map(d => d.Movie))
			.padding(0.1)

	const xExtent = d3.extent(sortedData, d => parseFloat(d.Rating)),
		minY = xExtent[0]-1 < 0 ? 0 : xExtent[0]-1,
		maxY = xExtent[1]+1 > 10 ? 10 : xExtent[1]+1,
		yScale = d3.scaleLinear()
		.range([height - C.padding, 0])
		.domain([minY, maxY])

	const color = d3.scaleOrdinal(sortedData.map(d => d.Movie), d3.schemeCategory10)

	// -- axis ---
	const axisX = d3.axisBottom(xScale)
			.ticks(null, 's'),
			// .tickSize(1)
		axisY = d3.axisLeft(yScale)
			.tickFormat(d3.format(".0f"))

	chartFilm.append("g")
		.attr("class", "axisY")
		.transition()
		.duration(750)
		.call(axisY)

	//-- circle --

	const rectCont = chartFilm.selectAll('rect')
		.data(sortedData)
		.enter()
		.append("g")

	rectCont.append("rect")
		.attr('id', d => getIdByName(d.Movie))
		.attr('class', "rect")
		.attr("x", d => xScale(d.Movie))
		.attr("y", d => yScale(d.Rating))
		.attr("width", xScale.bandwidth())
		.attr("height", d => yScale(minY) - yScale(d.Rating))
		.attr('fill', d => color(d.Movie))
		.on("mousemove", function(e) {
			if (d3.select(this).classed('hide'))
				return

			const {
				Movie,
				Year,
				Actor,
				Language,
				Duration } = e,
				html = `
					<div>
						<span>${Movie},</span>
						<span> ${Duration} min,</span><br>
						<span>${Year},</span><br>
						<span>${Actor},</span><br>
						<span>${Language},</span><br>
					</div>
				`

			tooltipCont.html(html)
				.style("top", (d3.event.pageY+30) + "px")
				.style("left", (d3.event.pageX+10 ) + "px")
				.style("display", "flex");


		})
		.on("mouseout", function() {
			tooltipCont.style("display", "none");
		})
		.on('click', function (e) {
			if (d3.select(this).classed('hide'))
				return

			//what already select?
			const alreadySelected = d3.selectAll('.selected.rect')
				.data()
				.map(d => d.Movie)

			//that node already selected?
			const movieName = e.Movie,
				include = alreadySelected.indexOf(movieName),
				willSelect = (include < 0) ?
					alreadySelected.concat(movieName) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			const movies = globalData.filter(d =>
				willSelect.includes(d.Movie)
			)

			selectMovie(movies)
		})

	rectCont.append('text')
		.attr('class', 'movieName')
		.attr("transform", d => "translate(" + (xScale(d.Movie) + 8) + "," + (yScale(minY) + 12) + ") rotate(-30)")
		.text(d => {
			let result = d.Movie
			if (d.Movie.length > 20) {
				result = d.Movie.slice(0,17) + '...'
			}

			return result
		})


	chartFilm.append("g")
		.attr("class", "axisX")
		.attr("transform", `translate(${0},${height - C.padding})`)
		.transition()
		.duration(750)
		.call(axisX)
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

function selectMovie (movies = []) {
	/*-deselect and hide all*/
	d3.selectAll('.selected')
		.classed("selected", false)

	d3.selectAll('.node, .rect, .arc')
		.classed("hide", true && hideMode)
		.classed('transparent', true)

	/*-- select --*/
	movies.forEach(movie => {

		//movie select
		const movieID = getIdByName(movie.Movie)
		d3.select('#'+movieID)
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

		//director select
		const directorID = getIdByName(movie.Director),
			directorNode = d3.select('#'+directorID),
			directorData = directorNode.data()[0]

		directorNode
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

		const pieChart = d3.select('#'+C.directorChart.id),
			startAngle = directorData.startAngle,
			endAngle = directorData.endAngle,
			angle = 270 - (startAngle + endAngle) / 2 * 180 / Math.PI

		pieChart
			.transition()
			.duration(750)
			.attr('transform', `rotate(${angle})`)

		//duration select
		const durationID = getIdByName(movie.Duration)
		d3.select('#'+durationID)
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

	})
}

function getIdByName (name) {
	//remove space, (,),? and add random number
	const id = 'i' + name.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', '')
	return id
}

function makeAbsoluteContext(element, svgDocument) {
	return function(x,y) {
		var offset = svgDocument.getBoundingClientRect();
		var matrix = element.getScreenCTM();
		return {
			x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
			y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
		};
	};
}

