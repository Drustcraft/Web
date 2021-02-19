<template>
  <div class="statusbar">
    <div class="statusbar-left">
      <h4><i class="fas fa-users" aria-hidden="true"></i> {{ players }} Currently Playing</h4>
      <p><small>What are you waiting for?</small></p>
    </div>
    <div class="statusbar-right">
      <h4>
        <a href="#" @click="copyAddress"
          ><span>{{ address }}</span> <i class="fas fa-copy" aria-hidden="true"></i
        ></a>
      </h4>
      <p><small>Click to copy address</small></p>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      players: 0,
      address: '',
    }
  },
  methods: {
    copyAddress() {
      const textarea = document.createElement('textarea')

      textarea.value = this.address
      textarea.setAttribute('readonly', '')
      textarea.style.cssText = 'position:fixed;pointer-events:none;z-index:-9999;opacity:0;'

      document.body.appendChild(textarea)

      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        textarea.contentEditable = true
        textarea.readOnly = true

        const range = document.createRange()

        range.selectNodeContents(textarea)

        const selection = window.getSelection()

        selection.removeAllRanges()
        selection.addRange(range)
        textarea.setSelectionRange(0, 999999)
      } else {
        textarea.select()
      }

      let success = false

      try {
        success = document.execCommand('copy')
      } catch (err) {
        console.warn(err)
      }

      document.body.removeChild(textarea)

      var copyStatusElem = document.querySelector('.statusbar-right p small')
      if (copyStatusElem) {
        var prevMessage = copyStatusElem.innerHTML
        var newMsg = 'Copied!'
        copyStatusElem.innerHTML = newMsg

        window.setTimeout(function () {
          copyStatusElem = document.querySelector('.statusbar-right p small')
          if (copyStatusElem && copyStatusElem.innerHTML == newMsg) {
            copyStatusElem.innerHTML = prevMessage
          }
        }, 5000)
      }
    },
  },
  created: function () {
    var self = this

    this.$root.fetch('status', null, function (data) {
      if (data != null) {
        self.players = data['players']
      }
    })
  },
}
</script>

<style lang="scss">
.statusbar {
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 0.5rem 1rem;
  color: #ccc;

  .statusbar-left {
    flex: 50%;
  }

  .statusbar-right {
    flex: 50%;
    text-align: right;
  }

  i {
    margin: 0 0.5rem;
  }

  h4,
  h4 a {
    color: #efba4d;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 0;
  }

  p {
    margin: 0 0.5rem;
  }
}
</style>
