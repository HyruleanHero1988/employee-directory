var app = angular.module('organizationDirectory', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                    organizationPromise: ['organizations', function(organizations) {
                        return organizations.getAll();
                    }]
                }
            })
            .state('organizations', {
                url: '/organizations/{id}',
                templateUrl: '/organizations.html',
                controller: 'OrganizationsCtrl',
                resolve: {
                    organization: ['$stateParams', 'organizations', function($stateParams, organizations) {
                        return organizations.get($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('organizations', ['$http', function($http) {
    var o = {
        organizations: []
    };

    o.getAll = function() {
        return $http.get('/organizations').success(function(data) {
            angular.copy(data, o.organizations);
        });
    };

    o.create = function(organization) {
        return $http.post('/organizations', organization).success(function(data) {
            o.organizations.push(data);
        });
    };

    o.get = function(id) {
        return $http.get('/organizations/' + id).then(function(res) {
            return res.data;
        });
    };

    o.update = function(organization) {
        return $http.put('/organizations/' + organization._id, organization);
    };

    o.updateEmployee = function(employee) {
        return $http.put('/employees/' + employee._id, employee);
    };

    o.addEmployee = function(organization, employee) {
        return $http.post('/organizations/' + organization._id + '/employees', employee);
    };

    o.delete = function(organization) {
        return $http.delete('/organizations/' + organization._id);
    };

    o.deleteEmployee = function(organization, employee) {
        return $http.delete('/organizations/' + organization._id + '/employees/' + employee._id);
    };

    return o;
}]);

app.controller('MainCtrl', [
    '$scope',
    'organizations',
    function($scope, organizations) {
        $scope.updating = false;
        $scope.organizations = organizations.organizations;

        $scope.addOrganization = function() {
            if (!$scope.name || $scope.name === '') {
                return;
            }
            organizations.create({
                name: $scope.name,
                phoneNumber: $scope.phoneNumber,
                website: $scope.website
            });
            $scope.name = '';
            $scope.phoneNumber = '';
            $scope.website = '';
        };

        $scope.showOrgUpdateForm = function(organization) {
            $scope.organization = organization;
            $scope.newName = organization.name;
            $scope.newPhoneNumber = organization.phoneNumber;
            $scope.newWebsite = organization.website;
            $scope.updating = true;
        };

        $scope.updateOrganization = function(organization) {
            organization.name = $scope.newName;
            organization.phoneNumber = $scope.newPhoneNumber;
            organization.website = $scope.newWebsite;
            organizations.update(organization);
            $scope.updating = false;
            $scope.newName = '';
        };

        $scope.deleteOrganization = function(organization) {
            organizations.delete(organization).success(function() {
                $scope.organizations.splice($scope.organizations.indexOf(organization), 1);
            });
        };

        $scope.populateData = function() {
            organizations.create({
                name: "ADP",
                phoneNumber: "202-555-0133",
                website: "www.adp.com"
            }).success(function() {
                organizations.addEmployee(organizations.organizations[0], {
                    firstName: "Carlos",
                    lastName: "Rodriguez",
                    phoneNumber: "202-555-0165",
                    emailAddress: "Carlos.Rodriguez@adp.com"
                });
                organizations.addEmployee(organizations.organizations[0], {
                    firstName: "Leslie",
                    lastName: "Brun",
                    phoneNumber: "202-555-0182",
                    emailAddress: "Leslie.Brun@adp.com"
                });
                organizations.addEmployee(organizations.organizations[0], {
                    firstName: "Henry",
                    lastName: "Taub",
                    phoneNumber: "202-555-0169",
                    emailAddress: "Henry.Taub@adp.com"
                });
            });
            organizations.create({
                name: "Google",
                phoneNumber: "202-555-0141",
                website: "www.google.com"
            }).success(function() {
                organizations.addEmployee(organizations.organizations[1], {
                    firstName: "Larry",
                    lastName: "Page",
                    phoneNumber: "202-555-0165",
                    emailAddress: "Larry.Page@gmail.com"
                });
                organizations.addEmployee(organizations.organizations[1], {
                    firstName: "Sergey",
                    lastName: "Brin",
                    phoneNumber: "202-555-0182",
                    emailAddress: "Sergey.brin@gmail.com"
                });
                organizations.addEmployee(organizations.organizations[1], {
                    firstName: "Sundar",
                    lastName: "Pichai",
                    phoneNumber: "202-555-0169",
                    emailAddress: "Sundar.Pichai@gmail.com.com"
                });
            });
            organizations.create({
                name: "Microsoft",
                phoneNumber: "202-555-0173",
                website: "www.microsoft.com"
            }).success(function() {
                organizations.addEmployee(organizations.organizations[2], {
                    firstName: "Bill",
                    lastName: "Gates",
                    phoneNumber: "202-555-0165",
                    emailAddress: "Bill.Gates@outlook.com"
                });
                organizations.addEmployee(organizations.organizations[2], {
                    firstName: "Paul",
                    lastName: "Allen",
                    phoneNumber: "202-555-0182",
                    emailAddress: "Paul.Allen@outlook.com"
                });
                organizations.addEmployee(organizations.organizations[2], {
                    firstName: "Sataya",
                    lastName: "Nadella",
                    phoneNumber: "202-555-0169",
                    emailAddress: "Sataya.Nadella@outlook.com"
                });
            });
        }
    }
]);

app.controller('OrganizationsCtrl', [
    '$scope',
    'organizations',
    'organization',
    function($scope, organizations, organization) {
        $scope.organization = organization;

        $scope.addEmployee = function() {
            if (!$scope.firstName || $scope.firstName === '' || !$scope.lastName || $scope.lastName === '') {
                return;
            }
            organizations.addEmployee(organization, { //this should be more consistent, sometimes you pass organization, sometimes you pass id
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                phoneNumber: $scope.phoneNumber,
                emailAddress: $scope.emailAddress,
            }).success(function(employee) {
                $scope.organization.employees.push(employee);
            });
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.phoneNumber = '';
            $scope.emailAddress = '';
        };

        $scope.showEmpUpdateForm = function(employee) {
            $scope.newFirstName = employee.firstName;
            $scope.newLastName = employee.lastName;
            $scope.newEmailAddress = employee.emailAddress;
            $scope.newPhoneNumber = employee.phoneNumber;
            $scope.employee = employee;
            $scope.updatingEmployee = true;
        };

        $scope.updateEmployee = function(employee) {
            employee.firstName = $scope.newFirstName;
            employee.lastName = $scope.newLastName;
            employee.phoneNumber = $scope.newPhoneNumber;
            employee.emailAddress = $scope.newEmailAddress;
            organizations.updateEmployee(employee);
            $scope.updatingEmployee = false;
        };

        $scope.deleteEmployee = function(organization, employee) {

            organizations.deleteEmployee(organization, employee).success(function() {
                $scope.organization.employees.splice($scope.organization.employees.indexOf(employee), 1);
            });
        };
    }
]);