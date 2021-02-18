<template>
  <div class="statusbar">
    <div class="statusbar-left">
      <h4><i class="fas fa-users" aria-hidden="true"></i> {{ players }}</h4>
      <p><small>What are you waiting for?</small></p>
    </div>
    <div class="statusbar-right">
      <h4>
        <a href="#" @click="copyText">{{ address }} <i class="fas fa-copy" aria-hidden="true"></i></a>
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
    }
  },
  methods: {
    copyText() {
      var range
      if (document.selection) {
        // IE
        range = document.body.createTextRange()
        range.moveToElementText(this.$refs)
        range.select()
      } else if (window.getSelection) {
        range = document.createRange()
        range.selectNode(this.$refs)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }

      document.execCommand('copy')

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
    fetch('http://drustcraftq.test/api/status')
      .then(response => response.json())
      .then(data => {
        this.players = data['players']
      })
  },
}
</script>

<style></style>
