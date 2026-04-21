import express from 'express';
import { dirname, join } from "path"
import { fileURLToPath } from 'url';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url)); 
const filepath = join(__dirname, 'public');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(filepath));

const simproute = (filename) =>
  (req, res) => {
    res.sendFile(join(filepath, filename))
  }

//ROUTES
app.get("/", simproute('landing.html'))
app.get("/login", simproute('login.html'))
app.get("/welinggstarters", simproute('welinggstarters.html'))
app.get("/mains", simproute('mainsw.html'))
app.get("/platters", simproute('platters.html'))
app.get("/drinks-tap", simproute('drink tabs.html'))

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  return res.redirect("/landing.html")
})

app.listen(port, () => {
  console.log(`welinggs is runnin on ${port}`)
}) 
