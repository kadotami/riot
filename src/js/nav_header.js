riot.tag('nav-header', '<h2>site title</h2> <nav> <li each="{menu in this.menus}"><a href="{menu.url}">{menu.text}</a></li> </nav>', 'nav-header , [riot-tag="nav-header"] { position: fixed; display: block;; top: 0; width: 100%; height: 48px; background: #008844; } nav-header h2, [riot-tag="nav-header"] h2{ line-height: 48px; margin: 0; } nav-header nav, [riot-tag="nav-header"] nav{ position: absolute; right: 0; top: 0; line-height: 48px; } nav-header nav li, [riot-tag="nav-header"] nav li{ float: left; } nav-header nav:after, [riot-tag="nav-header"] nav:after{ content: ""; display: block; clear: both; }', function(opts) {
    this.menus = [
      {url :"/#/", text: "ホーム"}
    ]
  
});