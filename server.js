var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt')
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Fullstack-login'
require('dotenv').config()

app.use(cors())
app.use(express.json())
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL)

app.get('/get', function (req, res, next) {
  console.log("hello")
  res.send("hello")
})

app.post('/disease', jsonParser, function (req, res, next) {
  connection.execute(
    'INSERT INTO Disese (D_Name, D_Symptom, D_Cause, D_Treatment, D_Treatmentys) VALUES (?,?,?,?,?)',
    [req.body.D_Name, req.body.D_Symptom, req.body.D_Cause, req.body.D_Treatment, req.body.D_Treatmentys],
    function(err, results, fields) {
      if (err) {
        res.json({ status: 'Error', message: err });
        return;
      }
      res.json({ status: 'Ok' });
    }
  );
});


app.get('/tabledisease', function (req, res, next) {
  connection.query(
    'SELECT * FROM `Disese`',
    function (err, results, fields) {
      if (err) {
        console.error(err)
        res.status(500).json({ status: "ERROR" })
      } else {
        res.json({ status: "OK", data: results });
      }
    }
  );
})

app.post('/delete', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'DELETE FROM Disese WHERE D_ID = ?',
      [req.body.D_ID],
      function(err, results, fields) {
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"Delete success",message:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})

app.post('/getdisease', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'SELECT * FROM Disese WHERE D_ID = ?',
      [req.body.D_ID],
      function(err, results, fields) {
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"ok",data:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})

app.post('/editdisease', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'UPDATE Disese SET `D_Name`= ?, `D_Symptom`= ?, `D_Cause`= ?, `D_Treatment`= ?, `D_Treatmentys`= ? WHERE D_ID = ?',
       [req.body.D_Name, req.body.D_Symptom, req.body.D_Cause, req.body.D_Treatment, req.body.D_Treatmentys, req.body.D_ID],
      function(err, results, fields) {
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"Update success",data:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})
//about drug
app.post('/drug',jsonParser, function (req, res, next) {
  connection.execute(
   'INSERT INTO Drug (DI_Name, DI_Properties, DI_Type, DI_Price) VALUES (?,?,?,?)',
   [req.body.DI_Name,req.body.DI_Properties,req.body.DI_Type,req.body.DI_Type],
   function(err, results, fields) {
    if (err){
        res.json({status: 'Error', message: err})
        return
    }
    res.json({status: 'Ok'})
   }
 );
})

app.get('/tabledrug', function (req, res, next) {
  connection.query(
      'SELECT * FROM `Drug`',
      function (err, results, fields) {
          if(!err){
              res.json({"status":"OK ",data:results});
              
          }
          else{
              res.json({"status":"ERROR"});
          }
        
      }
  );
})

app.post('/deletedrug', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'DELETE FROM Drug WHERE DI_ID = ?',
      [req.body.DI_ID],
      function(err, results, fields) {
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"Delete success",message:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})

app.post('/getdrug', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'SELECT * FROM Drug WHERE DI_ID = ?',
      [req.body.DI_ID],
      function(err, results, fields) {
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"ok",data:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})

app.post('/editdrug', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'UPDATE Drug SET `DI_Name`= ?, `DI_Properties`= ?, `DI_Type`= ?, `DI_Price`= ? WHERE DI_ID = ?',
       [req.body.DI_Name, req.body.DI_Properties, req.body.DI_Type, req.body.DI_Price, req.body.DI_ID],
      function(err, results, fields) {
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"Update success",data:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})

//about regit admin
app.post('/register',jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.Password,saltRounds,function(err, hash){
      connection.execute(
          'INSERT INTO Register (Fname, Lname, Email, Password) VALUES (?,?,?,?)',
          [req.body.Fname,req.body.Lname,req.body.Email,hash],
          function(err, results, fields) {
              if (err){
                  res.json({status: 'Error', message: err})
                  return
              }
              res.json({status: 'Ok'})
          }
      );
  });
})

app.post('/login',jsonParser,function(req, res, next){
  connection.execute(
      'SELECT * FROM Register WHERE Email=?',
      [req.body.Email],
      function(err, user, fields){
          if(err){
              res.json({status: "Error", message: err})
              return
          }
          if(user.length == 0){
              res.json({status: "Error", message: "Email not found"})
              return
          }
          bcrypt.compare(req.body.Password, user[0].Password,function(err,isLogin){
              if(isLogin){
                  var token = jwt.sign({ Email: user[0].Email }, secret, { expiresIn: "1h" });
                  res.json({status: "Ok", message: "Login Success", token})
              }
              else{
                  res.json({status: "Error", message: "Password Incorrect"})
              }
          });
      }
  );
})

app.post('/authen', jsonParser, function(req, res, next){
  try{
      const token = req.headers.authorization.split(' ')[1]
      var decoded = jwt.verify(token, secret);
      res.json({status: 'Ok', decoded})
      res.json({decoded})
  } catch(err){
      res.json({status: 'Error', message: err.message})
  }

})


//about user
app.post('/record',jsonParser, function (req, res, next) {
  connection.execute(
   'INSERT INTO Record (Nickname, Birth, County, Canton, District, Congenitaldisease) VALUES (?,?,?,?,?,?)',
   [req.body.Nickname,req.body.Birth,req.body.County,req.body.Canton,req.body.District,req.body.Congenitaldisease],
   function(err, results, fields) {
    if (err){
        res.json({status: 'Error', message: err})
        return
    }
    res.json({status: 'Ok'})
   }
 );
})
//drug
//detail
app.post('/getdetaildrug', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'SELECT DI_Properties,DI_Type,DI_Price FROM `Drug` WHERE `DI_ID` = ?;',
      [req.body.DI_ID],
      function(err, results, fields) {
        console.log(results.data)
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"ok",data:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})
//getid,name
app.post('/tablegrug', function (req, res, next) {
  connection.query(
      'SELECT DI_ID,DI_Name FROM Drug;',
      function (err, results, fields) {
          if(!err){
              res.json({"status":"OK ",data:results});
              
          }
          else{
              res.json({"status":"ERROR"});
          }
        
      }
  );
})

//disease
//getid,name
app.post('/tabledisease', function (req, res, next) {
  connection.query(
      'SELECT D_ID,D_Name FROM Disese;',
      function (err, results, fields) {
          if(!err){
              res.json({"status":"OK ",data:results});
              
          }
          else{
              res.json({"status":"ERROR"});
          }
        
      }
  );
})
//detail
app.post('/getdetaildisease', jsonParser , function (req, res, next) {
  try {
    connection.execute(
      'SELECT D_Symptom,D_Cause,D_Treatment,D_Treatmentys FROM Disese WHERE D_ID = ?;',
      [req.body.D_ID],
      function(err, results, fields) {
        if (err){
          res.json({status:"error",message: err})
          return
        }
        res.json({status:"ok",data:results})
      }
    );
  } catch(err) {
    res.json({status:"error",message: err})
  }
})
app.listen(4000,jsonParser, function () {
  console.log('CORS-enabled web server listening on port 4000')
})