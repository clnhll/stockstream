'use strict';

angular.module('stockstreamApp')

  .controller('MainCtrl', function ($scope, $http, socket, $filter) {
    $scope.awesomeThings = [];
    $scope.arrayLength=-1;
    $scope.deleted = false;
    var date = new Date();
  	var year = date.getFullYear();
  	var month = date.getMonth().toString().length == 1 ? "0" + (date.getMonth()+1).toString() : (date.getMonth()+1).toString();
  	var day = date.getDate().toString().length == 1 ? "0" + date.getDate().toString() : date.getDate().toString();
  	var hours = date.getHours().toString().length == 1 ? "0" + date.getHours().toString() : date.getHours().toString();
  	var minutes = date.getMinutes().toString().length == 1 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
    var dateStr = year + "-" + month + "-" + day;

    $scope.refreshChart = function(){
      $('#container').highcharts({
            chart: {
              type: 'line',
              alignTicks: false,
            },
            navigator:{
             enabled:!1
             },
            rangeSelector:{
              enabled:!1
            },
            exporting:{
              enabled:!1
            },
            scrollbar:{
              enabled:!1
            },
            legend: {
              enabled: true
            },
            title: "",
            series: $scope.stocks,
            xAxis: {
              showFirstLabel: false,
              showLastLabel: false,
              tickLength: 0,
              labels: {
                enabled: false
              }
            },
            yAxis: {
              gridLineWidth: 0,
              labels: {
              },
              title: {
                enabled: false
              }
            },
            tooltip : {
              followPointer: true,
              crosshairs: true
            },
            credits: {
              enabled: false
            }
      });
      $scope.arrayLength = $scope.stocks.length
    }

    $http.get('/api/stocks/').success(function(stocks) {
      $scope.stocks = stocks;
      socket.syncUpdates('stock', $scope.stocks,function(event, stock, stocks) {
        setTimeout(function(){$scope.refreshChart();},500);
      });
      $scope.refreshChart();
    });

    $scope.addStock = function() {
      if($scope.newStock === '') {
        return;
      }
      $(".btn").prop("disabled",true);
      $(".form-control").prop("disabled",true);

      $http.get('https://www.quandl.com/api/v1/datasets/WIKI/' + $scope.newStock + '.json?sort_order=asc&exclude_headers=true&trim_start=' + year + '-01-01&trim_end=' + dateStr + '&auth_token=PwyZscKorv3wCa-dEbtX').success(function(stockData){
        var newStockInfo = {
          type: "line",
          name: $scope.newStock,
          data: stockData.data.map(function(arr){
            return [$filter('date')(arr[0],'longDate'),arr[4]]}),
          marker: {
            enabled: false
          },
          color: $scope.getRandomColor()
        }
        $http.post('/api/stocks', newStockInfo).success(function(){
          $(".btn").prop("disabled",false);
          $(".form-control").prop("disabled",false);
          $scope.newStock='';
          /** $http.get('/api/stocks/').success(function(stocks) {
            $scope.stocks = stocks;
            socket.syncUpdates('stock', $scope.stocks);
            $scope.refreshChart();

          }); **/
        });
      })


    };

    $scope.deleteStock = function(stock) {
      $http.delete('/api/stocks/' + stock._id).success(function(){
        $http.get('/api/stocks/').success(function(stocks) {
          $scope.stocks = stocks;
          /** socket.syncUpdates('stock', $scope.stocks,function(event, stock, stocks) {
            //$scope.refreshChart();
          }); **/
          $scope.refreshChart();
        });
      });
    };

    $scope.getRandomColor = function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $scope.$on('$destroy', function(){
      socket.unSyncUpdates('stock' /** ,function(event, stock, stocks) {
        //$scope.refreshChart();
      } **/ );
    });
  });
