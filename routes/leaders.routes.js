const express =require( 'express')
const router = express.Router();
const User = require("../models/user.model");
const Group = require("../models/group.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

    router.route('/notificationsent/:ruleId').put((req, res) => {
      let ruleId = req.params.ruleId
      const updatedRule=Rule.findByIdAndUpdate(ruleId, {
      notificationsent:true
    }).exec()
    })

    router.route('/restrictionratificationnotificationsent/:ruleId').put((req, res) => {
      const updatedPoll=Rule.findByIdAndUpdate(req.params.ruleId, {
      ratificationnotificationsent:true
    }).exec()
    })

    router.route('/voteforleader/:leaderId/:userId').put((req, res) => {
      User.findByIdAndUpdate(req.params.leaderId, {$push : {
      votes:req.params.userId
    }}).exec()
    })

    router.route('/withdrawvoteforleader/:leaderId/:userId').put((req, res) => {
      User.findByIdAndUpdate(req.params.leaderId, {$pull : {
      votes:req.params.userId
    }}).exec()
    })






module.exports= router
