//validating if user is accredited to vote
const queries = require('../model/firebase/queries')

let validateUser = function(req, res, next){
    let user = req.body.phoneNumber;
    let mobileNumber = [];
   return queries.getDoc("faculty of science",'accredited voters')
        .then(result => {
            for(mobile in result){
                mobileNumber.push(mobile);
            }
             let validUser = mobileNumber.includes(user);
             if(validUser){
                 req.body.user = result[user].name
                 
                 next()
             }else{
                 res.send(`END You are not a registered voter`)
             }
        }).catch(error => {
            console.log("Error",error)
        })
};

module.exports = validateUser;
