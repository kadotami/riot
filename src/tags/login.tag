<login>
  <form onsubmit="{ login }">
    <input name="login_id" type="text" placeholder="login_id">
    <input name="password" type="password" placeholder="password">
    <button>login</button>
  </form>

  var request = require('superagent')
  login() {
    sendParams = {
      login_id: this.login_id.value,
      password: this.password.value
    };
    request.post('https://wizpra.card.wizpra.com/api/session')
      .send(sendParams)
      .end(function(err,json) {
        if (err) {
          console.log(err)
        } else {
          riot.route('#/home');
        }
      });
  }
</login>
