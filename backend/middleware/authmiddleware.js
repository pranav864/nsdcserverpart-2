const {verify} = require('../utils/jwt');

//verify user token
exports.verifyToken = (req, res, next) => {
    try{

        const authHeader = req.headers.authorization;
        //check if token is present
        if(!authHeader) {
            return res.status(401).json({
                success:false,
                message: ' token is required'
            });
        }
        //remove bearer
        const token = authHeader.split(' ')[1];

        //verify token
        const decoded = verify(token);
        req.user = decoded;
        next();
    
        //store user data in request
        req.user = decoded;
        next();

    }catch(error){
        res.status(401).json({
            success:false,  
            message: 'invalid token'
        });
    }
};