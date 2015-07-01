$.fn.editable.defaults.mode = 'inline';
$.fn.editable.defaults.ajaxOptions = {type: "PUT"};

var params = function(params) {  //params already contain `name`, `value` and `pk`
  var data = {};
  data[params.name] = params.value;
  return data;
};
function populate(data, user_id) {
  $('#username').editable({url: '/api/users/' + user_id, params : params, value : data.username});
  $('#password').editable({url: '/api/users/' + user_id, params : params, value : data.password});
  $('#email').editable({url: '/api/users/' + user_id, params : params, value : data.email});
  $('#firstName').editable({url: '/api/users/' + user_id, params : params, value : data.firstName});
  $('#lastName').editable({url: '/api/users/' + user_id, params : params, value : data.lastName});
}
function retrieveRoles(user_id) {
  var template = Handlebars.compile('[{{#each this}}{"value": "{{_id}}", "text": "{{rolename}}"},{{/each}}]');

  $.ajax( {
    url: '/api/users/' + user_id + '/roles?offset=0&limit=50'
  }).then(function(data) {
    $('#roles').editable({
      url: '/api/users/' + user_id + '/roles',
      ajaxOptions : {type: "POST"},
      params : params,
      value : data.selected,
      source : template(data.roles)});
  });
}
function retrieveResources(user_id) {
  var template = Handlebars.compile($('#resources-template').html());

  $.ajax( {
    url: '/api/resources?offset=0&limit=50'
  }).then(function(data) {
    $('#resources').html(template(data.data));
  });
}
function retrievePermissions(user_id) {
  var template = Handlebars.compile($('#permissions-template').html());

  $.ajax( {
    url: '/api/permissions?offset=0&limit=50'
  }).then(function(data) {
    $('#permissions').html(template(data.data));
  });
}
