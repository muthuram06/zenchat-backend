const userSchema = require('../Models/userModel')

const updateAvatar =async(req,res)=>{
    try {
        const {id} = req.params
        const {isAvatarImage,AvatarImage} = req.body
        if(!AvatarImage || !isAvatarImage){
            return res.json({message:'Please provide an image',status:false})
        }
        const checkUser = await userSchema.findById(id)
        if(!checkUser){
            return res.json({message:"No User Found",status:false})
        }
        const user = await userSchema.findByIdAndUpdate(id,{isAvatarImage,AvatarImage},{ new: true })
        delete user.password
        res.status(201).json({user,status:true})
    } catch (error) {
        res.status(401).json({message: `${error.message}`,status:false})
    }
}

const getAllContacts =async(req,res)=>{
    const {id} = req.params
    try {
        const data = await userSchema
            .find({ _id: { $ne: id } })
            .select('username email AvatarImage')
        res.status(201).json({data,status:true})
    } catch (error) {
        res.status(401).json({message: `${error.message}`,status:false})
    }
}

module.exports = {updateAvatar,getAllContacts}