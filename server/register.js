 module.exports=register=(req,res,next)=>{

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const { firstName, lastName, email } = req.body;

    const created_at = new Date();
    createUser({ firstName, lastName, email, hashedPassword, created_at }).then(
        (result) => {
            console.log("result from db,", result);
            req.session = { ...result };
            return res.json({
                success: true,
                data: result,
            });
        }
    );
        return ("hi")
 }