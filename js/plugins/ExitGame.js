//----------------------------------------------------------------------------------------------------------------------
//ExitGame.js
//----------------------------------------------------------------------------------------------------------------------
/*:
 * @plugindesc Adds a quit button to the main menu and to the in game menu.
 * @author Brian Howard
 *
 * @param ButtonText
 * @desc What you want the Exit Game button to say.
 * @default Exit
 *
 * @help To use this plugin, move it to your plugins folder inside your project.
 */

(function() {

    var params = PluginManager.parameters('ExitGame');
    var sceneTitleWindow = Scene_Title.prototype.createCommandWindow;
    var windowTitleCommandList = Window_TitleCommand.prototype.makeCommandList;
    var sceneGameEndWindow = Scene_GameEnd.prototype.createCommandWindow;
    var windowGameEndCommandList = Window_GameEnd.prototype.makeCommandList;
    var textExit = String(params['ButtonText'] || 'Exit');

    //This code handles the title menu exit
    Window_TitleCommand.prototype.makeCommandList = function() {
        windowTitleCommandList.call(this); //calls the original makeCommandList function
        this.addCommand(textExit, 'exitGame'); //adds the command to the list of commands
    };

    Scene_Title.prototype.createCommandWindow = function () {
        sceneTitleWindow.call(this); //calls the original makeCommandWindow function
        this._commandWindow.setHandler('exitGame', this.commandExitGame.bind(this)); //draws the exitGame command/binds the function to this button
    };
    
    Scene_Title.prototype.commandExitGame = function() {
        this._commandWindow.close(); //closes the window
        this.fadeOutAll(); //fades out the screen
        SceneManager.exit(); //closes the actual game
    };

    //This code handles the ingame exit
    Window_GameEnd.prototype.makeCommandList = function() {
        windowGameEndCommandList.call(this); //calls the original makeCommandList function
        this.addCommand(textExit, 'exitGame');
    };

    Scene_GameEnd.prototype.createCommandWindow = function() {
        sceneGameEndWindow.call(this); //calls the original createCommandWindow function
        this._commandWindow.setHandler('exitGame', this.commandExit.bind(this));
    };

    Scene_GameEnd.prototype.commandExit = function() {
        this.fadeOutAll(); //fades out the screen
        SceneManager.exit(); //closes the actual game
    }
})();
