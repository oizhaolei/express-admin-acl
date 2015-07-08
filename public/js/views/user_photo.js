//- user photo detail
$('document').ready(function () {
  $.ajax( {
    url: photo_entry_point
  }).then(function(data) {
    var template = Handlebars.compile($('#user-photo-template').html());
    $('#user-photo').html(template(data));
  });
});
