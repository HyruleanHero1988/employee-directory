var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Organization = mongoose.model('Organization');
var Employee = mongoose.model('Employee');

/*------------- CREATE -------------*/

/* POST organizations. */
router.post('/organizations', function(req, res, next) {
    var organization = new Organization(req.body);

    organization.save(function(err, organization) {
        if (err) {
            return next(err);
        }

        res.json(organization);
    });
});

/* POST employees. */
router.post('/organizations/:organization/employees', function(req, res, next) {
    var employee = new Employee(req.body);
    employee.organization = req.organization;

    employee.save(function(err, employee) {
        if (err) {
            return next(err);
        }

        req.organization.employees.push(employee);
        req.organization.save(function(err, organization) {
            if (err) {
                return next(err);
            }

            res.json(employee);
        });
    });
});

/*------------- READ -------------*/

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Organization Directory'
    });
});

/* GET organizations. */
router.get('/organizations', function(req, res, next) {
    Organization.find(function(err, organizations) {
        if (err) {
            return next(err);
        }

        res.json(organizations);
    });
});

/* GET single organization by id, and get organization's employees */
router.get('/organizations/:organization', function(req, res) {
    req.organization.populate('employees', function(err, organization) {
        if (err) {
            return next(err);
        }

        res.json(organization);
    });
});

/*------------- UPDATE -------------*/

/* PUT update organization */
router.put('/organizations/:organization', function(req, res) {
    Organization.findById(req.organization._id, function(err, organization) {
        if (err) {
            res.send(err);
        };
        organization.name = req.body.name;
        organization.phoneNumber = req.body.phoneNumber;
        organization.website = req.body.website;
        organization.save(function(err) {
            if (err) {
                res.send(err);
            };
            res.json({
                message: 'Organization updated!'
            });
        });

    });
});

/* PUT update employee */
router.put('/employees/:employee', function(req, res, next) {
    Employee.findById(req.employee._id, function(err, employee) {
        if (err) {
            res.send(err);
        };
        employee.firstName = req.body.firstName;
        employee.lastName = req.body.lastName;
        employee.phoneNumber = req.body.phoneNumber;
        employee.emailAddress = req.body.emailAddress;
        employee.save(function(err) {
            if (err) {
                res.send(err);
            };
            res.json({
                message: 'Employee updated!'
            });
        });
    });
});

/*------------- DELETE -------------*/

/* DELETE organization. */
router.delete('/organizations/:organization', function(req, res) {
    Organization.remove({
        _id: req.organization._id
    }, function(err) {
        if (err) {
            res.send(err);
        };

        res.json({
            message: 'Organization successfully deleted'
        });
    });
});

/* DELETE employee. */
router.delete('/organizations/:organization/employees/:employee', function(req, res) {
    var employees = req.organization.employees;

    employees.splice(employees.indexOf(req.employee._id), 1);

    req.organization.employees = employees;
    req.organization.save(function(err, organization) {
        if (err) {
            return next(err);
        }

        res.json({
            message: 'Employee successfully deleted'
        });
    });
});

/*------------- PARAMS -------------*/

/* Organization param. */
router.param('organization', function(req, res, next, id) {
    var query = Organization.findById(id);

    query.exec(function(err, organization) {
        if (err) {
            return next(err);
        }
        if (!organization) {
            return next(new Error('can\'t find organization'));
        }

        req.organization = organization;
        return next();
    });
});

/* Employee param. */
router.param('employee', function(req, res, next, id) {
    var query = Employee.findById(id);

    query.exec(function(err, employee) {
        if (err) {
            return next(err);
        }
        if (!employee) {
            return next(new Error('can\'t find employee'));
        }

        req.employee = employee;
        return next();
    });
});

module.exports = router;