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


const data = [{"color":"Color","gross":"760505847","actor_1_name":"CCH Pounder","":"","movie_title":"Avatar ","budget":"237000000","imdb_score":"7.9","movie_facebook_likes":"33000","movie_imdb_link":"http://www.imdb.com/title/tt0499549/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"309404152","actor_1_name":"Johnny Depp","":"","movie_title":"Pirates of the Caribbean: At World's End ","budget":"300000000","imdb_score":"7.1","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0449088/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"200074175","actor_1_name":"Christoph Waltz","":"","movie_title":"Spectre ","budget":"245000000","imdb_score":"6.8","movie_facebook_likes":"85000","movie_imdb_link":"http://www.imdb.com/title/tt2379713/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"448130642","actor_1_name":"Tom Hardy","":"","movie_title":"The Dark Knight Rises ","budget":"250000000","imdb_score":"8.5","movie_facebook_likes":"164000","movie_imdb_link":"http://www.imdb.com/title/tt1345836/?ref_=fn_tt_tt_1"},{"color":"","gross":"","actor_1_name":"Doug Walker","":"","movie_title":"Star Wars: Episode VII - The Force Awakens             ","budget":"","imdb_score":"7.1","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt5289954/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"73058679","actor_1_name":"Daryl Sabara","":"","movie_title":"John Carter ","budget":"263700000","imdb_score":"6.6","movie_facebook_likes":"24000","movie_imdb_link":"http://www.imdb.com/title/tt0401729/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"336530303","actor_1_name":"J.K. Simmons","":"","movie_title":"Spider-Man 3 ","budget":"258000000","imdb_score":"6.2","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0413300/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"200807262","actor_1_name":"Brad Garrett","":"","movie_title":"Tangled ","budget":"260000000","imdb_score":"7.8","movie_facebook_likes":"29000","movie_imdb_link":"http://www.imdb.com/title/tt0398286/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"458991599","actor_1_name":"Chris Hemsworth","":"","movie_title":"Avengers: Age of Ultron ","budget":"250000000","imdb_score":"7.5","movie_facebook_likes":"118000","movie_imdb_link":"http://www.imdb.com/title/tt2395427/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"301956980","actor_1_name":"Alan Rickman","":"","movie_title":"Harry Potter and the Half-Blood Prince ","budget":"250000000","imdb_score":"7.5","movie_facebook_likes":"10000","movie_imdb_link":"http://www.imdb.com/title/tt0417741/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"330249062","actor_1_name":"Henry Cavill","":"","movie_title":"Batman v Superman: Dawn of Justice ","budget":"250000000","imdb_score":"6.9","movie_facebook_likes":"197000","movie_imdb_link":"http://www.imdb.com/title/tt2975590/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"200069408","actor_1_name":"Kevin Spacey","":"","movie_title":"Superman Returns ","budget":"209000000","imdb_score":"6.1","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0348150/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"168368427","actor_1_name":"Giancarlo Giannini","":"","movie_title":"Quantum of Solace ","budget":"200000000","imdb_score":"6.7","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0830515/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"423032628","actor_1_name":"Johnny Depp","":"","movie_title":"Pirates of the Caribbean: Dead Man's Chest ","budget":"225000000","imdb_score":"7.3","movie_facebook_likes":"5000","movie_imdb_link":"http://www.imdb.com/title/tt0383574/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"89289910","actor_1_name":"Johnny Depp","":"","movie_title":"The Lone Ranger ","budget":"215000000","imdb_score":"6.5","movie_facebook_likes":"48000","movie_imdb_link":"http://www.imdb.com/title/tt1210819/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"291021565","actor_1_name":"Henry Cavill","":"","movie_title":"Man of Steel ","budget":"225000000","imdb_score":"7.2","movie_facebook_likes":"118000","movie_imdb_link":"http://www.imdb.com/title/tt0770828/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"141614023","actor_1_name":"Peter Dinklage","":"","movie_title":"The Chronicles of Narnia: Prince Caspian ","budget":"225000000","imdb_score":"6.6","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0499448/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"623279547","actor_1_name":"Chris Hemsworth","":"","movie_title":"The Avengers ","budget":"220000000","imdb_score":"8.1","movie_facebook_likes":"123000","movie_imdb_link":"http://www.imdb.com/title/tt0848228/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"241063875","actor_1_name":"Johnny Depp","":"","movie_title":"Pirates of the Caribbean: On Stranger Tides ","budget":"250000000","imdb_score":"6.7","movie_facebook_likes":"58000","movie_imdb_link":"http://www.imdb.com/title/tt1298650/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"179020854","actor_1_name":"Will Smith","":"","movie_title":"Men in Black 3 ","budget":"225000000","imdb_score":"6.8","movie_facebook_likes":"40000","movie_imdb_link":"http://www.imdb.com/title/tt1409024/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"255108370","actor_1_name":"Aidan Turner","":"","movie_title":"The Hobbit: The Battle of the Five Armies ","budget":"250000000","imdb_score":"7.5","movie_facebook_likes":"65000","movie_imdb_link":"http://www.imdb.com/title/tt2310332/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"262030663","actor_1_name":"Emma Stone","":"","movie_title":"The Amazing Spider-Man ","budget":"230000000","imdb_score":"7","movie_facebook_likes":"56000","movie_imdb_link":"http://www.imdb.com/title/tt0948470/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"105219735","actor_1_name":"Mark Addy","":"","movie_title":"Robin Hood ","budget":"200000000","imdb_score":"6.7","movie_facebook_likes":"17000","movie_imdb_link":"http://www.imdb.com/title/tt0955308/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"258355354","actor_1_name":"Aidan Turner","":"","movie_title":"The Hobbit: The Desolation of Smaug ","budget":"225000000","imdb_score":"7.9","movie_facebook_likes":"83000","movie_imdb_link":"http://www.imdb.com/title/tt1170358/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"70083519","actor_1_name":"Christopher Lee","":"","movie_title":"The Golden Compass ","budget":"180000000","imdb_score":"6.1","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0385752/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"218051260","actor_1_name":"Naomi Watts","":"","movie_title":"King Kong ","budget":"207000000","imdb_score":"7.2","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0360717/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"658672302","actor_1_name":"Leonardo DiCaprio","":"","movie_title":"Titanic ","budget":"200000000","imdb_score":"7.7","movie_facebook_likes":"26000","movie_imdb_link":"http://www.imdb.com/title/tt0120338/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"407197282","actor_1_name":"Robert Downey Jr.","":"","movie_title":"Captain America: Civil War ","budget":"250000000","imdb_score":"8.2","movie_facebook_likes":"72000","movie_imdb_link":"http://www.imdb.com/title/tt3498820/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"65173160","actor_1_name":"Liam Neeson","":"","movie_title":"Battleship ","budget":"209000000","imdb_score":"5.9","movie_facebook_likes":"44000","movie_imdb_link":"http://www.imdb.com/title/tt1440129/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"652177271","actor_1_name":"Bryce Dallas Howard","":"","movie_title":"Jurassic World ","budget":"150000000","imdb_score":"7","movie_facebook_likes":"150000","movie_imdb_link":"http://www.imdb.com/title/tt0369610/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"304360277","actor_1_name":"Albert Finney","":"","movie_title":"Skyfall ","budget":"200000000","imdb_score":"7.8","movie_facebook_likes":"80000","movie_imdb_link":"http://www.imdb.com/title/tt1074638/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"373377893","actor_1_name":"J.K. Simmons","":"","movie_title":"Spider-Man 2 ","budget":"200000000","imdb_score":"7.3","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0316654/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"408992272","actor_1_name":"Robert Downey Jr.","":"","movie_title":"Iron Man 3 ","budget":"200000000","imdb_score":"7.2","movie_facebook_likes":"95000","movie_imdb_link":"http://www.imdb.com/title/tt1300854/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"334185206","actor_1_name":"Johnny Depp","":"","movie_title":"Alice in Wonderland ","budget":"200000000","imdb_score":"6.5","movie_facebook_likes":"24000","movie_imdb_link":"http://www.imdb.com/title/tt1014759/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"234360014","actor_1_name":"Hugh Jackman","":"","movie_title":"X-Men: The Last Stand ","budget":"210000000","imdb_score":"6.8","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0376994/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"268488329","actor_1_name":"Steve Buscemi","":"","movie_title":"Monsters University ","budget":"200000000","imdb_score":"7.3","movie_facebook_likes":"44000","movie_imdb_link":"http://www.imdb.com/title/tt1453405/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"402076689","actor_1_name":"Glenn Morshower","":"","movie_title":"Transformers: Revenge of the Fallen ","budget":"200000000","imdb_score":"6","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt1055369/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"245428137","actor_1_name":"Bingbing Li","":"","movie_title":"Transformers: Age of Extinction ","budget":"210000000","imdb_score":"5.7","movie_facebook_likes":"56000","movie_imdb_link":"http://www.imdb.com/title/tt2109248/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"234903076","actor_1_name":"Tim Holmes","":"","movie_title":"Oz the Great and Powerful ","budget":"215000000","imdb_score":"6.4","movie_facebook_likes":"60000","movie_imdb_link":"http://www.imdb.com/title/tt1623205/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"202853933","actor_1_name":"Emma Stone","":"","movie_title":"The Amazing Spider-Man 2 ","budget":"200000000","imdb_score":"6.7","movie_facebook_likes":"41000","movie_imdb_link":"http://www.imdb.com/title/tt1872181/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"172051787","actor_1_name":"Jeff Bridges","":"","movie_title":"TRON: Legacy ","budget":"170000000","imdb_score":"6.8","movie_facebook_likes":"30000","movie_imdb_link":"http://www.imdb.com/title/tt1104001/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"191450875","actor_1_name":"Joe Mantegna","":"","movie_title":"Cars 2 ","budget":"200000000","imdb_score":"6.3","movie_facebook_likes":"10000","movie_imdb_link":"http://www.imdb.com/title/tt1216475/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"116593191","actor_1_name":"Ryan Reynolds","":"","movie_title":"Green Lantern ","budget":"200000000","imdb_score":"5.6","movie_facebook_likes":"24000","movie_imdb_link":"http://www.imdb.com/title/tt1133985/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"414984497","actor_1_name":"Tom Hanks","":"","movie_title":"Toy Story 3 ","budget":"200000000","imdb_score":"8.3","movie_facebook_likes":"30000","movie_imdb_link":"http://www.imdb.com/title/tt0435761/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"125320003","actor_1_name":"Christian Bale","":"","movie_title":"Terminator Salvation ","budget":"200000000","imdb_score":"6.6","movie_facebook_likes":"0","movie_imdb_link":"http://www.imdb.com/title/tt0438488/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"350034110","actor_1_name":"Jason Statham","":"","movie_title":"Furious 7 ","budget":"190000000","imdb_score":"7.2","movie_facebook_likes":"94000","movie_imdb_link":"http://www.imdb.com/title/tt2820852/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"202351611","actor_1_name":"Peter Capaldi","":"","movie_title":"World War Z ","budget":"190000000","imdb_score":"7","movie_facebook_likes":"129000","movie_imdb_link":"http://www.imdb.com/title/tt0816711/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"233914986","actor_1_name":"Jennifer Lawrence","":"","movie_title":"X-Men: Days of Future Past ","budget":"200000000","imdb_score":"8","movie_facebook_likes":"82000","movie_imdb_link":"http://www.imdb.com/title/tt1877832/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"228756232","actor_1_name":"Benedict Cumberbatch","":"","movie_title":"Star Trek Into Darkness ","budget":"190000000","imdb_score":"7.8","movie_facebook_likes":"92000","movie_imdb_link":"http://www.imdb.com/title/tt1408101/?ref_=fn_tt_tt_1"},{"color":"Color","gross":"65171860","actor_1_name":"Eddie Marsan","":"","movie_title":"Jack the Giant Slayer ","budget":"195000000","imdb_score":"6.3","movie_facebook_likes":"22000","movie_imdb_link":"http://www.imdb.com/title/tt1351685/?ref_=fn_tt_tt_1"}]

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
		.on('dblclick', function (e) {
			let url = e.data.movie_imdb_link
			window.open(url, '_blank')
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

	





