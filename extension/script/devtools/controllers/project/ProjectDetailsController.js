'use strict';
require('angular');
var Site = require('../../model/Site');

module.exports = (function () {

    angular.module('KidoScraper').controller('ProjectDetailsController', function ($scope, $routeParams, $location, RunInBackgroundScript, AngularScope) {
        console.log('Loading Project Details Controller...');

        if (!$routeParams.name) {
            return $location.path('/');
        }
        $scope.types = [{
            id: Site.TYPES.FORM,
            name: 'Form'
        }, {
            id: Site.TYPES.CLICK,
            name: 'Click'
        }, {
            id: Site.TYPES.SCRAPE,
            name: 'Scrape'
        }];
        $scope.stepType = $scope.types[0].id;
        RunInBackgroundScript.getFromLocalStorage($routeParams.name).done(function(siteAsJson) {

            AngularScope.apply($scope, function() {
                $scope.site = siteAsJson;
                $scope.site.steps = $scope.site.steps || [];

                function _addStep(type) {
                    $location.path('/projects/step/edit/' + $routeParams.name + '/' + type);
                }

                $scope.addStep = function () {
                    _addStep($scope.stepType);
                };
                $scope.addCompleteForm = function () {
                    _addStep(Site.TYPES.FORM);
                };
                $scope.addClickEvent = function () {
                    _addStep(Site.TYPES.CLICK);
                };
                $scope.addScrape = function () {
                    _addStep(Site.TYPES.SCRAPE);
                };
                $scope.exportSite = function (site) {
                    $location.path('/projects/export/' + site.name);
                };
                $scope.runSite = function (site) {
                    $location.path('/projects/run/' + site.name);
                };
                $scope.editStep = function (step) {
                    $location.path('/projects/step/edit/' + $scope.site.name + '/' + step.type + '/' + step.name);
                };
                $scope.deleteStep = function (index) {
                    var stepName = $scope.site.steps[index].name;

                    if (!confirm("Are you sure you want to delete the step '" + stepName + "'?")) {
                        return;
                    }
                    $scope.site.steps.splice(index, 1);

                    RunInBackgroundScript.setInLocalStorage({
                        key: $scope.site.name,
                        value: new Site($scope.site).toJson()
                    });
                };
            });
        });
    });
})();