# Solo Star Miner - Tool for Solo Shooting Star Miners [OSRS]
Live at https://www.tomexlol.com/ssm/
### Context: What are Shooting Stars in Old School Runescape?

Shooting Stars are an activity in Old School Runescape in which a meteor falls from the sky approximately every two hours across every in-game server ("World"). 
These appear as Crashed Stars that can be mined.

Players can use a telescope to find the approximate area and time of the next landing.

Clicking the Crashed Star one time will make your character mine it for up to 25 minutes without any further clicks.

A decently sized star can last a single player around 2 to 3 hours worth of Mining. This means that, if you find a good Solo Star, you can train your Mining skill for around 3 hours while clicking under 10 times.

This makes Shooting Stars an ideal "background activity", very doable as you work, study, or watch a movie.

### The issue: Star Miners community

There's a community of people dedicated to ruining this aspect of the activity completely. This community scouts most Worlds for their next star's location and they share all the scouted locations publically.

This means the stars that have been scouted by them are mined by a ton of people at once, which makes it so that as a Solo Miner you have to find a new star, and thus pay attention to the game, every 10 minutes instead of three hours - completely robbing your attention away from your primary activity.

### The Solution: Solo Star Miner
Solo Star Miner was created as a tool to help you dodge this community and mine in peace, solo.

Using the Sheets API, it grabs the list of Worlds they scouted and it cross references against this list as you scout your own Worlds.

**Features:**
- Any of your self scouted Worlds that match the community list are dynamically highlighted in Red so you can remove them.
  - Also warns you dynamically when the value of World in the input is in the community list so you don't waste time scouting that World.

- Landing Times are automatically calculated from the input data and refreshed every minute. 
  - "Scouted Worlds" also refreshes every minute automatically, although the API only populates new data every 5m. New matches are auto highlighted as well on every update.

- Stars that have already landed (Minutes Until <= 0) are marked in Green as Landed Stars.

- Table is fully sortable.

- Table data is stored in localStorage to conserve Star data between sessions.
