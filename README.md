# SteamScaner
<h2>Application for scaning Steam accounts using Steam API</h2>
<article>
  <header>
    <h3>How it works?</h3>
  </header>
  <section>
    <h3>Detail info</h3>
    <section>
      The  server asynchronously gather information using Steam web api and send it to the client, where Angularjs catch these information and calculate the score.
      Current score formula is: TotalScore = player_xp/player_lvl + ((GameCount + TotalHoursPlayed + AchievementsPerGame)*HoursPerGame)
    </section>
  
    <ul>
      <li>Find two user profiles in Steam</li>
      <li>Copy his URLs to the fields</li>
      <li>Click the "Fight" button</li>
    </ul>
    <p>TA-DA!</p>
    <img src = "src/media/img/big pic.png" alt="result"/>
  </section>
</article>
