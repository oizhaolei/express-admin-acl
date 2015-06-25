csv = require('csv');

exports = module.exports = function(req, res) {

    var users = {};

    csv.stringify(users, function(err2, data) {
      if (err2) { throw err; }

      res.set({"Content-Disposition": "attachment; filename=\"users.csv\""});
      res.send(data);
    });
};
