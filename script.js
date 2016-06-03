var app = angular.module('HenriPotier', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html'
        })
        .when('/panier', {
            templateUrl: 'panier.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.service("service", function() {
    this.url = "";
    this.panTab = [];
});


app.controller('bookList', ["$scope", "$http", "service", function($scope, $http, service) {
    $http.get('http://henri-potier.xebia.fr/books')
        .then((response) => {
            $scope.datas = response.data;
        })
        .catch((response) => {
            console.error('Gists error', response.status, response.data);
        })
        .finally(() => {
            console.log("finally finished gists");
        });
    $scope.isbn = "";
    $scope.panierTab = [];
    $scope.nbPanier = 0;
    $scope.addPanier = function() {
        $scope.nbPanier += 1;
        $scope.isbn += this.data.isbn + ",";
        $scope.panierTab.push(this.data);
        service.panTab = $scope.panierTab;
        // console.log($scope.panierTab);
    };
    $scope.goPanier = function() {
        $scope.isbn = $scope.isbn.replace(/(\s+)?.$/, '');
        $scope.url = "http://henri-potier.xebia.fr/books/" + $scope.isbn + "/commercialOffers";
        service.url = $scope.url;
    };
}]);




app.controller('panList', ["$scope", "$http", "service", function($scope, $http, service) {
    $scope.getUrl = service.url;
    $scope.panTab = service.panTab;
    $scope.total = 0;
    $scope.totalPercent = 0;
    $scope.totalMinus = 0;
    $scope.totalSlice = 0;
    $scope.totalFinal = 0;
    $scope.choixReduc = "";
    for (var i = 0; i < $scope.panTab.length; i++) {
        $scope.total += $scope.panTab[i].price
    };


    $http.get($scope.getUrl)
        .then((response) => {
            $scope.datas = response.data;
            console.log($scope.datas["offers"][0].value);
            $scope.totalPercent = $scope.total - (($scope.total / 100) * $scope.datas["offers"][0].value);

            $scope.totalMinus = $scope.total - $scope.datas["offers"][1].value;

            $scope.totalSlice = $scope.total - Math.floor($scope.total / 100) * $scope.datas["offers"][2].value;


            if ($scope.totalPercent < $scope.totalMinus && $scope.totalPercent < $scope.totalSlice) {
                $scope.totalFinal = $scope.totalPercent;
                $scope.choixReduc = "avec moins " + $scope.datas["offers"][0].value + "%";
            } else if ($scope.totalSlice < $scope.totalMinus && $scope.totalSlice < $scope.totalPercent) {
                $scope.totalFinal = $scope.totalSlice;
                $scope.choixReduc = "avec moins " + $scope.datas["offers"][2].value + " par tranche de 100 soit: ";
            } else {
                $scope.totalFinal = $scope.totalMinus;
                $scope.choixReduc = "avec moins " + $scope.datas["offers"][1].value + "$";
            }

        })
        .catch((response) => {
            console.error('Gists error', response.status, response.data);
        })
        .finally(() => {
            console.log("finally finished gists");
        });


}]);
