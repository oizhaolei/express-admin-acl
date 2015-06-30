var rows_per_page = 7;

$('document').ready(function () {
  //init jplist with php + mysql data source, json and handlebars template

  retrieveUsers(0);

});

function init_page_count(pageCount) {
  $('#pagination').twbsPagination({
    visiblePages: 7,
    totalPages: pageCount,
    onPageClick: function (event, page) {
      retrieveUsers((page - 1) * rows_per_page);
    }
  });
}
function retrieveUsers(offset) {
  var template = Handlebars.compile($('#jplist-template').html());

  $.ajax( {
    url: '/api/users?offset=' + offset + '&limit=' + rows_per_page
  }).then(function(data) {
    $('#demo').html(template(data.data));
    init_page_count(data.count / rows_per_page);
  });
}
