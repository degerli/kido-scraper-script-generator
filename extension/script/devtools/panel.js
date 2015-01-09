/* global $, chrome, window, console, angular */
'use strict';
require('angular');
require('angular-route');
require('angular-loading-bar');
var Site = require('./model/Site');

angular.module('KidoScraper', ['ngRoute', 'angular-loading-bar'])
    .config(function ($routeProvider, $compileProvider) {
        $compileProvider
            .aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|filesystem:chrome-extension|blob:chrome-extension):/);

        $routeProvider
            .when('/zero', {
                templateUrl: 'partial/zero.html',
                controller: 'ZeroController'
            })
            .when('/one', {
                templateUrl: 'partial/one.html',
                controller: 'OneController'
            })
            .when('/two/:name', {
                templateUrl: 'partial/two.html',
                controller: 'TwoController'
            })
            .when('/three/:name/:type', {
                templateUrl: 'partial/three.html',
                controller: 'ThreeController'
            })
            .when('/export/:name', {
                templateUrl: 'partial/export.html',
                controller: 'ExportController'
            })
            .when('/run/:name', {
                templateUrl: 'partial/run.html',
                controller: 'RunController'
            })
            .when('/datasource/create/:serviceName/:siteName', {
                templateUrl: 'partial/ds.html',
                controller: 'CreateDSController'
            })
            .otherwise({
                redirectTo: '/zero'
            });
    })
    .run();