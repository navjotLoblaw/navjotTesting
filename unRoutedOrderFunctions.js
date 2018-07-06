module.exports =
{


    AllRouteFunction : function(resultFromWmQuery)
    {

      var aa=[];
      for(var j = 0; j < resultFromWmQuery.length; j++)
      {



            aa.push({"status":resultFromWmQuery[j][0],"pdt":resultFromWmQuery[j][1],"distroNumber":resultFromWmQuery[j][2],"louId":resultFromWmQuery[j][3],"qty":resultFromWmQuery[j][4]});

      }




      return aa;

    },

    filterLouIds : function(noRouteWmData)
    {

      var  uniqueLouId=[];
      for(i = 0; i< noRouteWmData.length; i++)
      {
        if(noRouteWmData[i].status==='No Route')
        {
          if(uniqueLouId.indexOf(noRouteWmData[i].louId) === -1){
              uniqueLouId.push("'"+noRouteWmData[i].louId+"'");
          }
        }
      }
console.log(uniqueLouId);
      return uniqueLouId;
    },

    allDataWithStatCd : function(allRouteWmData,dataFromOds)
    {
      var finalData=[];
      var finalData2=[];
      var finalData3=[];
      var finalData4=[];
    //  console.log(allRouteWmData[2].louId);
//console.log(dataFromOds[0][1]);
      for(i = 0; i< allRouteWmData.length; i++)
      {
        for(j = 0; j< dataFromOds.length; j++)
        {

          if(allRouteWmData[i].louId==dataFromOds[j][1] && allRouteWmData[i].status=='No Route')
          {
          //  console.log(dataFromOds[j][1]);
            finalData.push({"status":dataFromOds[j][2],"pdt":allRouteWmData[i].pdt,"distroNumber":allRouteWmData[i].distroNumber,"louId":allRouteWmData[i].louId,"qty":allRouteWmData[i].qty});
            break;
          }
          else if(allRouteWmData[i].status!='No Route')
          {
            finalData2.push({"status":allRouteWmData[i].status,"pdt":allRouteWmData[i].pdt,"distroNumber":allRouteWmData[i].distroNumber,"louId":allRouteWmData[i].louId,"qty":allRouteWmData[i].qty});
            break;
          }
        //  if(allRouteWmData[i].louId=="" && allRouteWmData[i].status=='No Route')
          else
          {
          //  console.log(dataFromOds[j][1]);
            finalData.push({"status":allRouteWmData[i].status,"pdt":allRouteWmData[i].pdt,"distroNumber":allRouteWmData[i].distroNumber,"louId":allRouteWmData[i].louId,"qty":allRouteWmData[i].qty});
            break;
          }

        }



    }

    finalData3 = finalData.concat(finalData2);
    

    return finalData3;
  }
};
