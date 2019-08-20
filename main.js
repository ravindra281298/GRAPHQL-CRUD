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
const myColl1='books',myColl2='authors';
var db=1,books=1,authors=1;

MongoClient.connect(url,(err,client)=>{
    assert.equal(err,null);
    db=client.db(dbName);
    books=db.collection(myColl1);
    console.log(`connected to database: ${dbName}:${myColl1}`);
    db=client.db(dbName);
    authors=db.collection(myColl2);
    console.log(`connected to database: ${dbName}:${myColl2}`);
});

const bookType=new GraphQLObjectType({
    name:'bookType',
    description:'This is bookType',
    fields:()=>({
        _id:{type:GraphQLString},
        id:{type:GraphQLInt},
        name:{type:GraphQLString},
        author:{
            type:authorsType,
            resolve:(book)=>authors.findOne({id:book.authorId})
        }
    })
});

const authorsType=new GraphQLObjectType({
    name:'authorsType',
    description:'This is authorType',
    fields:()=>({
        _id:{type:GraphQLString},
        id:{type:GraphQLInt},
        name:{type:GraphQLString},
        book:{
            type:GraphQLList(bookType),
            resolve:(author)=> books.find({authorId:author.id}).toArray()
        }
    })
});

const rootQueryType=new GraphQLObjectType({
    name:'query',
    description:'this is root query',
    fields:()=>({
        books:{
            type:GraphQLList(bookType),
            resolve:async ()=> await books.find().toArray()
        },
        book:{
            type:bookType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:async (root,args)=>await books.findOne({id:args.id})
        },
        authors:{
            type:GraphQLList(authorsType),
            resolve:async ()=> await authors.find().toArray()
        },
        author:{
            type:authorsType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:async (root,args)=> await authors.findOne({id:args.id})
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