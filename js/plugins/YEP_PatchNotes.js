//=============================================================================
// Yanfly Engine Plugins - Patch Notes
// YEP_PatchNotes.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_PatchNotes = true;

var Yanfly = Yanfly || {};
Yanfly.PatchNotes = Yanfly.PatchNotes || {};
Yanfly.PatchNotes.version = 1.00;

//=============================================================================
 /*:
 * @plugindesc v1.00 Add the ability to read Patch Notes from inside your game.
 * @author Yanfly Engine Plugins
 *
 * @param ---General---
 * @default
 *
 * @param Patch Notes File
 * @parent ---General---
 * @desc Filename used for the Patch Notes. Place this inside your
 * project's main folder.
 * @default patchnotes.txt
 *
 * @param ---Title---
 * @default
 *
 * @param PatchTitleCommand
 * @text Command Name
 * @parent ---Title---
 * @desc This is the text used for the menu command.
 * @default Patch Notes
 *
 * @param Add Title Screen
 * @parent ---Title---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Add the 'Patch Notes' command to the title screen?
 * NO - false     YES - true
 * @default true
 *
 * @param ---Menu---
 * @default
 *
 * @param PatchMenuCommand
 * @text Command Name
 * @parent ---Menu---
 * @desc This is the text used for the menu command.
 * @default Patch Notes
 *
 * @param Auto Add Menu
 * @parent ---Menu---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Automatically add the 'Patch Notes' command to the main menu?
 * NO - false     YES - true
 * @default true
 *
 * @param Show Command
 * @parent ---Menu---
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show the Patch command in the main menu by default?
 * NO - false     YES - true
 * @default true
 *
 * @param Auto Place Command
 * @parent ---Menu---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Allow this plugin to decide the menu placement position?
 * NO - false     YES - true
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin grants your players the ability to access Patch Notes from the
 * game itself. Being able to tell your players what you've changed from inside
 * the game can make all the difference in the player experience. This plugin
 * lets players access Patch Notes from the title screen, the main menu, or
 * from a Plugin Command ran inside the game.
 *
 * ============================================================================
 * Intructions
 * ============================================================================
 *
 * Place your Patch Notes file (could be either a HTML or TXT file) inside the
 * base directory of your game project. By default, this filename is set to
 * 'patchnotes.txt' in the Plugin Parameters, so change that if you intend to
 * use a different filename or file type.
 *
 * ============================================================================
 * Main Menu Manager - Positioning the Patch Command
 * ============================================================================
 *
 * For those using the Main Menu Manager and would like to position the Patch
 * Notes command in a place you'd like, use the following format:
 *
 *       Name: Yanfly.Param.PatchCmd
 *     Symbol: PatchNotes
 *       Show: $gameSystem.isShowPatchNotesCommand()
 *    Enabled: true
 *        Ext: 
 *  Main Bind: this.commandPatchNotes.bind(this)
 * Actor Bind: 
 *
 * Insert the above setup within a Main Menu Manager slot. Provided you copy
 * the exact settings to where you need it, it will appear there while using
 * all of the naming, enabling, disabling, hiding, and showing effects done by
 * the plugin parameters.
 *
 * Remember to turn off 'Auto Add Menu' from the plugin parameters.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * You can use the following plugin commands to adjust how accessing the Patch
 * file is done for your game.
 *
 * Plugin Commands
 *
 *   OpenPatchNotes
 *   - This will open up the Patch file or URL for your game.
 *
 *   ShowMenuPatchNotesCommand
 *   - Will make the 'PatchNotes' command show up in the main menu.
 *
 *   HideMenuPatchNotesCommand
 *   - Will make the 'PatchNotes' command hidden in the main menu.
 */
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_PatchNotes');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.PatchNotesFilename = String(Yanfly.Parameters['Patch Notes File']);

Yanfly.Param.PatchTitleCmd = String(Yanfly.Parameters['PatchTitleCommand']);
Yanfly.Param.PatchAddTitle = eval(String(Yanfly.Parameters['Add Title Screen']));

Yanfly.Param.PatchCmd = String(Yanfly.Parameters['PatchMenuCommand']);
Yanfly.Param.PatchAutoAdd = eval(String(Yanfly.Parameters['Auto Add Menu']));
Yanfly.Param.PatchShow = eval(String(Yanfly.Parameters['Show Command']));
Yanfly.Param.PatchAutoPlace = String(Yanfly.Parameters['Auto Place Command']);
Yanfly.Param.PatchAutoPlace = eval(Yanfly.Param.PatchAutoPlace);

//=============================================================================
// Game_System
//=============================================================================

Yanfly.PatchNotes.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  Yanfly.PatchNotes.Game_System_initialize.call(this);
  this.initPatchNotes();
};

Game_System.prototype.initPatchNotes = function() {
  this._PatchNotesCommandShow = Yanfly.Param.PatchShow;
};

Game_System.prototype.isShowPatchNotesCommand = function() {
  if (this._PatchNotesCommandShow === undefined) this.initPatchNotes();
  return this._PatchNotesCommandShow;
};

Game_System.prototype.setShowPatchNotesCommand = function(value) {
  if (this._PatchNotesCommandShow === undefined) this.initPatchNotes();
  this._PatchNotesCommandShow = value;
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.PatchNotes.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.PatchNotes.Game_Interpreter_pluginCommand.call(this, command, args);
  if (command === 'OpenPatchNotes') {
    Yanfly.AccessPatchNotes();
  } else if (command === 'ShowMenuPatchNotesCommand') {
    $gameSystem.setShowPatchNotesCommand(true);
  } else if (command === 'HideMenuPatcNoteshCommand') {
    $gameSystem.setShowPatchNotesCommand(false);
  }
};

//=============================================================================
// Window_MenuCommand
//=============================================================================

Yanfly.PatchNotes.Window_MenuCommand_addOriginalCommands =
  Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
  Yanfly.PatchNotes.Window_MenuCommand_addOriginalCommands.call(this);
  if (Yanfly.Param.PatchAutoAdd) this.addPatchCommand();
};

Window_MenuCommand.prototype.addPatchCommand = function() {
  if (!Yanfly.Param.PatchAutoPlace) return;
  if (!$gameSystem.isShowPatchNotesCommand()) return;
  if (this.findSymbol('PatchNotes') > -1) return;
  var text = Yanfly.Param.PatchCmd;
  this.addCommand(text, 'PatchNotes', true);
};

//=============================================================================
// Window_TitleCommand
//=============================================================================

Yanfly.PatchNotes.Window_TitleCommand_makeCommandList =
    Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
  Yanfly.PatchNotes.Window_TitleCommand_makeCommandList.call(this);
  this.addPatchNotesCommand();
};

Window_TitleCommand.prototype.addPatchNotesCommand = function() {
  if (!Yanfly.Param.PatchAddTitle) return;
  this.addCommand(Yanfly.Param.PatchTitleCmd, 'PatchNotes');
};

//=============================================================================
// Scene_Menu
//=============================================================================

Yanfly.PatchNotes.Scene_Menu_createCommandWindow =
  Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
  Yanfly.PatchNotes.Scene_Menu_createCommandWindow.call(this);
  this._commandWindow.setHandler('PatchNotes',
    this.commandPatchNotes.bind(this));
};

Scene_Menu.prototype.commandPatchNotes = function() {
  Yanfly.AccessPatchNotes();
  this._commandWindow.activate();
};

//=============================================================================
// Scene_Title
//=============================================================================

Yanfly.PatchNotes.Scene_Title_createCommandWindow =
    Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
  Yanfly.PatchNotes.Scene_Title_createCommandWindow.call(this);
  this._commandWindow.setHandler('PatchNotes', this.commandPatchNotes.bind(this));
};

Scene_Title.prototype.commandPatchNotes = function() {
  Yanfly.AccessPatchNotes();
  this._commandWindow.activate();
};

//=============================================================================
// Utilities
//=============================================================================

Yanfly.AccessPatchNotes = function() {
  if ($gameTemp.isPlaytest()) console.log('Opening Patch Notes File...');
  TouchInput.clear();
  Input.clear();
  var url = this.getPatchFileUrl();
  var win = window.open(url);
  if (win) {
    win.focus();
  } else if (Imported.YEP_ExternalLinks) {
    SceneManager.openPopupBlockerMessage();
  }
};

Yanfly.getPatchFileUrl = function() {
  var url = Yanfly.Param.PatchNotesFilename;
  if (url.match(/http/i)) {
    return url;
  } else {
    var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/,
    '/' + Yanfly.Param.PatchNotesFilename);
    if (path.match(/^\/([A-Z]\:)/)) path = path.slice(1);
    path = decodeURI(path);
    return path;
  }
};

//=============================================================================
// End of File
//=============================================================================