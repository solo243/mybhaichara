import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.production" });
dotenv.config({ path: ".env" });

const uri = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(uri);
  const adminDb = mongoose.connection.db.admin();
  const dbs = await adminDb.listDatabases();

  for (const dbInfo of dbs.databases) {
    if (["admin", "local"].includes(dbInfo.name)) continue;
    const db = mongoose.connection.client.db(dbInfo.name);
    const collections = await db.listCollections().toArray();

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
    }
  }

  await mongoose.disconnect();
}

check().catch(console.error);
