const express=require('express');
const ExpressGraphQL=require('express-graphql');
const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');

const{
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
}=require('graphql');

const app=express();


const url='mongodb://localhost:27017';
const dbName='confusion';
const myColl='books';
var bd=1
var coll=1;

MongoClient.connect(url,(err,client)=>{
    assert.equal(err,null);
    db=client.db(dbName);
    coll=db.collection(myColl);
    console.log(`connected to database: ${dbName}`);
});

const bookType=new GraphQLObjectType({
    name:'bookType',
    description:'This is bookType',
    fields:()=>({
         _id:{type:GraphQLString},
        id:{type:GraphQLInt},
        name:{type:GraphQLString},
        authorId:{type:GraphQLInt}
    })
});

const rootQueryType=new GraphQLObjectType({
    name:'query',
    description:'this is root query',
    fields:()=>({
        books:{
            type:GraphQLList(bookType),
            resolve:async ()=> await coll.find().toArray()
        },
        book:{
            type:bookType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:async (root,args)=>await coll.findOne({id:args.id})
        }
    })
})

const schema=new GraphQLSchema({
    query:rootQueryType
});


app.use('/',ExpressGraphQL({
   schema:schema,
    graphiql:true
}));

const hostname='localhost';
const port=4000;
app.listen(port,hostname,()=>{
    console.log(`listening on http://${hostname}:${port}`);
});