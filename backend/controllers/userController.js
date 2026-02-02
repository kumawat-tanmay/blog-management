import userModel from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {

        const users  = await userModel.find().select("-password")
        
        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
}

export const updateUserRole = async (req, res) => {
    try {
        
        const { role } = req.body;
        const userId = req.params.id;

        if(!role){
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }

        const user = await userModel.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if(user.role === "superAdmin"){
            return res.status(400).json({
                success: false,
                message: "Super admin role cannot be changed",
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json({
            success: false,
            message: "Failed to update role",
            error: error.message,
        });
    }
}