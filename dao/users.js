"use strict";
var config = require('../config.json');

var _ = require('underscore');
var mysql = require('mysql');

function Users() {
  var pool = mysql.createPool(config.mysql.ttt);
  this.pool = pool;
}

Users.prototype = {
  jplist : function (statuses, callback) {
    var json = {}
    ,query = ''
    ,status
    ,filter = ''
    ,sort = ''
    ,paging = ''
    ,pagingStatus = null
    ,preparedParams = []
    ,count = 0
    ,stmt;

    for(var i=0; i<statuses.length; i++){

      //get status
      status = statuses[i];

      switch(status.action){

      case 'paging':{
        pagingStatus = status;
      }
        break;

      case 'filter':{
        filter += getFilterQuery(status, filter, preparedParams);
      }
        break;

      case 'sort':{
        sort = getSortQuery(status, preparedParams);
      }
        break;
      }
    }

    var pool = this.pool;
    //count database items for pagination
    query = 'SELECT count(id) as count FROM tbl_user ' + filter + ' ' + sort;
    console.log(query, JSON.stringify(preparedParams));
    stmt = pool.query(query, preparedParams, function(err, results){

      if(!err && _.isArray(results) && results.length > 0){
        count = results[0].count;
      }

      if(pagingStatus){
        paging = getPagingQuery(pagingStatus, count, preparedParams);
      }

      //init query with sort, filter and pagination
      query = 'SELECT id, tel as username, fullname, pic_url portrait FROM tbl_user ' + filter + ' ' + sort + ' ' + paging;

      console.log(query, JSON.stringify(preparedParams));
      stmt = pool.query(query, preparedParams, function(err, results){

        callback({
          count: count
          ,data: results
        });
      });
    });
  }

};
  var getFilterQuery = function(status, prevQuery, preparedParams){

    var query = ''
    ,name = status.name
    ,data = status.data;

    if(name && data){

      switch(name){

      case 'title-filter':{

        if(data.path && data.value){

          if(prevQuery.indexOf('where') !== -1){
            query = ' and title like ?? ';
          }
          else{
            query = 'where title like ?? ';
          }

          preparedParams.push('%' + data.value + '%');
        }
      }
        break;

      case 'desc-filter':{

        if(data.path && data.value){

          if(prevQuery.indexOf('where') !== -1){
            query = ' and description like ?? ';
          }
          else{
            query = 'where description like ?? ';
          }

          preparedParams.push('%' + data.value + '%');
        }
      }
        break;
      }
    }

    return query;
  };

  /**
   * get sort query
   * @param {Object} status
   * @param {Array.<string>} preparedParams - array of params for prepare statement
   * @return {string}
   * sort example
   * {
   *     "action": "sort",
   *     "name": "sort",
   *     "type": "drop-down",
   *     "data": {
   *         "path": ".like",
   *         "type": "number",
   *         "order": "asc",
   *         "dateTimeFormat": "{month}/{day}/{year}"
   *     },
   *     "cookies": true
   */
  var getSortQuery = function(status, preparedParams){

    var query = ''
    ,data = status.data
    ,order = 'asc';

    if(data && data.path){

      switch(data.path){

      case '.title':{
        query = 'order by title';
      }
        break;

      case '.desc':{
        query = 'order by description';
      }
        break;

      case '.like':{
        query = 'order by likes';
      }
        break;
      }

      if(query){
        if(data.order){
          order = data.order.toLowerCase();
        }

        if(order !== 'desc'){
          order = 'asc';
        }

        query = query + ' ' + order;
      }
    }

    return query;
  };

  /**
   * get pagination query
   * @param {Object} status
   * @param {number} count - all items number (after the filters were applied)
   * @param {Array.<string>} preparedParams - array of params for prepare statement
   * @return {string}
   * status example
   * {
   *     "action": "paging",
   *     "name": "paging",
   *     "type": "placeholder",
   *     "data": {
   *         "number": "10",
   *         "currentPage": 0,
   *         "paging": null
   *     },
   *     "cookies": true
   * }
   */
  var getPagingQuery = function(status, count, preparedParams){

    var query = ''
    ,data = status.data
    ,currentPage = 0
    ,number = 0;

    if(data){

      currentPage = Number(data.currentPage) || 0;
      number = Number(data.number) || 0;

      if(count > number){
        query = 'LIMIT ' + currentPage * number + ', ' + number;
      }
    }

    return query;
  };

exports = module.exports = Users;
