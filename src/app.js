riot = require('riot/riot');
router = require('riot-router/lib/router');

require('./js/app');
require('./js/login');
require('./js/nav_header');
require('./js/todo');


riot.mount("*");

var Route = riot.router.Route,
    DefaultRoute = riot.router.DefaultRoute,
    NotFoundRoute = riot.router.NotFoundRoute,
    RedirectRoute = riot.router.RedirectRoute;

riot.router.routes([
  new DefaultRoute({tag: 'login'}),
  new Route({tag: 'todo'}),
  // new Route({tag: 'users'}).routes([
  //    new Route({path:'top', tag: 'users-home', api: {text: 'Select a top user'}}),
  //    new Route({path: '/user/:userId', tag: 'user'}),
  //    new DefaultRoute({tag: 'users-home', api: {text: 'Select a user'}}),
  //    new NotFoundRoute({tag: 'not-found'})
  //  ]),
  new NotFoundRoute({tag: 'not-found'})
  // new RedirectRoute({from: 'company', to: 'about'}),
  // new RedirectRoute({from: 'u', to: 'users/user'})
]);

riot.router.start();