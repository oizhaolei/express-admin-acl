var rows_per_page = 7;
var wookmark,

    $window = $(window),
    $document = $(document),
    options = {
      container: $('#main'),
      offset: 10, // Optional, the distance between grid items
      outerOffset: 10, // Optional, the distance to the containers border
      itemWidth: 210 // Optional, the width of a grid item
    },
    minId = '',
    isLoading = false,
    $loaderCircle = $('#loaderCircle');


$('document').ready(function () {
  // Init lightbox
  $('#container').magnificPopup({
    delegate: 'li a.photo',
    type: 'image',
    gallery: {
      enabled: true
    }
  });
  wookmark = new Wookmark("#container", options);

  $(document).bind('scroll', onScroll);
  loadData(minId);
});


function loadData(minId) {
  if (isLoading) return;

  isLoading = true;
  $loaderCircle.show();

  $.ajax({
    url: '/api/user_photos?last_id=' + minId
  }).then(function(data) {
    rows_per_page = data.rows_per_page;
    populate(data.data);
  });
};
function populate(data) {
  isLoading = false;
  $loaderCircle.hide();

  if (data.length > 0)
    minId = data[data.length - 1]._id;
  //
  var template = Handlebars.compile($('#user_photo_template').html());
  var html = template(data);
  // Add image HTML to the page.
  $("#container").append(html);

  // Apply layout.
  applyLayout();

}

function applyLayout() {
  imagesLoaded($("#container"), function () {
    wookmark.initItems();
    wookmark.layout(true);
  });
};
function onScroll(event) {

  // Check if we're within 100 pixels of the bottom edge of the broser window.
  var winHeight = window.innerHeight ? window.innerHeight : $window.height(), // iphone fix
      closeToBottom = ($window.scrollTop() + winHeight > $document.height() - 100);

  if (closeToBottom) {
    loadData(minId);
  }
};
