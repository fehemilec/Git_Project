require("dotenv").config({path: "./config.env"});

const express = require("express");
const axios = require("axios");

const PORT = process.env.PORT || 4000;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });


app.get('/login', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.clientID}&scope=repo`);
});

let token = null;


app.get('/signin/callback', (req, res) => {
  const body = {
    client_id: process.env.clientID,
    client_secret: process.env.clientSecret,
    code: req.query.code
  };
  const opts = { headers: { accept: 'application/json' } };
  axios.post(`https://github.com/login/oauth/access_token`, body, opts).
    then(res => res.data['access_token']).
    then(_token => {
      token = _token;
      console.log(' token:', token);

      //res.json({ ok: 1 });
      res.redirect(`http://localhost:3000/homescreen`);
      


    }).
    catch(err => res.status(500).json({ message: err.message }));

});

//running on port 4000
app.get('/user/', (req, res) => {
    //console.log("TOOKEEN: " + token)
    
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    axios
  .get('https://api.github.com/user/repos', config)
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res)
    
    let dat = res.data

    for(var i = 0; i < dat.length; i++)
{
    console.log(dat[i].name);
}
    
  })
  .catch(error => {
    console.error(error)
  })

  
  });


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});