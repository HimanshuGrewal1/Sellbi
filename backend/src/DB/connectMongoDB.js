import mongoose from "mongoose"




const connectDB=async () => {
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("Error connection to DB",error.message)
        process.exit(1)
    }
}

export default connectDB