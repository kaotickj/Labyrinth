//-----------------------------------------------------------------------------
//  Galv's Magic Shards
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_MagicShards.js
//-----------------------------------------------------------------------------
// 2017-04-12 - Version 2.2 - added plugin setting to show only equippable
//                          - shards in the actors shard list
// 2016-08-10 - Version 2.1 - fixed cache issue in MV 1.3 update
// 2016-03-22 - Version 2.0 - added plugin command to remove shard from actor,
//                          - no matter which slot it was in.
//                          - added text in level up message when shards added
// 2016-02-18 - Version 1.9 - notetag code changes
// 2015-11-30 - Version 1.8 - added script calls to check shards equipped
// 2015-11-30 - Version 1.7 - fixed crash issue in some browsers
// 2015-11-22 - Version 1.6 - fixed a crash when levelling
// 2015-11-19 - Version 1.5 - added ability to disable/enable menu command
// 2015-11-19 - Version 1.4 - added plugin command to change shards on actors
// 2015-11-18 - Version 1.3 - added ability to lock shard slots through
//                          - plugin commands and cursed shards
// 2015-11-18 - Version 1.2 - fixed a display bug made from last patch
//                          - added compatibility with yanfly passive states
// 2015-11-18 - Version 1.1 - fixed a bug with showing more than 12 shards
// 2015-11-18 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_MagicShards = true;

var Galv = Galv || {};          // Galv's main object
Galv.pCmd = Galv.pCmd || {};    // Plugin Command manager
Galv.MS = Galv.MS || {};        // Galv's stuff

// Galv Notetag setup (Add notes required for this plugin if not already added)
Galv.noteFunctions = Galv.noteFunctions || [];       // Add note function to this.


//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.2.2) A scene to equip actors with "Shards" to grant skills and parameter bonuses
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Appear in Menu
 * @desc Can be true or false if you want this plugin to add the Menu Command to the main menu or not
 * @default true
 *
 * @param Show as Icons
 * @desc Can be true or false. true will display shard items in the scene as icons without name. False will display as normal.
 * @default true
 *
 * @param Show Only Equippable
 * @desc true or false - show only shards actors can equip in the shard list
 * @default false
 *
 * @param Inventory Category
 * @desc item, weapon, armor, keyItem, none - To display in inventroy category. Make sure to use correct capitalization here.
 * @default item
 *
 * @param Max Shard Slots
 * @desc The maximum amount of shards slots an actor can ever have.
 * @default 11
 *
 * @param Cursed Shards
 * @desc List of SHARD ID's (not weapon or armor ids) separated by commas. Cursed shards lock the slot they are equipped to.
 * @default 666,13,1337
 *
 * @param ----- VOCAB -----
 * @desc
 * @default
 *
 * @param Menu Command
 * @desc Text for the Magic Shard's main menu command
 * @default Orb Shard
 *
 * @param Equip
 * @desc Text for "Equip" menu command
 * @default Equip
 *
 * @param Remove
 * @desc Text for "Remove" menu command
 * @default Remove
 *
 * @param Gained
 * @desc Text before skills that are added when equipping shards
 * @default Gained:
 *
 * @param Lost
 * @desc Text before skills that are lost when equipping shards
 * @default Lost:
 *
 * @param Empty
 * @desc Text displayed in an empty shard slot (displayed in non-graphics mode)
 * @default >>>
 *
 * @param Level Up Message
 * @desc Message displayed with level ups. Leave blank for none. # will be replaced with number of slots.
 * @default Shard slots have been increased by #!
 *
 * @param ----- SOUND -----
 * @desc
 * @default
 *
 * @param Gain Skill SE
 * @desc Sound effect that plays when gaining a skill.
 * FileName,volume,pitch.
 * @default Flash1,80,110
 *
 * @param Lose Skill SE
 * @desc Sound effect that plays when losing a skill.
 * FileName,volume,pitch.
 * @default Down2,70,150
 *
 * @param ----- IMAGES -----
 * @desc
 * @default
 *
 * @param Background Image
 * @desc true or false. Display /system/shardBg.png as scene background if true, false shows as normal.
 * @default true
 *
 * @param Graphics
 * @desc Can be true or false. true uses specific graphics from /img/system/ (see HELP for details).
 * @default true
 *
 * @param Orb Dimensions
 * @desc The width and height of the magic orb graphic (pixels), separated by a comma.
 * @default 336,336
 *
 * @param Orb XY
 * @desc The x,y offset for the orb graphics separated by a comma.
 * @default 0,0
 *
 * @param ----- OTHER -----
 * @desc
 * @default
 *
 * @param Use Links
 * @desc Can be true or false if you want to use the Shards.txt file for link skills
 * @default true
 *
 * @param Folder
 * @desc The folder name in your project that contains Shards.txt file for link skills.
 * @default data
 *
 * @help
 *   Galv's Magic Shards
 * ----------------------------------------------------------------------------
 * This plugin creates a new way for players to customize their characters.
 * It adds a "Magic Orb" to characters, which can have a number of "Shards"
 * equipped to the orb. During the game these characters can improve the
 * number of shards they are capable of equipping by adding "Shard Slots".
 *
 * Weapons and armors can be changed into shards (so they are no longer equips)
 * using the note tag found further below. All functions of the weapon/armor
 * will work for the shards including features, stats and equip restrictions.
 * This means you will need to set the actor up to be allowed to equip the
 * weapon/armor shard (using features) to be able to equip them in the scene.
 *
 * ----------------------------------------------------------------------------
 *   Note Tag for WEAPONS or ARMORS:
 * ----------------------------------------------------------------------------
 *
 *    <shard: n>       // This classifies a weapon/armor to be a shard
 *                     // Shards will display in the "Inventory Category" as
 *                     // well as the Magic Shard scene.
 *                     // The n is the shard ID, which is used in the external
 *                     // data/shards.txt file to determine skills gained by
 *                     // adjacent shards.
 *
 * ----------------------------------------------------------------------------
 *   Note Tag for ACTORS:
 * ----------------------------------------------------------------------------
 *
 *    <shardimg: X>     // image number for the actor's Shard Orb graphic.
 *                      // Taken from /img/system/ShardOrbX.png. If this tag is
 *                      // not included, actor will use ShardOrb0.png
 *
 * ----------------------------------------------------------------------------
 *   Note Tag for CLASS SKILLS TO LEARN:
 * ----------------------------------------------------------------------------
 * This note tag is to be used in the "Skills To Learn" section of the "Class"
 * tab. It is used to increase an actor's shard slots when the actor levels.
 *
 *     <shard: x>          // x is the amount of slots added to actor
 *
 * NOTE: This increase happens whenever this class learns the skill at the
 * specified level and it is permanent. If the actor levels down and levels up
 * again, it will increase again. So use only if not doing that stuff.
 * This cannot increase shard slots more than "Max Shards" setting.
 *
 * ----------------------------------------------------------------------------
 *   PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 *
 *   MSHARDS SLOTS ACTORID MOD    // Changes actor's max shards.
 *                                // MSHARDS - the plugin command word
 *                                // SLOTS - command word to change max slots
 *                                // ACTORID - the id of the actor changing
 *                                //           use negative for a party member
 *                                //           v# to use a variable
 *                                // MOD - positive/negative number to change
 *                                //       the amount of slots an actor has.
 *                                //       v# to use a variable
 *
 *   MSHARDS IMG ACTORID X        // Changes actor's shard orb image.
 *                                // MSHARDS - the plugin command word
 *                                // IMG - command word to change orb img
 *                                // ACTORID - the id of the actor changing
 *                                //           use negative for a party member
 *                                //           v# to use a variable
 *                                // X - the number of the orb image taken
 *                                //     from /img/system/ShardOrbX.png.
 *                                //     v# to use a variable
 *
 *   MSHARDS SCENE ACTORID        // Opens the shard scene for actor.
 *                                // MSHARDS - the plugin command word
 *                                // SCENE - command word to start scene
 *                                // ACTORID - the id of the actor changing
 *                                //           use negative for a party member
 *                                //           v# to use a variable
 *
 *   MSHARDS LOCK ACTORID X       // Prevents actor from changing shards.
 *                                // MSHARDS - the plugin command word
 *                                // LOCK - command word for locking
 *                                // ACTORID - the id of the actor changing
 *                                //           use negative for a party member
 *                                //           v# to use a variable
 *                                // X - the slot position to be locked. Dont
 *                                //     include this if you want to lock all
 *                                //     v# to use a variable
 *
 *   MSHARDS UNLOCK ACTORID X     // Unlocks actors shard slots
 *                                // Same as above but unlock instead of lock
 *
 *   MSHARDS CHANGE ACTORID X S   // Change an actor's shard in a certain slot
 *                                // MSHARDS - the plugin command word
 *                                // CHANGE - command word for changing shards
 *                                // ACTORID - the id of the actor changing
 *                                //           use negative for a party member
 *                                //           v# to use a variable
 *                                // X - the slot position to change.
 *                                //     v# to use a variable
 *                                // S - the shard equip item - letterNumber
 *                                //     eg. w10 for weapon 10
 *                                //         a4 for armor 4
 *                                //         none to remove the shard
 *
 *   MSHARDS REMOVE ACTORID S U   // Change an actor's shard in a certain slot
 *                                // MSHARDS - the plugin command word
 *                                // CHANGE - command word for changing shards
 *                                // ACTORID - the id of the actor changing
 *                                //           use negative for a party member
 *                                //           v# to use a variable
 *                                // S - the shard equip item - letterNumber
 *                                //     eg. w10 for weapon 10
 *                                //         a4 for armor 4
 *                                // U - Unlock shard slot true or false.
 *                                //     If true, the slot that the shard is
 *                                //     removed from will be unlocked. If
 *                                //     false, it will remain the same.
 *
 *   MSHARDS MENU STATUS          // Change the status of the menu command.
 *                                // MSHARDS - the plugin command word
 *                                // MENU - command word for changing shards
 *                                // STATUS - can be one of the following:
 *                                //          enabled
 *                                //          disabled
 *                                //          hidden
 *
 * Examples:
 * MSHARDS SLOTS 2 3       // Adds 3 slots to actor 2 limited to "Max Shards"
 * MSHARDS SLOTS -2 1      // Adds 1 slot to party member 2
 * MSHARDS SCENE 4         // Opens the shard scene for actor 4
 * MSHARDS SCENE -1        // Opens the shard scene for party member 1 (leader)
 * MSHARDS IMG 1 4         // Changes actor 1's shard image to MagicOrb4.png
 * MSHARDS LOCK 5 1        // Lock the first shard slot for actor 5
 * MSHARDS UNLOCK 7        // Unlock all slots for actor 7
 * MSHARDS CHANGE 2 1 w2   // Changes slot 1 on actor 2 to weapon 10
 * MSHARDS CHANGE -1 2 none  // Changes slot 2 on party member 1 to empty
 * MSHARDS MENU disabled     // Make menu command unable to be accessed
 * MSHARDS MENU hidden       // Don't show menu command
 * MSHARDS MENU enabled      // Menu command is active and normal
 * MSHARDS REMOVE 2 w8 true  // Removes weapon 10 shard from actor 2 and will
 *                           // unlock the shard slot it came from if locked
 *
 * ----------------------------------------------------------------------------
 *  LOCKED SHARD SLOTS & CURSED SHARDS
 * ----------------------------------------------------------------------------
 * With the above plugin commands, it is possible to lock and unlock actor's 
 * shard slots during the game. The settings also include a "Cursed Shards"
 * section, which you can list all SHARD ID's (NOT weapon id or armor id) that
 * you would like to be cursed.
 *
 * A cursed shard, when equipped, will lock the slot it was equipped to. The
 * only way to "uncurse" is to use the plugin commands above to unlock that
 * slot. Note that when the slot is unlocked, the cursed shard remains
 * equipped, but if you unequip it and then equip it again - the curse will
 * activate once more.
 *
 * ----------------------------------------------------------------------------
 *  Acquiring Skills through Shard Links
 * ----------------------------------------------------------------------------
 * If the setting "Use Links" is true, you can set up "Shard Links" in the
 * "Shards.txt" file (See below for required details for this file).
 *
 * A shard link means if you have 2 shards equipped in slots that are next to
 * each other (adjacent), they are considered linked. The text file contains a
 * list of possible combinations of SHARD ID's (the number specified in the
 * notetag you added to the weapon or armor).
 *
 * The Shards.txt file allows you to add as many combinations as you require
 * and each combination must be on a separate line in the txt file. Eg:
 *
 *    1,2,8    # example
 *    5,3,34   # example
 *    1,3,9    # Learn Fire
 *
 * The data above has 3 numbers per line separated by commas:
 * Shard Id, Shard Id, Skill Id      # Notes to keep track
 * The example: 1,3,9
 * Means if a shard with Shard Id of 1, and a shard with Shard Id of 3 are
 * equipped adjacent to each other - they are "linked" and the actor will
 * learn skill 9.
 * 
 * ----------------------------------------------------------------------------
 *  REQUIRED FILE INFORMATION                                     ! IMPORTANT
 * ----------------------------------------------------------------------------
 * If the setting "Use Links" is set to true, the plugin requires you to have
 * a file in your project in the folder you specified in the "Folder" setting.
 * This is the "data" folder by default. The required file must be named:
 *
 *   Shards.txt
 *
 * For example, this file by default is set to be:
 * YourProject/data/Shards.txt
 *
 * When the "Graphics" setting is set to true, the plugin uses the graphical
 * version which requires you to have certain graphics in /img/system/ folder.
 * Below is details about those graphics:
 *
 *   MagicOrb0.png     - The Magic Orb image.
 *                     - 336 x 336 pixels (Must be same width and height)
 *                     - Make sure "Orb Dimensions" setting is this size
 *                     - can add additional MagicOrb images with diff number
 *
 *   MagicOrbSlot.png  - The image for "slots" around the Magic Orb.
 *
 *   MagicOrbSlotLink.png  - The image that appears above the slot on shards
 *                         - that have a link in the "Shards.txt" file.
 *
 *   shardBg.png       - Optional. Used if "Background Image" setting is true.
 *
 *
 * ----------------------------------------------------------------------------
 *  Checking if actors have shards equipped
 * ----------------------------------------------------------------------------
 * In a conditional branch or script, you can use the 'hasShard(id,type) method
 * for an actor to check if they have a certain shard equipped.
 *
 *  $gameActors.actor(x).hasShard(id,type)   - x is the actor's ID 
 *                                           - type can be 'weapon' or 'armor'
 *                                           - (including quotes on those)
 *                                           - id is the equip's databse ID
 *
 *  $gameActors.actor(x).hasShard(id)   - x is the actor's ID
 *                                      - id is the Shard ID (specified in the
 *                                      - external text file)
 *
 *  -- To check a certain party member you can use:
 *
 *  $gameParty.members()[x].hasShard(id,type)     - where x member's position
 *  $gameParty.members()[x].hasShard(id)          - (0 for the leader)
 *  
 *  -- To check if anyone in the party has the shard:
 *
 *  $gameParty.hasShard(id,type)
 *  $gameParty.hasShard(id)
 */


//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------


(function() {
	
	// GALV'S PLUGIN MANAGEMENT. INCLUDED IN ALL GALV PLUGINS THAT HAVE PLUGIN COMMAND CALLS, BUT ONLY RUN ONCE.
	if (!Galv.aliased) {
		var Galv_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
		Game_Interpreter.prototype.pluginCommand = function(command, args) {
			if (Galv.pCmd[command]) {
				Galv.pCmd[command](args);
				return;
			};
			Galv_Game_Interpreter_pluginCommand.call(this, command, args);
		};
		Galv.aliased = true; // Don't keep aliasing for other Galv scripts.
	};
	
	// Direct to Plugin Object
	Galv.pCmd.MSHARDS = function(arguments) {Galv.MS.plugin(arguments)};
	// END GALV'S PLUGIN MANAGEMENT
	
	
	Galv.MS.plugin = function(arr) {
		if (arr[0] === "MENU") {
			$gameSystem.shardMenu = arr[1].toLowerCase();
			return;
		};
		
		
		var actorId = null;
		// Get correct actor ID
		actorId = Galv.MS.getActorId(arr[1]);
		if (!actorId) return;

		// Do plugin stuff		
		switch (arr[0]) {
			case "LOCK":
			case "UNLOCK":
				// Lock or unlock shards for ("lock"/"unlock",id,shard slot (1 is first))
				var slot = arr[2] ? Galv.MS.getValue(arr[2]) : null;
				Galv.MS.setLock(arr[0].toLowerCase(),actorId,slot);
				break;
			case "SCENE":
				// Run scene for certain actor
				Galv.MS.run(actorId)
				break;
			case "SLOTS":
				// Change actor's max slots
				Galv.MS.changeShardSlots(actorId,Galv.MS.getValue(arr[2]));
				break;
			case "CHANGE":
				// Change actor's equipped shard in certain slot
				var slot = Galv.MS.getValue(arr[2]);

				if (slot > $gameActors.actor(actorId)._shardSlots) return;  // dont equip if dont have that slot open
				var itemTag = arr[3] ? arr[3].toLowerCase() : "none";
				if (itemTag[0] === "w") {
					var shard = $dataWeapons[Number(itemTag.replace("w",""))];
				} else if (itemTag[0] === "a") {
					var shard = $dataArmors[Number(itemTag.replace("a",""))];
				} else {
					var shard = null;
				};

 				$gameActors.actor(actorId).changeShard(slot - 1, shard, false);
				break;
			case "REMOVE":
				
				
				var itemTag = arr[2] ? arr[2].toLowerCase() : "none";
				if (itemTag[0] === "w") {
					var shardType = 'weapon';
					var shardId = Number(itemTag.replace("w",""));
				} else if (itemTag[0] === "a") {
					var shardType = 'armor';
					var shardId = Number(itemTag.replace("a",""));
				} else {
					var shardId = Number(itemTag);
				};

				var unlock =  arr[3] && arr[3].toLowerCase() == 'true' ? true : false;
				$gameActors.actor(actorId).removeShard(shardId,shardType,unlock);

				break;
			case "IMG":
				// Change actor's orb image
				$gameActors.actor(actorId)._shardImg = Galv.MS.getValue(arr[2]);
				break;
		};
	};
		
	Galv.MS.getValue = function(string) {
		if (string[0].toLowerCase() === "v") {
			// Use variable
			var varId = Number(string.replace("v",""));
			return $gameVariables.value(varId);
		} else {
			return Number(string);
		};
	};
	
	Galv.MS.getActorId = function(string) {
		if (string[0].toLowerCase() === "v") {
			// Use variable
			var varId = Number(string.replace("v",""));
			return Math.abs($gameVariables.value(varId));
		} else if (Number(string) > 0) {
			// Use actor ID
			return Number(string);
		} else if (Number(string) <= 0) {
			var pId = Math.abs(Number(string));
			pId = pId == 0 ? 0 : pId - 1;  // if 0, leader. If 1 leader, 2 for 2nd, etc.
			if (!$gameParty.members()[pId]) return null;
			return $gameParty.members()[pId].actorId();
		};
	};
	
	Galv.MS.showOnlyEquippable = PluginManager.parameters('Galv_MagicShards')["Show Only Equippable"] === "true" ? true : false;
	Galv.MS.lvlMessage = PluginManager.parameters('Galv_MagicShards')["Level Up Message"];
	
	Galv.MS.graphics = PluginManager.parameters('Galv_MagicShards')["Graphics"] === "true" ? true : false;
	Galv.MS.mActive = PluginManager.parameters('Galv_MagicShards')["Appear in Menu"] === "true" ? true : false;
	Galv.MS.asIcons = PluginManager.parameters('Galv_MagicShards')["Show as Icons"] === "true" ? true : false;
	Galv.MS.iCat = PluginManager.parameters('Galv_MagicShards')["Inventory Category"];
	Galv.MS.maxAllowed = Number(PluginManager.parameters('Galv_MagicShards')["Max Shard Slots"]);
	Galv.MS.mCommand = PluginManager.parameters('Galv_MagicShards')["Menu Command"];
	Galv.MS.equip = PluginManager.parameters('Galv_MagicShards')["Equip"];
	Galv.MS.remove = PluginManager.parameters('Galv_MagicShards')["Remove"];
	Galv.MS.empty = PluginManager.parameters('Galv_MagicShards')["Empty"];
	Galv.MS.gained = PluginManager.parameters('Galv_MagicShards')["Gained"];
	Galv.MS.lost = PluginManager.parameters('Galv_MagicShards')["Lost"];
	Galv.MS.bg = PluginManager.parameters('Galv_MagicShards')["Background Image"] === "true" ? true : false;
	Galv.MS.xy = function() {
		var a = PluginManager.parameters('Galv_MagicShards')["Orb XY"].split(",");
		return [Number(a[0]),Number(a[1])];
	}();
	
	Galv.MS.wh = function() {
		var a = PluginManager.parameters('Galv_MagicShards')["Orb Dimensions"].split(",");
		return [Number(a[0]),Number(a[1])];
	}();
	
	Galv.MS.cursedShards = function() {
		var a = PluginManager.parameters('Galv_MagicShards')["Cursed Shards"].split(",");
		for (i = 0; i < a.length;i++) {
			a[i] = Number(a[i]);
		};
		return a;
	}();
	
	
	Galv.MS.run = function(actorId) {
		if (actorId) {
			$gameParty.setMenuActor($gameActors.actor(actorId));
		} else {
			$gameParty.setMenuActor($gameParty.leader());
		};
		SceneManager.push(Scene_MShards);
	};


	Galv.MS.makeSound = function(txt) {
		if (Array.isArray(txt)) {
			var arr = txt;
		} else {
			var arr = txt.split(",");
		};
		var obj = {
			name: arr[0],
			pan: 0,
			pitch: Number(arr[2]),
			volume: Number(arr[1])
		};
		return obj;
	};
	
	Galv.MS.GainSe = Galv.MS.makeSound(PluginManager.parameters('Galv_MagicShards')["Gain Skill SE"]);
	Galv.MS.LoseSe = Galv.MS.makeSound(PluginManager.parameters('Galv_MagicShards')["Lose Skill SE"]);

	Galv.MS.createShards = function(string) {
		if (Galv.MS.shardMixes) return;
		Galv.MS.shardMixes = {};
		var lines = string.split("\n");
		for (var i = 0; i < lines.length; i++) {
			var lineArr = lines[i].split(/(?:,| )+/);
	
			if (!isNaN(lineArr[0])) {
				Galv.MS.shardMixes[[Number(lineArr[0]),Number(lineArr[1])]] = Number(lineArr[2]);
			};
		};
	};
	
	Galv.MS.changeShardSlots = function(id,amount) {
		if (!$gameActors.actor(id)) return;
		var actor = $gameActors.actor(id);
		if (amount > 0 ) {
			// Adding Shard Slot
			var m = Galv.MS.maxAllowed - actor._shardSlots;
			var amount = amount > m ? m : amount;
			actor._shardSlots += amount;
		} else if (amount < 0) {
			// Removing Shard Slot
			var amount = (actor._shardSlots - Math.abs(amount)) < 0 ? 0 : Math.abs(amount);
			// Add shards to inventory from slots that are removed
			for (var i = 0; i < amount; i++) {
				var slot = actor._shardSlots - i - 1;
				actor.changeShard(slot, null);
			};
			actor._shardSlots -= amount;
		};
	};


	Galv.MS.setLock = function(type,id,slot) {
		if (!$gameActors.actor(id)) return;
		var actor = $gameActors.actor(id);
		var slots = [];
		
		if (!slot) {
			// Get all slots
			for (var i = 0; i < Galv.MS.maxAllowed;i++) {
				slots.push(i);
			};
		} else {
			slots.push(slot - 1);
		};
		
		if (type == "lock") {
			// Lock all slots in chosen slot list
			for (var i = 0;i < slots.length;i++) {
				if (!actor._shardLocks.contains(slots[i])) actor._shardLocks.push(slots[i]);
			};
		} else {
			// Unlock all slots in chosen slot list
			for (var i = 0;i < slots.length;i++) {
				var elementIndex = actor._shardLocks.indexOf(slots[i]);
				if (elementIndex >= 0) {
					// If the slot number to remove is in the list - nuke it
					actor._shardLocks.splice(elementIndex, 1);
				};
			};
		};
	};



//-----------------------------------------------------------------------------
//  NOTE TAGS
//-----------------------------------------------------------------------------

if (!Galv.notetagAlias) {   // Add alias only if not added by another Galv plugin
	Galv.MS.Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function() {	
		for (var i = 0;i < Galv.noteFunctions.length; i++) {
			Galv.noteFunctions[i]();	
		};
		Galv.MS.Scene_Boot_start.call(this);
	};
	Galv.notetagAlias = true;
};



Galv.MS.notetags = function() {
	// Weapon Notes
	for (var i = 1;i < $dataWeapons.length;i++) {
		var note = $dataWeapons[i].note.toLowerCase().match(/<shard:(.*)>/i)
		$dataWeapons[i].isShard = note ? Number(note[1]) : 0;
	};
	// Armor Notes
	for (var i = 1;i < $dataArmors.length;i++) {
		var note = $dataArmors[i].note.toLowerCase().match(/<shard:(.*)>/i)
		$dataArmors[i].isShard = note ? Number(note[1]) : 0;
	};
};

Galv.noteFunctions.push(Galv.MS.notetags);

DataManager.isShard = function(item) {
	if (!item) return false;
    if ($dataWeapons.contains(item) || $dataArmors.contains(item)) {
		return item.isShard;
	};
};



Galv.MS.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.MS.Game_System_initialize.call(this);
	this.shardMenu = "enabled";
};


// Display shards in chosen inventory category only
Galv.MS.Window_ItemList_includes = Window_ItemList.prototype.includes;
Window_ItemList.prototype.includes = function(item) {
    if (DataManager.isShard(item)) {
		return this._category === Galv.MS.iCat;
	} else {
    	return Galv.MS.Window_ItemList_includes.call(this, item);
    };
};

// Cache window items
Galv.MS.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
	 Galv.MS.Scene_Boot_loadSystemImages.call(this);
	 ImageManager.loadSystem('MagicOrbSlot');
	 ImageManager.loadSystem('MagicOrbSlotLink');
};


//-----------------------------------------------------------------------------
//  GAME_ACTOR
//-----------------------------------------------------------------------------


Game_Actor.prototype.removeShard = function(id, type, unlock) {
	if (this.hasShard(id,type)) {
		
		for (var i = 0; i < this._shardSlots; i++) {
			item = this._shards[i] ? this._shards[i].object() : null;
			if (this._tempShardItem == item) {
				this.changeShard(i, null, false);
				if (unlock) Galv.MS.setLock('unlock',this._actorId,i + 1);
			};
		};
		
		/*
		for (var child in this._shards) {
			item = this._shards[child] ? this._shards[child].object() : null;
			if (this._tempShardItem == item) {
				this.changeShard(slotId, null, loseItem);
				Galv.MS.setLock('unlock',this._actorId,slotId);
			};
			slotId += 1;
		};
		*/
		
	};
	this._tempShardItem = null;
};


Game_Actor.prototype.hasShard = function(id, type) {
	this._tempShardItem = null;
	if (!type) {
		// Check for ID of shard
		
		for (var child in this._shards) {
			item = this._shards[child] ? this._shards[child].object() : null;
			this._tempShardItem = item;
			if (item && item.isShard == id) return true;
		};
	} else if (type === 'weapon') {
		// Check if has weapon shard
		for (var child in this._shards) {
			item = this._shards[child] ? this._shards[child].object() : null;
			this._tempShardItem = item;
			if (item && DataManager.isWeapon(item) && item.id == id) return true;
		};
	} else if (type === 'armor') {
		// Check if has weapon shard
		for (var child in this._shards) {
			item = this._shards[child] ? this._shards[child].object() : null;
			this._tempShardItem = item;
			if (item && DataManager.isArmor(item) && item.id == id) return true;
		};
	};
	return false;
};


Game_Party.prototype.hasShard = function(id,type) {
	var result = false;
	$gameParty.members().forEach(function(mem) {
		if (mem.hasShard(id,type)) return result = true;
	});
	return result;
};




//-----------------------------------------------------------------------------

Galv.MS.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
	Galv.MS.Game_Actor_setup.call(this,actorId);
	this.initShards();
};

Game_Actor.prototype.initShards = function() {
	this._shardSlots = 0;    // Current shard slots actor has unlocked
    this._shards = {};       // Crate equipped shard object
	this._shardLocks = [];    // array of shard slot ID's (1 being first, 2 being second etc)
	var img = $dataActors[this._actorId].note.toLowerCase().match(/<shardimg:(.*)>/i)  // Shard Image ID
	this._shardImg = img ? Number(img[1]) : 0;
};

Game_Actor.prototype.isShardChangeOk = function(slotId) {
    return !this._shardLocks.contains(slotId); //|| (this._shardSlots[slotId] && this._shardSlots[slotId].object().shardLocked);
};

Game_Actor.prototype.changeShard = function(slotId, item, temp) {
	var newItem = item;
	var oldItem = (this._shards[slotId] && this._shards[slotId].object()) ? this._shards[slotId].object() : null;
	
	// Add old item to inventory
	if (oldItem && !temp) $gameParty.gainItem(oldItem,1);
	
	// Add new item to slot
	if (newItem) {
		this._shards[slotId] = new Game_Item();              // Make item space
		this._shards[slotId].setObject(newItem);             // If item, set it to actor
		if (!temp) $gameParty.loseItem(newItem,1);           // Remove from inventory
		// if item is cursed
		if (Galv.MS.cursedShards.contains(newItem.isShard)) Galv.MS.setLock("lock",this.actorId(),slotId + 1);
	} else {
		this._shards[slotId] = null;
		delete(this._shards[slotId]);              // If no new item, remove shard from actor
	};
        
	this.refresh();
};


Galv.MS.Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
	Galv.MS.Game_Actor_levelUp.call(this);
	this.currentClass().learnings.forEach(function(learning) {
        if (learning.level === this._level) {
			
            var shardSlots = learning.note.toLowerCase().match(/<shard:(.*)>/i);
			if (shardSlots) {
				Galv.MS.lvlSlotCount = Number(shardSlots[1]);
				Galv.MS.changeShardSlots(this.actorId(),Galv.MS.lvlSlotCount);
			};
        }
    }, this);
};


Galv.MS.Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
Game_Actor.prototype.displayLevelUp = function(newSkills) {
	Galv.MS.Game_Actor_displayLevelUp.call(this,newSkills);
	if (Galv.MS.lvlMessage) {
		var txt = Galv.MS.lvlMessage.replace("#",Galv.MS.lvlSlotCount);
		$gameMessage.newPage();
		$gameMessage.add(txt);
	};
};




// Make equipping shards the same as default equipping items.
Galv.MS.Game_BattlerBase_canEquip = Game_BattlerBase.prototype.canEquip;
Game_BattlerBase.prototype.canShardEquip = function(item) {
	return Galv.MS.Game_BattlerBase_canEquip.call(this,item);
};


// Prevent equipping shards in normal equipping item locations
Game_BattlerBase.prototype.canEquip = function(item) {
	if (item && item.isShard) return false;
	return Galv.MS.Game_BattlerBase_canEquip.call(this,item);
};

// Get traits from equipped shards
Galv.MS.Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
Game_Actor.prototype.traitObjects = function() {
    var objects = Galv.MS.Game_Actor_traitObjects.call(this);

	var shards = this._shards;
	for (var slot in shards) {
		var item = shards[slot].object();
        if (item) {
            objects.push(item);
        };
    };
	return objects;
};

// Get stats from equipped shards
Galv.MS.Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
Game_Actor.prototype.paramPlus = function(paramId) {
    var value = Galv.MS.Game_Actor_paramPlus.call(this,paramId);

    var shards = this._shards;
	for (var slot in shards) {
		var item = shards[slot].object();
        if (item) {
            value += item.params[paramId];
        };
    };
    return value;
};


// Add skills gained from linked shards
Galv.MS.Game_Actor_skills = Game_Actor.prototype.skills;
Game_Actor.prototype.skills = function() {
	var list = Galv.MS.Game_Actor_skills.call(this);
	var shards = this._shards;

	// Get list of equipped shards as array of shard ID's
	var sArr = [];
	for (var i = 0; i < this._shardSlots; i++) {
		sArr.push(null);
	};
	
	for (shard in shards) {
		//sArr.push(shards[shard].object().isShard);
		if (shards[shard]) sArr[shard] = shards[shard].object().isShard;
	};

	// Get shard before and shard after
	var shardCount = sArr.length;

	for (var i = 0; i < shardCount;i++) {
		var nextIndex = (i === this._shardSlots - 1) ? 0 : i + 1;  // Next Shard
		var next = sArr[nextIndex];
		var toCheck = [next,sArr[i]].sort();

		var sId = Galv.MS.shardMixes[[toCheck[0],toCheck[1]]];
		if (sId && !list.contains($dataSkills[sId])) {
			list.push($dataSkills[sId]);
		};
	};
    return list;
};


//-----------------------------------------------------------------------------
//  SCENE_MENU
//-----------------------------------------------------------------------------
if (Galv.MS.mActive) {  // If menu command setting is true
	Galv.MS.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		Galv.MS.Scene_Menu_createCommandWindow.call(this);
		this._commandWindow.setHandler('mshards',      this.commandPersonal.bind(this));
	};
	
	Galv.MS.Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
	Scene_Menu.prototype.onPersonalOk = function() {
		if (this._commandWindow.currentSymbol() === 'mshards') {
			SceneManager.push(Scene_MShards);
			return;
		};
		Galv.MS.Scene_Menu_onPersonalOk.call(this);
	};
	
	Galv.MS.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		Galv.MS.Window_MenuCommand_addOriginalCommands.call(this);
		this.addMShardsCommand();
	};
	
	Window_MenuCommand.prototype.addMShardsCommand = function() {
		if (this.needsCommand('mshards')) {
			switch ($gameSystem.shardMenu) {
				case 'enabled':
				case 'enable':
					var enabled = true;
					break;
				case 'disabled':
				case 'disable':
					var enabled = false;
					break;
				case 'hidden':
				default:
					// Don't add the command
					return;
			};
			this.addCommand(Galv.MS.mCommand, 'mshards', enabled);
		}
	};
};


//-----------------------------------------------------------------------------
//  SCENE_MSHARDS
//-----------------------------------------------------------------------------

function Scene_MShards() {
    this.initialize.apply(this, arguments);
}

Scene_MShards.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MShards.prototype.constructor = Scene_MShards;

Scene_MShards.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};


// CREATE STUFF


Scene_MShards.prototype.create = function() {
	
    Scene_MenuBase.prototype.create.call(this);
	
    this.createHelpWindow();
	
    this.createStatusWindow();
	
    this.createCommandWindow();
	this.createNameWindow();
	
	this.createSlotWindow();
    this.createItemWindow();
	this.createInfoWindow();
    this.refreshActor();
};

Scene_MShards.prototype.updateShardImage = function() {
	if (!Galv.MS.graphics) return;
	
	// Set centered
	var w = Galv.MS.wh[0];
	var h = Galv.MS.wh[1];
	var ox = Galv.MS.xy[0];
	var oy = Galv.MS.xy[1];
	
	this._shardImage.x = ox + this._statusWindow.width + (Graphics.boxWidth - this._statusWindow.width) / 2 - (w / 2);
	this._shardImage.y = oy + this._helpWindow.height + (Graphics.boxHeight - this._helpWindow.height) / 2 - (h / 2);
	
	this._center = [this._shardImage.x + w / 2,this._shardImage.y + h / 2];
	this._slotWindow.setCenter(this._center[0] - this._statusWindow.width, this._center[1] - this._helpWindow.height - this._nameWindow.height,w / 2);
	this._slotWindow.refresh();
	
	
	var actor = $gameParty.menuActor();
	this._shardImage.bitmap = ImageManager.loadSystem("MagicOrb" + actor._shardImg);
};

Scene_MShards.prototype.createBackground = function() {
	if (Galv.MS.bg) {
		this._backgroundSprite = new Sprite();
		this._backgroundSprite.bitmap = ImageManager.loadSystem("shardBg");
		this.addChild(this._backgroundSprite);
	} else {
		Scene_MenuBase.prototype.createBackground.call(this);
	};
	if (!Galv.MS.graphics) return;
	this._shardImage = new Sprite();

	this.addChild(this._shardImage);
};

Scene_MShards.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_ShardStatus(0, 0);
	this._statusWindow.y = Graphics.height - this._statusWindow.height;
    this.addWindow(this._statusWindow);
};

Scene_MShards.prototype.createCommandWindow = function() {
    var wx = this._statusWindow.x;
    var wy = this._helpWindow.height;
    var ww = this._statusWindow.width;
    this._commandWindow = new Window_MShardCommand(wx, wy, ww);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler('equip',    this.commandEquip.bind(this));
    this._commandWindow.setHandler('remove',   this.commandRemove.bind(this));
    this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
    this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._commandWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_MShards.prototype.createSlotWindow = function() {
    var wx = this._statusWindow.width;
    var wy = this._helpWindow.height + this._commandWindow.height;
    var ww = Graphics.boxWidth - this._statusWindow.width;
    var wh = Graphics.boxHeight - this._helpWindow.height - this._commandWindow.height;
    this._slotWindow = new Window_ShardSlot(wx, wy, ww, wh);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
    this._slotWindow.setHandler('cancel',   this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};

Scene_MShards.prototype.createNameWindow = function() {
    var wx = this._statusWindow.width;
    var wy = this._helpWindow.height;
    var ww = Graphics.boxWidth - this._statusWindow.width;
    var wh = this._commandWindow.height;
    this._nameWindow = new Window_ShardName(wx, wy, ww, wh);
    this.addWindow(this._nameWindow);
};

Scene_MShards.prototype.createInfoWindow = function() {
	var ww = Graphics.boxWidth / 2;
    var wx = ww / 2;
    var wh = this._helpWindow.height;
	var wy = Graphics.boxHeight - wh - 20;
    this._infoWindow = new Window_ShardInfo(wx, wy, ww, wh);
    this.addWindow(this._infoWindow);
};

Scene_MShards.prototype.createItemWindow = function() {
    var wx = this._commandWindow.x;
    var wy = this._commandWindow.y + this._commandWindow.height;
    var ww = this._commandWindow.width;
    var wh = Graphics.boxHeight - wy - this._statusWindow.height;
    this._itemWindow = new Window_ShardItem(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};


// Functionality


Scene_MShards.prototype.refreshActor = function() {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
	this._commandWindow.refresh();
	this.updateShardImage();
	this._nameWindow.refresh();
};

Scene_MShards.prototype.commandEquip = function() {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_MShards.prototype.commandRemove = function() {
	this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_MShards.prototype.onItemOk = function() {

	var skillsBefore = this.actor().skills()
    this.actor().changeShard(this._slotWindow.index(), this._itemWindow.item());
	var skillsAfter = this.actor().skills()
	var skillsAdded = skillsAfter.filter(function(a) { return skillsBefore.indexOf(a) < 0 });
	var skillsLost = skillsBefore.filter(function(a) { return skillsAfter.indexOf(a) < 0 });
	
	this._infoWindow.popup(skillsAdded,skillsLost);   // Show and update info window for action information
	this.playSe(skillsAdded,skillsLost);
	
    this._slotWindow.activate();
    this._slotWindow.refresh();
    this._itemWindow.deselect();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
	this._nameWindow.refresh();
};

Scene_MShards.prototype.onItemCancel = function() {
    this._slotWindow.activate();
    this._itemWindow.deselect();
};

Scene_MShards.prototype.onActorChange = function() {
    this.refreshActor();
	this._nameWindow.refresh();
    this._commandWindow.activate();
};

Scene_MShards.prototype.onSlotOk = function() {
	if (this._infoWindow._openness >= 255) {
		// To close info window on press if it's open
		this._infoWindow.close();
	};

	if (this._commandWindow.index() == 0) {
		// Equip
		this._itemWindow.activate();
		this._itemWindow.select(0);
	} else {
		// Remove
		var skillsBefore = this.actor().skills()
		this.actor().changeShard(this._slotWindow.index(), null);
		var skillsAfter = this.actor().skills()
		var skillsAdded = skillsAfter.filter(function(a) { return skillsBefore.indexOf(a) < 0 });
		var skillsLost = skillsBefore.filter(function(a) { return skillsAfter.indexOf(a) < 0 });
		
		this._infoWindow.popup(skillsAdded,skillsLost);   // Show and update info window for action information
		this.playSe(skillsAdded,skillsLost);
		
		this._statusWindow.refresh();
		this._slotWindow.refresh();
		this._itemWindow.refresh();
		this._nameWindow.refresh();
		this._slotWindow.activate();
	};
};

Scene_MShards.prototype.onSlotCancel = function() {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Scene_MShards.prototype.playSe = function(skillsAdded,skillsLost) {
	if (skillsAdded.length + skillsLost.length === 0) {
		SoundManager.playEquip();
	} else if (skillsAdded.length >= skillsLost.length) {
		AudioManager.playSe(Galv.MS.GainSe);
	} else if (skillsLost.length > skillsAdded.length) {
		AudioManager.playSe(Galv.MS.LoseSe);
	} else {
		SoundManager.playEquip();
	};
};





//-----------------------------------------------------------------------------
// Windows
//-----------------------------------------------------------------------------



// Window_ShardStatus
//-----------------------------------------------------------------------------

function Window_ShardStatus() {
    this.initialize.apply(this, arguments);
}

Window_ShardStatus.prototype = Object.create(Window_EquipStatus.prototype);
Window_ShardStatus.prototype.constructor = Window_ShardStatus;

Window_ShardStatus.prototype.numVisibleRows = function() {return 8};

if (Galv.MS.asIcons) {
	Window_ShardStatus.prototype.windowWidth = function() {return 312;};
} else {
	Window_ShardStatus.prototype.windowWidth = function() {return 362;};
};

Window_ShardStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        //this.drawActorName(this._actor, this.textPadding(), 0);
        for (var i = 0; i < 8; i++) {
            this.drawItem(0, this.lineHeight() * i, i);
        }
    }
};




// Window_MShardCommand
//-----------------------------------------------------------------------------


function Window_MShardCommand() {
    this.initialize.apply(this, arguments);
}

Window_MShardCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_MShardCommand.prototype.constructor = Window_MShardCommand;

Window_MShardCommand.prototype.initialize = function(x, y, width) {
    this._windowWidth = width;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_MShardCommand.prototype.windowWidth = function() {return this._windowWidth};
Window_MShardCommand.prototype.maxCols = function() {return 2};

Window_MShardCommand.prototype.makeCommandList = function() {
	var enabled = $gameParty.menuActor()._shardSlots > 0;
    this.addCommand(Galv.MS.equip,   'equip', enabled);
    this.addCommand(Galv.MS.remove, 'remove', enabled);
};



// Window_ShardSlot
//-----------------------------------------------------------------------------

function Window_ShardSlot() {
    this.initialize.apply(this, arguments);
}

Window_ShardSlot.prototype = Object.create(Window_Selectable.prototype);
Window_ShardSlot.prototype.constructor = Window_ShardSlot;

Window_ShardSlot.prototype.initialize = function(x, y, width, height) {
	if (Galv.MS.graphics) {
		var height = Math.max(this.fittingHeight(Galv.MS.maxAllowed),height);
	};
	
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
	if (Galv.MS.graphics) this.opacity = 0;
    this.refresh();
};

Window_ShardSlot.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_ShardSlot.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setSlotId(this.index());
    }
};

Window_ShardSlot.prototype.maxItems = function() {
    //return this._actor ? this._actor.equipSlots().length : 0;
	return this._actor ? this._actor._shardSlots : 0;
};

Window_ShardSlot.prototype.item = function() {
    return (this._actor && this._actor._shards[this.index()]) ? this._actor._shards[this.index()].object() : null;
};

Window_ShardSlot.prototype.refresh = function() {
	
	// Get Linked Shard ID's
	var list = []
	var actor = $gameParty.menuActor();

	for (var i = 0; i < actor._shardSlots;i++) {
		var nextIndex = (i === actor._shardSlots - 1) ? 0 : i + 1;  // Next Shard
		
		var nextShardId = actor._shards[nextIndex] ? actor._shards[nextIndex].object().isShard : 0;
		var thisShardId = actor._shards[i] ? actor._shards[i].object().isShard : 0;
		var toCheck = [nextShardId,thisShardId].sort();

		var sId = Galv.MS.shardMixes[[toCheck[0],toCheck[1]]];
		if (sId) {
			if (!list.contains(i)) list.push(i);
			if (!list.contains(nextIndex)) list.push(nextIndex);
		};
	};
	this.linked = list;

	Window_Selectable.prototype.refresh.call(this);
};

if (Galv.MS.graphics) {
// If Graphics is turned on

Window_ShardSlot.prototype.cursorRight = function(wrap) {this.cursorDown(wrap)};
Window_ShardSlot.prototype.cursorLeft = function(wrap) {this.cursorUp(wrap)};
Window_ShardSlot.prototype.standardPadding = function() {return 0};
Window_ShardSlot.prototype.textPadding = function() {return 0};
	
Window_ShardSlot.prototype.drawSlot = function(x,y,i) {
	var pw = 58;
    var ph = 58;
    var sx = 0;
    var sy = 0;
    var bitmap = ImageManager.loadSystem('MagicOrbSlot');
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);

	if (this.linked.contains(i)) {
		bitmap = ImageManager.loadSystem('MagicOrbSlotLink');
		this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
	};
};

Window_ShardSlot.prototype.setCenter = function(x,y,r) {
	this._cx = x;
	this._cy = y;
	this._radius = r - 15;
};

	
Window_ShardSlot.prototype.itemRect = function(index) {
	var actor = $gameParty.menuActor();
	var gap = 360 / actor._shardSlots;
	var angle = (gap * index - 90) * 0.0174532925;
    return {
        x: Math.cos(angle) * this._radius + this._cx - 29,  // the 29 is half the slot size
        y: Math.sin(angle) * this._radius + this._cy - 29,
        width: 58,
        height: 58
    };
};
	
Window_ShardSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        var rect = this.itemRectForText(index);

        this.changePaintOpacity(this.isEnabled(index));
		this.drawSlot(rect.x,rect.y,index);
		if (this._actor._shards[index] && this._actor._shards[index].object()) {
			var item = this._actor._shards[index].object();
			var o = (58 - Window_Base._iconWidth) / 2;
			this.drawIcon(item.iconIndex, rect.x + o, rect.y + o);
		};
        this.changePaintOpacity(true);
    }
};	
	
} else {
// If Graphics is turned OFF

Window_ShardSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        var rect = this.itemRectForText(index);
        this.changeTextColor(this.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
		if (this._actor._shards[index] && this._actor._shards[index].object()) {
        	this.drawItemName(this._actor._shards[index].object() || null, rect.x, rect.y);
		} else {
			this.changeTextColor(this.normalColor());
			this.drawText(Galv.MS.empty,rect.x,rect.y,rect.width);
		};
        this.changePaintOpacity(true);
    }
};

}; // END GRAPHICS CONDITIONAL

Window_ShardSlot.prototype.isEnabled = function(index) {
    return this._actor ? this._actor.isShardChangeOk(index) : false;
};

Window_ShardSlot.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_ShardSlot.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_ShardSlot.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};

Window_ShardSlot.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
}; 




// Window_ShardItem
//-----------------------------------------------------------------------------


function Window_ShardItem() {
    this.initialize.apply(this, arguments);
}

Window_ShardItem.prototype = Object.create(Window_ItemList.prototype);
Window_ShardItem.prototype.constructor = Window_ShardItem;

Window_ShardItem.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._slotId = 0;
};

Window_ShardItem.prototype.maxCols = function() {return Galv.MS.asIcons ? 4 : 1};
Window_ShardItem.prototype.spacing = function() {return 8};

Window_ShardItem.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

if (Galv.MS.asIcons) {
	Window_ShardItem.prototype.drawItemName = function(item, x, y, width) {
		width = width || 312;
		if (item) {
			var iconBoxWidth = this.lineHeight();
			var padding = (iconBoxWidth - Window_Base._iconWidth) / 2;
			this.drawIcon(item.iconIndex, x + padding, y + padding);
		};
	};
};



Window_ShardItem.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};

Window_ShardItem.prototype.setSlotId = function(slotId) {
    if (this._slotId !== slotId) {
        this._slotId = slotId;
        this.refresh();
        this.resetScroll();
    }
};

if (Galv.MS.showOnlyEquippable) {
	Window_ShardItem.prototype.actorCanEquip = function(item) {
		return this._actor && this._actor.canShardEquip(item);
	};
} else {
	Window_ShardItem.prototype.actorCanEquip = function(item) {
		return true;
	};
}

Window_ShardItem.prototype.includes = function(item) {
	return item && item.isShard && this.actorCanEquip(item);
};

Window_ShardItem.prototype.isEnabled = function(item) {
    return this._actor ? this._actor.canShardEquip(item) : false;
};

Window_ShardItem.prototype.selectLast = function() {
};

Window_ShardItem.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_ShardItem.prototype.updateHelp = function() {
    Window_ItemList.prototype.updateHelp.call(this);
    if (this._actor && this._statusWindow) {
        var actor = JsonEx.makeDeepCopy(this._actor);
        if (this._actor.canShardEquip(this.item())) actor.changeShard(this._slotId, this.item(),true);
        this._statusWindow.setTempActor(actor);
    }
};

Window_ShardItem.prototype.playOkSound = function() {
};



// Window_ShardName
//-----------------------------------------------------------------------------


function Window_ShardName() {
    this.initialize.apply(this, arguments);
}

Window_ShardName.prototype = Object.create(Window_Base.prototype);
Window_ShardName.prototype.constructor = Window_ShardName;

Window_ShardName.prototype.initialize = function(x,y,w,h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
	if (Galv.MS.graphics) this.opacity = 0;
    this.refresh();
};

Window_ShardName.prototype.refresh = function() {
    this.contents.clear();
	var actor = $gameParty.menuActor();
	var width = this.contents.width - this.textPadding() * 2;
    this.drawText(actor.name(), 0, 0, width);
	var equipped = Object.keys(actor._shards).length;
	this.drawText(equipped + "/" + actor._shardSlots, 0, 0, width,'right');
};



// Window_ShardInfo
//-----------------------------------------------------------------------------


function Window_ShardInfo() {
    this.initialize.apply(this, arguments);
}

Window_ShardInfo.prototype = Object.create(Window_Base.prototype);
Window_ShardInfo.prototype.constructor = Window_ShardInfo;

Window_ShardInfo.prototype.initialize = function(x,y,w,h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
	this._openness = 0;
	this._timer = 0;
};

Window_ShardInfo.prototype.update  = function() {
	Window_Base.prototype.update.call(this);
	this._timer -= 1;
	if (this._timer === 0) this.close();
};

Window_ShardInfo.prototype.popup = function(skillsAdded,skillsLost) {
	this.contents.clear();
	var width = this.contents.width - this.textPadding() * 2;
	var line = 0;
	var allowOpen = false;
	
	// Skills Added
	var count = skillsAdded.length;
	if (count > 0) {
		var names = Galv.MS.gained + " ";
		for (var i = 0; i < count;i++) {
			names = names + skillsAdded[i].name;
			if (i < count - 1) names = names + ", ";
		};
		this.changeTextColor("#99ff66");
		this.drawText(names, 0, 0, width,'center');
		allowOpen = true;
		line = 1;
	};
	
	// Skills Lost
	var count = skillsLost.length;
	if (count > 0) {
		var names = Galv.MS.lost + " ";
		for (var i = 0; i < count;i++) {
			names = names  + skillsLost[i].name;
			if (i < count - 1) names = names + ", ";
		};
		this.changeTextColor("#ff6666");
		this.drawText(names, 0, this.lineHeight() * line, width,'center');
		allowOpen = true;
	};

	if (allowOpen) {
		this.open();
		this._timer = 100;
	} else {
		this._timer = 1;
	};
	
};



// GET TXT FILE SHARD MIXTURES
//-----------------------------------------------------------------------------
if (PluginManager.parameters('Galv_MagicShards')["Use Links"] === "true") {

	Galv.MS.file = {}
	
	Galv.MS.file.getString = function(filePath) {
		var request = new XMLHttpRequest();
		request.open("GET", filePath);
		request.overrideMimeType('application/json');
		request.onload = function() {
			if (request.status < 400) {
				Galv.MS.createShards(request.responseText);
			}
		};
		request.send();
	};

	var folder = PluginManager.parameters('Galv_MagicShards')["Folder"];
	if (folder !== "") folder = folder + "/";
	Galv.MS.file.getString(folder + "Shards.txt");

} else {
	// No link shards
	Galv.MS.createShards("");
};

// Yanfly Patch
if (Imported.YEP_AutoPassiveStates) {
	Galv.MS.Game_Actor_passiveStatesRaw = Game_Actor.prototype.passiveStatesRaw;
	Game_Actor.prototype.passiveStatesRaw = function() {
		var pstates = Galv.MS.Game_Actor_passiveStatesRaw.call(this);
		
		// Get passive state data for shard equips
		for (var shard in this._shards) {
			var s = this._shards[shard].object();
			pstates = pstates.concat(this.getPassiveStateData(s));
		};
		return pstates;
	};
};
})();