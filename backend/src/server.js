import express from 'express';
import { coffeeRoute } from './routes/coffeeRoutes.js'

const app = express();
const PORT = 3000;

app.use(express.json());
app.get('/' , (req,res) => {
    res.send("src");
});

app.use('/coffee' , coffeeRoute);

app.listen(PORT, () => {
    console.log (`server rodando aq http://localhost:${PORT}`);
})