var warehouse=`SELECT  GRP_TYPE, COALESCE(TOTAL_TASKS,0), COALESCE(HOLD,0), COALESCE(RLSD_UNASSIGNED,0), COALESCE(RLSD_UNASSIGNED_HOT,0), COALESCE(RLSD_UNASSIGNED_NOT_HOT,0), COALESCE(RLSD_ASSIGNED,0), COALESCE(RLSD_ASSIGNED_HOT,0), COALESCE(RLSD_ASSIGNED_NOT_HOT,0) FROM
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE,
            count(*) as TOTAL_TASKS
from task_hdr_curr
where STAT_CODE < 90
group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) a
/*=============================================================================*/
Left Join
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE1,
            count(*) as RLSD_UNASSIGNED
            from task_hdr_curr
            where STAT_CODE like '10'
            group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) b
ON a.GRP_TYPE=b.GRP_TYPE1

/*=============================================================================*/
Left Join
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE2,
            count(*) as RLSD_UNASSIGNED_HOT
            from task_hdr_curr
            where STAT_CODE like '10' and CURR_USER_ID is null
            group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) c
ON a.GRP_TYPE=c.GRP_TYPE2
/*=============================================================================*/
Left Join
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE3,
            count(*) as RLSD_UNASSIGNED_NOT_HOT
            from task_hdr_curr
            where STAT_CODE like '10' and CURR_USER_ID is not null
            group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) d
ON a.GRP_TYPE=d.GRP_TYPE3
/*=============================================================================*/
Left Join
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE4,
            count(*) as RLSD_ASSIGNED
            from task_hdr_curr
            where STAT_CODE > '10' and STAT_CODE < 90
            group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) e
ON a.GRP_TYPE=e.GRP_TYPE4

/*=============================================================================*/
Left Join
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE5,
            count(*) as RLSD_ASSIGNED_HOT
            from task_hdr_curr
            where STAT_CODE > '10' and STAT_CODE < 90 and CURR_USER_ID is null
            group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) f
ON a.GRP_TYPE=f.GRP_TYPE5
/*=============================================================================*/
Left Join
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE6,
            count(*) as RLSD_ASSIGNED_NOT_HOT
            from task_hdr_curr
            where STAT_CODE > '10' and STAT_CODE < 90 and CURR_USER_ID is not null
            group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) g
ON a.GRP_TYPE=g.GRP_TYPE6
/*=============================================================================*/
Left Join
(select (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end) as GRP_TYPE7,
            count(*) as HOLD
            from task_hdr_curr
            where STAT_CODE = '05'
            group by (case when task_type like 'P%' then 'Putaway'
            when task_type like 'F%' then 'FPP'
            when task_type like '9%' then 'Flow'
            when task_type like 'R%' then 'Replen'
            when task_type like 'S%' then 'Stock'
            when task_type like 'A%' then 'Anchor'
            when task_type like 'L%' then 'L'

            else 'OTHER'
            end)) h

ON a.GRP_TYPE=h.GRP_TYPE7
ORDER BY GRP_TYPE ASC
/*=============================================================================*/
`;
var eligibleWorkersSql=`((Select Sum (mycount) AS ELIGIBLE  From
(select curr_task_grp, count(*) as mycount
from user_profile_curr
where CURR_TASK_GRP is not null and CURR_TASK_GRP like ('%AA%') or CURR_TASK_GRP like ('%AL%') or CURR_TASK_GRP like ('%AR%') or CURR_TASK_GRP like('%XA%')
group by CURR_TASK_GRP)
/* Count of REPLEN*/

union all

Select Sum (mycount) AS ELIGIBLE  From
(select curr_task_grp, count(*) as mycount
from user_profile_curr
where  CURR_TASK_GRP is not null and CURR_TASK_GRP like ('%AA%') or CURR_TASK_GRP like ('%AL%') or CURR_TASK_GRP like ('%XL%') or CURR_TASK_GRP like('%XP%')
group by CURR_TASK_GRP)
/* Count of  FPP */

union all

Select  Sum (mycount) AS ELIGIBLE From
(select curr_task_grp, count(*) as mycount
from user_profile_curr
where LAST_TASK is not null and CURR_TASK_GRP like ('%AA%') or CURR_TASK_GRP like ('%AL%') or CURR_TASK_GRP like ('%AP%') or CURR_TASK_GRP like('%XR%')
group by CURR_TASK_GRP))
/* Count of PUTAWAY*/

union all

Select  Sum (mycount) AS ELIGIBLE From
(select curr_task_grp, count(*) as mycount
from user_profile_curr
where LAST_TASK is not null and LAST_TASK is null
group by CURR_TASK_GRP)

union all

Select  Sum (mycount) AS ELIGIBLE From
(select curr_task_grp, count(*) as mycount
from user_profile_curr
where LAST_TASK is not null and LAST_TASK is null
group by CURR_TASK_GRP)) order by ELIGIBLE`;
var routed_but_not_really = `select sd.whse,
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
module.exports =
{
warehouse,eligibleWorkersSql,routed_but_not_really
}
