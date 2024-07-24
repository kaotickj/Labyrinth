//-----------------------------------------------------------------------------
//  Galv's Animated Menu Cursor
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_CursorImage.js
//-----------------------------------------------------------------------------
//  2019-03-13 - Version 1.8 - fixed issue with battle actor window no cursor
//  2017-04-02 - Version 1.7 - added ability to hide/unhide cursor
//  2016-08-10 - Version 1.6 - updated to work with MV version 1.3
//  2016-07-10 - Version 1.5 - hid cursor in yanfly battle status window
//  2016-06-13 - Version 1.4 - removed cursor in shop plugins item number box
//  2016-06-11 - Version 1.3 - fixed indent for default battle actor name
//                           - removed cursor from number input
//  2016-05-12 - Version 1.2 - cursor image added to 'dont exclude' file list
//  2016-04-11 - Version 1.1 - fixed display bug for initially inactive windows
//  2016-04-02 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_CursorImage = true;

var Galv = Galv || {};          // Galv's main object
Galv.pCmd = Galv.pCmd || {};    // Plugin Command manager
Galv.CI = Galv.CI || {};        // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.8) Display an animated image next to the selected menu command.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Cursor Image
 * @desc Image filename located in /img/system/ folder.
 * @default WindowCursor
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param Image Frames
 * @desc How many frames are in your cursor animation
 * @default 4
 *
 * @param Position Centered
 * @desc true or false if Image cursor is centered vertically to the command or not.
 * @default true
 *
 * @param Position Offset
 * @desc x,y - to reposition the cursor next to the active command in your menus
 * @default 0,0
 *
 * @param Animation Speed
 * @desc Speed that the animation plays each frame. Lower numbers mean faster animation speed.
 * @default 6
 *
 * @param Command Indent
 * @desc Indent commands in menus to make room for the cursor if required
 * @default 0
 *
 * @param Item Indent
 * @desc Indent items and skills in menus to make room for the cursor if required
 * @default 0
 *
 * @param Start Hidden
 * @desc Start the cursor hidden (invisible) on game load
 * true or false
 * @default false
 *
 * @help
 *   Galv's Animated Menu Cursor
 * ----------------------------------------------------------------------------
 * Make sure the cursor image is located in /img/system/ folder in your
 * project and the plugin settings are setup as required.
 *
 * Any size image can be used as long as the width is divisible by the number
 * of frames set in the "Image Frames" plugin setting.
 *
 * ----------------------------------------------------------------------------
 *    SCRIPT CALLS
 * ----------------------------------------------------------------------------
 *
 *     $gameSystem._cursorHidden = true;      // hide cursor
 *     $gameSystem._cursorHidden = false;     // show cursor
 */



//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

Galv.CI.initHidden = PluginManager.parameters('Galv_CursorImage')["Start Hidden"].toLowerCase() === 'true' ? true : false;

Galv.CI.image = PluginManager.parameters('Galv_CursorImage')["Cursor Image"];
Galv.CI.frames = Number(PluginManager.parameters('Galv_CursorImage')["Image Frames"]);
Galv.CI.animSpeed = Number(PluginManager.parameters('Galv_CursorImage')["Animation Speed"]);
Galv.CI.center = PluginManager.parameters('Galv_CursorImage')["Position Centered"].toLowerCase() == 'true' ? true : false;
Galv.CI.cIndent = Number(PluginManager.parameters('Galv_CursorImage')["Command Indent"]);
Galv.CI.iIndent = Number(PluginManager.parameters('Galv_CursorImage')["Item Indent"]);
var tmp = PluginManager.parameters('Galv_CursorImage')["Position Offset"].split(",");
Galv.CI.offset = {x: Number(tmp[0]), y: Number(tmp[1])};
tmp = null;

// Pre Cache
//-----------------------------------------------------------------------------

Galv.CI.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
	Galv.CI.Scene_Boot_loadSystemImages.call(this);
    ImageManager.loadSystem(Galv.CI.image);
};


// Window Stuff
//-----------------------------------------------------------------------------

Galv.CI.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.CI.Game_System_initialize.call(this);
	this._cursorHidden = Galv.CI.initHidden;
};


// Window Stuff
//-----------------------------------------------------------------------------

Galv.CI.Window_Selectable_initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(x, y, width, height) {
	Galv.CI.Window_Selectable_initialize.call(this,x,y,width,height);
	this.createGalvCursor();
};

Window_NumberInput.prototype.createGalvCursor = function() {
};

Window_ShopNumber.prototype.createGalvCursor = function() {
};

Window_BattleStatus.prototype.createGalvCursor = function() {
};



Galv.CI.Window_BattleStatus_drawActorName = Window_BattleStatus.prototype.drawActorName;
Window_BattleStatus.prototype.drawActorName = function(actor, x, y, width) {
	x += Galv.CI.iIndent;
	Galv.CI.Window_BattleStatus_drawActorName.call(this,actor,x,y,width);
};

Window_Selectable.prototype.createGalvCursor = function() {
	this._galvCursor = new Sprite_GalvCursor(this);
	this.addChild(this._galvCursor);
};

Window_BattleActor.prototype.createGalvCursor = Window_Selectable.prototype.createGalvCursor;

Galv.CI.Window_Command_textPadding = Window_Command.prototype.textPadding;
Window_Command.prototype.textPadding = function() {
    return Galv.CI.Window_Command_textPadding.call(this) + Galv.CI.cIndent;
};

Galv.CI.Window_EquipSlot_drawText = Window_EquipSlot.prototype.drawText;
Window_EquipSlot.prototype.drawText = function(text, x, y, maxWidth, align) {
	x += Galv.CI.iIndent;
	Galv.CI.Window_EquipSlot_drawText.call(this,text,x,y,maxWidth,align);
};

Galv.CI.Window_Selectable_drawItemName = Window_Selectable.prototype.drawItemName;
Window_Selectable.prototype.drawItemName = function(item, x, y, width) {
	x += Galv.CI.iIndent;
	Galv.CI.Window_Selectable_drawItemName.call(this,item,x,y,width);
};

Galv.CI.Window_EquipSlot_drawIcon = Window_EquipSlot.prototype.drawIcon;
Window_EquipSlot.prototype.drawIcon = function(iconIndex, x, y) {
	x += Galv.CI.iIndent;
    Galv.CI.Window_EquipSlot_drawIcon.call(this,iconIndex, x, y);
};



// Sprite_GalvCursor
//-----------------------------------------------------------------------------

function Sprite_GalvCursor() {
    this.initialize.apply(this, arguments);
}

Sprite_GalvCursor.prototype = Object.create(Sprite_Base.prototype);
Sprite_GalvCursor.prototype.constructor = Sprite_GalvCursor;

Sprite_GalvCursor.prototype.initialize = function(window) {
    Sprite_Base.prototype.initialize.call(this);
	this._window = window;
	this.createImage();
	this._ticker = 0;
	this._pattern = 0;
	this.updateFrame();
};

Sprite_GalvCursor.prototype.createImage = function() {
	this.bitmap = ImageManager.loadSystem(Galv.CI.image);
	this._frameWidth = this.bitmap.width / Galv.CI.frames;
	this._frameHeight = this.bitmap.height;
	this._maxPattern = Galv.CI.frames - 1;
	this._tickSpeed = Galv.CI.animSpeed;
	this.anchor.y = 0.5;
	this.opacity = 0;
};

Sprite_GalvCursor.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	if (this._window.isCursorVisible() && !$gameSystem._cursorHidden) {
		this.opacity = this._window.openness >= 255 ? 255 : 0;
		if (this._window.active) this.updateFrame();
		this.updatePosition();
	} else {
		this.opacity = 0;
	};
};

Sprite_GalvCursor.prototype.updateFrame = function() {
    var pw = this._frameWidth;
    var ph = this._frameHeight;
    var sx = this._pattern * pw;
	this.setFrame(sx, 0, pw, ph);
	
	this._ticker += 1;
	if (this._ticker >= this._tickSpeed) {
		this._pattern = this._pattern == this._maxPattern ? 0 : this._pattern + 1;
		this._ticker = 0;
	};
};

Sprite_GalvCursor.prototype.updatePosition = function() {
	var rect = this._window._cursorRect;
	this.y = rect.y + Galv.CI.offset.y + this._window.standardPadding() + this.yPos(rect.height);
	this.x = rect.x + Galv.CI.offset.x;
};


if (Galv.CI.center) {
	Sprite_GalvCursor.prototype.yPos = function(height) {
		return height / 2;
	};
} else {
	Sprite_GalvCursor.prototype.yPos = function(height) {
		return 0;
	};
};

})();