<template>
  <div class="rules">
    <div class="card animateSlideUp">
      <div class="card-content">
        <h1>Frequently Asked Questions</h1>

        <h3>Do I need a Minecraft account to play on Drustcraft?</h3>
        <p>
          Yes! You will require a paid Minecraft account in order to connect to
          Drustcraft. You can get an official Minecraft account from
          <a href="https://minecraft.net">minecraft.net</a>
        </p>

        <h3>Is it free to play on the Drustcraft server?</h3>
        <p>
          Yes! We do not charge any subscription or access fees for players on
          our servers
        </p>

        <h3>What is Java and Bedrock Minecraft?</h3>
        <p>
          Java Minecraft is the version of Minecraft that you purchase directly
          from <a href="https://minecraft.net">minecraft.net</a> for your Mac or
          PC
        </p>
        <p>
          Bedrock Minecraft is the version of Minecraft that you purchase from
          an online App store such as the Microsoft Online Store or the Apple
          App Store
        </p>

        <h3>I can't connect to the server</h3>
        <p>
          We currently only support Java and Bedrock clients, however there are
          workarounds for XBox and Playstation. You will need to look online how
          to set these versions up.
        </p>
        <p>
          Minecraft Education does not allow connecting to third party servers,
          sorry.
        </p>
        <p>
          If for some reason you are having problems with using
          <strong>play.drustcraft.com.au</strong> as the server name, try:
        </p>
        <ul style="dash">
          <li><strong>Java:</strong> 119.252.189.5:26963</li>
          <li><strong>Bedrock:</strong> Address: 119.252.189.5 Port: 19132</li>
        </ul>

        <h3>How safe is it to let my child on your server?</h3>
        <p>
          Playing online is never 100% safe, however we do try our best to
          create a safe and enjoyable environment for our players by:
        </p>
        <ul class="dash">
          <li>
            Monitoring, filtering and logging player chat and activity in-game
          </li>
          <li>
            Strictly enforcing the no sharing of personal details across the
            Drustcraft platforms
          </li>
          <li>
            All staff accounts are required to adhere to the
            <a href="http://bluecard.qld.gov.au"
              >Queensland Working with Check BlueCard</a
            >
          </li>
          <li>We do not require personal information to sign up as a player</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
h3 {
  margin-top: 2rem;
}

p,
ul {
  margin-left: 1rem;
}

ul.dash {
  list-style-type: none;

  li {
    text-indent: -5px;
    margin-left: 2rem;

    &:before {
      content: "- ";
      text-indent: -5px;
    }
  }
}
</style>
