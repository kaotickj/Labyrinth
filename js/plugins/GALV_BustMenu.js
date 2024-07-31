//-----------------------------------------------------------------------------
//  Galv's Bust Menu
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_BustMenu.js
//-----------------------------------------------------------------------------
//  2019-08-09 - Version 1.8 - added fix for busts not loading in MV updated
//                             projects when lots of actors
//  2016-03-28 - Version 1.7 - added ability to disable certain info with -1
//  2016-02-12 - Version 1.6 - Added nickname, made changable actor display no.
//  2016-01-12 - Version 1.5 - Fixed MAX level and EXP bar issue.
//                           - compatibility: Rocketmancers prettier gauges
//  2015-11-21 - Version 1.4 - fixed tiny JP alignment issue
//  2015-11-21 - Version 1.3 - added compatiblity for Yanfly's JobPoints
//  2015-11-19 - Version 1.2 - fixed issue with drawing single character bust
//  2015-11-08 - Version 1.1 - added EXP bar and settings
//  2015-11-07 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_BustMenu = true;

var Galv = Galv || {};        // Galv's main object
Galv.BM = Galv.BM || {};      // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Changes the default actor layout in the main menu to use
 * vertical "bust" or portrait graphics from /img/pictures/
 * @author Galv - galvs-scripts.com
 *
 * @param Menu Actors
 * @desc Number of actors that appear in the menu before scrolling (can be changed in-game)
 * @default 3
 *
 * @param Menu Actor Rows
 * @desc Number of rows of actors (cannot be changed in-game). You will need to change settings below to fit
 * @default 1
 *
 * @param Name
 * @desc Line number of actor's name
 * -1 to not display
 * @default 1
 *
 * @param Nickname
 * @desc Line number of actor's name
 * -1 to not display
 * @default 0
 *
 * @param Class
 * @desc Line number of actor's class
 * -1 to not display
 * @default 2
 *
 * @param Level
 * @desc Line number of actor's level
 * -1 to not display
 * @default 3
 *
 * @param States
 * @desc Line number of actor's state icons
 * -1 to not display
 * @default 13
 *
 * @param Bars
 * @desc Line number of actor's hp/mp bars
 * -1 to not display
 * @default 14
 *
 * @param Show Exp Bar
 * @desc Can be true or false to display exp bar or not
 * @default true
 *
 * @param Exp Bar
 * @desc Line number of actor's EXP bar
 * -1 to not display
 * @default 4
 *
 * @param JP
 * @desc Line number of actor's JP (If Yanfly's JobPoints is installed)
 * -1 to not display
 * @default 2
 *
 * @param Exp Bar Height
 * @desc Height of the EXP bar in pixels
 * @default 10
 *
 * @param Show Exp Text
 * @desc Can be true or false to display exp text on the bar or not
 * @default true
 *
 * @param Exp Text
 * @desc Text displayed before the exp-till-next-level number
 * @default Next
 *
 * @param Max Exp Text
 * @desc When actor reaches maximum level, this text is displayed on exp bar
 * @default Max
 *
 * @param Exp Bar Color 1
 * @desc Uses text color numbers from windowskin file. Will gradient into color 2
 * @default 0
 *
 * @param Exp Bar Color 2
 * @desc Uses text color numbers from windowskin file. Will gradient into color 1
 * @default 8
 *
 * @param Bust Y
 * @desc Y position of the bust image in pixels
 * @default 100
 *
 * @param Bust Height
 * @desc Height of the bust image in pixels
 * @default 360
 *
 * @param -----------
 * @desc
 *
 * @default
 *
 * @param Bust Offsets
 * @desc See the help section for how to use this.
 * @default
 *
 * @help
 *   Galv's Bust Menu
 * ----------------------------------------------------------------------------
 * This plugin changes the layout of actors in the main menu. The plugin
 * includes settings that allow you to change the positioning of the actor
 * data (such as name, level, hp, image, etc.) including how many actors will
 * appear on the menu screen. (NOTE: 1 actor is not working)
 *
 * The plugin displays bust images from /img/pictures/ folder based on the
 * actor's face.  For example:
 * If an actor uses the 2nd face from the "Actor1" faces file, then the bust
 * will instead use /img/pictures/Actor1_2.png bust image.
 *
 * ----------------------------------------------------------------------------
 *   Bust Offsets (Scroll down the plugin settings to find this)
 * ----------------------------------------------------------------------------
 * Bust images are centered in the actor positions, but sometimes the bust
 * images are not centered themselves. This setting is used to tweak the x,y
 * position of busts if required.
 * To add an x,y offset to busts, add data to this setting as below:
 *
 *     bustImageName_1,x,y|bustImageName_2,x,y|bustImageName_3,x,y
 *
 * Each image and data are separated by a pipe (the "|" symbol). For example:
 * Actor1_2,-10,0|Actor1_5,20,5
 * The Actor1_2.png bust will be offset 10 pixels to the left
 * The Actor1_5.png bust will be offset 20 pixels to the right, 5 pixels down
 * ----------------------------------------------------------------------------
 *   SCRIPT CALL
 * ----------------------------------------------------------------------------
 * $gameParty._bustActorCount = x;        // x is number of actors to display
 * ----------------------------------------------------------------------------
 */


//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {	

Galv.BM.a = Number(PluginManager.parameters('Galv_BustMenu')["Menu Actors"]);
Galv.BM.ar = Number(PluginManager.parameters('Galv_BustMenu')["Menu Actor Rows"]);
Galv.BM.name = Number(PluginManager.parameters('Galv_BustMenu')["Name"] - 1);
Galv.BM.nickname = Number(PluginManager.parameters('Galv_BustMenu')["Nickname"] - 1);
Galv.BM.class = Number(PluginManager.parameters('Galv_BustMenu')["Class"] - 1);
Galv.BM.level = Number(PluginManager.parameters('Galv_BustMenu')["Level"] - 1);
Galv.BM.bars = Number(PluginManager.parameters('Galv_BustMenu')["Bars"] - 1);
Galv.BM.JP = Number(PluginManager.parameters('Galv_BustMenu')["JP"] - 1);
Galv.BM.xp = Number(PluginManager.parameters('Galv_BustMenu')["Exp Bar"] - 1);
Galv.BM.xpBar = PluginManager.parameters('Galv_BustMenu')["Show Exp Bar"] == "true" ? true : false;
Galv.BM.xpText = PluginManager.parameters('Galv_BustMenu')["Show Exp Text"] == "true" ? true : false;
Galv.BM.xpLabel = PluginManager.parameters('Galv_BustMenu')["Exp Text"];
Galv.BM.xpHeight = PluginManager.parameters('Galv_BustMenu')["Exp Bar Height"];
Galv.BM.maxTxt = PluginManager.parameters('Galv_BustMenu')["Max Exp Text"];

Galv.BM.xpCol1 = Number(PluginManager.parameters('Galv_BustMenu')["Exp Bar Color 1"]);
Galv.BM.xpCol2 = Number(PluginManager.parameters('Galv_BustMenu')["Exp Bar Color 2"]);
Galv.BM.icons = Number(PluginManager.parameters('Galv_BustMenu')["States"] - 1);
Galv.BM.bust = Number(PluginManager.parameters('Galv_BustMenu')["Bust Y"]);
Galv.BM.bustHeight = Number(PluginManager.parameters('Galv_BustMenu')["Bust Height"]);
Galv.BM.offsets = function() {
	var array = PluginManager.parameters('Galv_BustMenu')["Bust Offsets"].split("|");
	var obj = {};
	for (i = 0; i < array.length; i++) {
		if (array[i]) {
			var data = array[i].split(",");
			obj[data[0]] = [Number(data[1]),Number(data[2])];
		};
	};
	return obj;
}();

//------------------------------------------------------------
// COMPATIBILITY WITH ROCKETMANCER'S PRETTIER GAUGES


if (PluginManager.parameters('PrettyGauges') && Object.keys(PluginManager.parameters('PrettyGauges')).length > 0) {
	Galv.BM.rmplugin = true;
};
//------------------------------------------------------------


var Galv_Game_Party_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    Galv_Game_Party_initialize.call(this);
    this._bustActorCount = Galv.BM.a;
};


// OVERWRITE
Window_MenuStatus.prototype.numVisibleRows = function() {return Galv.BM.ar};
Window_MenuStatus.prototype.maxCols = function() {return $gameParty._bustActorCount};
Window_Selectable.prototype.spacing = function() {return 0};

Window_MenuStatus.prototype.drawItemStatus = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    var x = rect.x;
    var y = rect.y;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};


var Galv_Window_MenuStatus_update = Window_MenuStatus.prototype.update;
Window_MenuStatus.prototype.update = function() {
	Galv_Window_MenuStatus_update.call(this);
	
	// Added as a check if bust bitmaps don't load from cache, refresh again to draw loaded bitmap.
	if (this._galvRefresh) {
		this._galvRefresh = false;
		this.refresh();
	}
};

// OVERWRITE
Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
	var width = this.bustWidth();
	
	var x = x + 5;
    var width2 = Math.max(100, width - this.textPadding()) - 5;
	if (Galv.BM.xp > -1) this.drawActorEXP(actor,x,y + lineHeight * Galv.BM.xp,width2)
    if (Galv.BM.name > -1) this.drawActorName(actor, x, y + lineHeight * Galv.BM.name);
	if (Galv.BM.nickname > -1) this.drawActorNickname(actor, x, y + lineHeight * Galv.BM.nickname);
    if (Galv.BM.level > -1) this.drawActorLevel(actor, x, y + lineHeight * Galv.BM.level);
    if (Galv.BM.icons > -1) this.drawActorIcons(actor, x, y + lineHeight * Galv.BM.icons);
    if (Galv.BM.class > -1) this.drawActorClass(actor, x, y + lineHeight * Galv.BM.class, width2);
	if (Galv.BM.bars > -1) {
		this.drawActorHp(actor, x, y + lineHeight * Galv.BM.bars, width2);
		this.drawActorMp(actor, x, y + lineHeight * (Galv.BM.bars + 1), width2);
		if (Imported.YEP_CoreEngine && eval(Yanfly.Param.MenuTpGauge)) {
			this.drawActorTp(actor, x, y + lineHeight * (Galv.BM.bars + 2), width2);
		}
	};
	if (Imported.YEP_JobPoints && eval(Yanfly.Param.JpShowMenu)) {
		var classId = actor.currentClass().id;
		if (Galv.BM.JP > -1) this.drawActorJp(actor, classId, x, y + lineHeight * Galv.BM.JP, width2, 'right');
	};
	
};


Game_Actor.prototype.xpRate = function() {
    return (this.nextLevelExp() - this.currentExp()) / (this.nextLevelExp() - this.currentLevelExp());
};

Window_MenuStatus.prototype.drawActorEXP = function(actor, x, y, width) {
	if (Galv.BM.xpBar) {
		var color1 = this.xpGaugeColor1();
		var color2 = this.xpGaugeColor2();
		if (actor.isMaxLevel()) {
			var xprate = 0;
		} else {
			var xprate = actor.xpRate();
		};
		this.drawExpGauge(x, y, width, xprate, color1, color2);
	};
	if (Galv.BM.xpText) {
		this.changeTextColor(this.systemColor());
		this.drawText(xprate > 0 ? Galv.BM.xpLabel : Galv.BM.maxTxt, x, y, 44);
		this.changeTextColor(this.normalColor());
		if (xprate > 0) this.drawText(actor.nextRequiredExp(), x, y, width,"right");
	};
};



if (Galv.BM.rmplugin) {
	// IF ROCKETMANCER'S PRETTIER GAUGES PLUGIN
	
	var parameters = PluginManager.parameters('PrettyGauges');
	var barTypeLeft = String(parameters['barType']).substring(0,1);
	var barTypeRight = String(parameters['barType']).substring(1,2)
	var outline = Number(parameters['outline'] || 0);
	var barHeight = Number(parameters['barHeight'] || 0);
	var outlineColor1 = String(parameters['outlineColor1']);
	var outlineColor2 = String(parameters['outlineColor2']);
	var backgroundColor1 = String(parameters['backgroundColor1']);
	var backgroundColor2 = String(parameters['backgroundColor2']);
	var hpColor1 = String(parameters['hpColor1']);
	var hpColor2 = String(parameters['hpColor2']);
	var mpColor1 = String(parameters['mpColor1']);
	var mpColor2 = String(parameters['mpColor2']);
	var tpColor1 = String(parameters['tpColor1']);
	var tpColor2 = String(parameters['tpColor2']);
	
	
	Window_Base.prototype.drawExpGauge = function(x, y, width, rate, color1, color2) {
		var color3 = this.gaugeBackColor();
		var fillW = Math.floor(width * rate).clamp(0, width);
		var gaugeH = Galv.BM.xpHeight;
		var gaugeY = y + this.lineHeight() - gaugeH - 2;
		var fillW = Math.floor(width * rate);
		var gaugeY = y + this.lineHeight() - gaugeH - 2;
		
		var fillW = Math.floor(width * rate);
		var gaugeY = y + this.lineHeight() - 2 - barHeight;
		this.contents.fillTrap(x, gaugeY, width, width, barHeight, this.gaugeBackColor1(),  this.gaugeBackColor2());
		this.contents.fillTrap(x, gaugeY, width, fillW, barHeight, color1, color2);
		if (outline) { this.contents.outlineTrap(x, gaugeY, width, barHeight, outlineColor1, outlineColor2)}
		
		
	};
	
	
	
} else {
	// IF GALV ONLY
	Window_Base.prototype.drawExpGauge = function(dx, dy, dw, rate, color1, color2) {
		var color3 = this.gaugeBackColor();
		var fillW = Math.floor(dw * rate).clamp(0, dw);
		var gaugeH = Galv.BM.xpHeight;
		var gaugeY = dy + this.lineHeight() - gaugeH - 2;
		var fillW = Math.floor(dw * rate);
		var gaugeY = dy + this.lineHeight() - gaugeH - 2;
		this.contents.fillRect(dx, gaugeY, dw, gaugeH, color3);
		this.contents.gradientFillRect(dx, gaugeY, dw - fillW, gaugeH, color1, color2);
	};
};



Window_Base.prototype.xpGaugeColor1 = function() {
    return this.textColor(Galv.BM.xpCol1);
};

Window_Base.prototype.xpGaugeColor2 = function() {
    return this.textColor(Galv.BM.xpCol2);
};


// Because blt didn't let you draw a bitmap if it was a tiny bit off
Bitmap.prototype.unlimitedBlt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
	if (!source.isReady()) return;  // inaba byakko: Fix for Edge?
    dw = dw || sw;
    dh = dh || sh;
        this._context.globalCompositeOperation = 'source-over';
        this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
        this._setDirty();
};

Window_MenuStatus.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    var width = this.bustWidth();

	var bustName = faceName + "_" + (faceIndex + 1)
	var bitmap = ImageManager.loadPicture(bustName);
	
	if (!bitmap.isReady()) this._galvRefresh = true; // fix for bitmaps not loading
	
	var ox = 0;
	var oy = 0;
	if (Galv.BM.offsets[bustName]) {
		ox = Galv.BM.offsets[bustName][0] || 0;
		oy = Galv.BM.offsets[bustName][1] || 0;
	};

    var sw = width;
    var sh = Galv.BM.bustHeight;
    var dx = x - 1;
    var dy = y + Galv.BM.bust;
    var sx = bitmap.width / 2 - width / 2 - ox;
    var sy = oy;
    this.contents.unlimitedBlt(bitmap, sx, sy, sw, sh, dx, dy);
};

Window_MenuStatus.prototype.bustWidth = function() {
    return Math.floor((this.width - (this.standardPadding() * 2)) / this.maxCols());
};


Window_MenuStatus.prototype.cursorDown = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        this.select((index + maxCols) % maxItems);
	} else {
		this.select(maxItems - 1);
    }
};


Window_MenuStatus.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
        this.select((index - maxCols + maxItems) % maxItems);
	} else {
		this.select(0);
    }
};


})();