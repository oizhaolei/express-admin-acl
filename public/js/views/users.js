$('document').ready(function () {
  var $list = $('#demo .list')
  , template = Handlebars.compile($('#jplist-template').html());
  //init jplist with php + mysql data source, json and handlebars template
  $('#demo').jplist({
    itemsBox: '.list'
    , itemPath: '.list-item'
    , panelPath: '.jplist-panel'
    //data source
    , dataSource: {
      type: 'server'
      , server: {
	//ajax settings
	ajax: {
	  url: '/api/users'
	  , dataType: 'json'
	  , type: 'GET'
	  , cache: false
	}
      }
      //render function for json + templates like handlebars, xml + xslt etc.
      , render: function (dataItem, statuses) {
	$list.html(template(dataItem.content));
      }
    }
  });
});
