riot.tag('login', '<form onsubmit="{ login }"> <input name="login_id" type="text" placeholder="login_id"> <input name="password" type="password" placeholder="password"> <button>login</button> </form>', function(opts) {

  var request = require('superagent')
  this.login = function() {
    params = {
      login_id: this.login_id.value,
      password: this.password.value
    };
    request.post('https://wizpra.card.wizpra.com/api/session')
      .send(params)
      .end(function(err,json) {
        riot.route('#/home');
      });
  }.bind(this);


});
