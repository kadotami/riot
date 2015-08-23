<login>
  <form onsubmit="{ login }">
    <input name="login_id" type="text" placeholder="login_id">
    <input name="password" type="password" placeholder="password">
    <button>login</button>
  </form>

  var request = require('superagent')
  login() {
    params = {
      login_id: this.login_id.value,
      password: this.password.value
    };
    request.post('https://wizpra.card.wizpra.com/api/session')
      .send(params)
      .end(function(err,json) {
        riot.route('#/home');
      });
  }
</login>
