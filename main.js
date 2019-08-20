const express=require('express');
const ExpressGraphQL=require('express-graphql');

const{
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList
}=require('graphql');

const app=express();



const authors=[
    {id:1,name:"J. K. Rowling"},
    {id:2,name:"J. R. R. Tolkien"},
    {id:3,name:"Brent Weeks"}
]

const books=[
    {id:1,name:"Harry Potter and the Chamber of secrets",authorId:1},
    {id:2,name:"Harry potter and the Prisoner of Azkaban",authorId:1},
    {id:3,name:"Harry potter and the Goblet of Fire",authorId:1},
    {id:4,name:"The Fellowship of the Ring",authorId:2},
    {id:5,name:"The Two Towers",authorId:2},
    {id:6,name:"The return of the King",authorId:2},
    {id:7,name:"The way of Shadows",authorId:3},
    {id:8,name:"Beyond the Shadows",authorId:3},
]

const authorType=new GraphQLObjectType({
    name:'authors',
    description:'authorType',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLString},
        books:{
            type:GraphQLList(bookType),
            resolve:(author)=>(books.filter(book=>book.authorId===author.id))
        }
    })
});

const bookType=new GraphQLObjectType({
    name:'book',
    description:'bookType',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLString},

        author:{
            type:GraphQLList(authorType),
            resolve:(book)=>(authors.filter(author=>author.id===book.authorId))
        }
    })
});


const rootQueryType=new GraphQLObjectType({
    name:'query',
    description:'inside root query',
    // fields:()=>({book:{},books:{},author:{}})   // structure of query
    fields:()=>({
        book:{
            type:bookType,
            description:'display single book',
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(root,args)=>books.find(book=>book.id===args.id)
        },
        books:{
            type:GraphQLList(bookType),
            description:'display all books',
            resolve:()=>books
        },
        author:{
            type:GraphQLList(authorType),
            description:'all authors',
            resolve:()=>authors
        }
    })
});



const schema=new GraphQLSchema({
    query:rootQueryType
});

app.use('/',ExpressGraphQL({
    schema:schema,
    graphiql:true
}));

const hostname='localhost';
const port=3000;
app.listen(port,hostname,()=>{
    console.log(`listening on http://${hostname}:${port}`);
});