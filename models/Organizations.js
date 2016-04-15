var mongoose = require('mongoose');

var OrganizationSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    website: String,
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }]
});

mongoose.model('Organization', OrganizationSchema);