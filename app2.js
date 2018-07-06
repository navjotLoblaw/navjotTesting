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







var app = express();



app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

var counter=0;
var host="LAKRWMSPRO1.ngco.com";
var sidOntario="PR271";
var sidFreePort="PR272";
var sql=`SELECT * FROM(
 select th.whse,
        trunc(td.CREATE_DATE_TIME) TDT,

        SUM(CASE
              WHEN TD.TASK_TYPE IN
                   ('A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8') THEN
               TD.QTY_PULLD
              ELSE
               0
            END) HP,
        SUM(CASE
              WHEN TD.TASK_TYPE IN
                   ('F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F9') THEN
               TD.QTY_PULLD
              ELSE
               0
            END) FPP,
        SUM(CASE
              WHEN TD.TASK_TYPE IN
                   ('S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S9', 'F8') THEN
               TD.QTY_PULLD
              ELSE
               0
            END) FLOW,

        SUM(CASE
              WHEN TD.TASK_TYPE IN
                   ('A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8') AND
                   td.STAT_CODE <= 40 THEN
               TD.QTY_ALLOC
              ELSE
               0
            END) HP_Left,
        SUM(CASE
              WHEN TD.TASK_TYPE IN
                   ('F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F9') AND
                   td.STAT_CODE <= 40 THEN
               TD.QTY_ALLOC
              ELSE
               0
            END) FPP_Left,
        SUM(CASE
              WHEN TD.TASK_TYPE IN
                   ('S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S9', 'F8') AND
                   td.STAT_CODE <= 40 THEN
               TD.QTY_ALLOC
              ELSE
               0
            END) FLOW_Left
   from task_DTL_curr td
   join task_hdr_curr th
     on td.TASK_ID = th.TASK_ID
  where td.task_type IN ('A0',
                         'A1',
                         'A2',
                         'A3',
                         'A4',
                         'A5',
                         'A6',
                         'A7',
                         'A8',
                         'F0',
                         'F1',
                         'F2',
                         'F3',
                         'F4',
                         'F5',
                         'F6',
                         'F7',
                         'F9',
                         'S0',
                         'S1',
                         'S2',
                         'S3',
                         'S4',
                         'S5',
                         'S6',
                         'S7',
                         'S8',
                         'S9')
    AND TD.SKU_id <> '999999'
    AND TD.STAT_CODE < 99
    and trunc(th.CREATE_DATE_TIME) = trunc(sysdate)
  group by th.whse, trunc(td.CREATE_DATE_TIME)
  order by tdt desc) XX
  WHERE NOT(XX.HP_LEFT=0 AND XX.FPP_LEFT=0 AND XX.FLOW_LEFT=0)`;

                 // logEvery2Seconds(0);


                 var ottawa = [];
                 var mapleGrove = [];
                 var ajax=[];
                 var southCaledon=[];
                 function setValue(value) {
                 ottawa = value;
                 console.log("Ottawa :"+ottawa);
                 }
                 function setValue2(value) {
                 mapleGrove = value;
                 console.log("Maple Grove :"+mapleGrove);
                 }

                 function setValue3(value) {
                 ajax = value;
                 console.log("Ajax : "+ajax);
                 }
                 function setValue4(value) {
                 southCaledon = value;
                 console.log("South Caledon :"+southCaledon);
                 }


                 var connection_ajax = oracledb.getConnection(
                 {

                 user: 'PR279WM',
                 password: 'PR279WM',
                 connectString : `(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = ${host})(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = ${sidOntario})))`,

                 multipleStatements: true
                 }
                 ,
                 function(err, connection)
                 {
                 if (err)
                 {
                 console.error(err.message);
                 return;
                 }
                 console.log("executing equery");
                 connection.execute(sql,function(err, result)
                         {
                         if (err) { console.error(err.message); return;
                          }
                          setValue3(result.rows);
                        // console.log(result.rows);  // print all returned rows
                       });
                 }
                 );






// lumpDtl

var config = {
    url: 'jdbc:teradata://TDDR1COP1.ngco.com/database=DLSUP_DATA',
  username: 'DR_DL_SUPLY_CHN_RPT',
  password: 'DR_DL_SUPLY_CHN_RPT01',
  libpath: './jars/terajdbc4.jar',
    libs: ['./jars/tdgssconfig.jar'],
  minPoolSize: 1,
    maxPoolSize: 100,
    keepalive: {
      interval: 60000,
      query: 'SELECT 1',
      enabled: true
    }
};


var abc=[];

var teradata = new Teradata(config);
var id=700018;
var sql2 = "select cast(SUM(QTY) as character(9)) as a from DLSUP_Data.LUMP_DTL where Dest='D060';";






 teradata.read(sql2)
  .then(function(response) {
    abc=response[0].a;
    console.log(abc);
  });






app.get(`/DisplayBoard2`, (req, res) => {





  // var connection_freePort = oracledb.getConnection(
  // {
  //
  // user: 'PR281WM',
  // password: 'PR281WM',
  // connectString : `(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = ${host})(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = ${sidFreePort})))`,
  //
  // multipleStatements: true
  // }
  // ,
  // function(err, connection)
  // {
  // if (err)
  // {
  // console.error(err.message);
  // return;
  // }
  // console.log("executing equery");
  // connection.execute(sql,function(err, result1)
  //          {
  //          if (err) { console.error(err.message); return;
  //           }
  //           setValue(result1.rows);
  //          console.log(result1.rows);  // print all returned rows
  //        });
  // }
  // );




  // var connection_ajax = oracledb.getConnection(
  // {
  //
  // user: 'PR279WM',
  // password: 'PR279WM',
  // connectString : `(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = ${host})(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = ${sidOntario})))`,
  //
  // multipleStatements: true
  // }
  // ,
  // function(err, connection)
  // {
  // if (err)
  // {
  // console.error(err.message);
  // return;
  // }
  // console.log("executing equery");
  // connection.execute(sql,function(err, result)
  //         {
  //         if (err) { console.error(err.message); return;
  //          }
  //          setValue3(result.rows);
  //         //console.log(result.rows);  // print all returned rows
  //       });
  // }
  // );
  //
  // var connection_southCaledon = oracledb.getConnection(
  // {
  //
  // user: 'PR455WM',
  // password: 'PR455WM',
  // connectString : `(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = ${host})(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = ${sidOntario})))`,
  //
  // multipleStatements: true
  // }
  // ,
  // function(err, connection)
  // {
  // if (err)
  // {
  // console.error(err.message);
  // return;
  // }
  // console.log("executing equery");
  // connection.execute(sql,function(err, result)
  //         {
  //         if (err) { console.error(err.message); return;
  //          }
  //          setValue4(result.rows);
  //         //console.log(result.rows);  // print all returned rows
  //       });
  // }
  // );







 res.render('LumpQty',{data1:ajax,data2:abc});



});




app.listen(1521, function(){
  console.log('Server started at port 1521');
}



);
