<nav-header>
  <h2>site title</h2>
  <nav>
    <li each={menu in this.menus}><a href={menu.url}>{menu.text}</a></li>
  </nav>

  <style scoped>
    :scope {
      position: fixed;
      display: block;;
      top: 0;
      width: 100%;
      height: 48px;
      background: #008844;
    }
    h2 {
      line-height: 48px;
      margin: 0;
    }
    nav {
      position: absolute;
      right: 0;
      top: 0;
      line-height: 48px;
    }
    nav li {
      float: left;
    }
    nav:after {
      content: "";
      display: block;
      clear: both;
    }
  </style>

  <script>
    this.menus = [
      {url :"/#/", text: "ホーム"}
    ]
  </script>
</nav-header>