var oracledb = require('oracledb');
const express = require('express');
const bodyParser = require('body-parser');


const validator = require('validator');


const ejs = require('ejs');
var path = require('path');
var app = express();




app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

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
   and trunc(th.CREATE_DATE_TIME) >= trunc(sysdate) - 1
 group by th.whse, trunc(td.CREATE_DATE_TIME)
 order by tdt desc) XX`;

app.get('/DisplayBoard', (req, res) => {

console.log("enter");
res.render('index');
//doRelease(connection);

});
app.get('/DisplayBoard1', (req, res) => {
debugger;
console.log("enter");
res.render('2');
//doRelease(connection);

});
function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
app.get('/DisplayBoard/data', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var name= req.query.optns;
var qw=req.query.qw;
var sid = req.query.sid;
var host = req.query.host;
var val = req.query.val;


if(val=="dc")
{
  debugger;
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
      connection.execute(sql  ,

            function Result (err, result)
        {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
var ab=[];

          if (ab=== undefined || ab.length == 0)
          {

            res.render('displayNoData',{name:name,qw:qw});
          }
          else {
res.render('display',{'sql':result,name:name,qw:qw});

          }

        //  console.log("Hello"+req.body.optns+"user");
          //console.log("Hello"+req.body.qw+"user");
          doRelease(connection);
        });
    });




}
if(val=="region")
{

  if(name="Ontario")
  {

    var host2="LAKRWMSPRO1.ngco.com";
    var sid2="PR271";
    var name2="Maple Grove"
  oracledb.getConnection(
    {
      user          : "PR277WM",
      password      : "PR277WM",
      connectString : `(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = ${host2})(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = ${sid2})))`
    },
    function(err, connection)
    {
      if (err) {
        console.error(err.message);
        return;
              }
      console.log("executing equery");
      connection.execute(sql,

        function Result (err, result)
        {
          if (err)
          {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          res.render('mapleGrove',{'sql':result,name:name2,qw:qw});
        //  console.log("Hello"+req.body.optns+"user");
          //console.log("Hello"+req.body.qw+"user");
          doRelease(connection);
        }
      );
    });



}

}

});




app.get('/DisplayBoard/atlanticFreezer', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var host="lakrwmspra1.ngco.com";
var sid="PR273";
var name="Atlantic Freezer";
var qw="PR274WM";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('mapleGrove',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });





});


app.get('/DisplayBoard/lakeside', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var host="lakrwmspra1.ngco.com";
var sid="PR273";
var name="Lakeside";
var qw="PR275WM";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('mapleGrove',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });





});


app.get('/DisplayBoard/stjohns', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var host="lakrwmspra1.ngco.com";
var sid="PR273";
var name="St John's";
var qw="PR305WM";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('mapleGrove',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });





});


app.get('/DisplayBoard/moncton', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var host="lakrwmspra1.ngco.com";
var sid="PR273";
var name="Moncton";
var qw="PR380WM";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('mapleGrove',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });





});


app.get('/DisplayBoard/caledonia', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var host="lakrwmspra1.ngco.com";
var sid="PR273";
var name="Caledonia";
var qw="PR381WM";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('mapleGrove',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });





});












app.get('/DisplayBoard/mapleGrove', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var name= "Maple Grove";
var qw="PR277WM";
var sid = "PR271";
var host = "LAKRWMSPRO1.ngco.com";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('mapleGrove',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });





});

app.get('/DisplayBoard/ottawa', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var name= "Ottawa";
var qw="PR405WM";
var sid = "PR271";
var host = "LAKRWMSPRO1.ngco.com";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('ottawa',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });




});
app.get('/DisplayBoard/southCaledon', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var name= "South Caledon";
var qw="PR455WM";
var sid = "PR271";
var host = "LAKRWMSPRO1.ngco.com";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('southCaledon',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });




});

app.get('/DisplayBoard/ajax', (req, res) => {
//  req.checkBody('optns', 'options has to be selected.').isArray().notEmpty();

var name= "Ajax";
var qw="PR279WM";
var sid = "PR271";
var host = "LAKRWMSPRO1.ngco.com";
oracledb.getConnection(
  {
    user          :qw ,
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
    connection.execute(sql,

          function Result (err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        res.render('ajax',{'sql':result,name:name,qw:qw});
      //  console.log("Hello"+req.body.optns+"user");
        //console.log("Hello"+req.body.qw+"user");
        doRelease(connection);
      });
  });





});

// Get a non-pooled connection


app.listen(1521);
