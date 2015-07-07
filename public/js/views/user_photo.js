//- user photo detail
$('document').ready(function () {
  $.ajax( {
    url: '/api/user_photos/' + user_photo_id
  }).then(function(data) {
    var template = Handlebars.compile($('#user-photo-template').html());
    $('#user-photo').html(template(data));
  });
});
