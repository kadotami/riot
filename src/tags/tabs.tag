<riot-tabs>
  <h2>Tabs</h2>
  <ul>
    <li each={ tab, i in tabs } class={ tabItem: true }>{tab.title}</li>
  </ul>
  <div class="tabContent">
    <div class={ tabContent__item: true }>(1) Lorem ispum dolor...</div>
    <div class={ tabContent__item: true }>(2) Lorem ispum dolor...</div>
    <div class={ tabContent__item: true }>(3) Lorem ispum dolor...</div>
  </div>

  this.tabs = [
    { title: 'Tab 1' },
    { title: 'Tab 2' },
    { title: 'Tab 3' }
  ]

  <style>
  </style>
  <scfipt type="es6">
  </script>
</riot-tabs>