import express from 'express';
import bodyParser from 'body-parser';
  import { dirname} from "path"
  import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url)); 
const app = express();
const port = 3000;
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
  
//ROUTES
app.get("/",(req,res)=>(
  res.sendFile(__dirname + "/public/landing.html")
))
 app.get("/login",(req,res) =>{
  res.sendFile(__dirname + "/public/login.html") 
 })
 app.get("/welinggstarters",(req,res) =>{
  res.sendFile(__dirname + "/public/welinggstarters.html") 
 })
 app.get("/mains",(req,res) =>{
  res.sendFile(__dirname + "/public/mainsw.html") 
 })
 app.get("/platters",(req,res) =>{
  res.sendFile(__dirname + "/public/platters.html") 
 })
 app.get("/drinks tab",(req,res) =>{
  res.sendFile(__dirname + "/public/drink tabs.html") 
 })


 app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;}
 )

app.listen(port,()=>{
  console.log(`welinggs is runnin on ${port}`)
}) 