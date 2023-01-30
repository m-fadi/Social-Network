module.export.authenticate = (req, res, next) => {
     const { firstName, lastName, email } = req.body;
     if (firstName == "" || lastName == "")
         return res.json({
             success: false,
             message: "user name shouldn't be empty",
         });
    
    if (email == "")
             return res.json({
                 success: false,
                 message: "email shouldn't be empty",
             });
    next()
};
