


module.exports =
{


  filteredNoRouteFunction : function(arrayWithNoRoute,resultFromSecondQuery)
  {
    var m =[];
    var aa=[];
    aa.length=0;
    var count =0;
    for(var j = 0; j < arrayWithNoRoute.length; j++)
    {
      for(var k = 0; k < resultFromSecondQuery.rows.length; k++)
      {
        if(arrayWithNoRoute[j].louid===resultFromSecondQuery.rows[k][1])
        {
          count++;
          aa.push({"statCd":resultFromSecondQuery.rows[k][2],"whse":arrayWithNoRoute[j].whse,"cartonType":arrayWithNoRoute[j].cartonType,"pdt":arrayWithNoRoute[j].pdt,"qty":arrayWithNoRoute[j].qty});
        }
      }
    }
    //console.log(aa);
    console.log("Count is : "+count);
    var uniqueStatCd = [];
    uniqueStatCd.length=0;
    for(i = 0; i< aa.length; i++){
        if(uniqueStatCd.indexOf(aa[i].statCd) === -1){
            uniqueStatCd.push(aa[i].statCd);
        }
    }
    var uniqueCartonType = [];
    uniqueCartonType.length=0;
    for(i = 0; i< aa.length; i++){
        if(uniqueCartonType.indexOf(aa[i].cartonType) === -1){
            uniqueCartonType.push(aa[i].cartonType);
        }
    }

    var uniquePdt = [];
    uniquePdt.length=0;
    for(i = 0; i< aa.length; i++){
        if(uniquePdt.indexOf(aa[i].pdt) === -1){
            uniquePdt.push(aa[i].pdt);
        }
    }
    var uniqueWhse = [];
    uniqueWhse.length=0;
    for(i = 0; i< aa.length; i++){
        if(uniqueWhse.indexOf(aa[i].whse) === -1){
            uniqueWhse.push(aa[i].whse);
        }
    }

    var bbc=[];
    bbc.length=0;
    for(a=0;a<uniqueStatCd.length;a++)
    {
      for(b=0;b<uniqueCartonType.length;b++)
      {
        for(c=0;c<uniquePdt.length;c++)
        {
          for(e=0;e<uniqueWhse.length;e++)
          {
          for(d=0;d<aa.length;d++)
          {
            if(uniqueStatCd[a]==aa[d].statCd && uniqueCartonType[b]==aa[d].cartonType && uniquePdt[c]==aa[d].pdt && uniqueWhse[e]==aa[d].whse)
            {

              bbc.push({"statCd":uniqueStatCd[a],"cartonType":uniqueCartonType[b],"pdt":uniquePdt[c],"whse":uniqueWhse[e]});
              break;
            }
          }
        }
        }
      }
    }


    for(ii=0;ii<bbc.length;ii++)
    {
      var sum=0;
      for(jj=0;jj<aa.length;jj++)
      {

        if(aa[jj].statCd == bbc[ii].statCd && aa[jj].cartonType == bbc[ii].cartonType && aa[jj].pdt == bbc[ii].pdt)
        {
          sum+=aa[jj].qty ;
        }

      }
      m.push({"sum":sum,"statCd":bbc[ii].statCd,"cartonType":bbc[ii].cartonType,"pdt":bbc[ii].pdt,"whse":bbc[ii].whse});
    }

return m;
},



  filteredJSONFunction : function(resultset)
  {
    var m =[];
    var uniqueStatus2 = [];
    var uniqueCartonType2 = [];
    var uniquePdt2 = [];
    var uniqueWhse2 = [];
    uniqueStatus2.length=0;
    uniqueCartonType2.length=0;
    uniquePdt2.length=0;

uniqueWhse2.length=0;
    for(i = 0; i< resultset.length; i++)
    {
        if(uniqueStatus2.indexOf(resultset[i].status) === -1){
            uniqueStatus2.push(resultset[i].status);
        }
        if(uniqueCartonType2.indexOf(resultset[i].cartonType) === -1){
            uniqueCartonType2.push(resultset[i].cartonType);
        }
        if(uniquePdt2.indexOf(resultset[i].pdt) === -1){
            uniquePdt2.push(resultset[i].pdt);
        }
        if(uniqueWhse2.indexOf(resultset[i].whse) === -1){
            uniqueWhse2.push(resultset[i].whse);
        }

    }


    var bbc2=[];
    bbc2.length=0;
    var ct=0;
    for(a=0;a<uniqueStatus2.length;a++)
    {
      for(b=0;b<uniqueCartonType2.length;b++)
      {
        for(c=0;c<uniquePdt2.length;c++)
        {

          for(e=0;e<uniqueWhse2.length;e++)
          {

          for(d=0;d<resultset.length;d++)
          {

            if(uniqueStatus2[a]==resultset[d].status && uniqueCartonType2[b]==resultset[d].cartonType && uniquePdt2[c]==resultset[d].pdt && uniqueWhse2[e]==resultset[d].whse)
            {



               ct++;
              bbc2.push({"status":uniqueStatus2[a],"cartonType":uniqueCartonType2[b],"pdt":uniquePdt2[c],"whse":uniqueWhse2[e]});
             break ;
            }
          }

        }
        }
      }
    }


console.log(ct+"Is the n oo");

    for(ii=0;ii<bbc2.length;ii++)
    {
    var qty =0;
        for(jj=0;jj<resultset.length;jj++)
        {
          if(bbc2[ii].status == resultset[jj].status && bbc2[ii].whse == resultset[jj].whse && bbc2[ii].pdt == resultset[jj].pdt && bbc2[ii].cartonType == resultset[jj].cartonType)
          {
            qty+=resultset[jj].qty;
          }
        }

    m.push({"sum":qty,"statCd":bbc2[ii].status,"cartonType":bbc2[ii].cartonType,"pdt":bbc2[ii].pdt,"whse":bbc2[ii].whse});
    }

return m;

  },

  sortJSONFunction : function(resultset)
  {

    var uniqueCartonType2 = [];
    var uniquePdt2 = [];
    var sortedArray=[];
    for(i = 0; i< resultset.length; i++)
    {

        if(uniqueCartonType2.indexOf(resultset[i].cartonType) === -1){
            uniqueCartonType2.push(resultset[i].cartonType);
        }
        if(uniquePdt2.indexOf(resultset[i].pdt) === -1){
            uniquePdt2.push(resultset[i].pdt);
        }


    }
    var sortedCarton=[];
    var sortedPdt=[];
  sortedCarton=uniqueCartonType2.sort();
  sortedPdt=uniquePdt2.sort();
  //console.log(sortedCarton);
  //console.log(sortedPdt);
    for(b=0;b<sortedCarton.length;b++)
    {
      for(c=0;c<sortedPdt.length;c++)
      {
        for(i = 0; i< resultset.length; i++)
        {
          if(sortedCarton[b]==resultset[i].cartonType && sortedPdt[c]==resultset[i].pdt)
          {
          sortedArray.push({"sum":resultset[i].sum,"statCd":resultset[i].statCd,"cartonType":sortedCarton[b],"pdt":sortedPdt[c],"whse":resultset[i].whse});
          }
        }
      }
    }
    return sortedArray;
  }

};
