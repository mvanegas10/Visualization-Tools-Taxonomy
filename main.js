'use strict';

var visToolsApp = angular.module('visToolsApp', []);

visToolsApp.controller('visToolsCtrl', ['$scope', function($scope){

    d3.csv("./data/tools.csv", function(data) {
        data = data;
        var columns = Object.keys(data[0]);
        getTools(data, columns);
    });

    $scope.languages = ["Java","JavaScript","C++","PHP","C#","Ruby","Python","R","Matlab"];
    $scope.tables = ["Bar chart", "Line chart", "Pie chart", "Scatter plot"];
    $scope.graphs = ["Node-Link Diagram", "Adjacency matrix", "Tree map"];
    $scope.spatial = ["Map", "Vector"];
    $scope.abstraction = ["High", "Low"];
    $scope.interData = ["Poll"];
    $scope.interUser = ["Zoom","Pop up","Drill Down"];
    $scope.widgets = ["Communication","Interaction"];
    $scope.license = ['BSD 3-clause "New" or "Revised" License',"BSD License","Creative Commons Attribution-ShareAlike 4.0 International License","MIT License","Apache License 2.0",'BSD 2-clause "Simplified" License',"GNU Free Documentation License","GNU General Public License v3","Apache 2.0 License/MIT License"];

    $scope.selectionLanguage = {"language":""};
    $scope.selection = [];
    $scope.selectionAbstraction = {"abstraction":""};
    $scope.selectionLicense = {"license":""};


    $scope.selectLanguage = function (option) {
        console.log($scope.selectionLanguage);
        filterData();
    };

    $scope.select = function (option) {
        var idx = $scope.selection.indexOf(option);
        if (idx > -1) $scope.selection.splice(idx, 1);
        else $scope.selection.push(option);
        filterData();
    };

    $scope.selectAbstraction = function (option) {
        console.log($scope.selectionAbstraction);
        filterData();
    };

    $scope.selectLicense = function (option) {
        console.log($scope.selectionLicense);
        filterData();
    };

    function filterData () {
        d3.csv("/data/tools.csv", function(data) {
            data = data;
            var columns = Object.keys(data[0]);
            if($scope.selectionLanguage.language){
                data = data.filter(function (d) {
                    if(d.Language === $scope.selectionLanguage.language) return d;
                });
            }
            $scope.selection.forEach(function (col){
                var option = col.replace(" ","_");
                data = data.filter(function (d) {
                    if(d[option] === "1") return d;
                });
            });
            if($scope.selectionAbstraction.abstraction){
                data = data.filter(function (d) {
                    if(d["Abstraction-Level"].trim() === $scope.selectionAbstraction.abstraction.trim()) return d;
                });
            }
            if($scope.selectionLicense.license){
                data = data.filter(function (d) {
                    if(d.License.trim() === $scope.selectionLicense.license.trim()) return d;
                });
            }
            document.getElementById("tools").innerHTML = "";
            getTools(data, columns);
        });
    }

    function getTools(data, columns) {
        console.log("Showing " + data.length + " tools");
        console.log(data);
        var container = d3.select("#tools");

        var nested_data = d3.nest()
            .key(function (d) { return d[columns[1]];})
            .entries(data); 

        var topicsData = container.selectAll(".topic")
            .data(nested_data);

        var topicsEnter = topicsData.enter()
            .append("div")
            .attr("class", "topic row col-sm-6")
            .style("padding","0.5cm")
            
        var topics = topicsEnter.merge(topicsData);

        topicsData.exit().remove();
            
        var projs = topics.selectAll(".tool")
            .data(function (d) { return d.values; })
            .enter();

        var link = projs.append("a")
            .attr("href" , function (d) {
              return d[columns[1]];
            })
            .attr("target", "_blank")
            .append("img")
            .attr("src", function (d) { return "images/" + d[columns[2]]; })
            .attr("height","50px");

        var body = projs.append("div")
            .attr("class", "tool-body");

        body.append("h4")
            .text(function (d) { return columns[3] + ": " + d[columns[3]] }); 

        body.append("h4")
            .text("Dataset types"); 

        var row = body.append("div")
            .attr("class", "row");

        var tables = row.append("div")
            .attr("class", "col-md-4 tables")
            .append("h5")
            .text("Tables and fields");

        var graphs = row.append("div")
            .attr("class", "col-md-4 graphs")
            .append("h5")
            .text("Graphs and trees");

        var spatial = row.append("div")
            .attr("class", "col-md-4 spatial")
            .append("h5")
            .text("Spatial");

        var rowsTables = tables.append('table').selectAll('tr')
            .data(function (d){
                var newData = [];
                columns.slice(4,8).forEach(function(column){
                    newData.push({"column":column, "value":d[column]});
                });
                return newData;
            })
            .enter()
            .append('tr');                      

        rowsTables.selectAll('td')
            .data(function (column) {
                var newData = [];
                newData.push(column.column);
                newData.push(column.value);
                return newData;
            })
            .enter()
            .append('td')
            .text(function (d) { 
                if(d === "0")return "No"; 
                else if(d === "1")return "Yes"; 
                else return d.replace("_"," ");
            });   
            
        var rowsGraph = graphs.append('table').selectAll('tr')
            .data(function (d){
                var newData = [];
                columns.slice(8,11).forEach(function(column){
                    newData.push({"column":column, "value":d[column]});
                });
                return newData;
            })
            .enter()
            .append('tr');                      

        rowsGraph.selectAll('td')
            .data(function (column) {
                var newData = [];
                newData.push(column.column);
                newData.push(column.value);
                return newData;
            })
            .enter()
            .append('td')
            .text(function (d) { 
                if(d === "0")return "No"; 
                else if(d === "1")return "Yes"; 
                else return d.replace("_"," ");
            });      

        var rowsSpatial = spatial.append('table').selectAll('tr')
            .data(function (d){
                var newData = [];
                columns.slice(11,13).forEach(function(column){
                    newData.push({"column":column, "value":d[column]});
                });
                return newData;
            })
            .enter()
            .append('tr');                      

        rowsSpatial.selectAll('td')
            .data(function (column) {
                var newData = [];
                newData.push(column.column);
                newData.push(column.value);
                return newData;
            })
            .enter()
            .append('td')
            .text(function (d) { 
                if(d === "0")return "No"; 
                else if(d === "1")return "Yes"; 
                else return d.replace("_"," ");
            });   

        body.append("h4")
            .text("Abstraction level");                                

        body.append("h5")
            .text(function(d) {return d["Abstraction-Level"]});

        body.append("h4")
            .text("Interaction");  

        body.append("h5")
            .text("Data");               

        var interaction = body.append("div");

        var rowsInterData = interaction.append('table').selectAll('tr')
            .data(function (d){
                var newData = [];
                columns.slice(14,16).forEach(function(column){
                    newData.push({"column":column, "value":d[column]});
                });
                return newData;
            })
            .enter()
            .append('tr');                      

        rowsInterData.selectAll('td')
            .data(function (column) {
                var newData = [];
                newData.push(column.column);
                newData.push(column.value);
                return newData;
            })
            .enter()
            .append('td')
            .text(function (d) { 
                if(d === "0")return "No"; 
                else if(d === "1")return "Yes"; 
                else return d.replace("_"," ");
            });

        body.append("h5")
            .text("User");               

        var interaction = body.append("div");

        var rowsInterUser = interaction.append('table').selectAll('tr')
            .data(function (d){
                var newData = [];
                columns.slice(16,19).forEach(function(column){
                    newData.push({"column":column, "value":d[column]});
                });
                return newData;
            })
            .enter()
            .append('tr');                      

        rowsInterUser.selectAll('td')
            .data(function (column) {
                var newData = [];
                newData.push(column.column);
                newData.push(column.value);
                return newData;
            })
            .enter()
            .append('td')
            .text(function (d) { 
                if(d === "0")return "No"; 
                else if(d === "1")return "Yes"; 
                else return d.replace("_"," ");
            });           

        body.append("h4")
            .text("Widgets");                 

        var widgets = body.append("div");

        var rowsWidget = widgets.append('table').selectAll('tr')
            .data(function (d){
                var newData = [];
                columns.slice(19,21).forEach(function(column){
                    newData.push({"column":column, "value":d[column]});
                });
                return newData;
            })
            .enter()
            .append('tr');                      

        rowsWidget.selectAll('td')
            .data(function (column) {
                var newData = [];
                newData.push(column.column);
                newData.push(column.value);
                return newData;
            })
            .enter()
            .append('td')
            .text(function (d) { 
                if(d === "0")return "No"; 
                else if(d === "1")return "Yes"; 
                else return d.replace("_"," ");
            });             

        body.append("h4")
            .text("License");                                

        body.append("h5")
            .text(function(d) {return d["License"]});            

    }

}]);


