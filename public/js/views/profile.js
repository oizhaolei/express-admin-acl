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

//- user detail
$('document').ready(function () {
  $.ajax( {
    url: '/api/users/' + user_id
  }).then(function(data) {
    populate(data, user_id);
  });
});
