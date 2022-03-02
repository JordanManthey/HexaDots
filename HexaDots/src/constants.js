export const constants = {

  SCENES: {
    MENU: 'MENU',
    PLAY: 'PLAY'
  },

  IMAGES: {
    TITLE: 'title.png',
    BG: 'background.jpg',
    PLAY: 'play.png',
    DOT: 'dot.png',
    GAMEOVER: 'gameover.png',
    RESTART: 'restart.png',
    QUIT: 'quit.png'
  },

  COLORS: {
    RED: 0xD10003,
    ORANGE: 0xFF9C00,
    YELLOW: 0xFFFB00,
    BLUE: 0x0044FF,
    PURPLE: 0x8800FF,
    GREEN: 0x00C510,
    PINK: 0xFF4EF2,
    TURQUOISE: 0x14dba6
  },

  GAME_SETTINGS: {
    // Change game settings here.
    NUM_COLS: 8,
    NUM_ROWS: 6,
    NUM_COLORS: 8,
    TIME_LIMIT: 60, // In seconds.

    // Don't change below.
    EDGE_BUFFER: {
      X: 65,
      Y: 50
    },
    DOT_BUFFER: {
      X: 0,
      Y: 0
    }
  }
}
