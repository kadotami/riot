riot.tag('login', '<form onsubmit="{ login }"> <input name="login_id" type="text" placeholder="login_id"> <input name="password" type="password" placeholder="password"> <button>login</button> </form> <div class="{ hide: login_error }"> idとpasswordが一致しません。 </div>', 'login .hide, [riot-tag="login"] .hide{ display:none; }', function(opts) {

  var self = this
  login_error = true;
  var request = require('superagent')
  this.login = function(e) {
    sendParams = {
      login_id: this.login_id.value,
      password: this.password.value
    };
    request.post('https://wizpra.card.wizpra.com/api/session')
      .send(sendParams)
      .end(function(err,json) {
        if (err) {
          login_error = false;
          self.update();
        } else {
          localStorage.pz_token = JSON.parse(json.text).auth_token
          riot.route('#/todo');
        }
      });
  }.bind(this);

});
