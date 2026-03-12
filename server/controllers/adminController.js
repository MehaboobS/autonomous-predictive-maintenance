const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");

exports.getDashboard = async(req,res)=>{

    try{

        const totalUsers = await User.countDocuments({role:"owner"});
        const totalProviders = await ServiceProvider.countDocuments();

        const providers = await ServiceProvider.find();
        const users = await User.find({role:"owner"});

        let totalRequests = 0;

        providers.forEach(p=>{
            totalRequests += p.serviceRequests.length;
        });

        res.json({
            totalUsers,
            totalProviders,
            totalRequests,
            users,
            providers
        });

    }catch(err){

        res.status(500).json({
            message:"Admin dashboard error"
        });

    }

}