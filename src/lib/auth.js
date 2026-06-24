import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('BloodNet');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
   emailAndPassword: { 
    enabled: true, 
  }, 
   user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "donor"
      },
      status: {
        type: "string",
        defaultValue: "active" // এইটা ডকের রিকোয়ারমেন্ট!
      },
      blood_group: {
        type: "string",
        defaultValue: ""
      },
      district: {
        type: "string",
        defaultValue: ""
      },
      upazila: {
        type: "string",
        defaultValue: ""
      }
    }
  }
});