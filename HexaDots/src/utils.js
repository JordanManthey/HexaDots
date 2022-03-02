import { constants } from './constants';

// Returns a random dot color (hex value)
export function getRandomColor() {
  let colorHexList = Object.values(constants.COLORS);
  let randomIndex = Math.floor(Math.random() * constants.GAME_SETTINGS.NUM_COLORS);
  let colorHexValue = colorHexList[randomIndex];
  return colorHexValue;
}

// loads all images from the provided folder.
export function loadImages(scene, folder) {
  scene.load.setPath(`assets/${folder}`);

  for (let key in constants.IMAGES) {
    scene.load.image(constants.IMAGES[key], constants.IMAGES[key]);
  }
}

// Create a coordinate obj for easier grid manipulation.
export function getCoordinatesObj(col, row) {
  let coordinatesObj = {
    col: col,
    row: row
  };
  return coordinatesObj;
}
