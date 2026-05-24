const mongoose = require("mongoose")
const dns = require("dns")

dns.setServers(["8.8.8.8", "1.1.1.1"])

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    })

    console.log("MongoDB connected")
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

module.exports = connectDB