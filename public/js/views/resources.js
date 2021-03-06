var rows_per_page = 7;

$('document').ready(function () {
  //init jplist with php + mysql data source, json and handlebars template

  retrieveResources(0);

});

function init_page_count(pageCount) {
  pageCount = parseInt(pageCount) + 1;
  $('#pagination').twbsPagination({
    visiblePages: 7,
    totalPages: pageCount,
    onPageClick: function (event, page) {
      retrieveResources((page - 1) * rows_per_page);
    }
  });
}
function retrieveResources(offset) {
  var template = Handlebars.compile($('#jplist-template').html());

  $.ajax( {
    url: '/api/resources?offset=' + offset + '&limit=' + rows_per_page
  }).then(function(data) {
    $('#demo').html(template(data.data));
    init_page_count(data.count / rows_per_page);
  });
}
