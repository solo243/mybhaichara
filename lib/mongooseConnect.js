// // import mongoose from "mongoose";

// // const MONGODB_URI = process.env.MONGODB_URI;

// // if (!MONGODB_URI) {
// //   throw new Error("Please define MONGODB_URI in .env.local");
// // }

// // let cached = global.mongoose;
// // if (!cached) cached = global.mongoose = { conn: null, promise: null };

// // export async function connectDB() {
// //   if (cached.conn) return cached.conn;

// //   if (!cached.promise) {
// //     cached.promise = mongoose.connect(MONGODB_URI, {
// //       dbName: "test",
// //     });
// //   }

// //   cached.conn = await cached.promise;
// //   return cached.conn;
// // }

// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define MONGODB_URI in environment variables");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       maxPoolSize: 10, // Important for serverless
//       serverSelectionTimeoutMS: 5000, // Fail fast, don't hang
//       socketTimeoutMS: 45000,
//       family: 4, // Force IPv4 (sometimes helps)
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log("MongoDB connected");
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null; // Reset so next request retries
//     throw e;
//   }

//   return cached.conn;
// }

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // adjust based on your plan
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
