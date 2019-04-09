# TWO DUCKS IN A TRENCHCOAT

Rachel Lim and August Luhrs <br>
for Collective Play <br>
ITP Spring 2019 -- Mimi Yin <br>


Link to game: https://two-ducks.glitch.me/

Link to Screen: https://two-ducks.glitch.me/screen/
<!-- ## ===============
## Class Guide 3/25 -->

===============
Questions/Issues 3/25

- Seems like we would need to totally overhaul the scroll system to make it work on the server, sending the arrays to the partners instead of having them locally different
- probably would want to set the first duck in each room as a leader, and only have them send the events (to prevent double events when updating scroll arrays and scores)
- lots of tiny bugs that wouldn't theoretically come up in real group game, but annoying when testing
- lean stuff annoying... not a reliable source of values (should re look)
- needs to reset the scroll arrays on reset, if not can get stuck on poop.
- shouldn't have tried to do the chat room implementation before getting game to work, my bad (August)
- interesting stuff brought up in class:
  - what if each duck saw different thing intentionally, i.e. one sees cake and one sees poop
  







===============
Notes 3/21

### To do (roughly):
- Get the rotation stuff working (will hopefully work with Mimi's sketch)
- get the game graphics
- make the actual game (scrolling, score, fail, restart, etc).
- design elements (feedback, text, etc)
- get the chat room stuff working (or abandon that and just stick to
two local players)
- if we can get chat room pairing working, then have a leaderboard screen.



=================

August Notes 3/19
- going to move input/output to one screen so they just open the app and it's auto all there.
  - on connect, we'll have them put their name, and then use the chat room example to auto-sort them
  - then we'll list their names at the bottom so they know who's on their team
  - and have a three second countdown before each round starts
- then if we want we can have a "leaderboard" screen that will list the top scores of each team
- graphics
  - It would be great if the sprite they're controlling looked like a lumpy trenchcoat with duck feet 
  - what scene should they be trying to navigate? what is their goal? they're in a bakery? should there be items they can pick up to boost their score? maybe they're trying to pass as a bakery inspector and collect as much bread as possible, but if they run into any of the bakers running around, then they get knocked over, lose all their bread, and their cover is blown.
  


=================

Brainstorm 3/15
- Two players, one axis 
- One blind?	 No b/c leader and follower
- Non-verbal, just have to figure out how to move as one
- Arcade style elements moving down screen, getting fast as time goes on and they rack up more points


