var oracledb = require('oracledb');
const express = require('express');
const bodyParser = require('body-parser');
var Teradata = require('node-teradata');
var Jdbc = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var Pool = require('jdbc/lib/pool');
console.log("hello");
const ejs = require('ejs');
var path = require('path');

var sqlQueries = require("./sqlQueries.js");

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/DisplayBoard/WarehouseStatus', (req, res) => {
   res.render('indexWarehouseStatus');
});

var resultset1=[];
app.get('/DisplayBoard/WarehouseStatus/data', (req, res) => {
  resultset1.length=0;
              var name= req.query.optns;
              var qw=req.query.qw;
              var sid = req.query.sid;
              var host = req.query.host;
              var val = req.query.val;

            var warehouseSql=sqlQueries.warehouse;


            exports.getUsers = function getUsers () {

                            return new Promise((resolve, reject) => {
                                oracledb.getConnection(
                                {
                                  user          : qw,
                                  password      : qw,
                                  connectString : `(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = ${host})(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = ${sid})))`
                                },
                                function(err, connection)
                                {
                                  if (err) {
                                    console.error(err.message);
                                    return;
                                  }
                                  console.log("executing equery");
                                  connection.execute(warehouseSql,function Result (err, result)
                                    {
                                      if (err) {
                                        // Reject the Promise with an error
                                          doRelease(connection);
                                        return reject(err)
                                      }
                                      for(i=0;i<result.rows.length;i++)
                                      {

                                             resultset1.push({
                                                       "grpType":result.rows[i][0],
                                                       "totalTasks":result.rows[i][1],
                                                       "hold":result.rows[i][2],
                                                       "unAssigned": result.rows[i][3],
                                                       "unAssignedHot": result.rows[i][4],
                                                        "unAssignedNotHot": result.rows[i][5],
                                                        "Assigned": result.rows[i][6],
                                                        "AssignedHot": result.rows[i][7],
                                                        "AssignedNotHot": result.rows[i][8]
                                                   });

                                      }
                                       console.log(resultset1);
                          doRelease(connection);
                                return resolve(resultset1)

                                    });
                                });
                            })
            }
            exports.getUsers()  // Returns a Promise!
              .then((mainquery) => {
            var eligibleWorkersSql=sqlQueries.eligibleWorkersSql;
            var resultset2=[];
resultset2.length=0;
            console.log("executing eligibleWorkersSql");
            oracledb.getConnection(
              {
                user          : qw,
                password      : qw,
                connectString : `(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = ${host})(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = ${sid})))`

              },
              function(err, connection)
              {
                if (err) {
                  console.error(err.message);
                  return;
                }
                console.log("executing ods query");
                connection.execute(eligibleWorkersSql,function Result(err, result)
                  {
                    if (err)
                    {
                      console.error(err.message);
                      doRelease(connection);
                      return;
                    }

 console.log(mainquery[0].sumTasks);
            for(j=0;j<mainquery.length;j++)
            {
console.log("hello"+j);
                   resultset2.push({

                             "grpType":mainquery[j].grpType,
                             "totalTasks":mainquery[j].totalTasks,
                             "hold":mainquery[j].hold,
                             "unAssigned":mainquery[j].unAssigned,
                             "unAssignedHot":mainquery[j].unAssignedHot,
                              "unAssignedNotHot":mainquery[j].unAssignedNotHot,
                              "Assigned":mainquery[j].Assigned,
                              "AssignedHot":mainquery[j].AssignedHot,
                              "AssignedNotHot":mainquery[j].AssignedNotHot,


                             "Eligible":result.rows[j]
                         });

            }


      doRelease(connection);
      console.log(resultset2);
      res.render('warehouseStatusReport',{data1:resultset2,data2:"Warehouse Status",data3:name});


                  });
              });




        }).catch(err => {
          // handle errors
        })
        });// get method ends







function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}


app.listen(1521, function(){
  console.log('Server started at port 1521');
});
