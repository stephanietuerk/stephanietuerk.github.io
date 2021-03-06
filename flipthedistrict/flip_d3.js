console.log("I'm here");

//Global color variables
	var rColor = "#f4003d",
		dColor = "#2437ff",
		dMapColor = "#394bff",
		oColor = "#f6b500",
		initialColor = "#cccccc";

	//
	//
	//
	//Create visualization container
	//////////////////////////////////////////////
		var flipContainer = d3.select("#flip").append("svg")
			.attr("class", "vizContainer")
			.attr("width", 906)
			.attr("height", 800);


	//
	//Create start page
	/////////////////////////////////////////////

		var startButtonContainer = flipContainer.append("svg")
			.attr("class", "vizContainer")
			.attr("width", 906)
			.attr("height", 700)
			.attr("x", 0)
			.attr("y", 0);

		var startBackground = startButtonContainer.append("image")
			.attr("xlink:href", "background_text_big.png")
			.attr("x", 0)
			.attr("y", 0)

		var	startButtonBox = startButtonContainer.append("rect")
			.attr("class", "start-button")
			.attr("x", 270)
			.attr("y", 270)
			.attr("width", 360)
			.attr("height", 80)
			.style("fill", initialColor);

		var startTitle = startButtonContainer.append("text")
			.attr("class", "start-text")
			.attr("x", 450)
			.attr("y", 230)
			.style("text-anchor", "middle")
			.style("fill", "white")
			.text("Flip the District")
			.transition()
			    .delay(function(d, i) { return i * 50; })
			    .on("start", function repeat() {
			        d3.active(this)
			            .duration(200)
			            .style("fill", rColor)
			          .transition()
			          	.duration(200)
			            .style("fill", initialColor)
			          .transition()
			          	.duration(200)
			            .style("fill", dColor)
			          .transition()
			          	.duration(200)
			            .on("start", repeat);
			      });

		var startSub = startButtonContainer.append("text")
			.attr("class", "start-smtext")
			.attr("x", 450)
			.attr("y", 295)
			.style("text-anchor", "middle")
			.style("fill", "white")
			.text("drag the bars - change the vote");


		var startEnterBox = startButtonContainer.append("rect")
			.attr("class", "start-text_sm")
			.attr("width", 100)
			.attr("height", 35)
			.attr("x", 400)
			.attr("y", 305)
			.style("fill", "#bbbbbb")
			.style("stroke", "white")
			.style("stroke-width", "1px")
			.on("click", makeFlipViz)
			.on("mouseover", function(d) {
					d3.select(this).style("stroke", "white");
				})
			.on("mouseout", function(d) {
					d3.select(this).style("stroke", "#bbbbbb");
			});
			

		var startEnterText = startButtonContainer.append("text")
			.attr("class", "start-smtext")
			.attr("x", 450)
			.attr("y", 328)
			.style("text-anchor", "middle")
			.style("fill", "white")
			.text("LET'S GO")
			.on("click", makeFlipViz)
			.on("mouseover", function(d) {
				startEnterBox.style("stroke", "white");
				startEnterBox.style("stroke-width", "3px");
			})
			.on("mouseout", function(d) {
				startEnterBox.style("stroke", "#bbbbbb");
			});
		

	function makeFlipViz () {

		d3.selectAll("svg").remove();

		//
		//
		//
		//Create visualization container
		//////////////////////////////////////////////
		var flipContainer = d3.select("#flip").append("svg")
				.attr("class", "vizContainer")
				.attr("width", 906)
				.attr("height", 700);


		//Read in Data and create visualization from that 
		d3.tsv("CD_VoteData.tsv", function(data) {
			
			//nest data by CD	
			var cdData = d3.nest()
				.key(function(d) {return d.CD;}) 
				.entries(data);

			console.log(cdData);

		//
		//
		//Create global data holder.
		//Initialize to zero, fill from within makeBar()
		//////////////////////////////////////////////
			var voteDataHolder = [];
			
			for (i in cdData.length) {
				voteDataHolder.push(0);
			};

			// console.log(voteDataHolder);


		//		
		//
		//Create bars for each Congressional District
		//this needs to be done first so that data values can then be read from bars
		/////////////////////////////////////////////

			var	numBars = cdData.length,
				w_bar = 25,
				h_bar = 200,
				barMargin = {top: 0, right: 11, bottom: 0, left: 11},
				boxMargin = {top: 30, right: 30, bottom: 0, left: 30},
				barOffset = 25;

			var barsBoxWidth = ((numBars*(barMargin.left+w_bar+barMargin.right))+(boxMargin.left+boxMargin.right)),
				barsBoxHeight = h_bar + 50;

			//Create container to hold bars graphic
			var barsContainer = flipContainer.append("svg")
				.attr("class", "container")
				.attr("width", barsBoxWidth)
				.attr("height", barsBoxHeight)
				.attr("x", 0)
				.attr("y", 160);


			//Create dashed line to represent 50% of the votes	
			var lineLength = barsBoxWidth;

			var line = barsContainer.append("line")
				.attr("class", "bars-line")
				.attr("x1", 0)
				.attr("x2", lineLength)
				.attr("y1", barOffset + h_bar/2)
				.attr("y2", barOffset + h_bar/2)
				.style("stroke", "#909090")
				.style("stroke-width", "2px")
				.style("stroke-dasharray", ("2,2"))
				.style("stroke-linecap", "butt");

			var linelabel = barsContainer.append("text")
				.attr("class", "bars-line-label")
				.attr("x", 872)
				.attr("y", barOffset + h_bar/2 + 12)
				.style("text-anchor", "right")
				.text("50% of")

			var linelabel2 = barsContainer.append("text")
				.attr("class", "bars-line-label")
				.attr("x", 880)
				.attr("y", barOffset + h_bar/2 + 22)
				.style("text-anchor", "right")
				.text("votes")

			var cdLabel = barsContainer.append("text")
				.attr("class", "display-cong")
				.attr("x", barsBoxWidth/2)
				.attr("y", 20)
				.style("text-anchor", "middle")
				.text("congressional districts");

			var dragLabel = barsContainer.append("text")
				.attr("class", "display-cong")
				.attr("x", barsBoxWidth/2)
				.attr("y", 240)
				.style("text-anchor", "middle")
				.text("drag to change the vote");


			//Add an SVG holder for each bar/congressional district, with the desired dimensions and margin.
			//Append a "svg: g" to each SVG that moves bar into the center of the SVG mentioned above, creating space between bars
			var svg = barsContainer.selectAll("svg")
				.data(cdData)
			  .enter()
				.append("svg") //svg container for one bar element
				.attr("width", w_bar+barMargin.left+barMargin.right)
				.attr("height", h_bar+barMargin.top+barMargin.bottom)
				.attr("x", function (d, i) {
					return (boxMargin.left+(i*(w_bar+barMargin.right+barMargin.left)));
				})
				.attr("y", barOffset);




		    //Append placeholder "svg:g" for each bar that rectangles will be appended to
		    var svgbar = svg.append("g")
		    	.attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")")
				.each(makeBar);

			//
			//Initialize global (statewide) data variables -- must be called after makeBar or will be 0
			//////////////////////////////////////////////
			var stateVoteSums = getStateSums();
				
			var voteSums = stateVoteSums[0],
				districtSums = stateVoteSums[1];

			var dSum = voteSums[0],
				rSum = voteSums[1],
				oSum = voteSums[2];

			var dDistrictSum = districtSums[0],
				rDistrictSum = districtSums[1],	
				oDistrictSum = districtSums[2];
			//
			//
			//Create top container (to hold map and vote grid) (now at bottom)
			/////////////////////////////////////////////
				var topBoxWidth = 900,
					topBoxHeight = 350;

				var topContainer = flipContainer.append("svg")
					.attr("class", "container")
					.attr("width", topBoxWidth)
					.attr("height", topBoxHeight)
					.attr("x", 3)
					.attr("y", 390);

				//small text info - static and dynamic
				var popBoxLabel = topContainer.append("text")
					.attr("class", "display-label")
					.attr("x", 525)
					.attr("y", 65)
					.style("text-anchor", "right")
					.text("statewide votes: 5,757,009");

				var seatsLabel = topContainer.append("text")
					.attr("class", "display-label")
					.attr("x", 860-(500/9))
					.attr("y", 65)
					.style("text-anchor", "right")
					.text("seats: 18");

				//Convert floating point numbers to something normal
				var format = d3.format(",d");


				var cdInfoTextContainer = topContainer.append("g")
					.style("opacity", 0)
					

				// Map text
				var cdInfoName = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-header")
					
				var cdInfoVotes = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-label-sm")
					.text("2016 votes:")
					.style("text-anchor", "start");

				var cdInfoVotesNum = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-num")
					.style("text-anchor", "end");

				var cdInfoDCand = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-cand text-dem")

				var cdInfoDCandPer = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-num text-dem")
					.style("text-anchor", "end");

				var cdInfoRCand = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-cand text-rep")

				var cdInfoRCandPer = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-num text-rep")
					.style("text-anchor", "end");

				var cdInfoOCand = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-cand text-oth")

				var cdInfoOCandPer = cdInfoTextContainer.append("text")
					.attr("class", "cd-info-text cd-info-text-num text-oth")
					.style("text-anchor", "end");

			//
			//
			//Create small map of Pennsylvania in top container
			/////////////////////////////////////////////
				var mapBoxWidth = 475,
					mapBoxHeight = 300;

				//Create container to hold map graphic
				var mapContainer = topContainer.append("svg")
					.attr("width", mapBoxWidth)
					.attr("height", mapBoxHeight)
					.attr("x", 50)
					.attr("y", 15);


				d3.json("PA_CongDist_2015.json", function(error, pa) {
				  if (error) return console.error(error);
				  
				
					var projection = d3.geoAlbers()
				    .scale(6000)
				    .rotate( [77.1945,0] )
		    		.center( [0, 41.2033] )
				    .translate([mapBoxWidth / 2, mapBoxHeight / 2]);

				    var path = d3.geoPath()
				    .projection(projection);


					mapContainer.append("g")
						.selectAll("path")
				    .data(topojson.feature(pa, pa.objects.PA_CongDist_2015).features) 
				      	.enter().append("path")
				      	.attr("class", "cd-boundaries")
				      	.attr("d", path)
				      	.attr("CD", function(d) {return +d.properties.CD114FP})
				      	.attr("winner", function(d) {
				      		var cd = this.getAttribute("CD");
				      		var dVotes = voteDataHolder[cd-1]["DEM"];
				      		var rVotes = voteDataHolder[cd-1]["REP"];
				      		var oVotes = voteDataHolder[cd-1]["OTH"];
				      		if ((dVotes > rVotes) && (dVotes > oVotes)) {
				      			return "DEM";
				      		}
				      		if ((rVotes > dVotes) && (rVotes > oVotes)) {
				      			return "REP";
				      		}
				      		if ((oVotes > dVotes) && (oVotes > rVotes)) {
				      			return "OTH";
				      		}
				      	})
				      	.style("fill", initialColor)
				      	.transition()
				      		.delay(function(d) {
				      			var cdNum = +d.properties.CD114FP;
				      			return (300+(cdNum*70));
				      		})
				      		.duration(420)   	
					     	.style("fill", function(d) {
								// var cdNum = +d.properties.CD114FP;
				      			if (this.getAttribute("winner") == "DEM") {
				      				return dMapColor;
				      			}
				      			if (this.getAttribute("winner") == "REP") {
				      				return rColor;
				      			}
				      			if (this.getAttribute("winner") == "REP") {
				      				return oColor;
								}
				      		});				      		
				//end d3.json function call ->
				});
			
			//end of small map 

			//
			//
			//Create vote grid for Pennsylvania at large in top container
			/////////////////////////////////////////////
				var voteGridWidth = 250,
					voteGridHeight = 250,
					gridSq = 5,
					gridRows = voteGridHeight/gridSq,
					gridCols = voteGridWidth/gridSq,
					numGridSquares = gridRows*gridCols;

				//Create container to hold vote grid graphic
				var voteGridContainer = topContainer.append("svg")
					.attr("width", voteGridWidth)
					.attr("height", voteGridHeight)
					.attr("x", 525)
					.attr("y", 70)
					.append("g");
						
				var grid = voteGridContainer.each(makeVoteGrid);

			//end of vote grid

			//
			//
			//Create CD bar for Pennsylvania at large in top container
			/////////////////////////////////////////////
				var congBarWidth = (500/9),
					congBarHeight = 250,
					congBarSq = (500/18),
					congBarRows = congBarHeight/congBarSq,
					congBarCols = congBarWidth/congBarSq,
					numCongSquares = congBarRows*congBarCols;

				//Create container to hold vote grid graphic
				var congBarContainer = topContainer.append("svg")
					.attr("width", congBarWidth)
					.attr("height", congBarHeight)
					.attr("x", 860-congBarWidth)
					.attr("y", 70)
					.append("g");
					
				var congBar = congBarContainer.each(makecongBar);

			//end of top container 
			
			//
			//
			//Create display to show numbers
			/////////////////////////////////////////////
				var displayBoxWidth = 900,
					displayBoxHeight = 160;

				//Create container to hold vote grid graphic
				var displayContainer = flipContainer.append("svg")
					.attr("class", "container")
					.attr("width", displayBoxWidth)
					.attr("height", displayBoxHeight)
					.attr("x", 3)
					.attr("y", 0)
					.append("g");


				var line = displayContainer.append("line")
					.attr("class", "bars-line")
					.attr("x1", 110)
					.attr("x2", 790)
					.attr("y1", 83)
					.attr("y2", 83)
					.style("stroke", "#cccccc")
					.style("stroke-width", "2px")
					// .style("stroke-dasharray", ("2,2"))
					.style("stroke-linecap", "butt");


				//Make display boxes for text elements

				//For static text
				

				var votesFixedDisplay = displayContainer.append("text")
					.attr("class", "display-static")
					.attr("x", displayBoxWidth/2)
					.attr("y", (displayBoxHeight/2)-20)
					.style("text-anchor", "middle")
					.text("votes");

				var districtsFixedDisplay = displayContainer.append("text")
					.attr("class", "display-static")
					.attr("x", displayBoxWidth/2)
					.attr("y", (displayBoxHeight/2)+40+10)
					.style("text-anchor", "middle")
					.text("seats");

				
				//For dynamic text

				
				

				//Dem Votes
				var demVotesDisplay = displayContainer.append("g");

				var demVotesNum = demVotesDisplay.append("text")
					.attr("class", "display-data-dem display-votes")
					.attr("id", "dVotesDisplay")
					.attr("width", 300)
					.attr("x", displayBoxWidth/4)
					.attr("y", (displayBoxHeight/2)-15)
					.style("text-anchor", "middle")
					.style("fill", dColor)
					.style("stroke", "none")
					.text("0");

				demVotesDisplay.select("text")
					.transition()
						.ease(d3.easeQuadOut) 
						.duration(2500)
						.tween("text", function() {
							var that = d3.select(this);
							var	i = interpolateNumber(that.text(), dSum);
								return function(t) { 
									that.text(format(i(t)));
								};
						});	

				//Rep Votes
				var repVotesDisplay = displayContainer.append("g")

				var repVotesNum = repVotesDisplay.append("text")
					.attr("class", "display-data-rep display-votes")
					.attr("id", "rVotesDisplay")
					.attr("width", 300)
					.attr("x", displayBoxWidth*(3/4))
					.attr("y", (displayBoxHeight/2)-15)
					.style("text-anchor", "middle")
					.style("fill", rColor)
					.style("stroke", "none")
					.text("0");
					

				repVotesDisplay.select("text")	
					.transition()
						.ease(d3.easeQuadOut) 
						.duration(2500)
						.tween("text", function() {
							var that = d3.select(this);
							var	i = interpolateNumber(that.text(), rSum);
								return function(t) { 
									that.text(format(i(t)));
								};
						});

				//Dem Districts
				var demDistrictsDisplay = displayContainer.append("g");

				var demDistrictsNum = demDistrictsDisplay.append("text")
					.attr("class", "display-data-dem display-districts")
					.attr("id", "dDistrictsDisplay")
					.attr("x", displayBoxWidth*(1/4))
					.attr("y", (displayBoxHeight/2)+40+10)
					.style("text-anchor", "middle")
					.style("fill", dColor)
					.text("");

				demDistrictsDisplay.select("text")	
					.transition()
						//.ease("poly-out")
						.duration(2500)
						.tween("text", function() {
							var that = d3.select(this);
							var	i = interpolateNumber(that.text(), dDistrictSum);
							return function(t) { 
								that.text(format(i(t)));
								};
						});

				//Rep districts
				var repDistrictsDisplay = displayContainer.append("g");

				var repDistrictsNum = repDistrictsDisplay.append("text")
					.attr("class", "display-data-rep display-districts")
					.attr("id", "rDistrictsDisplay")
					.attr("x", displayBoxWidth*(3/4))
					.attr("y", (displayBoxHeight/2)+40+10)
					.style("text-anchor", "middle")
					.style("fill", rColor)
					.text("");


				repDistrictsDisplay.select("text")	
					.transition()
						//.ease("poly-out")
						.duration(2500)
						.tween("text", function() {
							var that = d3.select(this);
							var	i = interpolateNumber(that.text(), rDistrictSum);
							return function(t) { 
								that.text(format(i(t)));
								};
						});


			//
			//FUNCTIONS within makeFlipViz/d3.tsv call
			/////////////////////////////////////////
			function makeBar(CD) {	
			//Makes one bar//////////////////////////
			//Because the visualization is controlled by dragging on a bar, all update functions are nested in makeBar

				// get values from loaded data
				var cdVoteData = {};
				
				cdVoteData["CD"] = +CD.key;
				cdVoteData["DEM"] = +CD.values[0].DEM_USC;
				cdVoteData["REP"] = +CD.values[0].REP_USC;
				cdVoteData["OTH"] = +CD.values[0].OTHERS_USC;
				
				
				//Upload initial values to global (and mutating) data holder
				voteDataHolder[CD.key-1] = cdVoteData;

				//Initialize variables for drag functionality
				var dragTimes = 0,
					startParty = 0,
					isDragging = false,
					startVotes = [],
					startParty = "none";
    				
				//Set dimensions of bar elements
				var barSq = 5;

				var barRows = h_bar/barSq,
					barCols = w_bar/barSq,
					numBarSquares = barRows*barCols;

				var dVotes = +voteDataHolder[CD.key-1]["DEM"],
					rVotes = +voteDataHolder[CD.key-1]["REP"],
					oVotes = +voteDataHolder[CD.key-1]["OTH"],	
					cdTotalVotes = (dVotes+rVotes+oVotes),
					perD = (dVotes/cdTotalVotes),
					perR = (rVotes/cdTotalVotes),
					perO = (oVotes/cdTotalVotes),
					cutD = perD*barRows*barCols,
					cutOther = ((dVotes+oVotes)/cdTotalVotes)*barRows*barCols;


				var delayTime = 8,
					delayTimeOther = delayTime*2
					pauseTime = 500;

				var svg = d3.select(this)
					.attr("class", "bar")
					.attr("CD", CD.key)
					.style("fill", "none");	
				
				//make transparent rectangle to pick up drag
				svg.append("rect")
				    .attr("class", "drag-bar")
				    .attr("CD", CD.key)
				    .style("pointer-events", "all")
				    .attr("width", w_bar)
				    .attr("height", h_bar)
				    .style("fill", "none")
				    .on("mouseover", handleMouseOver)
				    .on("mouseout", handleMouseOut)
				    .call(d3.drag()
				    	.on("start", initiateDrag)
						.on("drag", dragChange)
				    	.on("end", dragEnd));

			    console.log(CD);
				//makes squares as "rect" elements
				var squares = svg.selectAll(".bar-square")
					.data(d3.range(numBarSquares))
			  	  .enter()
					.append('rect')
					.attr("class", "bar-square")
					.attr("CD", CD.key)
					.attr("width", barSq)
					.attr("height", barSq)
					.attr("cellnum", function (i) {return ((numBarSquares)-i);})
					.attr("x", function(i) {return (barSq*(i%barCols));})
					.attr("y", function(i) {return (barSq*Math.floor((i/barCols)));})
					.style("fill",initialColor)
					.style("stroke", "ffffff")
					.style("stroke-width", .4)      
	    			.style("stroke-linecap", "butt")
	    			.style("pointer-events", "none")		
					.attr("squareColor", function() {
						if (this.getAttribute('cellnum') <= cutD) {
						    return dColor;
						}
						if (this.getAttribute('cellnum') > cutD && (this.getAttribute('cellnum') <= cutOther)) {
							return oColor;
						}
						else {return rColor;}
					})
					.transition()
				     	.delay(function() {
							if (this.getAttribute('squareColor') == dColor) {
			   					return (pauseTime+this.getAttribute("cellnum")*delayTime);
			     			}
			     			if (this.getAttribute('squareColor') == oColor) {
			   					return (pauseTime+((this.getAttribute("cellnum")*delayTimeOther)+(cutOther*delayTime)));
			     			}
			     			if (this.getAttribute('squareColor') == rColor) {
			     	
			     				return (pauseTime+((cutD*delayTime)+((numBarSquares)-this.getAttribute("cellnum")+1)*delayTime));
			     				}
							})     	
				     	.style("fill", function() {
								return this.getAttribute('squareColor')
							});


				////////////////////////////////////////////
				//FUNCTIONS inside makeBar call
				//

				function initiateDrag(d) {				
				//Gets existing vote values on drag start/start-click
				//If this is the first drag instance, use values from read-in data file
				//Else use values that were the result of the last drag
				//Updates global variables "startVotes", "startParty", and dragTimes

					isDragging = true;

					startVotes = initializeVotes(dragTimes);

					var x = Math.max(0, Math.min(w_bar, d3.mouse(this)[0])),
		 				y = Math.max(0, Math.min(h_bar, d3.mouse(this)[1]));

					//convert mouse position to vote number
					var onClickVotes = clickToVotes(x, y);

					startParty = getParty(startVotes, onClickVotes);
					
					dragTimes += 1;	
				
				//end initiateDrag function ->
				}

				function dragChange(d) {
				// use this to style real-time changes, i.e. colors of squares changing
				// also display of votes

					//constrain displacement to dimensions of bar
					var x = Math.max(0, Math.min(w_bar, d3.mouse(this)[0])),
		 				y = Math.max(0, Math.min(h_bar, d3.mouse(this)[1]));

		 			//covert mouse position to vote number
					var dragVotes = clickToVotes(x, y);

					//get D, R, and O votes based on drag location
					var newVotes = getVotes(dragVotes, startVotes, startParty),
						dVotesDrag = newVotes[0],
						rVotesDrag = newVotes[1],
						oVotesDrag = newVotes[2];

					var dragVotesTot = (dVotesDrag+rVotesDrag+oVotesDrag);

					//Prepare data to update global vote holder
					var cdDragVoteData = {};
					
					cdDragVoteData["CD"] = +CD.key;
					cdDragVoteData["DEM"] = +dVotesDrag
					cdDragVoteData["REP"] = +rVotesDrag;
					cdDragVoteData["OTH"] = +oVotesDrag;
					
					//Update global vote holder
					voteDataHolder[CD.key-1] = cdDragVoteData;

					var newStateSums = getStateSums(),
						stateVoteSums = newStateSums[0],
						stateDistrictSums = newStateSums[1];

					updateBar();
					updateGrid(stateVoteSums);
					updateMap();
					updateDisplay(stateVoteSums, stateDistrictSums);


					function updateBar() {

						var perDBar = (dVotesDrag/cdTotalVotes),
							perRBar = (rVotesDrag/cdTotalVotes),
							perOBar = (oVotesDrag/cdTotalVotes),
							cutDBar = perDBar*barRows*barCols,
							cutRBar = (perDBar+perOBar)*barRows*barCols;

						d3.selectAll(".bar-square").filter(function(){return this.getAttribute("CD") == CD.key})
							.attr("squareColor", function() {
							if (this.getAttribute('cellnum') <= cutDBar) {
							    return dColor;
							}
							if (this.getAttribute('cellnum') > cutDBar && (this.getAttribute('cellnum') <= cutRBar)) {
								return oColor;
							}
							if (this.getAttribute('cellnum') >= cutRBar) {
							    return rColor;
							}
							else {return rColor;}
							}
							)
							.transition()
					     		.duration(60)     	
					     		.style("fill", function() {
									return this.getAttribute('squareColor')
								});
				    }
				    

				    function updateGrid(stateVoteSums) {

						var dSum = stateVoteSums[0],
							rSum = stateVoteSums[1],
							oSum = stateVoteSums[2];

						var paSum = (dSum+rSum+oSum),
							perDGrid = (dSum/paSum),
							perRGrid = (rSum/paSum),
							perOGrid = (oSum/paSum),
							cutDGrid = perDGrid*gridRows*gridCols,
							cutOtherGrid = ((dSum+oSum)/paSum)*gridRows*gridCols;

						d3.selectAll(".grid-square")
							.attr("squareColor", function() {
								if (this.getAttribute('cellnum') <= cutDGrid) {
							    return dColor;
								}
								if (this.getAttribute('cellnum') > cutDGrid && (this.getAttribute('cellnum') <= cutOtherGrid)) {
									return oColor;
								}
								else {return rColor;}
							})
							.transition()
						     	.duration(100)    	
						     	.style("fill", function() {
										return this.getAttribute('squareColor')
									});
					}
					

					function updateMap() {

					    d3.selectAll(".cd-boundaries").filter(function(){return this.getAttribute("CD") == CD.key})
					    	// .attr("class", "cd-boundaries-drag")
					    	.raise()
					    	.classed("active-drag", true)
					    	.classed("active-mouseover", false)
					    	.attr("winner", function() {
				      			if ((dVotesDrag > rVotesDrag) && (dVotesDrag > oVotesDrag)) {
				      				return "DEM";
				      			}
				      			if ((rVotesDrag > dVotesDrag) && (rVotesDrag > oVotesDrag)) {
				      				return "REP";
				      			}
				      			if ((oVotesDrag > dVotesDrag) && (oVotesDrag > rVotesDrag)) {
				      				return "OTH";
				      			}
					      	})
					      	.transition()
					      		.duration(120)   	
						     	.style("fill", function(d) {
					      			if (this.getAttribute("winner") == "DEM") {
					      				return dMapColor;
					      			}
					      			if (this.getAttribute("winner") == "REP") {
					      				return rColor;
					      			}
					      			if (this.getAttribute("winner") == "OTH") {
					      				return oColor;
									}})
								;

						d3.selectAll(".cd-boundaries").filter(function(){return this.getAttribute("CD") != CD.key})
							.classed("active-drag-others", true);
					}


				    function updateDisplay(stateVoteSums, stateDistrictSums){

						var dSum = stateVoteSums[0],
							rSum = stateVoteSums[1],
							osum = stateVoteSums[2];

						var dDistrictSum = stateDistrictSums[0],
							rDistrictSum = stateDistrictSums[1],
							oDistrictSum = stateDistrictSums[2];

						
						var format = d3.format(",d");

						d3.selectAll(".display-data-dem").filter(".display-votes")
							.text(format(dSum));

						d3.selectAll(".display-data-rep").filter(".display-votes")
							.text(format(rSum));

						d3.selectAll(".display-data-dem").filter(".display-districts")
							.text(format(dDistrictSum))
							;

						d3.selectAll(".display-data-rep").filter(".display-districts")
							.text(format(rDistrictSum));

						d3.selectAll(".congbar-square")
							.attr("squareColor", function() {
								if (this.getAttribute('cellnum') <= dDistrictSum) {
							    	return dColor;
								}
								if (this.getAttribute('cellnum') > dDistrictSum && (this.getAttribute('cellnum') <= (dDistrictSum+oDistrictSum))) {
									return oColor;
								}
								if (this.getAttribute('cellnum') >= (dDistrictSum+oDistrictSum)) {
							    	return rColor;
								}
								})
							.transition()
						     	.duration(100)    	
						     	.style("fill", function() {
										return this.getAttribute('squareColor')
									});
					}
				//end dragChange function ->
				}


				function dragEnd(d) {

					isDragging = false;

					d3.selectAll(".cd-boundaries").filter(function(){return this.getAttribute("CD") == CD.key})
						.classed("active-drag", false)
						.classed("active-mouseover", false);

					d3.selectAll(".cd-boundaries").filter(function(){return this.getAttribute("CD") != CD.key})
						.classed("active-drag-others", false);

				//end dragEnd function ->
				}


				function clickToVotes(a, b) {
				//translates mouse x,y to a number of votes

					var barToVotes = d3.scaleLinear()
						.domain([0, (Math.sqrt(Math.pow(h_bar, 2)+Math.pow(w_bar, 2)))])
						.range([0, cdTotalVotes])
						.clamp(true);
					
					var hyp = Math.sqrt(Math.pow(a, 2)+Math.pow(b, 2)),
						votes = barToVotes(hyp);
					
					return votes;
				}


				function initializeVotes(dragTimes) {

					if (dragTimes == 0) {
						dStartVotes = +CD.values[0].DEM_USC;
						rStartVotes = +CD.values[0].REP_USC;
						oStartVotes = +CD.values[0].OTHERS_USC;
					}
					else {
						dStartVotes = voteDataHolder[CD.key-1]["DEM"];
						rStartVotes = voteDataHolder[CD.key-1]["REP"];
						oStartVotes = voteDataHolder[CD.key-1]["OTH"];
					}

					votes = [dStartVotes, rStartVotes, oStartVotes];

					return votes;
				}


				function getParty (startVotes, onClickVotes) {
				//determines what color/party of the bar was initially clicked on on drag

					var dStartVotes = startVotes[0],
						rStartVotes = startVotes[1],
						oStartVotes = startVotes[2];

					//handle cases when CD is all one party	
					//if CD is 100% one party, startParty is the other party
					//allows users to introduce other party into originally monopolized district
					if (rStartVotes == cdTotalVotes) {
						return "D";
						}
					if (dStartVotes == cdTotalVotes) {
						return "R";
						}

					//else get on click
					else if (onClickVotes <= rStartVotes) {
						return "R";
						}
					else if (onClickVotes > rStartVotes && onClickVotes <= (rStartVotes+oStartVotes)) {
						return "O";
						}
					else if (onClickVotes > (rStartVotes+oStartVotes)) {
						return "D";
						}
				}


				function getVotes(dragVotes, startVotes, startParty) {
					//get new number of votes based on mouse position/drag 
					//and color/party that was first clicked on

						var dVotes = 0,
							rVotes = 0,
							oVotes = 0;

						var dStartVotes = startVotes[0],
							rStartVotes = startVotes[1],
							oStartVotes = startVotes[2];

						if (startParty == "D") {
							if (dragVotes >= (cdTotalVotes-(dStartVotes+oStartVotes)) && dragVotes >= (cdTotalVotes-dStartVotes)) {
								dVotes = cdTotalVotes-dragVotes;
								rVotes = rStartVotes;
								oVotes = cdTotalVotes-dVotes-rVotes;
								}
							else if (dragVotes >= (cdTotalVotes-(dStartVotes+oStartVotes)) && dragVotes < (cdTotalVotes-dStartVotes)) {
								dVotes = cdTotalVotes-dragVotes;
								rVotes = rStartVotes;
								oVotes = cdTotalVotes-dVotes-rVotes;							
							}	

							else if (dragVotes < (cdTotalVotes-(dStartVotes+oStartVotes))) {
								dVotes = cdTotalVotes-dragVotes;
								rVotes = dragVotes;
								oVotes = 0;
							}
						}
						if (startParty == "R") {
							if (dragVotes < (cdTotalVotes-(dStartVotes+oStartVotes))) {
								dVotes = dStartVotes;
								rVotes = dragVotes;
								oVotes = cdTotalVotes-dVotes-rVotes;
							}
							else if (dragVotes >= (cdTotalVotes-(dStartVotes+oStartVotes)) && dragVotes < (cdTotalVotes-dStartVotes)) {
								dVotes = dStartVotes;
								rVotes = dragVotes;
								oVotes = cdTotalVotes-dVotes-rVotes;
							}
							else if (dragVotes >= (cdTotalVotes-(dStartVotes+oStartVotes)) && dragVotes >= (cdTotalVotes-dStartVotes)){
								dVotes = cdTotalVotes-dragVotes;
								rVotes = dragVotes;
								oVotes = 0
							}
						}
						if (startParty == "O") {
							if (dragVotes < rStartVotes) {
								dVotes = dStartVotes;
								rVotes = dragVotes;
								oVotes = cdTotalVotes-dVotes-rVotes;
							}
							else if (dragVotes >= rStartVotes && dragVotes < dStartVotes) {
								dVotes = dStartVotes;
								rVotes = rStartVotes;
								oVotes = dragVotes-rStartVotes;
							}
							else if (dragVotes >= dStartVotes) {
								dVotes = cdTotalVotes-dragVotes;
								rVotes = rStartVotes;
								oVotes = dragVotes-rStartVotes;
							}
						}

						var votes = [dVotes, rVotes, oVotes]; 
						return (votes);
					}

				//END OF DRAG FUNCTIONAALITY////////////////////////////////

				//MOUSE FUNCTIONS///////////////////////////////////////////
				function handleMouseOver () {
			
					d3.selectAll(".cd-boundaries").filter(function(){return this.getAttribute("CD") == CD.key})
						.classed("active-mouseover", true)
						.raise();
						

					var dVotes2016 = +CD.values[0].DEM_USC
						rVotes2016 = +CD.values[0].REP_USC,
						oVotes2016 = +CD.values[0].OTHERS_USC;
						voteTotal2016 = (dVotes+rVotes+oVotes)

					var formatPercent = d3.format(".0%");

					cdInfoTextContainer.style("opacity", 1);
				
					var infoNameX = 100,
						infoNumX = 350,
						startY = 20,
						infoLineSpacing = 12;

					makeCDInfo();	

					function makeCDInfo() {	
					
						cdInfoName
							.attr("x", infoNameX)
							.attr("y", startY+infoLineSpacing)
							.text("PA District "+CD.key);
						
						cdInfoVotes
							.attr("x", infoNameX+155)
							.attr("y", startY+infoLineSpacing)
						
						cdInfoVotesNum
							.attr("x", infoNumX)
							.attr("y", startY+infoLineSpacing)
							.style("text-anchor", "end")
							.text(voteTotal2016);
						
						var dLine = 0,
							rLine = 0,
							oLine = 0;

						if (CD.values[0]["DEM_CAND"] != 0 && typeof CD.values[0]["DEM_CAND"] !== 'undefined') {
							dLine = 2;
							if (CD.values[0]["REP_CAND"] != 0 && typeof CD.values[0]["REP_CAND"] !== 'undefined') {
								rLine = 3;
								if (CD.values[0]["OTH_CAND"] != 0 && typeof CD.values[0]["OTH_CAND"] !== 'undefined') {
									oLine = 4;
								}
								else {oLine = 0;}
							}
							else if (CD.values[0]["REP_CAND"] == 0 | typeof CD.values[0]["REP_CAND"] == 'undefined') {
								rLine = 0;
								if (CD.values[0]["OTH_CAND"] != 0 && typeof CD.values[0]["OTH_CAND"] !== 'undefined') {
									oLine = 3;
								}
								else {oLine = 0;}
							}
						}
						else if (CD.values[0]["DEM_CAND"] == 0 | typeof CD.values[0]["DEM_CAND"] == 'undefined') {
							dLine = 0;
							if (CD.values[0]["REP_CAND"] != 0 && typeof CD.values[0]["REP_CAND"] !== 'undefined') {
								rLine = 2;
								if (CD.values[0]["OTH_CAND"] != 0 && typeof CD.values[0]["OTH_CAND"] !== 'undefined') {
									oLine = 3
								}
								else {oLine = 0;}
							}
							else if (CD.values[0]["REP_CAND"] == 0 | typeof CD.values[0]["REP_CAND"] == 'undefined') {
								rLine = 0;
								if (CD.values[0]["OTH_CAND"] != 0 && typeof CD.values[0]["OTH_CAND"] !== 'undefined') {
									oLine = 2;
								}
								else {oLine = 0;}
							}
						}

						if (dLine != 0) {
							cdInfoDCand
								.attr("x", infoNameX)
								.attr("y", (startY+(infoLineSpacing*dLine)))
								.text(CD.values[0]["DEM_CAND"]);

							cdInfoDCandPer
								.attr("x", infoNumX)
								.attr("y", (startY+(infoLineSpacing*dLine)))
								.text(formatPercent(dVotes2016/voteTotal2016));
						}
						else {
							cdInfoDCand
								.attr("x", null)
								.attr("y", null)
								.text(null);

							cdInfoDCandPer
								.attr("x", null)
								.attr("y", null)
								.text(null);
						}

						if (rLine != 0) {
							cdInfoRCand
								.attr("x", infoNameX)
								.attr("y", (startY+(infoLineSpacing*rLine)))
								.text(CD.values[0]["REP_CAND"]);

							cdInfoRCandPer
								.attr("x", infoNumX)
								.attr("y", startY+(infoLineSpacing*rLine))
								.text(formatPercent(rVotes2016/voteTotal2016));
						}
						else {
							cdInfoRCand
								.attr("x", null)
								.attr("y", null)
								.text(null);

							cdInfoRCandPer
								.attr("x", null)
								.attr("y", null)
								.text(null);
						}

						if (oLine != 0) {		
							cdInfoOCand
								.attr("x", infoNameX)
								.attr("y", (startY+(infoLineSpacing*oLine)))
								.text(CD.values[0]["OTH_CAND"]);

							cdInfoOCandPer
								.attr("x", infoNumX)
								.attr("y", (startY+(infoLineSpacing*oLine)))
								.text(formatPercent(oVotes2016/voteTotal2016));
						}
						else {
							cdInfoOCand
								.attr("x", null)
								.attr("y", null)
								.text(null);

							cdInfoOCandPer
								.attr("x", null)
								.attr("y", null)
								.text(null);
						}
					}
				}

				
				function handleMouseOut () {
					d3.selectAll(".cd-boundaries").filter(function(){return this.getAttribute("CD") == CD.key})
						.classed("active-mouseover", false);
						
					cdInfoTextContainer.style("opacity", 0);

					cdInfoDCand.select("text").remove;
					cdInfoDCandPer.select("text").remove;
					cdInfoRCand.select("text").remove;
					cdInfoRCandPer.select("text").remove;
					cdInfoOCand.select("text").remove;
					cdInfoOCandPer.select("text").remove;
				}

			//end makeBar function ->
			}


			function makeVoteGrid () {

				//var svg = voteGridContainer.append("svg");
				var svg = d3.select(this);

				var paSum = (dSum + rSum + oSum),
					perDGrid = (dSum/paSum),
					perRGrid = (rSum/paSum),
					perOGrid = (oSum/paSum),
					cutDGrid = perDGrid*gridRows*gridCols,
					cutOtherGrid = ((dSum+oSum)/paSum)*gridRows*gridCols;

				var delayTime = 2.8,
					pauseTime = 0;

				//makes squares as "rect" elements
				var gridSquares = svg.selectAll(".grid-square")
					.data(d3.range(numGridSquares))
			  	  .enter()
					.append('rect')
					.attr("class", "grid-square")
					.attr("width", gridSq)
					.attr("height", gridSq)
					.attr("cellnum", function (i) {return ((numGridSquares)-i);})
					.attr("x", function(i) {return (gridSq*(i%gridCols));})
					.attr("y", function(i) {return (gridSq*Math.floor((i/gridCols)));})
					.style("fill",initialColor)
					.style("stroke", "ffffff")
					.style("stroke-width", .4)      
	    			.style("stroke-linecap", "butt")		
					.attr("squareColor", function() {
						if (this.getAttribute('cellnum') <= cutDGrid) {
						    return dColor;
						}
						if (this.getAttribute('cellnum') > cutDGrid && (this.getAttribute('cellnum') <= cutOtherGrid)) {
							return oColor;
						}
						else {return rColor;}
					})
					.transition()
				     	.delay(function() {
							if (this.getAttribute('squareColor') == dColor) {
			   					return (pauseTime+this.getAttribute("cellnum")*delayTime);
			     			}
			     			if (this.getAttribute('squareColor') == oColor) {
			     				if (cutOtherGrid < (numGridSquares)/2) {
			   						return (pauseTime+(((numGridSquares)-(this.getAttribute("cellnum"))+1)*delayTime)+(100*delayTime));
			     				}
			     				else {
			   						return (pauseTime+((this.getAttribute("cellnum"))+1)*delayTime)+(100*delayTime);
			     				}
			     			}
			     			if (this.getAttribute('squareColor') == rColor) {
			     				return (pauseTime+((numGridSquares)-this.getAttribute("cellnum")+1)*delayTime);
			     				}
							})     	
				     	.style("fill", function() {
								return this.getAttribute('squareColor')
							});
			//end makeVoteGrid function ->
			}
		

			function makecongBar () {

				//var svg = voteGridContainer.append("svg");
				var svg = d3.select(this);

				var delayTime = 200,
					pauseTime = 0;

				//makes squares as "rect" elements
				var congBarSquares = svg.selectAll(".congbar-square")
					.data(d3.range(numCongSquares))
			  	  .enter()
					.append('rect')
					.attr("class", "congbar-square")
					.attr("width", congBarSq)
					.attr("height", congBarSq)
					.attr("cellnum", function (i) {return ((numCongSquares)-i);})
					.attr("x", function(i) {return (congBarSq*(i%congBarCols));})
					.attr("y", function(i) {return (congBarSq*Math.floor((i/congBarCols)));})
					.style("fill",initialColor)
					.style("stroke", "ffffff")
					.style("stroke-width", 2)      
	    			.style("stroke-linecap", "butt")		
					.attr("squareColor", function() {
						if (this.getAttribute('cellnum') <= dDistrictSum) {
						    return dColor;
						}
						if (this.getAttribute('cellnum') > dDistrictSum && (this.getAttribute('cellnum') <= (dDistrictSum+oDistrictSum))) {
							return oColor;
						}
						if (this.getAttribute('cellnum') >= (dDistrictSum+oDistrictSum)) {
						    return rColor;
						}
					})
					.transition()
				     	.delay(function() {
							if (this.getAttribute('squareColor') == dColor) {
			   					return (pauseTime+this.getAttribute("cellnum")*delayTime);
			     			}
			     			if (this.getAttribute('squareColor') == oColor) {
			     				if (cutOtherGrid < (numCongSquares)/2) {
			   						return (pauseTime+(((numCongSquares)-(this.getAttribute("cellnum"))+1)*delayTime)+(100*delayTime));
			     				}
			     				else {
			   						return (pauseTime+((this.getAttribute("cellnum"))+1)*delayTime)+(100*delayTime);
			     				}
			     			}
			     			if (this.getAttribute('squareColor') == rColor) {
			     				return (pauseTime+((numCongSquares)-this.getAttribute("cellnum")+1)*delayTime);
			     				}
							})     	
				     	.style("fill", function() {
								return this.getAttribute('squareColor')
							});
			//end makecongBar function ->
			}


			function getStateSums() {

				var dSum = 0,
					rSum = 0,
					oSum = 0;

				for (var key in voteDataHolder) {
					dSum += voteDataHolder[key]["DEM"];
					rSum += voteDataHolder[key]["REP"];
					oSum += voteDataHolder[key]["OTH"];
				};
				
				var dDistrictSum = 0,
					rDistrictSum = 0,
					oDistrictSum = 0;

				for (var key in voteDataHolder) {
					if (voteDataHolder[key]["DEM"] >= voteDataHolder[key]["REP"] && voteDataHolder[key]["DEM"] >= voteDataHolder[key]["OTH"]) {
						dDistrictSum += 1;
					}
					if (voteDataHolder[key]["REP"] >= voteDataHolder[key]["DEM"] && voteDataHolder[key]["REP"] >= voteDataHolder[key]["OTH"]) {
						rDistrictSum += 1;
					}
					if (voteDataHolder[key]["OTH"] >= voteDataHolder[key]["DEM"] && voteDataHolder[key]["OTH"] >= voteDataHolder[key]["REP"]) {
						oDistrictSum += 1;
					}
				};

				var voteSums = [dSum, rSum, oSum],
					districtSums = [dDistrictSum, rDistrictSum, oDistrictSum];

				var stateSums = [voteSums, districtSums]

				return stateSums;
			
			}

			function interpolateNumber(a, b) {
	  			return function(t) {
	    		return a + t * (b - a);
	  			};
			}
	
	//end d3.tsv function call ->
	})	

		//Reset Button
	var resetContainer = d3.select("#resetAll").append("svg")
		.attr("width", 900)
		.attr("height", 50)
		.attr("x", 3)
		.attr("y", 720);

	var resetBox = resetContainer.append("rect")
		.attr("class", "reset-button reset-box")
		.attr("width", 160)
		.attr("height", 22)
		.attr("x", 370)
		.attr("y", 20)
		.on("click", clickToReset);

	var resetText = resetContainer.append("text")
		.attr("class", "reset-button reset-text")
		.attr("x", 450)
		.attr("y", 35)
		.style("text-anchor", "middle")
		.style("pointer-events", "none")
		.text("reset to 2016 results");


	function clickToReset() {
		d3.selectAll("svg").remove();

		var resetContainer = d3.select("#resetAll").append("svg")
			.attr("width", 900)
			.attr("height", 50)
			.attr("x", 3)
			.attr("y", 720);

		var resetBox = resetContainer.append("rect")
			.attr("class", "reset-button reset-box")
			.attr("width", 160)
			.attr("height", 22)
			.attr("x", 370)
			.attr("y", 20)
			.on("click", clickToReset);

		var resetText = resetContainer.append("text")
			.attr("class", "reset-button reset-text")
			.attr("x", 450)
			.attr("y", 35)
			.style("text-anchor", "middle")
			.style("pointer-events", "none")
			.text("reset to 2016 results");
		
		makeFlipViz();
	}
	//end of makeFlipViz function -->
	}