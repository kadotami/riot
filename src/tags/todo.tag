<todo>

  <h3>do</h3>


  <form onsubmit={ add }>
    <input name="input" onkeyup={ edit }>
    <button disabled={ !text }>Add</button>
  </form>

  <ul>
    <li each={ items }>
      <label class={ completed: done }>
        <input type="checkbox" checked={ done } onclick={ parent.toggle }> { title }
      </label>
    </li>
  </ul>

  <script>
    this.disabled = true;

    this.items = opts.items;

    if(this.items===undefined) {
      this.items = []
    }

    this.edit = function(e) {
      this.text = e.target.value
    }
    this.add = function(e) {
      if (this.text) {
        this.items.push({ title: this.text })
        this.text = this.input.value = ''
      }
    }

    this.toggle = function (e) {
      var item = e.item
      item.done = !item.done
      return true
    }
  </script>

</todo>
