# A3 SPA: Personal Web Desktop
## Description
PWA is a in-browser window manager build with vanilla javascript. The application is a single page application that enable the user to open multiple applications on the same time using a virtual desktop enviorment.

## Video Presentation
<a href="https://drive.google.com/drive/folders/132gk_-kVuzacOTmswTB-Wc4Xi-BB0zWQ?usp=drive_link">Video Link (Google Drive)</a>

## Features
The app features includes the following.
### <img src="src/img/favicon.svg" width="18"/>  The Window Manager:
1. Application can be open by clicking on the desktop icon.
1. You can open multiple instances of the same application.
1. The Windows can be moved, minimized and *optionally* resized or maximized.
1. Every resizable window can be resized by clicking and dragging of the arrow icon on the bottom right of the window.
1. Interacting with a window will focus it, put it to the front and unfocus other windows.
1. Using the taskbar you can navigate between the windows.
1. Clicking on the task icon of a window in the taskbar will minimize the window if the window is in focus else the window will get focused first.
1. When a window is maximized it retain its size the position and return to it when exiting fullscreen.
1. Dragging a window in fullscreen will minimize the window.
1. A Window cannot be dragged on the taskbar or outside the desktop.
1. After opening multiple windows the windows will stack by moving the new window. 

### <img src="src/img/memory.svg" width="18"/> Memory Game
1. Player can play multiple games at the same time.
1. The game has three difficulties.
1. The difficulties vary in size.
1. The game has a 60 seconds time limit.
1. Upon completing the game the player is presented with the number of atempts and the time it took to complete the game.

### <img src="src/img/chat.svg" width="18"/> Chat App
1. Several chat applications can run at the same time.
1. The username can be changed.
1. The username is retained.
1. Channel can be changed.
1. The application supports emojis.
1. The messages are cached when received.
1. Cached messages are loaded when listening to a channel.
1. The chat window is resizable.

### <img src="src/img/camera.svg" width="18"/> Camera App
1. Stream and webcam feed into a window.
1. Using the mouse wheel, scrolling (up/down) controls the brightness.
1. Using the mouse wheel and ctrl-key, scrolling (left/right) controls the contrast.
1. Camera window is resizable

### <img src="src/img/paint.svg" width="18"/> Paint App 
1. The window and the canvas is resizable.
1. User can draw on the canvas with the mouse.
1. Pen color and size can be changed
1. User can erase the with an eraser tool.

## Implementation
This a submition for the third assignment *JavaScript* SPA implements all the required features (F1-F5) as well as the optional features (F6-F8).

### 1. PWD Functional requirements
The baseline of the application are 3 classes ```Desktop```, ```WMWindow``` and ```Taskbar```. 

The first class ```Desktop``` is responsble for the opening the application by creating a window object and linking the application contents to the window element as well as creating a desktop icon on the registration of an application and managing the ```Taskbar```. Handling of the moving resizing the a window is also the responsiblity of the ```Desktop``` class.

Upon constructing a ```WMWindow``` object a window element will be created dynamiclly based on the argument that the application requires *i.e if the window is resizable.* The following features are also implemented by the ```WMWindow``` :
 - Windows should get focus when clicked/dragged.
 - The icon used to close the window should be represented in the upper bar of the window.
 - The window with focus shall be on top of all other windows.

The third feature in the functional requirments "The user shall be able to drag and move the windows inside the PWD." is implemented in both ```Desktop```and ```WMWindow``` the reasoning for this is that the desktop element is the drop zone while the draggable object is the window element.

> The explination for the implementation of the built-in applications are written in F3, F4 and F5.


### 2. PWD Non functional requirements

The styling of the window manager is design from scratch, All of the icon used are from [papirus-icon-theme](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme).

The stylesheet for the window manager is seperated from the styling of the application although they share a very similar style. The Chat and the memory game uses some animation to enhance the interactivity.

The code is well organized in to a separate class that is resides in an ES modules, and all the functions are documented using JSDoc.

All of the applications are classes the extends the class ```Application``` and has a template that includes the main HTML of the application body. Each application has a name, icon, options and id, the id is used to query the template of the application. The classes are registered in the ```Desktop``` object and constructed/initilized each time the application is opened.

### 3. Memory Game Window Application

Upon opening an instance of the game the user is presented with a start screen containing 3 buttons with one for each difficulty, based on the chose of the user the game code renders a grid or randomly selected video games' icons, initially the cards are flipped when the user click on the first card the image appears and what for the next flip, if the next flipped card does not contain the same image both cards are flipped to the hidden state. Otherwise, cards stay visible and the procedure repeat until all cards are visible of the time remaining reaches 0 seconds.
The game window cannot be resized or maximized, however depending on the difficulty the code changes the size of the window dynamically to accommodate the number of cards. 

To randomize the cards the code contains array of paths for all the images, the array is randomize  using ```Math.random()``` every game, trimmed to the number of images that need, doublicated to the number of cards then randomized one more time.

All the cards are creating dynamically.

### 4. Chat Application Window

The chat application implements a front-end user interface to the websocket chat service that is provided with the assignment. The connection with the websocket service is handled by the class ```ChatService``` where it is instantiated for each instance of the chat application (new window). 

The ```ChatService``` accept an username, channel and a callback method to handle receviving a message from the connection. It also handles sending messages.
Both channel name and username can be changed in a running application. Changing the username also get saved in the Session storage and set as the default for the next window opened.
While the user on a channel all the recevied messages are cached, listening on channel with cached messages will get loaded to and instance of chat app.

In chat app the user also is able to use a limited number of emojis.

### 5. An additional window application
For the additional application I added two apps, the first window application is a simple painting app *Paint* where the user can draw using the mouse with different colors and line width.
The colors can be selected my clicking to one of the available colors on the bottom of the canvas.
The paint app uses mainly the ```canvas``` element.
Both of the additional apps can be resized and set to full screen.


I also implemented a simple camera app that can display the feed from a webcam to a window. In the *Camera* Using the scroll wheel and scrolling vertically changes the brightness, and horizontally changes the contrast of the feed. The application works by requesting the feed of the webcam through the ```Navigator``` and rendering the feed to an ```video``` element

### 6. An enhanced chat application

The added enhancements were previously explained in the 4th section "*Chat Application Window*"

### 7. Additional enhancements
Improvements to the PWD includes the ability for the window to be set to full-screen this is achieved by changing the size of the window to size of the view port minus the taskbar and change how to handle dragging for a window in full-screen mode, where when dragging starts the will first gets a window minimized
When maximizing the window, the current size and placement is saved and then used to place the window into its original place when exiting full-screen mode.

Windows can be rescaled/resized. Using the drag and drop API dragging the right bottom of a window changes the size of the window. This is implemented similarly to the window moving.

The application uses the *Taskbar* to keep track of the opened window, each window has its own task entry in the taskbar. Clicking on a task will focuses the window unless the window is in focus, then the window will be minimized. The Taskbar also highlights the focused window.

The Memory game has a time limit, if the user did not open all the cards on time, a message will pop up finishing the game and presenting the user with the option to try again.

### 8. Documentation on code structure

<img src="diagram.svg"/>


The code is structured into modules, each module contain an class, the class ```Desktop``` is responsble for the opening the application by creating a window object and linking the application contents to the window element as well as creating a desktop icon on the registration of an application and managing the ```Taskbar```. Handling of the moving resizing the a window is also the responsiblity of the ```Desktop``` class.

Upon constructing a ```WMWindow``` object a window element will be created dynamiclly based on the argument that the application requires *i.e if the window is resizable.*
Drag and move the windows is implemented in both ```Desktop```and ```WMWindow``` the reasoning for this is that the desktop element is the drop zone while the draggable object is the window element.

All of the window applications are classes the extends the class ```Application``` and has a template that includes the main HTML of the application body. Each application has a name, icon, options and id, the id is used to query the template of the application. The classes are registered in the ```Desktop``` object and initialized each time the application is opened.
This feature makes this project easy to improve by adding unlimited number of other applications without changing the base code that handles the windows and the desktop itself.

## Installation

To download and start the application, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone git@gitlab.lnu.se:1dv528/student/nm222ra/a3-spa.git
    ```

2. Navigate to the project directory:

    ```bash
    cd a3-spa
    ```

3. Use npm to install the required packages:
    ``` bash
    npm i
    ```

4. Build and run the project:
    ``` bash
    npm run build && npm run serve
    ```


## Linters

This project includes linting tools to maintain code quality. To execute the linters:


1. Install dependencies:

    ```bash
    npm install
    ```

2. run the linters using the command:

    ```bash
    npm run lint
    ```


These commands will analyze your code and provide feedback on code quality and style adherence.
