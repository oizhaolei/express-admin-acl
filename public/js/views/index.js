var rows_per_page = 7;
var minId = '',
    isLoading = false;


$('document').ready(function () {
  Dropzone.options.myAwesomeDropzone = {
    uploadMultiple: false,
    maxFilesize: 5,
    init: function() {
      this.on("success", function(file, responseText, e) {
        console.info(responseText.filename);
        $('#pic_url').val(responseText.filename);
        $(".user-photo").show();
      });
    }
  };
  $('#post-user-photo').click(function(){
    console.info("post user_photo");
  });
  // Init lightbox
  $('#container').magnificPopup({
    delegate: 'div.item a.photo',
    type: 'ajax',
    gallery: {
      enabled: true
    }
  });

  $('#container').waterfall({
    itemCls: 'item',
    colWidth: 270,
    gutterWidth: 15,
    gutterHeight: 15,
    checkImagesLoaded: false,
    path: function(page) {
        return entry_point + '?last_id=' + minId;
    },
    callbacks : {
      renderData: function (data, dataType) {
        var tpl, template;

        data = data.data;
        if (data.length > 0)
          minId = data[data.length - 1]._id;

        if ( dataType === 'json' ||  dataType === 'jsonp'  ) { // json or jsonp format
          tpl = $('#waterfall-tpl').html();
          template = Handlebars.compile(tpl);

          return template(data);
        } else { // html format
          return data;
        }
      }
    }
  });

});
