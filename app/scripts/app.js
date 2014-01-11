/*global define */
define([], function () {
    'use strict';
});

var TYPE = 'issues';

var issues2 = [{'text': 'Determining the role of online learning', 'id':'i1'},
		{'text': 'Improving student outcomes', 'id':'i2'},
		{'text': 'Using analytics', 'id':'i3'},
		{'text': 'Developing an IT org model', 'id':'i4'},
		{'text': 'Assisting faculty with instructional integration', 'id':'i5'},
		{'text': 'Addressing access demand', 'id':'i6'},
		{'text': 'Balancing innovation with execution', 'id':'i7'},
		{'text': 'Competing for IT talent', 'id':'i8'},
		{'text': 'Establishing and implementing IT governance', 'id':'i9'},
		{'text': 'Changing IT funding models', 'id':'i10'},
		{'text': 'Establishing partnership between IT and leadership', 'id':'i11'},
		{'text': 'Harnessing the trends toward consumerization', 'id':'i12'},
		{'text': 'Supporting the research mission', 'id':'i13'},
		{'text': 'Developing an enterprise IT architecture', 'id':'i14'},
		{'text': 'Identifying new models', 'id':'i15'},
		{'text': 'Optimizing IT efficiency and excellence', 'id':'i16'},
		{'text': 'Sourcing technologies and services at scale', 'id':'i17'},
		{'text': 'Risk mgmt infosec practices', 'id':'i18'}];

//initalize svg
var margin = {top: 40, right: 10, bottom: 20, left: 0};

var width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var textOffset = 6;

var svg = d3.select(".svg-content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//scales
var y = d3.scale.linear().domain([1,10]).range([0,height]);
var color = d3.scale.ordinal().range(["#d3d3d3","#75c0d8","#c4d676"])

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
d3.csv('data/issues_data.csv', function (data){ 

		//myData.filter(ccSelected, fteSelected, controlSelected)
	var theData = new Data(data);
	theData.init();
	theData.rank();


	var issueElements = svg.selectAll(".issue")
		.data(theData.summary, function (d){ return d.text })
		.enter()
		.append("text")
		.attr("class", "issue")
		.attr('y', function (d,i){ return (y(d.rank) + textOffset)})
		.attr('x', 30)
		.text(function (d,i){ return d.text});

	var numLabel = svg.selectAll(".num-label")
		.data(theData.summary, function (d){ return d.text })
		.enter()
		.append("text")
		.attr("class", "num-label")
		.attr('y', function (d,i){ return (y(d.rank) + textOffset)})
		.attr('x', 10)
		.text(function (d,i){ return d.rank});

	var link = svg.selectAll(".link")
        .data(theData.rank())
        .enter().append("path")
        .attr("class", "link")
        .attr("stroke", function (d){ return color(d.rank - d.originalRank) })
        .attr("stroke-width", "3")
        .attr('fill', 'none')
        .attr('stroke-opacity', 0)
        .attr("d", diagonal);

	var issueDots = svg.selectAll(".dot")
		.data(theData.summary, function (d){ return d.text })
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("fill", function (d){ return getColor(d) })
		.attr('r', 5)
		.attr('cx', 10)
		.attr('fill-opacity', 0)
		.attr('cy', function (d,i){ return y(d.originalRank)});

	var filteredLabel = svg.append('text').attr('opacity', 0).attr('class', 'data-label').attr('x', 83).attr('y', -20).text('Filtered');
	var originalLabel = svg.append('text').attr('opacity', 0).attr('class', 'data-label').attr('x', 3).attr('y', -20).text('All');

	$('.n-label').html("n="+theData.data.length);

	$('input').change(function (e){

		var ccSelected = $.map($('.btn-group.cc').find('input:checked'), function (d){ return $(d).attr('data') });
		var fteSelected = $.map($('.btn-group.fte').find('input:checked'), function (d){ return $(d).attr('data') });
		var controlSelected = $.map($('.btn-group.control').find('input:checked'), function (d){ return $(d).attr('data') });

		theData.filter( ccSelected, fteSelected, controlSelected,true );

		if( theData.rank().filter(function (d){return d.sort == 11})[0].tie ){
			y.domain([1,11]);
		}
		else{
			y.domain([1,10]);
		}

		issueElements = svg.selectAll(".issue")
			.data(theData.rank(),function (d){ return d.text });

		issueElements.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr('y', function (d,i){ return y(d.sort) + textOffset})
			.attr('x', 120)
			.text(function (d,i){ return d.text});

		issueElements.enter()
			.append("text")
			.attr("class", "issue")
			.attr('y', function (d,i){ return y(d.sort) + textOffset})
			.attr('x', 100)
			.attr('opacity', 0)
			.text(function (d,i){ return d.rank + ". " + d.text})
			.transition()
			.attr('opacity', 1);

		var tieID = $.map(theData.rank(), function (d){ return (d.tie) ? d.sort : null });

		numLabel.data(theData.summary, function (d){ return d.text })
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			//.attr('y', function (d,i){ return (y(d.rank) + textOffset) })
			//.attr('opacity', function (d){ return (d.tie) ? 0 : 1})
			.attr('x', 100)
			.attr('y', function (d,i){ 
			var c = d3.sum( $.map(tieID, function (h){ return (+h-1===+d.sort)? 1 : 0 }) );
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
			}})

		issueDots.data(theData.rank(),function (d){ return d.text })
			.transition()
			.delay(function (d,i){ return d.rank * 50})
			.attr("fill-opacity", function(d){ return (theData.data.length == 444) ? 0 : 1 })
			.attr("fill", function (d){ return getColor(d) })
			.attr('cy', function (d,i){ return y(d.originalRank)});;

		issueElements.exit().transition().attr('opacity','0').remove();

		evaluateButtons(theData);
		$('.n-label').html("n="+theData.data.length);

		filteredLabel.transition().attr('opacity', 1);
		originalLabel.transition().attr('opacity', 1);

		var link = svg.selectAll(".link")
            .data(theData.rank())
            .transition()
            .delay(function (d,i){ return d.rank * 50})
            .attr("stroke", function (d){ return getColor(d) })
            .attr('stroke-opacity', .4)
            .attr("d", diagonal);

	})
	
});

//------------------------Data object--------------

//begin data object
function Data(data) {
	this.cf = crossfilter(data);
	this.data = [];
}
//get unfiltered(all) records
Data.prototype.all = function (){ 
	var dim = this.cf.dimension(function (d){ return d.fte });
	var rVal = dim.filter(null).top(Infinity);

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
 		scores = $.map(issues2, function (d){ return {'score': d3.sum(data, function (h) { return +h[d.id]/data.length }) , 'id': d.id}} );
 	}
 	else{
 		scores = [];
 	}

 	this.summary = issues2.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });
 	
 	return this.summary;
}
Data.prototype.rank = function (){

	var sorted = this.summarize().sort(obSort('score'));

	var previousScore = 0;
	var currentRank = 0;

	return $.map(sorted, function (d,i){
		if(Math.abs(d.score - previousScore) > .01) {
			currentRank += 1;
			d.rank = currentRank;
			d.tie = false;
		}
		else{
			d.rank = currentRank;
			currentRank += 1;
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
 		scores = $.map(issues2, function (d){ return {'score': d3.sum(data, function (h) { return +h[d.id]/data.length }) , 'id': d.id}} );
 	}
 	else{
 		scores = [];
 	}
 	
 	//join calculated scores with text by id
 	var rankedData = issues2.map(function (d,i){ return scores.map(function (h){ return (h.id === d.id) ?  $.extend(d,h) : null}).filter(function(d){return d})[0] });
 	var sorted = $.map(rankedData, function (d){ return $.extend(d, {'originalScore': d.score}) }).sort(obSort('originalScore'));

 	//add ranks and check for ties
	var previousScore = 0;
	var currentRank = 0;

	this.summary = $.map(sorted, function (d){
		if(Math.abs(d.originalScore - previousScore) > .01) {
			currentRank += 1;
		}

		previousScore = d.originalScore;

		return $.extend(d, {"originalRank":currentRank});
	});

}

//---------------Utility functions --------------------

function obSort(name){
	return function(a,b){
		return a[name] < b[name] ? -1 : a[name] > b[name] ? 1 : a[name] >= b[name] ? 0 : NaN;
	}
	
}
//evaluate each button
function evaluateButtons(data){
	var ccSelected = $.map($('.btn-group.cc').find('input:checked'), function (d){ return $(d).attr('data') });
	var fteSelected = $.map($('.btn-group.fte').find('input:checked'), function (d){ return $(d).attr('data') });
	var controlSelected = $.map($('.btn-group.control').find('input:checked'), function (d){ return $(d).attr('data') });

	$.map($('.btn-group').find('input:checked'), function (d){ 
		var c = $(d.parentElement.parentElement).attr('class').split(' ')[1]
		var n = $(d).attr('data');
		switch(c){
			case 'cc':
				var opposite = $.map(ccSelected, function (h){ return (h != $(d).attr('data')) ? h : null });
				if( data.checkLength( opposite, fteSelected, controlSelected ) ){
					$(d).prop('disabled', false);
				}
				else{
					$(d).prop('disabled', true);
				}
			break;
			case 'fte':
				var opposite = $.map(fteSelected, function (h){ return (h != $(d).attr('data')) ? h : null });
				if( data.checkLength( ccSelected, opposite, controlSelected ) ){
					$(d).prop('disabled', false);
				}
				else{
					$(d).prop('disabled', true);
				}
			break;
			case 'control':
				var opposite = $.map(controlSelected, function (h){ return (h != $(d).attr('data')) ? h : null });
				if( data.checkLength( ccSelected, fteSelected, opposite ) ){
					$(d).prop('disabled', false);
				}
				else{
					$(d).prop('disabled', true);
				}
			break;
		}

		return d });
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
