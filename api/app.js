var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http');
var oracledb = require('oracledb');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));

var time = Date.now || function() {
  return +new Date;
};

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var connAttrs = {
  "user": "SYSTEM",
  "password": "Azerty01",
  "connectString" : "89.234.181.99/XE"
}

app.use(express.static('public')); // public & static content will be available via this folder

app.set('views', './views');
app.set('view engine', 'jade');


app.get('/', function (req, res) {
    //res.render('index');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("No Data Requested, so none is returned");
    res.end();
});

/////////////////////
// GET ALL USERS
////////////////////
app.get('/user_profiles',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "[" + time() +"] - Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".UTILISATEUR",{},{
      outFormat: oracledb.OBJECT
    }, function(err,result){
        if(err){
          res.set('Content-Type','application/json');
          res.status(500).send(JSON.stringify({
            status:500,
            message: "[" + time() + "] - Error getting Users",
            detailed_message: err.message
          }));
        }else{
          res.contentType('application/json').status(200);
          res.send(JSON.stringify(result.rows));
          console.log("[" + time() + "] - GetUsers : success" + JSON.stringify(result.rows));
        }
        connection.release(
          function(err){
            if(err){
              console.log(err.message);
            }else{
              console.log("[" + time() + "] - GetUsers : connection released");
            }
          });
    });
  });
});

/////////////////////
// GET ONE USER BY LOGIN
////////////////////
app.get('/user_profiles/:LOGIN',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".UTILISATEUR WHERE LOGIN= :LOGIN",[req.params.LOGIN],{
        outFormat: oracledb.OBJECT
    }, function(err,result){
          if(err || result.rows.length <1){
            res.set('Content-Type','application/json');
            var status = err ? 500 : 404;
            res.status(status).send(JSON.stringify({
              status:status,
              message: err ? "Error getting user" : "User doesn't exist",
              detailed_message: err ? err.message : ""
            }));
          }else{
            res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            console.log("[" + time() + "] - getOneUser : success" + JSON.stringify(result.rows));
          }
          connection.release(
            function(err){
              if(err){
                console.log(err.message);
              }else{
                console.log("GET /user/"+req.params.LOGIN + " : connection released");
              }
            });
          });
       });
});

/////////////////////
// INSERT NEW USER
////////////////////
app.post('/user_profiles',function(req,res){
  "use strict";
  console.log(req.get('Content-Type'));
  if("application/json" !== req.get('Content-Type')){
    res.set('Content-Type','application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content type. Only application/json accepted",
      detailed_message: null
    }));
    return;
  }

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json').status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to db",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("INSERT INTO \"KAS-BDD\".UTILISATEUR VALUES(:IDPERSONNE,:NOM,:PRENOM,TO_DATE(:DATENAISSANCE,'yyyy/mm/dd'),:LOGIN,:MDP,:ROLE)", [req.body.IDPERSONNE,req.body.NOM, req.body.PRENOM, req.body.DATENAISSANCE, req.body.LOGIN,req.body.MDP,req.body.ROLE],{
      autoCommit: true,
      outFormat: oracledb.OBJECT
    },
    function(err,result){
      if(err){
        res.set('Content-Type','application/json');
        res.status(400).send(JSON.stringify({
          statuts: 400,
          message: err.message.indexOf("ORA-00001") > 1 ? "User already exists" : "Input Error",
          detailed_message: err.message
        }));
      }
      else{
        res.status(201).set('Location','/user_profiles/'+req.body.LOGIN).end();
      }
      connection.release(
        function(err){
          if(err){
            console.error(err.message);
          }else{
            console.log("POST /user_profiles : connection released");
          }
      });
    });
  })
});

/////////////////////
// CHECK CONNEXION
////////////////////
app.get('/user_profiles/connect/:LOGIN/:MDP',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".UTILISATEUR WHERE LOGIN= :LOGIN AND MDP = :MDP",[req.params.LOGIN,req.params.MDP],{
        outFormat: oracledb.OBJECT
    }, function(err,result){
          if(err || result.rows.length <1){
            res.set('Content-Type','application/json');
            var status = err ? 500 : 204;
            res.status(status).send(JSON.stringify({
              status:status,
              message: err ? "Error getting user" : "User doesn't exist or password incorrect",
              detailed_message: err ? err.message : ""
            }));
          }else{
            res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
          }
          connection.release(
            function(err){
              if(err){
                console.log(err.message);
              }else{
                console.log("GET /user/"+req.params.LOGIN + " : connection released");
              }
            });
          });
       });
});

/////////////////////
// EDIT A USER - A TESTER
////////////////////
app.put('/user_profiles',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.query("UPDATE \"KAS-BDD\".UTILISATEUR SET IDPERSONNE=?,NOM=?,PRENOM=?,DATENAISSANCE=?,LOGIN=?,MDP=?,ROLE=?",[req.body.IDPERSONNE,req.body.NOM,req.body.PRENOM,req.body.DATENAISSANCE,req.body.LOGIN,req.body.MDP,req.body.ROLE],
    function(error,results,fields){
      if (error) throw error;
      res.end(JSON.stringify(results));
    });
});
});

/////////////////////
// GET ALL CIRCUIT
////////////////////
app.get('/circuit',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".CIRCUIT",{},{
      outFormat: oracledb.OBJECT
    }, function(err,result){
        if(err){
          res.set('Content-Type','application/json');
          res.status(500).send(JSON.stringify({
            status:500,
            message: "Error getting Circuit",
            detailed_message: err.message
          }));
        }else{
          res.contentType('application/json').status(200);
          res.send(JSON.stringify(result.rows));
        }
        connection.release(
          function(err){
            if(err){
              console.log(err.message);
            }else{
              console.log("GET /Circuit : connection released");
            }
          });
    });
  });
});


/////////////////////
// GET 3 CIRCUITS
////////////////////
app.get('/threecircuit',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".CIRCUIT WHERE rownum<=3",{},{
      outFormat: oracledb.OBJECT
    }, function(err,result){
        if(err){
          res.set('Content-Type','application/json');
          res.status(500).send(JSON.stringify({
            status:500,
            message: "Error getting Circuit",
            detailed_message: err.message
          }));
        }else{
          res.contentType('application/json').status(200);
          res.send(JSON.stringify(result.rows));
        }
        connection.release(
          function(err){
            if(err){
              console.log(err.message);
            }else{
              console.log("GET /Circuit : connection released");
            }
          });
    });
  });
});

/////////////////////
// GET ONE CIRCUIT
////////////////////
app.get('/circuit/:VILLEDEPART',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".CIRCUIT WHERE VILLEDEPART=:VILLEDEPART",[req.params.VILLEDEPART],{
        outFormat: oracledb.OBJECT
    }, function(err,result){
          if(err || result.rows.length <1){
            res.set('Content-Type','application/json');
            var status = err ? 500 : 404;
            res.status(status).send(JSON.stringify({
              status:status,
              message: err ? "Error getting circuit" : "Circuit doesn't exist",
              detailed_message: err ? err.message : ""
            }));
          }else{
            res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
          }
          connection.release(
            function(err){
              if(err){
                console.log(err.message);
              }else{
                console.log("GET /circuit/"+req.params.LOGIN + " : connection released");
              }
            });
          });
       });
});


/////////////////////
// GET ONE CIRCUIT by id
////////////////////
app.get('/circuitbyid/:IDCIRCUIT',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".CIRCUIT WHERE IDCIRCUIT = :IDCIRCUIT",[req.params.IDCIRCUIT],{
        outFormat: oracledb.OBJECT
    }, function(err,result){
          if(err || result.rows.length <1){
            res.set('Content-Type','application/json');
            var status = err ? 500 : 404;
            res.status(status).send(JSON.stringify({
              status:status,
              message: err ? "Error getting circuit" : "Circuit doesn't exist",
              detailed_message: err ? err.message : ""
            }));
          }else{
            res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
          }

          connection.release(
            function(err){
              if(err){
                console.log(err.message);
              }else{
                console.log("GET /circuit/"+req.params.IDCIRCUIT + " : connection released");
              }
            });
          });
       });
});

/////////////////////
// GET ETAPES BY CIRCUIT ID
////////////////////
app.get('/etapesbycircuitid/:IDCIRCUIT',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT E.DATEETAPE,E.DUREE,E.NOMLIEUX,E.VILLE,E.PAYS,L.PRIXVISITE FROM \"KAS-BDD\".ETAPES E, \"KAS-BDD\".LIEUX_TOURISTIQUE L WHERE E.IDCIRCUIT = :IDCIRCUIT AND E.NOMLIEUX = L.NOMLIEUX",[req.params.IDCIRCUIT],{
        outFormat: oracledb.OBJECT
    }, function(err,result){
          if(err || result.rows.length <1){
            res.set('Content-Type','application/json');
            var status = err ? 500 : 404;
            res.status(status).send(JSON.stringify({
              status:status,
              message: err ? "Error getting circuit" : "Circuit doesn't exist",
              detailed_message: err ? err.message : ""
            }));
          }else{
            res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
          }

          connection.release(
            function(err){
              if(err){
                console.log(err.message);
              }else{
                console.log("GET /circuit/"+req.params.IDCIRCUIT + " : connection released");
              }
            });
          });
       });
});


/////////////////////
// CIRCUIT A LA UNE
////////////////////
app.get('/one',function (req,res){
  "use strict";

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json');
      res.status(500).send(JSON.stringify({
        status:500,
        message: "Error connecting DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM \"KAS-BDD\".CIRCUIT WHERE rownum<=1",{},{
      outFormat: oracledb.OBJECT
    }, function(err,result){
        if(err){
          res.set('Content-Type','application/json');
          res.status(500).send(JSON.stringify({
            status:500,
            message: "Error getting Circuit",
            detailed_message: err.message
          }));
        }else{
          res.contentType('application/json').status(200);
          res.send(JSON.stringify(result.rows));
        }
        connection.release(
          function(err){
            if(err){
              console.log(err.message);
            }else{
              console.log("GET /Circuit : connection released");
            }
          });
    });
  });
});


/////////////////////
// INSERT NEW CIRCUIT
/////////////////////
app.post('/circuit',function(req,res){
  "use strict";
  if("application/json" !== req.get('Content-Type')){
    res.set('Content-Type','application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content type. Only application/json accepted",
      detailed_message: null
    }));
    return;
  }

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json').status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to db",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("INSERT INTO \"KAS-BDD\".CIRCUIT VALUES(:IDCIRCUIT,:DESCRIPTIF,:VILLEDEPART,:VILLEARRIVEE,:DUREE,:PRIX,TO_DATE(:DATEDEPART,'yyyy/mm/dd'),:NBRPLACEDISPONIBLES)", [req.body.IDCIRCUIT,req.body.DESCRIPTIF, req.body.VILLEDEPART, req.body.VILLEARRIVEE, req.body.DUREE,req.body.PRIX,req.body.DATEDEPART,req.body.NBRPLACEDISPONIBLES],{
      autoCommit: true,
      outFormat: oracledb.OBJECT
    },
    function(err,result){
      if(err){
        res.set('Content-Type','application/json');
        res.status(400).send(JSON.stringify({
          statuts: 400,
          message: err.message.indexOf("ORA-00001") > 1 ? "Circuit already exists" : "Input Error",
          detailed_message: err.message
        }));
      }
      else{
        res.status(201).set('Location','/circuit/'+req.body.VILLEDEPART).end();
      }
      connection.release(
        function(err){
          if(err){
            console.error(err.message);
          }else{
            console.log("POST /circuit : connection released");
          }
      });
    });
  })
});

/////////////////////
// INSERT NEW PASSAGER
/////////////////////

app.post('/newpassager',function(req,res){
  "use strict";
  console.log(req.get('Content-Type'));
  if("application/json;charset=UTF-8" !== req.get('Content-Type')){
    res.set('Content-Type','application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content type. Only application/json accepted",
      detailed_message: null
    }));
    return;
  }

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json').status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to db",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("INSERT INTO \"KAS-PROJET-BDD\".PASSAGER(IDPERSONNE,NOM,PRENOM,DATENAISSANCE) VALUES(:IDPERSONNE,:NOM,:PRENOM,TO_DATE(:DATENAISSANCE,'mm/dd/yyyy'))", [req.body.IDPERSONNE,req.body.NOM, req.body.PRENOM, req.body.DATENAISSANCE],{
      autoCommit: true,
      outFormat: oracledb.OBJECT
    },
    function(err,result){
      if(err){
        res.set('Content-Type','application/json');
        res.status(400).send(JSON.stringify({
          statuts: 400,
          message: err.message.indexOf("ORA-00001") > 1 ? "Passager already exists" : "Input Error",
          detailed_message: err.message
        }));
      }
      connection.release(
        function(err){
          if(err){
            console.error(err.message);
          }else{
            console.log("POST /newpassager : connection released");
          }
      });
    });
  })
});

/////////////////////
// INSERT NEW RESERVATION
/////////////////////

app.post('/newreservation',function(req,res){
  "use strict";
  if("application/json" !== req.get('Content-Type')){
    res.set('Content-Type','application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content type. Only application/json accepted",
      detailed_message: null
    }));
    return;
  }

  oracledb.getConnection(connAttrs, function(err,connection){
    if(err){
      res.set('Content-Type','application/json').status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to db",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("INSERT INTO \"KAS-BDD\".RESERVATION VALUES(:IDRESERVATION,TO_DATE(:DATERESERVATION,'yyyy/mm/dd'),:NBRPLACERESERVEES,:IDPERSONNE,:IDCIRCUIT", [req.body.IDRESERVATION,req.body.DATERESERVATION, req.body.NBRPLACERESERVEES, req.body.IDPERSONNE, req.body.IDCIRCUIT],{
      autoCommit: true,
      outFormat: oracledb.OBJECT
    },
    function(err,result){
      if(err){
        res.set('Content-Type','application/json');
        res.status(400).send(JSON.stringify({
          statuts: 400,
          message: err.message.indexOf("ORA-00001") > 1 ? "Reservation already exists" : "Input Error",
          detailed_message: err.message
        }));
      }
      connection.release(
        function(err){
          if(err){
            console.error(err.message);
          }else{
            console.log("POST /reservation : connection released");
          }
      });
    });
  })
});

// FIN REQUETE

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit();
})

 var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });
