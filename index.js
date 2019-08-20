const express=require('express');
const ExpressGraphQL=require('express-graphql');

const{
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLFloat
}=require('graphql');

const app=express();

colleges=[
    {
       id:"col-101",
       name:"AMU",
       location:"Uttar Pradesh",
       rating:5.0
    },
    {
       id: "col-102",
       name: "CUSAT",
       location: "Kerala",
       rating:4.5
    }
]

students=[
    {
       id: "S1001",
       firstName:"Mohtashim",
       lastName:"Mohammad",
       email: "mohtashim.mohammad@tutorialpoint.org",
       password: "pass123",
       collegeId: "col-102"
    },
    {
       id: "S1002",
       email: "kannan.sudhakaran@tutorialpoint.org",
       firstName:"Kannan",
       lastName:"Sudhakaran",
       password: "pass123",
       collegeId: "col-101"
    },
    {
       id: "S1003",
       email: "kiran.panigrahi@tutorialpoint.org",
       firstName:"Kiran",
       lastName:"Panigrahi",
       password: "pass123",
       collegeId: "col-101"
    }
]

const collegeType=new GraphQLObjectType({
    name:'collegeType',
    description:'this is college type',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        location:{type:GraphQLString},
        rating:{type:GraphQLFloat}
    })
});

const studentType=new GraphQLObjectType({
    name:'studentType',
    description:'this is studentType',
    fields:()=>({
        id:{type:GraphQLString},
        email:{type:GraphQLString},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        password:{type:GraphQLString},
        college:{
            type:collegeType,
            resolve:(student)=>colleges.find(college=>college.id===student.collegeId)
        }
    })
});


const rootQueryType=new GraphQLObjectType({
    name:'query',
    description:'rootQueryType',
    fields:()=>({
        colleges:{
            type:new GraphQLList(collegeType),
            resolve:()=>colleges
        },
        students:{
            type:new GraphQLList(studentType),
            resolve:()=>students
        },
        student:{
            type:studentType,
            args:{
                id:{type:GraphQLString}
            },
            resolve:(root,args)=>students.find(student=>student.id===args.id)
        }
    })
});




const schema=new GraphQLSchema({
    query:rootQueryType
})

app.use('/',ExpressGraphQL({
    schema:schema,
    graphiql:true
}));

const hostname='localhost';
const port=3000;
app.listen(port,hostname,()=>{
    console.log(`listening on http://${hostname}:${port}`);
});