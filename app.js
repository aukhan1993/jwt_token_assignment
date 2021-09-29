const express = require("express");
// const cors = require('cors');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { json } = require("express/lib/response");
const auth = require("./middleware/auth");
const res = require("express/lib/response");
const { path } = require("path");
const req = require("express/lib/request");

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname))

const Users = [];
const emailList = [];
const TOKEN_KEY = "c66ghc545i2c";

// app.post("/welcome", auth, (req, res) => {
//     res.status(200).send("Welcome...");
// })

app.get("/get_request", auth, (req, res) => {
    //res.send('This is get request');
    res.json({ "message": "Congrats...! You are Authenticated. This is GET request." });
});

app.post('/post_request', auth, (req, res) => {
    // console.log(req);
    res.json({ "message": "Congrats...! You are Authenticated. This is POST request." });
});

app.put('/put_request', (req, res) => {
    res.json({ "message": "This is a PUT request." });
});

app.delete('/delete_request', (req, res) => {
    res.json({ "message": "This is a DELETE request." });
});

app.get('/time_now', (req, res) => {
    const timeNow = new Date()
    res.json({ "time": timeNow.toTimeString() })
});

app.get('/task_tracker', (req, res) => {
    return res.sendFile(__dirname + "/Task_Tracker.html");
});

app.get('/sign_up', (req, res) =>{
    return res.sendFile(__dirname + "/sign_up.html");    
});

app.get('/login', (req, res) =>{
    return res.sendFile(__dirname + "/login.html");    
});

// Method for Sign Up request.
app.post('/signed_up', async (req, res) => {

    try {
        // User Input
        const { name, email, password } = req.body;

        //validate user input if it is null or not
        if (!(email && password && name)) {
            res.status(400).send("Please provide input in all fields");
        }


        for (user of Users) {
            emailList.push(user.email);
        }
        if (emailList.includes(email)) {
            return res.status(409).send("User Already Exist. Please login");
        }


        // Hash user password
        encryptedPassword = await bcryptjs.hash(password, 10);

        // Random string to be used in the token
        //randomString = Math.random().toString(20).substring(2, 12);

        //Create token
        const token = jwt.sign({ name: name, email: email }, TOKEN_KEY, { expiresIn: "1h" });
        console.log(token);
        const u = {
            name: name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            token: token
        }

        Users.push(u);
        //console.log(Users)
        //res.status(201).json(u);
        res.redirect("/task_tracker");

    } catch (err) {
        console.log(err);
    }

    // const user = req.body;
    // if (user.name.length === 0 || user.email.length === 0 || user.password.length === 0) {
    //     res.send("<h3>Sign Up failed...! Please add values for all parameters</h3>");
    //     return
    // }
    // else {
    //     Users.push(user);
    //     res.send("<h3>Sign up Successfully!</h3>");
    // }
})

// Method for Sign in request.
app.post('/logged_in', async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!(email || password)) {
            res.status(400).send("<h3>Sign In failed...! Please provide values for all parameters</h3>");
        }

        const userObj = Users.find(us => us.email === email);
        indexOf = Users.indexOf(Users.find(us => us.email === email));

        // Random string to be used in the token
        //randomString = Math.random().toString(20).substring(2, 12);
        if (userObj && (await bcryptjs.compare(password, userObj.password))) {

            // Create Token
            const token = jwt.sign({ email: email }, TOKEN_KEY, { expiresIn: "2h", });

            Users[indexOf]["token"] = token;
            
            console.log(Users[indexOf]);
            //User
            return res.redirect("/task_tracker");
        }
        res.status(400).send("Invalid Credentials");
    }
    catch (err) {
        console.log(err);
    }

    // else{
    //     for(let u of Users){
    //         if(u.email === user.email && u.password === user.password){
    //             console.log(u);
    //             res.send("<h3>Sign In Successfully...!</h3>");
    //             return;
    //         }
    //     }
    //     res.send("<h3>Your password or email is incorrect.</h3>");
    // }
});


app.listen(3000, () => {
    console.log("The server is running on port 3000");
});