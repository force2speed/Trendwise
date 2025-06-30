import mongoose from "mongoose"

const MONGODB_URI=process.env.MONGODB_URI as string 

if(!MONGODB_URI){
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")

}

let cached =(global as any).mongoose||{conn:null,promise:null };

async function connectDB(){
        cached.promise=mongoose.connect(MONGODB_URI,{
            dbName:'trendwise',
            bufferCommands:false,

        })
        .then((mongoose)=>{
            return mongoose;
        })

        cached.conn = await cached.promise;
  return cached.conn;
}

(global as any).mongoose = cached;
    export default connectDB;