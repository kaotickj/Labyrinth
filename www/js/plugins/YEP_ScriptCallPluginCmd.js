//=============================================================================
// Yanfly Engine Plugins - Script Call Plugin Command
// YEP_ScriptCallPluginCmd.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_ScriptCallPluginCmd = true;

var Yanfly = Yanfly || {};
Yanfly.CsTxCo = Yanfly.CsTxCo || {};
Yanfly.CsTxCo.version = 1.00;

//=============================================================================
 /*:
 * @plugindesc v1.00 (Req YEP_MessageCore.js) Allows you to create your own
 * custom text codes and determine what they do.
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Have you ever came across the odd situation where you wanted to use a
 * Plugin Command during a script call or Lunatic Mode code? This plugin will
 * help facilitate the process in doing so by creating a new function for you
 * to use in JavaScript that will transcribe the Plugin Command string and run
 * it during a script call.
 *
 * ============================================================================
 * Script Call
 * ============================================================================
 *
 * The script call to run plugin commands from script call is as follows:
 *
 *   CallPluginCommand('str');
 *   - Replace 'str' with the Plugin Command you wish to run as a string.
 *
 * Example:
 *
 *   var line = 'GainGold 1234567890';
 *   CallPluginCommand(line);
 *
 * This will run the plugin command 'GainGold' from YEP_CoreEngine and give the
 * player 1,234,567,890 gold.
 *
 * -------
 * WARNING
 * -------
 *
 * Not all plugin commands are compatible with script calls. What do I mean by
 * this? Well, certain plugin commands (for example, adjusting wait times)
 * will not necessarily work together with this method. This is due to the way
 * JavaScript works itself as all code inside a function and called functions
 * are instantaneous. 
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
// New Function
//=============================================================================

CallPluginCommand = function(line) {
  var args = line.split(" ");
  var command = args.shift();
  var interpreter = new Game_Interpreter();
  interpreter._params = [line];
  interpreter.pluginCommand(command, args);
};

//=============================================================================
// End of File
//=============================================================================