var mongoose = require('mongoose');

var EmployeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    emailAddress: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
});

mongoose.model('Employee', EmployeeSchema);