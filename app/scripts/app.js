/*global define */
define(['d3'], function (d3) {
    'use strict';

var TYPE = $('.container').attr('vismode');
var TOLERANCE = (TYPE == 'issues') ? 0.01 : 0.00001; 

var issues2 = [{"text": "Sustainable online learning", "id":"i1"},
		{"text": "Improving student outcomes", "id":"i2"},
		{"text": "Analytics to support institutional outcomes", "id":"i3"},
		{"text": "IT staffing models", "id":"i4"},
		{"text": "Assisting faculty with information technology", "id":"i5"},
		{"text": "Access demand", "id":"i6"},
		{"text": "Balancing innovation with execution", "id":"i7"},
		{"text": "Competing for IT talent", "id":"i8"},
		{"text": "Establishing and implementing IT governance", "id":"i9"},
		{"text": "Funding IT strategically", "id":"i10"},
		{"text": "Institution-wide IT governance", "id":"i11"},
		{"text": "IT consumerization and BYOD", "id":"i12"},
		{"text": "Supporting research (HPC, large data, analytics)", "id":"i13"},
		{"text": "Enterprise IT architecture", "id":"i14"},
		{"text": "Using IT to improve operational efficiency", "id":"i15"},
		{"text": "Optimizing IT efficiency and excellence", "id":"i16"},
		{"text": "Service delivery strategy", "id":"i17"},
		{"text": "IT compliance and risk management", "id":"i18"}];

var technologies = [{"text":"802.11ac wireless networking standard","id":"i19"},
		{"text":"Mesh networking","id":"i20"},
		{"text":"Software‐defined networks","id":"i21"},
		{"text":"Virtual desktops or virtual PC applications","id":"i22"},
		{"text":"IT accessibility assessment tools","id":"i23"},
		{"text":"Network performance monitoring tools","id":"i24"},
		{"text":"Private‐cloud storage","id":"i25"},
		{"text":"Network capacity planning and management tools","id":"i26"},
		{"text":"Data center capacity planning and management tools","id":"i27"},
		{"text":"IT asset management tools","id":"i28"},
		{"text":"Service level reporting tools","id":"i29"},
		{"text":"Unified communications and collaboration","id":"i30"},
		{"text":"Ethernet fabrics","id":"i31"},
		{"text":"Biometric authentication","id":"i32"},
		{"text":"Content‐aware data loss protection (DLP)","id":"i33"},
		{"text":"Database encryption","id":"i34"},
		{"text":"E‐signatures","id":"i35"},
		{"text":"E‐mail encryption","id":"i36"},
		{"text":"Enterprise identity and access management solutions","id":"i37"},
		{"text":"Federated ID management","id":"i38"},
		{"text":"PCI data security standards","id":"i39"},
		{"text":"Strong authentication for critical applications","id":"i40"},
		{"text":"Enterprise GRC systems","id":"i41"},
		{"text":"Digital preservation of research data","id":"i42"},
		{"text":"Digital repositories for researchers and scholars","id":"i43"},
		{"text":"Open content","id":"i44"},
		{"text":"Self‐publishing","id":"i45"},
		{"text":"Cloud‐based HPC","id":"i46"},
		{"text":"Mobile apps for enterprise applications","id":"i47"},
		{"text":"Mobile app development","id":"i48"},
		{"text":"Mobile data protection","id":"i49"},
		{"text":"Mobile device management","id":"i50"},
		{"text":"Adaptive learning","id":"i51"},
		{"text":"Badging/open digital microcredentials","id":"i52"},
		{"text":"E‐portfolios","id":"i53"},
		{"text":"E‐book readers, e‐textbooks","id":"i54"},
		{"text":"Gamification","id":"i55"},
		{"text":"Mashware","id":"i56"},
		{"text":"Online courses on mobile devices","id":"i57"},
		{"text":"Cloud‐based academic applications","id":"i58"},
		{"text":"Administrative or business performance analytics","id":"i59"},
		{"text":"BI reporting dashboards","id":"i61"},
		{"text":"Mobile BI","id":"i62"},
		{"text":"Big data","id":"i63"},
		{"text":"Data warehouse","id":"i64"},
		{"text":"Learning analytics: Course level","id":"i66"},
		{"text":"Learning analytics: Degree advising","id":"i67"},
		{"text":"Predictive analytics","id":"i68"},
		{"text":"Talent workforce analytics","id":"i69"},
		{"text":"Text content analytics","id":"i70"},
		{"text":"Cloud‐based administrative enterprise applications","id":"i71"},
		{"text":"Cloud‐based e‐mail for faculty and staff","id":"i72"},
		{"text":"Cloud‐based office productivity suites","id":"i73"},
		{"text":"Application platform as a service (PaaS)","id":"i74"},
		{"text":"Infrastructure as a service (IaaS)","id":"i75"},
		{"text":"Cloud‐based video streaming solutions","id":"i76"},
		{"text":"Cloud‐based voice solutions","id":"i77"},
		{"text":"Hybrid cloud computing","id":"i78"},
		{"text":"Cloud‐based security services","id":"i79"},
		{"text":"Institutional support for public cloud storage","id":"i80"},
		{"text":"3D printing","id":"i81"},
		{"text":"3D scanners","id":"i82"},
		{"text":"Tablet computing","id":"i83"},
		{"text":"The Internet of Things","id":"i84"},
		{"text":"Social media","id":"i85"},
		{"text":"Location intelligence","id":"i86"},
		{"text":"Speech recognition","id":"i87"},
		{"text":"Virtual environments","id":"i88"},
		{"text":"CRM for admissions and enrollment","id":"i89"},
		{"text":"Hadoop","id":"i91"},
		{"text":"Extreme‐low‐energy servers","id":"i92"},
		{"text":"In‐memory computing","id":"i93"},
		{"text":"Power over Ethernet","id":"i95"},
		{"text":"Quantum computing for researchers","id":"i96"},
		{"text":"Activity streams","id":"i97"},
		{"text":"Affective computing","id":"i98"},
		{"text":"Augmented reality","id":"i99"},
		{"text":"Virtual assistants","id":"i100"}];

//initalize svg
var margin = {top: 40, right: 10, bottom: 20, left: 0};

var width = 610 - margin.left - margin.right,
    height = (($(window).width() > 997) ? $('.filter-panel').height() + $('.header').height() : 400) - margin.top - margin.bottom;

var textOffset = 6;

var svg = d3.select('.svg-content').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//scales
var y = d3.scale.linear().domain([1,10]).range([0,height]);
var color = d3.scale.ordinal().range(['#d3d3d3','#d3d3d3','#c4d676']);

//create the diagonal generator for the ranking lines
//the projection here flips the x and y values so the curve is draw the right way
var diagonal = d3.svg.diagonal()
	.source(function (d){
		return {'y': 10, 'x': y(d.originalRank)};
	})
	.target(function (d){
		return {'y': 90, 'x': y(d.sort)};
	}).projection(function(d) { return [d.y, d.x]; });


//load data file
d3.text('data/issues_data_final.csv', function (data){

	var theData = new Data(d3.csv.parse(data));
	theData.init();
	theData.rank();

	if( theData.rank().filter(function (d){return d.sort == 11})[0].tie ){
		y.domain([1,11]);
	}
	else{
		y.domain([1,10]);
	}
	//ties
	var tieID = $.map(theData.rank(), function (d){ return (d.tie) ? d.sort : null });

	var issueElements = svg.selectAll('.issue')
		.data(theData.summary, function (d){ return d.id })
		.enter()
		.append('text')
		.attr('class', 'issue')
		.attr('y', function (d,i){ return (y(d.sort) + textOffset)})
		.attr('x', 30)
		.text(function (d,i){ return d.text});

	var numLabel = svg.selectAll('.num-label')
		.data(theData.summary, function (d){ return d.id })
		.enter()
		.append('text')
		.attr('class', 'num-label')
		.attr('x', 10)
		.attr('y', function (d,i){ 
				if(d.tie){
					return y(d.rank) + ((y(2) - y(1))/2) + textOffset;
				}
				else{
					return (y(d.rank) + textOffset);
			}}).text(function (d,i){ return d.rank});

	numLabel.attr('opacity', function (d,i){ 
			var c = d3.sum( $.map(tieID, function (h){ return (+h-1===+d.sort)? 1 : 0 }) );
				if(c > 0){
					return 0;
				}
				else{
					return 1;
				}
			});

	var link = svg.selectAll('.link')
		.data(theData.rank())
		.enter().append('path')
		.attr('class', 'link')
		.attr('stroke', function (d){ return color(d.rank - d.originalRank) })
		.attr('stroke-width', '3')
		.attr('fill', 'none')
		.attr('stroke-opacity', 0)
		.attr('d', diagonal);

	var issueDots = svg.selectAll('.dot')
		.data(theData.summary, function (d){ return d.id })
		.enter()
		.append('circle')
		.attr('class', 'dot')
		.attr('fill', function (d){ return getColor(d) })
		.attr('r', 5)
		.attr('cx', 10)
		.attr('fill-opacity', 0)
		.attr('cy', function (d,i){ return y(d.originalRank)});

	var filteredLabel = svg.append('text').attr('opacity', 0).attr('class', 'data-label').attr('x', 83).attr('y', -20).text('Filtered');
	var originalLabel = svg.append('text').attr('opacity', 0).attr('class', 'data-label').attr('x', 3).attr('y', -20).text((TYPE == 'issues') ? 'All U.S.' : 'All');

	$('.n-label').html('n='+theData.data.length);


//FILTER BUTTON EVENT
	$('.filter-button').click(function (e){

		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}
		else{
			$(this).addClass('active');
		}	

		var ccSelected = $.map($('.btn-group.cc').find('.filter-button.active'), function (d){ return $(d).attr('data') });
		var fteSelected = $.map($('.btn-group.fte').find('.filter-button.active'), function (d){ return $(d).attr('data') });
		var controlSelected = $.map($('.btn-group.control').find('.filter-button.active'), function (d){ return $(d).attr('data') });

		theData.filter( ccSelected, fteSelected, controlSelected,true );

		if( theData.rank().filter(function (d){return d.sort == 11})[0].tie ){
			y.domain([1,11]);
		}
		else{
			y.domain([1,10]);
		}
		//debugPrint(theData.rank())

		issueElements = svg.selectAll('.issue')
			.data(theData.rank(),function (d){ return d.id });

		issueElements.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('y', function (d,i){ return y(d.sort) + textOffset})
			.attr('x', 120)
			.text(function (d,i){ return d.text});

		issueElements.enter()
			.append('text')
			.attr('class', 'issue')
			.attr('y', function (d,i){ return y(d.sort) + textOffset})
			.attr('x', 100)
			.attr('opacity', 0)
			.text(function (d,i){ return d.rank + '. ' + d.text})
			.transition()
			.attr('opacity', 1);

		var tieID = $.map(theData.rank(), function (d){ return (d.tie) ? d.sort : null });

		numLabel.data(theData.summary, function (d,i){ return d.id })
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('x', 100)
			.attr('y', function (d,i){ return y(d.rank) + ( ((y(2) - y(1)) * d.tiedepth)/2 ) + textOffset}) 
			.text(function (d,i){ return d.rank});
		
		numLabel.attr('opacity', function (d,i){ 
			var c = d3.sum( $.map(tieID, function (h){ return (+h-1===+d.sort)? 1 : 0 }) );
				if(c > 0){
					return 0;
				}
				else{
					return 1;
				}
			});

		issueDots.data(theData.rank(),function (d){ return d.id })
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('visibility', 'visible')
			.attr('fill-opacity', function(d){ return (theData.data.length == 444) ? 1 : 1 })
			.attr('fill', function (d){ return getColor(d) })
			.attr('cy', function (d,i){ return y(d.originalRank)});

		issueElements.exit().transition().attr('opacity','0').remove();

		evaluateButtons(theData);
		$('.n-label').html('n='+theData.data.length);

		filteredLabel.transition().attr('opacity', 1);
		originalLabel.transition().attr('opacity', 1);


		var link = svg.selectAll('.link')
			.data(theData.rank())
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('visibility', 'visible')
			.attr('stroke', function (d){ return getColor(d) })
			.attr('stroke-opacity', .4)
			.attr('d', diagonal);

			})
		
//reset
	$('.reset-btn').click(function (){
		
		$('.filter-button').addClass('active');
		$('.filter-button:contains("International")').removeClass('active');

		theData.init();
		theData.rank();

		if( theData.rank().filter(function (d){return d.sort == 11})[0].tie ){
			y.domain([1,11]);
		}
		else{
			y.domain([1,10]);
		}

		issueElements = svg.selectAll('.issue')
			.data(theData.rank(),function (d){ return d.id });

		issueElements.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('y', function (d,i){ return y(d.sort) + textOffset})
			.attr('x', 30)
			.text(function (d,i){ return d.text});

		issueElements.enter()
			.append('text')
			.attr('class', 'issue')
			.attr('y', function (d,i){ return y(d.sort) + textOffset})
			.attr('x', 100)
			.attr('opacity', 0)
			.text(function (d,i){ return d.rank + '. ' + d.text})
			.transition()
			.attr('opacity', 1);

		var tieID = $.map(theData.rank(), function (d){ return (d.tie) ? d.sort : null });

		numLabel.data(theData.summary, function (d,i){ return d.id })
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('x', 10)
			.attr('y', function (d,i){ 
				if(d.tie){
					return y(d.rank) + ((y(2) - y(1))/2) + textOffset;
				}
				else{
					return (y(d.rank) + textOffset);
			}}).text(function (d,i){ return d.rank});
		
		numLabel.attr('opacity', function (d,i){ 
			var c = d3.sum( $.map(tieID, function (h){ return (+h-1===+d.sort)? 1 : 0 }) );
				if(c > 0){
					return 0;
				}
				else{
					return 1;
				}
			});

		issueDots.data(theData.rank(),function (d){ return d.id })
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('visibility', 'hidden')
			.attr('fill-opacity', function(d){ return (theData.data.length == 444) ? 0 : 1 })
			.attr('fill', function (d){ return getColor(d) })
			.attr('cy', function (d,i){ return y(d.originalRank)});

		issueElements.exit().transition().attr('opacity','0').remove();

		evaluateButtons(theData);
		$('.n-label').html('n='+theData.data.length);

		filteredLabel.transition().attr('opacity', 0);
		originalLabel.transition().attr('opacity', 0);

		var link = svg.selectAll('.link')
			.data(theData.rank())
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('visibility', 'hidden')
			.attr('stroke', function (d){ return getColor(d) })
			.attr('stroke-opacity', .4)
			.attr('d', diagonal);


		
	})
});

//------------------------Data object--------------

//begin data object
function Data(data) {
	this.cf = crossfilter(data);
	this.data = [];
};
//get unfiltered(all) records
Data.prototype.all = function (){ 
	var dim = this.cf.dimension(function (d){ return d.carnegie });
	var rVal = dim.filterFunction(function (d){ return d3.sum($.map((TYPE == 'issues') ? [0,1,2,4,6,8] : [0,1,2,4,6,8,9], function (h){ return (+h === +d) ? 1 : 0 })) }).top(Infinity);

	dim.dispose();

	this.data = rVal;

	return  rVal;
};
//get records with filters applied
Data.prototype.filter = function (cc, fte, control, save){ 
	//create dimensions
	var fteFilter = this.cf.dimension(function (d){ return d.fte }),
	 	controlFilter = this.cf.dimension(function (d){ return d.control }),
	 	ccFilter = this.cf.dimension(function (d){ return d.carnegie });

	// if(cc.indexOf('9') > 0){
	// 	fte = fte.concat([0]);
	// 	control = control.concat([0]);
	// };

	//apply filters from selected checkboxes to crossfilter
	fteFilter.filterFunction(function (d){ return d3.sum($.map(fte, function (h){ return (+h === +d) ? 1 : 0 })) });
	controlFilter.filterFunction(function (d){ return d3.sum($.map(control, function (h){ return (+h === +d) ? 1 : 0 })) });
	ccFilter.filterFunction(function (d){ return d3.sum($.map(cc, function (h){ return (+h === +d) ? 1 : 0 })) });

	//save the output before dimension removal
	var rVal = ccFilter.top(Infinity);

	//remove the dimensions from the crossfilter
	fteFilter.dispose();
	controlFilter.dispose();
	ccFilter.dispose();
	if(save){
		this.data = rVal;
	}

	return rVal;
 };
 //check how many records returned by current filters (return true if > 15)
 Data.prototype.checkLength = function (cc, fte, control){ 

	return this.filter(cc,fte,control, false).length > 15;
 };
Data.prototype.summarize = function (){

	var data = this.data;

	var scores = [];
	//check for what visualization is running
	if(TYPE === 'issues'){
		scores = $.map(issues2, function (d){ return {'score': d3.mean(data, function (h) { return +h[d.id] }) , 'id': d.id}} );
		this.summary = issues2.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });
	}
	else{
		scores = $.map(technologies, function (d){ return {'score': d3.mean(data, function (h) { return +h[d.id] }) , 'id': d.id}} );
		this.summary = technologies.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });
	}

	return this.summary;
}
Data.prototype.rank = function (){

	var sorted = this.summarize().sort(obSort('score'));

	var previousScore = 0;
	var currentRank = 0;

	//Fake the tie on the initial issues page
	$.map(sorted, function (d,i){
		if(d.id == "i14" && initialState()){
			d.tiedepth = 1;
		}
		else{
			d.tiedepth =  d3.sum($.map(sorted.slice(0,i), function (h){
				return (Math.abs(d.score - h.score) > TOLERANCE) ? 0 : 1;
			}))
		}

	});

	return $.map(sorted, function (d,i){
		if(d.tiedepth == 0) {
			currentRank += 1;
			d.rank = currentRank;
			d.tie = false;
		}
		else{
			d.rank = currentRank;
			currentRank += d.tiedepth;
			d.tie = true;
		}

		previousScore = d.score;

		d.sort = i+1;
		return d;
	});
}
//initialize the data by getting unfiltered data and then ranking it
Data.prototype.init = function (){
	this.all();

	var data = this.data;

	var scores = [];
	//check for what visualization is running
		if(TYPE === 'issues'){
			scores = $.map(issues2, function (d){ return {'score': d3.mean(data, function (h) { return +h[d.id] }) , 'id': d.id}} );
			this.summary = issues2.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });

			//join calculated scores with text by id
			var rankedData = issues2.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });
		}
		else{
			scores = $.map(technologies, function (d){ return {'score': d3.mean(data, function (h) { return +h[d.id] }) , 'id': d.id}} );
			this.summary = technologies.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });

			//join calculated scores with text by id
			var rankedData = technologies.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });
		}
		
		
		var sorted = $.map(rankedData, function (d){ return $.extend(d, {'originalScore': d.score}) }).sort(obSort('originalScore'));

		//add ranks and check for ties
	var previousScore = 0;
	var currentRank = 0;

	this.summary = $.map(sorted, function (d){
		if(Math.abs(d.originalScore - previousScore) > TOLERANCE) {
			currentRank += 1;
		}

		previousScore = d.originalScore;

		return $.extend(d, {'originalRank':currentRank});
	});

}

//---------------Utility functions --------------------

function obSort(name){
	if(TYPE === 'issues'){
		return function(a,b){
			return a[name] < b[name] ? -1 : a[name] > b[name] ? 1 : a[name] >= b[name] ? 0 : NaN;
		}
	}
	else{
		return function(a,b){
			return b[name] < a[name] ? -1 : b[name] > a[name] ? 1 : b[name] >= a[name] ? 0 : NaN;
		}
	}
	
}
//evaluate each button
function evaluateButtons(data){

	var ccSelected = $.map($('.btn-group.cc').find('.filter-button.active'), function (d){ return $(d).attr('data') });
	var fteSelected = $.map($('.btn-group.fte').find('.filter-button.active'), function (d){ return $(d).attr('data') });
	var controlSelected = $.map($('.btn-group.control').find('.filter-button.active'), function (d){ return $(d).attr('data') });

	$.map($('.btn-group').find('.filter-button.active'), function (d){ 
		var c = $(d.parentElement).attr('class').split(' ')[1];
		var n = $(d).attr('data');
		switch(c){
			case 'cc':
				var opposite = $.map(ccSelected, function (h){ return (h != $(d).attr('data')) ? h : null });
				if( data.checkLength( opposite, fteSelected, controlSelected ) ){
					$(d).prop('disabled', false);
					$(d).removeClass('disabled');
				}
				else{
					$(d).prop('disabled', true);
					$(d).addClass('disabled');
				}
			break;
			case 'fte':
				var opposite = $.map(fteSelected, function (h){ return (h != $(d).attr('data')) ? h : null });
				if( data.checkLength( ccSelected, opposite, controlSelected ) ){
					$(d).prop('disabled', false);
					$(d).removeClass('disabled');
				}
				else{
					$(d).prop('disabled', true);
					$(d).addClass('disabled');
				}
			break;
			case 'control':
				var opposite = $.map(controlSelected, function (h){ return (h != $(d).attr('data')) ? h : null });
				if( data.checkLength( ccSelected, fteSelected, opposite ) ){
					$(d).prop('disabled', false);
					$(d).removeClass('disabled');
				}
				else{
					$(d).prop('disabled', true);
					$(d).addClass('disabled');
				}
			break;
		}

		return d });
}
function debugPrint(data){
	console.log("----------------------")
	console.log("TEXT |", "SCORE |", "RANK")
	$.map(data, function (d){ console.log(d.text, d.score, d.rank)});
}
function initialState(){
	var ccSelected = $.map($('.btn-group.cc').find('.filter-button.active'), function (d){ return $(d).attr('data') }).join();
	var fteSelected = $.map($('.btn-group.fte').find('.filter-button.active'), function (d){ return $(d).attr('data') }).join();
	var controlSelected = $.map($('.btn-group.control').find('.filter-button.active'), function (d){ return $(d).attr('data') }).join();

	return (ccSelected == [1,2,4,6,8] && controlSelected == [1,2,0] && fteSelected == [1,2,3,4,5,0])
}
function getColor(d){ 
	var val = d.rank - d.originalRank;
	var rval;
	if(val>0){
		rval = color(1);
	}
	else if(val < 0){
		rval = color(2);
	}
	else{
		rval = color(0);
	}
	return rval;
}
});