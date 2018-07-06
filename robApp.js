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

var RobSql=`select ld_leg_id, s.SHPG_LOC_CD,s.SHPG_LOC_NAME,sta_cd,to_char(s.cmpd_arvl_dtt,'YYYY-mm-dd HH24:MI') fromDt,to_char(s.cmpd_dptr_dtt,'YYYY-mm-dd HH24:MI') toDt from jdatm_prod.stop_t s
inner join jdatm_prod.address_r ad on s.addr_id = ad.addr_id
where elst_to_dlvy_dtt is not null and exists (select * from jdatm_prod.stop_t s2 where s2.ld_leg_id<>s.ld_leg_id and s2.shpg_loc_cd = s.shpg_loc_cd and
s.cmpd_dptr_dtt > s2.cmpd_arvl_dtt
and s2.cmpd_dptr_dtt > s.cmpd_arvl_dtt
and s.cmpd_arvl_dtt  < s2.cmpd_dptr_dtt
and s2.ld_leg_id in (select ld_leg_id from jdatm_prod.ld_leg_t where cur_optlstat_id < '355'))
and ld_leg_id in (select ld_leg_id from jdatm_prod.ld_leg_t where end_dtt is not null and end_dtt > current_date and cur_optlstat_id in ('300','305')) and cmpd_arvl_dtt>current_timestamp and shpg_loc_cd not like 'D0%'  and shpg_loc_cd like '00000%' order by shpg_loc_cd, ltst_frm_dlvy_dtt

`;

var OpenLoads=`SELECT LD_LEG_ID,
  stat2 AS LL_STATUS,
  STRD_DTT,
  LD_STRD_DT,CARR_CD,
  SRVC_CD,
  FRM_SHPG_LOC_CD
FROM (SELECT JDATM_PROD.LD_LEG_T.LD_LEG_ID,
    status_r2.STAT_CD STAT2,
    JDATM_PROD.LD_LEG_T.STRD_DTT,
    to_date(STRD_DTT)            AS LD_STRD_DT,
    JDATM_PROD.LD_LEG_T.CRTD_DTT AS LD_CRTD_DT,
    JDATM_PROD.LD_LEG_T.CARR_CD,
    JDATM_PROD.LD_LEG_T.SRVC_CD,
    JDATM_PROD.SHIPMENT_R.SHPM_NUM,
    JDATM_PROD.SHIPMENT_R.FRM_SHPG_LOC_CD,
    JDATM_PROD.SHIPMENT_R.TO_SHPG_LOC_CD,
    status_r.STAT_CD STAT,
    JDATM_PROD.SHIPMENT_R.PLAN_ID,
    JDATM_PROD.SHIPMENT_R.RATG_VLID_YN,
    JDATM_PROD.SHIPMENT_R.HOLD_YN,
    JDATM_PROD.SHIPMENT_R.RATD_DTT,
    JDATM_PROD.SHIPMENT_R.CRTD_DTT,
    JDATM_PROD.SHIPMENT_R.UPDT_DTT,
    JDATM_PROD.SHIPMENT_R.FRM_PKUP_DTT,
    JDATM_PROD.SHIPMENT_R.TO_PKUP_DTT,
    JDATM_PROD.SHIPMENT_R.FRM_DLVY_DTT,
    JDATM_PROD.SHIPMENT_R.TO_DLVY_DTT,
    JDATM_PROD.SHIPMENT_R.CDTY_CD,
    JDATM_PROD.SHIPMENT_R.SCLD_WGT,
    JDATM_PROD.SHIPMENT_R.VOL
  FROM JDATM_PROD.SHIPMENT_R
  inner JOIN jdatm_prod.status_r
  ON JDATM_PROD.SHIPMENT_R.CUR_OPTLSTAT_ID = status_r.STAT_ID
  LEFT JOIN JDATM_PROD.LD_LEG_DETL_T on SHIPMENT_R.SHPM_ID =LD_LEG_DETL_T.SHPM_ID
  LEFT JOIN JDATM_PROD.LD_LEG_t
  ON JDATM_PROD.LD_LEG_DETL_T.LD_LEG_ID = JDATM_PROD.LD_LEG_T.LD_LEG_ID
  inner JOIN jdatm_prod.status_r status_r2
  ON LD_LEG_T.CUR_OPTLSTAT_ID = status_r2.STAT_ID
  WHERE LD_LEG_T.CUR_OPTLSTAT_ID =300
  AND JDATM_PROD.SHIPMENT_R.SHPM_NUM NOT LIKE '%PS'
  AND JDATM_PROD.SHIPMENT_R.FRM_SHPG_LOC_CD LIKE 'D0%'
  AND JDATM_PROD.SHIPMENT_R.CRTD_DTT    >CURRENT_TIMESTAMP-3
  AND JDATM_PROD.SHIPMENT_R.FRM_PKUP_DTT<CURRENT_TIMESTAMP+1
  AND JDATM_PROD.SHIPMENT_R.CUST_CD     ='LCL' )  OL
GROUP BY LD_LEG_ID,
  stat2,
  STRD_DTT,
  LD_STRD_DT,
  CARR_CD,
  SRVC_CD,
  FRM_SHPG_LOC_CD


  ORDER BY FRM_SHPG_LOC_CD, STRD_DTT


`;
app.get('/DisplayBoard/OpenLoads', (req, res) => {

  oracledb.getConnection(
    {
      user          : "TMS_RO",
      password      : "TmR3p0rt1ng",
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
      console.log("executing equery");
      connection.execute(OpenLoads,{},{ extendedMetaData: true },function Result (err, result)
        {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }



          res.render('robPotter2',{data1:result.rows,data2:'Open Loads',data3:result.metaData});

          doRelease(connection);
        });
    });
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
app.get('/DisplayBoard/OverlappingDeliveries', (req, res) => {

  oracledb.getConnection(
    {
      user          : "TMS_RO",
      password      : "TmR3p0rt1ng",
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
      console.log("executing equery");
      connection.execute(RobSql,{},{ extendedMetaData: true },function Result (err, result)
        {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }

          res.render('robPotter2',{data1:result.rows,data2:'Overlapping Deliveries ',data3:result.metaData});



          doRelease(connection);
        });
    });




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



// promise

// Usage:





app.listen(1521, function(){
  console.log('Server started at port 1521');
});
