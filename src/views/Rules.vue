<template>
  <div class="container">
    <h1>Minecraft Server Rules</h1>
    <p>
      The Minecraft Server rules are in addition to the
      <router-link to="/terms">Terms of Use</router-link> agreement when playing
      on the Drustcraft Minecraft server.
    </p>

    <h3>1. Spam</h3>
    <div class="track">
      ( Warning -> 30m Mute -> 1d Mute -> 7d Mute -> Permanent Mute )
    </div>
    <p>Repeating the same phrase multiple times.</p>

    <h3>2. Command Spam</h3>
    <div class="track">
      ( Warning -> Kick -> 1d Ban -> 7d Ban -> Permanent Ban )
    </div>
    <p>
      Repeating the same command multiple times. This does not apply to the
      /builder or world editing commands.
    </p>

    <h3>3. Inappropriate language</h3>
    <div class="track">
      ( Warning -> 30m Mute -> 1d Mute -> 7d Mute -> Permanent Mute )
    </div>
    <p>Bypassing the swear filter or making sexual comments and phrases.</p>

    <h3>4. Hate Speech</h3>
    <div class="track">( 30d Ban -> Permanent Ban )</div>
    <p>
      This includes any type of racism or homophobia. Casual slang such as 'gay'
      will not be punished for unless clearly being used to offend or attack.
    </p>

    <h3>5. Harassment/Personal Attacks</h3>
    <div class="track">( 1d Mute -> 7d Ban -> 30d Ban -> Permanent Ban )</div>
    <p>Intentional harassment or attacks of another player.</p>

    <h3>6. Death, DDos, Dox, and SWAT Threats</h3>
    <div class="track">( Permanent Ban )</div>
    <p>
      Anything containing a direct serious threat to someone’s safety, wellbeing
      or privacy can be classified as death / ddos / dox / swat threats.
    </p>

    <h3>7. Releasing personal information</h3>
    <div class="track">( Permanent Ban )</div>
    <p>
      Releasing any kind of personal information about others. This may be full
      names, phone numbers, addresses or anything of the like.
    </p>

    <h3>8. Impersonation</h3>
    <div class="track">( Permanent Ban )</div>
    <p>
      When a player is attempting to impersonate another player or a staff
      member through /nick or any other method.
    </p>

    <h3>9. Advertising</h3>
    <div class="track">
      ( Warning -> 30m Mute -> 1d Ban -> 7d Ban -> 30d Ban -> Permanent Ban )
    </div>
    <p>
      When a player is advertising IPs or other server address to the server or
      their personal social media without permission. This does not include
      mentioning a server name.
    </p>

    <h3>9. Hackusating</h3>
    <div class="track">
      ( Warning -> 30m Mute -> 3h Mute -> 12h Mute -> 7d Mute )
    </div>
    <p>
      This is when a player is accusing another player of hacking in public chat
      instead of reporting it.
    </p>

    <h3>10. Inappropriate Name or Skin</h3>
    <div class="track">( Permanent ban until changed )</div>
    <p>
      Having a name or skin that does not follow one or more of our rules, such
      as swearing, nudity or offensive language. [Appeal when changed to be
      unbanned]
    </p>

    <h3>11. Third Party Trades</h3>
    <div class="track">( 7d Ban -> Permanent Ban )</div>
    <p>
      Offering or trading or requesting any items outside of Drustcraft or money
      for a service in game.
    </p>

    <h3>12. Hacked Client/Disallowed Modifications</h3>
    <div class="track">( 30d Ban -> Permanent Ban )</div>
    <p>
      Make sure to check out the page
      <router-link to="mods">Allowed and Disallowed Mods</router-link>.
    </p>

    <h3>13. Macros/Scripts</h3>
    <div class="track">( Kick -> 7d Ban -> Permanent Ban )</div>
    <p>
      Anything that loops commands or automatically performs tasks for you
      without having to do anything is prohibited. This includes external
      programs or first party interference such as weighting your keyboard or
      mouse.
    </p>

    <h3>14. Exploiting/Abusing a plugin</h3>
    <div class="track">( Permanent Ban )</div>
    <p>
      Using a bug to for example duplicate gear/items, anything that would give
      you an unfair advantage, is considered exploiting. If you stumble upon
      something that you think is an exploit, contact an administrator so it can
      be fixed as soon as possible. The above punishment length tree is most
      likely to change depending on the severity of your offense. The severity
      of the bug determines the length of your ban. Typically we generously
      reward players who report game-breaking bugs.
    </p>

    <h3>15. Ban/Mute Evading</h3>
    <div class="track">( Permanent Ban )</div>
    <p>Evading a Ban or Mute punishment by using an Alt account.</p>
  </div>
</template>

<style lang="scss">
.track {
  color: rgb(184, 49, 47);
}
</style>
