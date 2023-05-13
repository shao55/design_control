const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChangeSchema = new Schema({
    readiness: Number,
    fixationDate: Date
});

const SheetSchema = new Schema({
    name: String,
    specificWeight: Number,
    comment: String,
    changes: [ChangeSchema]
});

const ConstructiveGroupSchema = new Schema({
    name: String,
    specificWeight: Number,
    comment: String,
    sheets: [SheetSchema]
});

const ExpertiseDateSchema = new Schema({
    saveDate: Date,
    dates: [{
        stage: String,
        date: Date
    }]
});

const ProjectSchema = new Schema({
    id: Number,
    name: String,
    customer: String,
    management: String,
    designOrganization: String,
    curator: String,
    category: String,
    expertiseDates: [ExpertiseDateSchema],
    constructiveGroups: [ConstructiveGroupSchema]
});

const Project = mongoose.model('Project', ProjectSchema, 'Projects');

module.exports = Project;
