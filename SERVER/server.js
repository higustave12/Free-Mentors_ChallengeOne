import express from 'express';
import body_parser from 'body-parser';
import router from './ROUTES/Routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './SWAGGER/swagger.json';

const app= express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended : false}));

app.use('/freementors', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/',(req,res)=>{
    return res.status(200).json({
        status:200,
        message:'WELCOME TO Free Mentors'
    }) 
 });

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Connected to port ${PORT}`);
});

export default app;