
import express , {Request, Response} from 'express'
import  * as dotenv from 'dotenv'
import session, { Cookie } from 'express-session';
import { connectDB } from './config/db.config';
import { error } from 'console';
import { userRouter , busRouter, bookingRouter} from './routes/index.routes';


dotenv.config();

const port = process.env.PORT ?? 8800;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
}));


app.use('api/v1/user', userRouter);
app.use('api/v1/bus', busRouter);
app.use('api/v1/book', bookingRouter);


connectDB()
.then(() =>{
    app.listen(port,
         () =>{
        console.log(`server started running on ${port}`);  
    })
})
.catch((error) =>{
    console.log(`failed to connect with db ${error}`);
});

