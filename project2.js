d3.text('data/data2.csv').then(response => {
	const data = d3.csvParse(response)
	const colorLiner = d3.scaleLinear()
		.domain([4, 6, 8])
		.range(['#d73027', '#fee529', '#3de100'])
		.interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb

	//show Movie circle
	const width = 220,
		height = 220,
		radius = Math.min(width, height) / 2

	const circle = svg.append('g')
		.attr("transform", "translate(" + (180 + width / 2) + "," + (12 + height / 2) + ")")
		.append('g')
		.attr('id', "circle")

	const pie = d3.pie()
		.sort(null)
		.value(d => 2)

	const arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius * 0.6)

	const arc2 = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius)

	const pieChart = circle
		.selectAll('.arc')
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', 'arc')
		.attr('id', d => d.data.movie_title.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''))
		.on('click', function (e) {
			const alreadySelected = d3.selectAll('.selected.arc')
				.data()
				.map(d => d.data.movie_title)

			const movieName = e.data.movie_title,
				include = alreadySelected.indexOf(movieName),
				willSelect = (include < 0) ?
					alreadySelected.concat(movieName) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			const movies = data.filter(d =>
				willSelect.includes(d.movie_title)
			)

			selectThis(movies)
		})

	pieChart.append('path')
		.attr("fill", d => colorLiner(d.data.imdb_score))
		.attr("stroke-width", "1px")
		.attr("stroke", "white")
		.attr('d', arc)

	pieChart.append('text')
		.attr("dy", ".2em")
		.attr("dx", d => {
			const angle = (d.startAngle + d.endAngle) / 2 * 180 / Math.PI
			const result = angle > 180 ? 0.2 : -6.0
			return result + "em"
		})
		.text(d => {
			const text = d.data.movie_title.length > 12 ?
				(d.data.movie_title.slice(0, 10) + '..') :
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
		.attr("transform", "translate(" + 220 + "," + 50 + ")")

	const bubbleBudget = d3.pack(datasetBudget)
		.size([140, 140])
		.padding(7)

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
		.attr('id', d => d.data.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''))
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")"
		})
		.on('click', function (e) {
			const alreadySelected = d3.selectAll('.budget.selected')
				.data()
				.map(d => d.data)

			const budget = e.data,
				include = alreadySelected.indexOf(budget),
				willSelect = (include < 0) ?
					alreadySelected.concat(budget) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			const movies = data.filter(d =>
				willSelect.includes(d.budget)
			)

			selectThis(movies)
		})

	nodeBudget.append("circle")
		.attr("r", d => d.r)
		.style("fill", d => color2(d.data))

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
		const movies = data.filter(movie => movie.imdb_score === imdb_score)
		let valMovies = movies.length
		const averageBudget = movies.reduce((accumulator, currentValue, index) => {
			let budget = +currentValue.budget
			if (!currentValue.budget) {
				budget = 0
				valMovies -= 1
			}
			return budget + accumulator
		}, 0) / valMovies
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

	chartRating.selectAll('.dot')
		.data(dataScore)
		.enter()
		.append('circle')
		.attr('id', d => d.imdb_score.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''))
		.attr('class', 'dot')
		.attr('cx', (d) => xScale(d.imdb_score))
		.attr('cy', (d) => yScale(d.averageBudget))
		.attr('r', 7)
		.attr('fill', d => colorLiner(d.imdb_score))
		.on('click', function (e) {
			if (d3.select(this).classed('hide'))
				return

			const alreadySelected = d3.selectAll('.dot.selected')
				.data()
				.map(d => d.imdb_score)

			const score = e.imdb_score,
				include = alreadySelected.indexOf(score),
				willSelect = (include < 0) ?
					alreadySelected.concat(score) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			const movies = data.filter(d =>
				willSelect.includes(d.imdb_score)
			)

			selectThis(movies)
		})

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

function unique (arr) {
	let obj = {}

	for (let i = 0; i < arr.length; i++) {
		let str = arr[i]
		obj[str] = true
	}

	return Object.keys(obj)
}

const selectThis = (movies) => {
	d3.selectAll('.selected')
		.classed("selected", false)

	d3.selectAll('.budget, .dot, .arc')
		.classed('transparent', true)

	movies.forEach(movie => {

		//movie select
		const movieID = movie.movie_title.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', '')
		d3.select('#'+movieID)
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

		//budget select
		const budgetID = movie.budget.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''),
			budgetNode = d3.select('#'+budgetID)

		budgetNode
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

		//score select
		const scoreID = movie.imdb_score.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', '')
		d3.select('#'+scoreID)
			.classed("selected", true)
			.classed("hide", false)
			.classed('transparent', false)

	})
}

const svg = d3.select('#root').append('svg')
	.attr('class', 'svg')
	.attr('preserveAspectRatio', 'xMinYMin meet')
	.attr('viewBox', `0 0 600 320`)
	.on('click', function (e) {
		if (d3.event.target.tagName === 'svg') {
			svg.selectAll('.selected')
				.classed('selected', false)

			svg.selectAll('.dot, .budget, .arc')
				.classed('hide', false)
				.classed('transparent', false)
		}
	})



