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

var sqlQueries = require("./sqlQueries.js");
var unRoutedOrderFunctions = require("./unRoutedOrderFunctions.js");
app.get('/DisplayBoard/RoutedButNotReally', (req, res) => {
   res.render('index_routed_but_not_really');
});



app.get('/DisplayBoard/RoutedButNotReally/data', (req, res) => {
console.log("hello");
  var name= req.query.optns;
  var qw=req.query.qw;
  var sid = req.query.sid;
  var host = req.query.host;
  var val = req.query.val;


  var routed_but_not_really_Sql = `select sd.whse,
         sd.distro_nbr,
         sd.store_nbr,
         sd.rte_id,
         sd.frt_class,
         sd.in_store_date,
         t.rte_id,
         t.depart_date,
         t.segment_x      SEG,
         t.rte_stop_seq   StopNum,
         t.rte_load_seq   LoadNum,
         t.routed
    from store_distro_curr sd
    left outer join (select tms.whse,
                            tms.rte_id,
                            tms.distro_nbr,
                            tms.START_SHIP_DATE  Depart_Date,
                            tms.SEGMENT_X,
                            tms.RTE_STOP_SEQ,
                            tms.RTE_LOAD_SEQ,
                            tms.create_date_time Routed
                       from lobl_tms_routing_curr tms
                      group by tms.whse,
                               tms.rte_id,
                               tms.distro_nbr,
                               tms.START_SHIP_DATE,
                               tms.SEGMENT_X,
                               tms.RTE_STOP_SEQ,
                               tms.RTE_LOAD_SEQ,
                               tms.CREATE_DATE_TIME) t
      on t.whse = sd.whse
     and t.distro_nbr = sd.distro_nbr

   where sd.rte_id is null and t.rte_id is not null
     and sd.frt_class <> 99
     and sd.sku_id <> '999999'
   group by sd.whse,
            sd.distro_nbr,
            sd.store_nbr,
            sd.rte_id,
            sd.frt_class,
            sd.in_store_date,
            t.rte_id,
            t.depart_date,
            t.segment_x,
            t.rte_stop_seq,
            t.rte_load_seq,
            t.routed
  `;
console.log(routed_but_not_really_Sql);
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
      doRelease(connection);
      return;
    }
    console.log("executing equery");
    connection.execute(routed_but_not_really_Sql,{},{ extendedMetaData: true },function Result (err, result)
      {
        if (err) {
          // Reject the Promise with an error
            doRelease(connection);

        }

        res.render('routed_but_not_really',{data1:result.rows,data2:'Routed but not Really',data3:result.metaData});

   //res.render('routed_but_not_really');
});
});

});



// unrouted Orders

app.get('/DisplayBoard/UnRoutedOrders', (req, res) => {
   res.render('indexUnRoutedOrders');
});



app.get('/DisplayBoard/UnRoutedOrders/data', (req, res) => {
console.log("hello");
  var name= req.query.optns;
  var qw=req.query.qw;
  var sid = req.query.sid;
  var host = req.query.host;
  var val = req.query.val;


var unRoutedOrdersSql = `
        select
        t1.statusofline,t1.PDT,t1.distro_NBr,t1.C_PLANNED_LOU_ID,
        sum(qty) as SumofQty

        from

        (


        select
        case
        when ch.stat_code is not null and ch.stat_code = '50' then 'Loaded'
        when d.wave_nbr is null and d.rte_id is null then 'Not Waved'

        when d.stat_code < 80 then 'Not Allocated'
        when d.c_PLANNED_LOU_ID is null and ch.carton_nbr is null and d.rte_id is null then 'No LOU'
        when d.RTE_ID is null  then 'No Route'
        when ch.dest_locn_id is null and ch.curr_locn_id is null then 'No OCL'
        when ch.stat_code='10' then 'Not Started'
        when ch.curr_locn_id is not null then 'Staged'
        when c.units_pakd > 0 then 'Picked'
        when ch.stat_code = '15' then 'Picking'
        when ch.curr_locn_id is null then 'Not Yet Staged'

        else 'Unknown'
        end statusofline,

        case when ch.stat_code is null then d.reqd_qty
        when ch.stat_code <20 then to_be_pakd_units
        else units_pakd end qty,ol.STAT_CODE Load_Status,c_PLANNED_LOU_ID, to_char(C_PLANNING_DATE_TIME,'YY-MM-DD HH24:MI') PDT,distro_NBr

        from STORE_DISTRO_CURR d
        left outer join outbd_stop_curr s on d.RTE_ID=s.RTE_ID and d.RTE_LOAD_SEQ=s.RTE_LOAD_SEQ
        left outer join OUTBD_LOAD_CURR ol on s.LOAD_NBR= ol.load_nbr
        left outer join CARTON_DTL_CURR c on c.PKT_CTRL_NBR=d.PKT_CTRL_NBR and c.PKT_SEQ_NBR=d.PKT_SEQ_NBR
        left outer join CARTON_HDR_CURR ch on c.CARTON_NBR=ch.CARTON_NBR
        left outer join item_master im on d.sku_id = im.sku_id
        where distro_type = '1' AND C_ASD_INDICATOR<>'COEX'
        and d.RTE_ID is null
        and (C_PLANNED_LOU_ID is null or C_PLANNED_LOU_ID not like '%PS%') AND d.STAT_CODE <95
        and (ol.STAT_CODE is null or ol.stat_code < '80')
        and (ch.STAT_CODE is null or ch.stat_code < 90)
        and (carton_nbr is null or length(carton_nbr)<15)

        ) t1

        group by t1.C_PLANNED_LOU_ID,t1.distro_NBr,t1.PDT,t1.statusofline
        order by t1.PDT,t1.distro_NBr`;

exports.getUsers = function getUsers () {

  return new Promise((resolve, reject) =>
  {
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
              doRelease(connection);
              return;
            }
            console.log("executing equery");
            connection.execute(unRoutedOrdersSql,{},{ extendedMetaData: true },function Result (err, result)
              {
                if (err) {
                  // Reject the Promise with an error
                    doRelease(connection);

                }
                //console.log(result);
              var noRouteWmData=[];
              noRouteWmData = unRoutedOrderFunctions.AllRouteFunction(result.rows);
//console.log(noRouteWmData);
              doRelease(connection);
                    return resolve(noRouteWmData)
              //  res.render('unRoutedOrders',{data1:result.rows,data2:'UnRouted Orders',data3:result.metaData});

           //res.render('routed_but_not_really');
        });
        });

  })
}// export getusers end

exports.getUsers()  // Returns a Promise!
  .then((allRouteWmData) => {


    var uniqueLouId=[];
    uniqueLouId = unRoutedOrderFunctions.filterLouIds(allRouteWmData);


//console.log(uniqueLouId);
    var sqlODS=`select ld_leg_t.ld_leg_id, shipment_r.shpm_num,status_r2.stat_cd  FROM JDATM_PROD.SHIPMENT_R
    inner JOIN jdatm_prod.status_r
    ON JDATM_PROD.SHIPMENT_R.CUR_OPTLSTAT_ID = status_r.STAT_ID
    LEFT JOIN JDATM_PROD.LD_LEG_DETL_T on SHIPMENT_R.SHPM_ID =LD_LEG_DETL_T.SHPM_ID
    LEFT JOIN JDATM_PROD.LD_LEG_t
    ON JDATM_PROD.LD_LEG_DETL_T.LD_LEG_ID = JDATM_PROD.LD_LEG_T.LD_LEG_ID
    inner JOIN jdatm_prod.status_r status_r2
    ON LD_LEG_T.CUR_OPTLSTAT_ID = status_r2.STAT_ID
    where shipment_r.shpm_num in (`+uniqueLouId+`)`;
console.log(sqlODS);

    oracledb.getConnection(
      {
        user          : 'TMS_RO',
        password      : 'TmR3p0rt1ng',
        connectString : `(DESCRIPTION =
      (ADDRESS_LIST =
        (ADDRESS = (PROTOCOL = TCP)(HOST = lahetmspr08.ngco.com)(PORT = 1527))
      )
      (CONNECT_DATA =
        (SID = PR822)
      )
    )
`
      },
      function(err, connection)
      {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("executing ods query");
        connection.execute(sqlODS,function Result(err, result123)
          {
            if (err)
            {
              console.error(err.message);
              doRelease(connection);
              return;
            }
console.log(result123.rows);
        var finalData=[];
        finalData = unRoutedOrderFunctions.allDataWithStatCd(allRouteWmData,result123.rows);



            // doRelease(connection);
             res.render('unRoutedOrders',{data1:finalData,data2:"UnRouted Order",data3:name});



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
