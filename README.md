Admin UI for ACL
===========
An web interface for administrators to manage ACL.

## Documentation
### Usage
create a config.json file and fill in the following values:
``` js
{
  "redis" : {
    "host": "127.0.0.1",
    "port": 6379
  },
  "mysql" : {
    "acl" : {
      "host" : "local",
      "user" : "tt",
      "port" : 3316,
      "password" : "pass",
      "database" : "tt",
      "charset" : "utf8mb4",
      "dateStrings" : true
    }
  }
}
```
Run it!
``` shell
npm install
node index.js
```
### Typical Issues
- Nodejs, Redis, Mysql, Mongo
- JQuery, AngularJS, Pagination, Grid
- ACL
- Restful
