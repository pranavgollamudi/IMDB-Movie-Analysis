d3.text('data/data2.csv').then(response => {
	let data = d3.csvParse(response)
	let colorLiner = d3.scaleLinear()
		.domain([4, 6, 8])
		.range(['#d73027', '#fee529', '#3de100'])
		.interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb

	//show Movie circle
	let width = 220,
		height = 220,
		radius = Math.min(width, height) / 2

	let circle = svg.append('g')
		.attr("transform", "translate(" + (180 + width / 2) + "," + (12 + height / 2) + ")")
		.append('g')
		.attr('id', "circle")

	let pie = d3.pie()
		.sort(null)
		.value(d => 2)

	let arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius * 0.6)

	let arc2 = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius)

	let pieChart = circle
		.selectAll('.arc')
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', 'arc')
		.attr('id', d => 'i'+d.data.movie_title.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''))
		.on('click', function (e) {
			let alreadySelected = d3.selectAll('.selected.arc')
				.data()
				.map(d => d.data.movie_title)

			let movieName = e.data.movie_title,
				include = alreadySelected.indexOf(movieName),
				willSelect = (include < 0) ?
					alreadySelected.concat(movieName) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			let movies = data.filter(d =>
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
			let angle = (d.startAngle + d.endAngle) / 2 * 180 / Math.PI
			let result = angle > 180 ? 0.2 : -6.0
			return result + "em"
		})
		.text(d => {
			let text = d.data.movie_title.length > 12 ?
				(d.data.movie_title.slice(0, 10) + '..') :
				d.data.movie_title
			return text
		})
		.attr("transform", d => {
			let angle = (d.startAngle + d.endAngle) / 2 * 180 / Math.PI
			return "translate(" + arc2.centroid(d) + ") "
				+ "rotate(" + (angle > 180 ? angle + 90 : angle - 90) + ")"
		})
		.style("text-anchor", "start")
		.attr("font-family", "sans-serif")
		.style("font-size", 7)


	/*  -- show  budget --  */

	let iniqBdgt = unique(data.map(d => d.budget))

	let radScale = d3.scaleLinear()
			.range([8, 12])
			.domain(d3.extent(iniqBdgt, d => +d))

	let iniqBudget = iniqBdgt
		.map(d => {
			return {
				data: d,
				x: (180 + width / 2),
				y: (12 + height / 2),
				r: radScale(d)
			}
		})

	let color2 = d3.scaleOrdinal(iniqBudget, d3.schemeCategory10)

	let budgetGraph = svg.append('g')
		.attr('id', 'budgetGraph')
	let nodes = iniqBudget //bubbleBudget(nodesBudget).descendants()

	// bubbles
	let nodeBudget = budgetGraph.selectAll(".budget")
		.data(nodes)
		.enter()
		.append("g")
		.attr("class", "budget")
		.attr('id', d => 'i'+d.data.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''))
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")"
		})
		.on('click', function (e) {
			let alreadySelected = d3.selectAll('.budget.selected')
				.data()
				.map(d => d.data)

			let budget = e.data,
				include = alreadySelected.indexOf(budget),
				willSelect = (include < 0) ?
				alreadySelected.concat(budget) :
				[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			let movies = data.filter(d =>
				willSelect.includes(d.budget)
			)

			selectThis(movies)
		})



	let simulation = d3.forceSimulation(nodes)
		.force("charge", d3.forceManyBody().strength(1))
		.force("center", d3.forceCenter((180 + width / 2) , (12 + height / 2)))
		.force("collide", d3.forceCollide()
			.strength(.5)
			.radius(d => d.r + 2)
			.iterations(1)
		) // Force that avoids circle overlapping
		.on('tick', d => {
			budgetGraph.selectAll(".budget")
				.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")"
				})
		})
	let oldx, oldy
	nodeBudget
		.call(d3.drag() // call specific function when circle is dragged
			.on("start", function(d) {
				console.log('drag start')
				if (!d3.event.active)
					simulation.alpha(1).restart()
				d.fx = d.x;
				d.fy = d.y;
				oldx = d.x
				oldy = d.y
			})
			.on("drag", function(d) {
				console.log('drag')
				d.fx = d3.event.x;
				d.fy = d3.event.y;
			})
			.on("end", function (d) {
				console.log('drag end')
				console.log(oldx === d.x)
				console.log(oldx === d.y)
				if (!d3.event.active && !(oldx === d.x || oldx === d.y) )
					simulation.alpha(10)
				d.fx = null;
				d.fy = null;
			})
		)

	nodeBudget.append("circle")
		.attr("r", d => d.r)
		.style("fill", d => color2(d.data))

	nodeBudget.append("text")
		.attr("dy", ".0em")
		.style("text-anchor", "middle")
		.text(d => {
			let roundBudget = d.data/1000000

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

	let iniqScore = unique(data.map(d => d.imdb_score))

	let dataScore = iniqScore.map(imdb_score => {
		let movies = data.filter(movie => movie.imdb_score === imdb_score)
		let valMovies = movies.length
		let averageBudget = movies.reduce((accumulator, currentValue, index) => {
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

	let chartRating = svg.append('g')
		.attr('id', 'chartRating')
		.attr("transform", "translate(100,240)")

	let xExtent = d3.extent(dataScore, d => parseFloat(d.imdb_score)),
		xScale = d3.scaleLinear()
			.range([0, 400])
			.domain([(xExtent[0]-0.1), (xExtent[1])+0.1])

	let yScale = d3.scaleLinear()
		.range([60, 0])
		.domain(d3.extent(dataScore, d => d.averageBudget))

	let axisX = d3.axisBottom(xScale)
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
		.attr('id', d => 'i'+d.imdb_score.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''))
		.attr('class', 'dot')
		.attr('cx', (d) => xScale(d.imdb_score))
		.attr('cy', (d) => yScale(d.averageBudget))
		.attr('r', 7)
		.attr('fill', d => colorLiner(d.imdb_score))
		.on('click', function (e) {
			let alreadySelected = d3.selectAll('.dot.selected')
				.data()
				.map(d => d.imdb_score)

			let score = e.imdb_score,
				include = alreadySelected.indexOf(score),
				willSelect = (include < 0) ?
					alreadySelected.concat(score) :
					[...alreadySelected.slice(0, include), ...alreadySelected.slice(include + 1)]

			let movies = data.filter(d =>
				willSelect.includes(d.imdb_score)
			)

			selectThis(movies)
		})

	chartRating
		.append('text')
		.attr('x', 430)
		.attr('y', 65)
		.attr('text-anchor', 'middle')
		.attr('font-size', '10px')
		.text('imdb score')

	chartRating
		.append('text')
		.attr('transform', 'translate(-40, 30) rotate(-90)')
		.attr('text-anchor', 'middle')
		.attr('font-size', '10px')
		.text('average budget')

})

let unique = (arr) => {
	let obj = {}

	for (let i = 0; i < arr.length; i++) {
		let str = arr[i]
		if (str !== "") {
			obj[str] = true
		}
	}

	return Object.keys(obj)
}

let selectThis = (movies) => {
	d3.selectAll('.selected')
		.classed("selected", false)

	d3.selectAll('.budget, .dot, .arc')
		.classed('transparent', true)

	movies.forEach(movie => {

		//movie select
		let movieID = 'i'+movie.movie_title.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', '')
		d3.select('#'+movieID)
			.classed("selected", true)
			.classed('transparent', false)

		//budget select
		let budgetID = 'i'+movie.budget.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', ''),
			budgetNode = d3.select('#'+budgetID)

		budgetNode
			.classed("selected", true)
			.classed('transparent', false)

		//score select
		let scoreID = 'i' + movie.imdb_score.replace(/\s|\(|\)|\?|\:|\-|\'|\"|\&|\./g, '', '')
		d3.select('#'+scoreID)
			.classed("selected", true)
			.classed('transparent', false)

	})
}

let svg = d3.select('#root').append('svg')
	.attr('class', 'svg')
	.attr('preserveAspectRatio', 'xMinYMin meet')
	.attr('viewBox', `0 0 600 320`)
	.on('click', function (e) {
		if (d3.event.target.tagName === 'svg') {
			svg.selectAll('.selected')
				.classed('selected', false)

			svg.selectAll('.dot, .budget, .arc')
				.classed('transparent', false)
		}
	})


let textarea = document.querySelector('#description')
textarea.value = localStorage.getItem("description")

textarea.addEventListener('blur', e => {
	localStorage.setItem("description", e.target.value);
})

