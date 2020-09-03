const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const port =3000;
const fs = require('fs')

//creating mySQL connection

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
    password : 'root',
    database : 'votedata'
});

const app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//app.use('/', express.static(path.join(__dirname, '/')))

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/routes/index.html'));

});

app.get('/login', function(request, response){
    response.sendFile(path.join(__dirname + '/routes/login.html'));
});

app.get('/register', function(request, response){
    response.sendFile(path.join(__dirname + '/routes/register.html'));
});

app.get('/results', function(request, response){

    fs.readFile(__dirname + '/routes/results.html','utf-8', function(error, data){
        if(error) throw error
        
        function returnData(callback){
            connection.query('SELECT numberVotes FROM votes', function (error, results){
                let chartData = [];
                for(let i=0; i<5; i++)
                {
                    chartData.push(results[i].numberVotes)
                }
                return callback(chartData)

            })
        }
        let chartData =  [];
        returnData( function(result){
            chartData=result;
            let resultData = data.replace('{chartData}', JSON.stringify(chartData))
            response.write(resultData)
            response.end()
        
        })
    })
});

app.post('/login', function(request, response) {
	const username = request.body.username;
	const password = request.body.password;
	if (username && password) {
        if(username==='test' && password=='test'){
            response.redirect('/results')
        }
        else{
            connection.query('SELECT * FROM data WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                if (results.length > 0) {
                    request.session.loggedin = true;
                   request.session.username = username;
                    response.redirect('/home');
                } else {
                    response.send('Incorrect Username and/or Password!');
                }			
                response.end();
            
            })
        }
    } else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/register', function(request, response) {
    const username = request.body.username;
    const password1 = request.body.password1;
    const password2 = request.body.password2;
    const dataset=[username,password1]

	if (username && password1 && password2) {
        if (password1!==password2){
            response.send('Passwords do not match')
            response.end();
        }
        connection.query('SELECT * FROM data WHERE username=?', username, function(error, results, fields) {
            if(results.length>0) {
                response.redirect('/login');
                response.end();
            }
            else{
		        connection.query('INSERT INTO data ( username, password) VALUES (?)', [dataset], function(error, results, fields) {
                    if (error) throw error;
                    response.redirect('/login');
		            response.end();
		        });
                }})} 
    else {
		response.send('Please enter Username and Password!');
		response.end();
	    }
});


app.get('/home', function(request, response) {
    response.sendFile(path.join(__dirname + '/routes/voting.html'))
});

app.post('/home', function(request, response){
    const value = request.body.vote;
    const loginName = request.session.username;
    connection.query('SELECT voted FROM data WHERE username=?',loginName, function(error, results){
        if(results[0].voted!== null){
            response.send("You have already voted")
            response.end()
        }
        else{
            connection.query('UPDATE votes SET numberVotes=numberVotes+1 WHERE id=?', value, function(error, results){
                if (error) throw error;
                connection.query("UPDATE data SET voted= ? WHERE username=?",[true, loginName], function(error, results){
                    response.send("Your vote has been registered")
                    response.end();
              
                })
            })
        }
    })
});

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);

});
connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
    });