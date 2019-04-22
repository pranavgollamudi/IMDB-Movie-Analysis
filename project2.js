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
	hideMode = false

const svg = d3.select('#root').append('svg')
	.attr('class', 'svg-content-responsive')
	.attr('preserveAspectRatio', 'xMinYMin meet')
	.attr('viewBox', `0 0 600 320`)
	.on('click', function (e) {
		if (d3.event.target.tagName !== 'svg')
			return

		svg.selectAll('.selected')
			.classed('selected', false)

		svg.selectAll('.dot, .budget, .arc')
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

			//what already select?
			const alreadySelected = d3.selectAll('.selected.arc')
				.data()
				.map(d => d.data.movie_title)

			//that node already selected?
			const movieName = e.data.movie_title,
				include = alreadySelected.indexOf(movieName),
				willSelect = (include < 0) ?
					alreadySelected.concat(movieName) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]


			const movies = data.filter(d =>
				willSelect.includes(d.movie_title)
			)

			/*-- select --*/
			selectMovie(movies)
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
		.attr('id', 'budgetGraph')
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
			if (d3.select(this).classed('hide'))
				return

			//what already select?
			const alreadySelected = d3.selectAll('.budget.selected')
				.data()
				.map(d => d.data)

			//that node already selected?
			const budget = e.data,
				include = alreadySelected.indexOf(budget),
				willSelect = (include < 0) ?
					alreadySelected.concat(budget) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			const movies = data.filter(d =>
				willSelect.includes(d.budget)
			)

			/*-- select --*/
			selectMovie(movies)
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

	chartRating.selectAll('.dot')
		.data(dataScore)
		.enter()
		.append('circle')
		.attr('id', d => getIdByName(d.imdb_score))
		.attr('class', 'dot')
		.attr('cx', (d) => xScale(d.imdb_score))
		.attr('cy', (d) => yScale(d.averageBudget))
		.attr('r', 7)
		.attr('fill', d => color3(d.imdb_score))
		.on('click', function (e) {
			if (d3.select(this).classed('hide'))
				return

			//what already select?
			const alreadySelected = d3.selectAll('.dot.selected')
				.data()
				.map(d => d.imdb_score)

			//that node already selected?
			const score = e.imdb_score,
				include = alreadySelected.indexOf(score),
				willSelect = (include < 0) ?
					alreadySelected.concat(score) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			const movies = data.filter(d =>
				willSelect.includes(d.imdb_score)
			)

			/*-- select --*/
			selectMovie(movies)
		})

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

	d3.selectAll('.budget, .dot, .arc')
		.classed("hide", true && hideMode)
		.classed('transparent', true)

	/*-- select --*/
	movies.forEach(movie => {

		//movie select
		const movieID = getIdByName(movie.movie_title)
		d3.select('#'+movieID)
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

		//budget select
		const budgetID = getIdByName(movie.budget),
			budgetNode = d3.select('#'+budgetID)

		budgetNode
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

		//score select
		const scoreID = getIdByName(movie.imdb_score)
		d3.select('#'+scoreID)
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


