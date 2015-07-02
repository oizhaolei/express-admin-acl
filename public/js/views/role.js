var rows_per_page = 7;
$.fn.editable.defaults.mode = 'inline';
$.fn.editable.defaults.ajaxOptions = {type: "PUT"};

var params = function(params) {  //params already contain `name`, `value` and `pk`
  var data = {};
  data[params.name] = params.value;
  return data;
};
function populate(data, user_id) {
  $('#role').editable({url: '/api/roles/' + role_id, params : params, value : data.role});
}
function retrieveRoleUsers(role_id) {
  var template = Handlebars.compile($('#role-users-template').html());

  $.ajax( {
    url: '/api/roles/' + role_id + '/users?offset=0&limit=50'
  }).then(function(data) {
    $('#role-users').html(template(data.data));
    $('deleteuserbtn').on('click', function(e){
      removeRoleUser(role_id, $(this).attr('userid'));
    });
  });
}
function removeRoleUser(role_id, user_id) {
  $.ajax( {
    type: 'DELETE',
    url: '/api/roles/' + role_id + '/users/' + user_id
  }).then(function(data) {
    retrieveRoleUsers(role_id);
  });
}
function retrieveResources(role_id) {
  var template = Handlebars.compile($('#role-resources-template').html());

  $.ajax( {
    url: '/api/resources?offset=0&limit=50'
  }).then(function(data) {
    $('#role-resources').html(template(data.data));
  });
}
function retrievePermissions(role_id) {
  var template = Handlebars.compile($('#role-permissions-template').html());

  $.ajax( {
    url: '/api/permissions?offset=0&limit=50'
  }).then(function(data) {
    $('#role-permissions').html(template(data.data));
  });
}


function init_page_count(pageCount) {
  pageCount = parseInt(pageCount) + 1;
  $('.user-pagination-sm').twbsPagination({
    visiblePages: 7,
    totalPages: pageCount,
    onPageClick: function (event, page) {
      retrieveUsers((page - 1) * rows_per_page);
    }
  });
}
function retrieveUsers(offset) {
  var template = Handlebars.compile($('#users-template').html());

  $.ajax( {
    url: '/api/users?offset=' + offset + '&limit=' + rows_per_page
  }).then(function(data) {
    $('#users').html(template(data.data));
    init_page_count(data.count / rows_per_page);
    console.log($('#adduserbtn'));
    $('.adduserbtn').on('click', function(e){
      addRoleUser(role_id, $(this).attr('userid'));
    });

  });
}
function addRoleUser(role_id, user_id) {
  $.ajax( {
    type: 'POST',
    data: {
      user_id : user_id
    },
    url: '/api/roles/' + role_id + '/users'
  }).then(function(data) {
    retrieveRoleUsers(role_id);
  });
}

//- role detail
$('document').ready(function () {
  $.ajax( {
    url: '/api/roles/' + role_id
  }).then(function(data) {
    populate(data, role_id);
  });
  $('#deleteRoleBtn').on('click', function(e){
    console.log('delete role');
  });

});
//- users, resources, permission
retrieveRoleUsers(role_id);
retrieveUsers(0);
retrieveResources(role_id);
retrievePermissions(role_id);
