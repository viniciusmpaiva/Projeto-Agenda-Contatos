const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
.then(()=>{
    console.log("Conectado")
    app.emit('done');
})
.catch((e)=>console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf'); 


const routes = require('./routes');
const path = require('path');
const myMiddleware = require('./src/middlewares/middleware');

app.use(helmet());
app.use(
    express.urlencoded(
        {
            extended:true
        }
    )
);
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'public')));



const sessionOptions = session({
    secret:'aasssddddddefrfffffff',
    store: MongoStore.create({mongoUrl:process.env.CONNECTIONSTRING}),
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
});
app.use(sessionOptions);
app.use(flash());

app.use(csrf());
app.use(myMiddleware.middlewareGlobal);
app.use(myMiddleware.checkCsrfError);
app.use(myMiddleware.csrfMiddleware);


app.set('views',path.resolve(__dirname,'src','views'));
app.set('view engine','ejs');
app.use(routes);


app.on('done',()=>{
    app.listen(3000,()=>{
        console.log('Servidor executando na porta 3000');
        console.log("Acessar http://localhost:3000");
    });
})
