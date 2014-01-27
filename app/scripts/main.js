require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        crossfilter: '../bower_components/crossfilter/crossfilter',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        d3: '../bower_components/d3/d3'
    }
});

require(['jquery','crossfilter','bootstrap','app','d3'], function ($, crossfilter, bootstrap, app, d3) {
    'use strict';
    // use app here
});
