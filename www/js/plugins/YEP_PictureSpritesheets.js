//=============================================================================
// Yanfly Engine Plugins - Picture Spritesheets
// YEP_PictureSpritesheets.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_PictureSpritesheets = true;

var Yanfly = Yanfly || {};
Yanfly.PicSS = Yanfly.PicSS || {};
Yanfly.PicSS.version = 1.00;

//=============================================================================
 /*:
 * @plugindesc v1.00 Another function from RPG Maker 2003 is back. You can now
 * use spritesheets in your pictures folder and change them to specific frames.
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * In RPG Maker 2003, pictures had the ability to load spritesheets and display
 * certain frames from them at the issue of a command. Ever since then, later
 * iterations of RPG Maker lacked the feature. This plugin will bring back that
 * old feature and give you access to use spritesheets as pictures once more
 * with complete frame control.
 *
 * ============================================================================
 * Instructions
 * ============================================================================
 *
 * When putting a spritesheet into your project's /img/pictures/ folder, you
 * have to name them a certain way.
 *
 *   filename[HxV]
 *
 * Replace H in the filename with the number of horizontal cells it has.
 * Replace V in the filename with the number of vertical cells it has.
 *
 * --- For example ---
 *
 * "Actor1_1(9x6)" will have 9 horizontal cells and 6 vertical cells.
 *
 * As long as the picture's filename is formatted in such a way, it will be
 * displayed in-game as a spritesheet.
 *
 * --- Frames ---
 * 
 * Individual frames can be displayed using Plugin Commands or Script Calls
 * (look in the later help sections to figure out how). To identify which frame
 * ID a particular spritesheet cell is, start with 0 in the upper left. The
 * frame ID increases as you go left to right, then it loops back around at the
 * start of a new row. For example:
 * 
 *  0  1  2  3  4  5  6  7  8
 *  9 10 11 12 13 14 15 16 17
 * 18 19 20 21 22 23 24 25 26
 * 27 28 29 30 31 32 33 34 35
 * 36 37 38 39 40 41 42 43 44
 * 45 46 47 48 49 50 51 52 53
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Using the Plugin Command event, you can set a specific picture to change to
 * a different cell by using the Plugin Command below:
 *
 * Plugin Commands:
 *
 *   Picture x Frame y
 *   - Replace 'x' with the ID of the picture you wish to change the frame of.
 *   - Replace 'y' with the frame ID to change the picture to.
 *
 * ============================================================================
 * Script Calls
 * ============================================================================
 *
 * For those who wish to use JavaScript code instead of Plugin Commands, you
 * can use the Script Call event command to do so:
 *
 *   var pictureId = 5;
 *   var frame = 10;
 *   $gameScreen.picture(pictureId).setSpritesheetFrame(frame);
 *
 * The above code will adjust the designated picture to change to desired frame
 * setting you would like.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.00:
 * - Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 */
//=============================================================================

//=============================================================================
// Game_Picture
//=============================================================================

Yanfly.PicSS.Game_Picture_initialize = Game_Picture.prototype.initialize;
Game_Picture.prototype.initialize = function() {
  Yanfly.PicSS.Game_Picture_initialize.call(this);
  this.initSpritesheetFrame();
};

Game_Picture.prototype.initSpritesheetFrame = function() {
  this._spritesheetFrame = 0;
};

Game_Picture.prototype.getSpritesheetFrame = function() {
  if (this._spritesheetFrame === undefined) this.initSpritesheetFrame();
  return this._spritesheetFrame;
};

Game_Picture.prototype.setSpritesheetFrame = function(value) {
  if (this._spritesheetFrame === undefined) this.initSpritesheetFrame();
  this._spritesheetFrame = value;
};

Yanfly.PicSS.Game_Picture_show = Game_Picture.prototype.show;
Game_Picture.prototype.show = function(name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
  Yanfly.PicSS.Game_Picture_show.call(this, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
  this.initSpritesheetFrame();
};

Yanfly.PicSS.Game_Picture_erase = Game_Picture.prototype.erase;
Game_Picture.prototype.erase = function() {
  Yanfly.PicSS.Game_Picture_erase.call(this);
  this.initSpritesheetFrame();
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.PicSS.Game_Interpreter_pluginCommand =
  Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.PicSS.Game_Interpreter_pluginCommand.call(this, command, args);
  var line = this._params[0];
  if (line.match(/Picture (\d+) Frame (\d+)/i)) {
    var pictureId = Number(RegExp.$1);
    var frame = Number(RegExp.$2);
    $gameScreen.picture(pictureId).setSpritesheetFrame(frame);
  }
};

//=============================================================================
// Sprite_Picture
//=============================================================================

Yanfly.PicSS.Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
Sprite_Picture.prototype.initialize = function(pictureId) {
  Yanfly.PicSS.Sprite_Picture_initialize.call(this, pictureId);
  this.initPictureSpritesheetSettings();
};

Sprite_Picture.prototype.initPictureSpritesheetSettings = function() {
  this._spritesheetHorzCells = 1;
  this._spritesheetVertCells = 1;
  this._lastSpritesheetFrame = -1;
};

Yanfly.PicSS.Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
Sprite_Picture.prototype.loadBitmap = function() {
  Yanfly.PicSS.Sprite_Picture_loadBitmap.call(this);
  this.initPictureSpritesheetSettings();
  this.setupPictureSpritesheetSettings();
  if (this.isSpritesheet()) {
    this.bitmap.addLoadListener(this.updateSpritesheetFrame.bind(this));
  } else {
    this.bitmap.addLoadListener(this.resetSpritesheetFrame.bind(this));
  }
};

Sprite_Picture.prototype.setupPictureSpritesheetSettings = function() {
  var name = this.picture().name();
  if (name && name.match(/\((\d+)x(\d+)\)/i)) {
    this._spritesheetHorzCells = Number(RegExp.$1);
    this._spritesheetVertCells = Number(RegExp.$2);
  }
};

Sprite_Picture.prototype.isSpritesheet = function() {
  return this._spritesheetHorzCells > 1 || this._spritesheetVertCells > 1;
};

Sprite_Picture.prototype.spritesheetFrame = function() {
  return this.picture().getSpritesheetFrame();
};

Sprite_Picture.prototype.updateSpritesheetFrame = function() {
  if (this._lastSpritesheetFrame === this.spritesheetFrame()) return;
  if (this.bitmap.width <= 0) return;
  this._lastSpritesheetFrame = this.spritesheetFrame();
  var pw = this.bitmap.width / this._spritesheetHorzCells;
  var ph = this.bitmap.height / this._spritesheetVertCells;
  var sx = this.spritesheetFrame() % this._spritesheetHorzCells * pw;
  var sy = Math.floor(this.spritesheetFrame() / this._spritesheetHorzCells) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_Picture.prototype.resetSpritesheetFrame = function() {
  this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
};

Yanfly.PicSS.Sprite_Picture_update = Sprite_Picture.prototype.update;
Sprite_Picture.prototype.update = function() {
  Yanfly.PicSS.Sprite_Picture_update.call(this);
  if (this.isSpritesheet()) this.updateSpritesheetFrame();
};

//=============================================================================
// End of File
//=============================================================================