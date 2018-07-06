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

var orderFlowFunction = require("./overFlowFunctions.js");

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));



// WM/TM dashboard

app.get('/DisplayBoard/OrderFlow', (req, res) => {
   res.render('indexOrderFlows');
});

app.get('/DisplayBoard/OrderFlow/DC', (req, res) => {
console.log("Entered wm");

var sqlWM =`select
    statusofline,

    carton_type,
    PDT,
    WHSE,
    C_PLANNED_LOU_ID,

    Sum(Qty) as SumOfQty
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
    else units_pakd end qty,ch.STAT_CODE,carton_type, to_char(C_PLANNING_DATE_TIME,'YY-MM-DD HH24:MI') PDT,d.WHSE,C_PLANNED_LOU_ID


    from STORE_DISTRO_CURR d
    left outer join outbd_stop_curr s on d.RTE_ID=s.RTE_ID and d.RTE_LOAD_SEQ=s.RTE_LOAD_SEQ
    left outer join OUTBD_LOAD_CURR ol on s.LOAD_NBR= ol.load_nbr
    left outer join CARTON_DTL_CURR c on c.PKT_CTRL_NBR=d.PKT_CTRL_NBR and c.PKT_SEQ_NBR=d.PKT_SEQ_NBR
    left outer join CARTON_HDR_CURR ch on c.CARTON_NBR=ch.CARTON_NBR
    left outer join item_master im on d.sku_id = im.sku_id
    where distro_type = '1' AND C_ASD_INDICATOR<>'COEX'
    and (C_PLANNED_LOU_ID is null or C_PLANNED_LOU_ID not like '%PS%') AND d.STAT_CODE <95
    and (ol.STAT_CODE is null or ol.stat_code < '80')
    and (ch.STAT_CODE is null or ch.stat_code < 90)
    and (carton_nbr is null or length(carton_nbr)<15)
)
group by
    statusofline,

    carton_type,
    PDT,
    WHSE,
    C_PLANNED_LOU_ID

order by statusofline
`;
var name= req.query.optns;
var qw=req.query.qw;
var sid = req.query.sid;
var host = req.query.host;
var val = req.query.val;


var resultset1=[];
resultset1.length=0;
var noRoute=[];
debugger;
noRoute.length=0;
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
        connection.execute(sqlWM,{},{ extendedMetaData: true },function Result (err, result)
          {
            if (err) {
              // Reject the Promise with an error
                doRelease(connection);
              return reject(err)
            }
            for(i=0;i<result.rows.length;i++)
            {

                   resultset1.push({
                             "qty":result.rows[i][5],
                             "louid":result.rows[i][4],
                             "whse":result.rows[i][3],
                             "status": result.rows[i][0],
                             "cartonType": result.rows[i][1],
                             "pdt": result.rows[i][2]
                         });

            }
doRelease(connection);
      return resolve(resultset1)

          });
      });
  })
}

var mainArray = [];
mainArray.length=0;
var arrayWithNoRoute=[];
arrayWithNoRoute.lenght=0;
var arrayWithRoute = [];
arrayWithRoute.length=0;
exports.getUsers()  // Returns a Promise!
  .then((mainquery) => {
//console.log("json data"+JSON.stringify(mainquery));


var count = 0,count2 = 0;
    for (var i = 0; i < mainquery.length; i++) {
      count2++;
      if(mainquery[i].status=='No Route')
      {
    mainArray.push("'"+mainquery[i].louid+"'");
    arrayWithNoRoute.push({
              "qty":mainquery[i].qty,
              "louid":mainquery[i].louid,
              "whse":mainquery[i].whse,
              "status": mainquery[i].status,
              "cartonType": mainquery[i].cartonType,
              "pdt": mainquery[i].pdt
          });

        }
        else {
          arrayWithRoute.push({
                    "qty":mainquery[i].qty,
                    "louid":mainquery[i].louid,
                    "whse":mainquery[i].whse,
                    "status": mainquery[i].status,
                    "cartonType": mainquery[i].cartonType,
                    "pdt": mainquery[i].pdt
                });
                count++;
        }


    }


        var sqlODS=`select ld_leg_t.ld_leg_id, shipment_r.shpm_num,status_r2.stat_cd  FROM JDATM_PROD.SHIPMENT_R
        inner JOIN jdatm_prod.status_r
        ON JDATM_PROD.SHIPMENT_R.CUR_OPTLSTAT_ID = status_r.STAT_ID
        LEFT JOIN JDATM_PROD.LD_LEG_DETL_T on SHIPMENT_R.SHPM_ID =LD_LEG_DETL_T.SHPM_ID
        LEFT JOIN JDATM_PROD.LD_LEG_t
        ON JDATM_PROD.LD_LEG_DETL_T.LD_LEG_ID = JDATM_PROD.LD_LEG_T.LD_LEG_ID
        inner JOIN jdatm_prod.status_r status_r2
        ON LD_LEG_T.CUR_OPTLSTAT_ID = status_r2.STAT_ID
        where shipment_r.shpm_num in (`+mainArray+`)`;

        //  console.log(sqlODS);
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
                //  console.log(result123.rows);



var m = [];
m.length=0;
var mp=[];
mp.length=0;
//console.log(result123.rows);
mp=orderFlowFunction.filteredNoRouteFunction(arrayWithNoRoute,result123);
 m=orderFlowFunction.filteredJSONFunction(arrayWithRoute);

var sortedArray = mp.concat(m);
var combinedValues=[];
combinedValues=orderFlowFunction.sortJSONFunction(sortedArray);

var xz={};
xz.length=0;
var xyy=[];
xyy.length=0;
var cmpr=[];
cmpr.length=0;
for(i=0;i<combinedValues.length;i++)
{
  if(i==0)
  {
    cmpr.push(combinedValues[i].pdt+combinedValues[i].cartonType);
  }
  else {
    if(cmpr.indexOf(combinedValues[i].pdt+combinedValues[i].cartonType)=== -1)
    {

      cmpr.push(combinedValues[i].pdt+combinedValues[i].cartonType);
    }
  }
}

for(j=0;j<cmpr.length;j++)
{
var xy={};

var sumOfAll_Ll=0;
var llClosed=0,llCompleted=0,   llPlanned=0,llTendered=0,llIntransit=0,llTndrAcpt=0,llTndrRej=0;

  for(i=0;i<combinedValues.length;i++)
  {
    var val = combinedValues[i].pdt+combinedValues[i].cartonType;
    if(cmpr[j]==val)
    {

      var stCd =combinedValues[i].statCd;
      var sum =combinedValues[i].sum;

      if(stCd=='LL CLOSED')
      {
        llClosed = sum;
      }
      if(stCd=='LL COMPLETED')
      {
        llCompleted = sum;
      }

      if(stCd=='LL PLANNED')
      {
        llPlanned = sum;
      }
      if(stCd=='LL TENDERED')
      {
        llTendered = sum;
      }

      if(stCd=='LL INTRANSIT')
      {
        llIntransit = sum;
      }

      if(stCd=='LL TNDR ACPT')
      {
        llTndrAcpt = sum;
      }

      if(stCd=='LL TNDR REJ')
      {
        llTndrRej = sum;
      }

      sumOfAll_Ll=llClosed+llCompleted+llPlanned+llTendered+llIntransit+llTndrAcpt+llTndrRej;
//console.log("Sum is"+sumOfAll_Ll);
      xy[stCd]=sum;
      xy["pdt"]=combinedValues[i].pdt;
      xy["cartonType"]=combinedValues[i].cartonType;
      xy["whse"]=combinedValues[i].whse;
    }
xy["sum_LL"]=sumOfAll_Ll;

  }
xyy.push(xy);

}


  doRelease(connection);
               res.render('testarray',{data1:xyy,data2:xyy});


                });
            });


})
  .catch(err => {
    // handle errors
  })
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


app.listen(1521, function(){
  console.log('Server started at port 1521');
});
