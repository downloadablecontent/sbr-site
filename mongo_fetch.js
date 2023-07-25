//fetch all blog posts from mongodb, then write to json file??? which sveltekit then reads from???
//not the most elegant, but not too weird and it will work, I think.

import { MongoClient } from 'mongodb';
import { writeFileSync } from 'fs';

//uncomment if running locally, don't forget to `npm i dotenv` and put the mongodb stuff in the `.env` file
//import { config } from 'dotenv';
//config();

//see if mongodb db connection string is set in env (make sure it is an encrypted secret if deploying with github pages)
//the mongo db user should have READ ONLY permissions, so even if connection string is leaked, no one can fuck with the db
if (process.env.MONGODB_CONNECTION_STRING) {
    //connect to mongodb
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    await client.connect();
    const db = client.db("TongMemorialDatabase");
    const posts_coll = db.collection("blog_posts");
    //fetch all blog posts
    let all_posts = await (await posts_coll.find({ hidden: false })).toArray();
    all_posts.forEach((item) => delete item._id)
    //write to json file
    writeFileSync("./src/lib/blog_posts.json", JSON.stringify(all_posts), "utf-8");
    console.log('done')
    process.exit();
}
