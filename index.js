const express = require('express');
const app= express();
const path= require('path');
const session=require('express-session');
const bodyParser=require('body-parser');
const mongoStore = require('connect-mongo');
const mgStore =mongoStore(session);
const mongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/test';


app.use(session({secret:'fuckoff',store:new mgStore({url:'mongodb://localhost:27017/test'})}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req,res) =>{

    console.log(req.session.tasks);
    // if(req.session.tasks != undefined){
    // req.session.tasks.forEeach((task)=>{
    //     res.write('<li>' +task.name+ '</li>')
    // })  this was moved to the html
//     res.render("index.ejs",{tasks:req.session.tasks});
// }else{
//     res.render("index.ejs",{tasks:[]})
// }

    mongoClient.connect(url, (err,client)=>{
        let db=client.db('test');
        db.collection('tasks').find().toArray((err,data)=>{
            res.render("index.ejs",{tasks:data});
        });
    })
    // res.end()
    // res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.post('/add',(req,res)=>{
    console.log(req.body.taskName);

    if (req.session.tasks ==undefined){
        req.session.tasks=[]
        
    }
    let tasks={name:req.body.taskName,done:false};

    // req.session.tasks.push({ name: req.body.taskName, done: false })

    let expressRes=res;
    mongoClient.connect(url,(err,client)=>{
        let db=client.db('test');
        db.collection('tasks').insertOne(tasks,(err,res)=>{
            console.log(err,res);
            expressRes.redirect('/');
        });
    });
    // res.redirect('/');

});




app.listen(8080);