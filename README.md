# A3 SPA: Personal Web Desktop
## Description
PWA is a in-browser window manager build with vanilla javascript. The application is a single page application that enable the user to open multiple applications on the same time using a virtual desktop enviorment.

## Features
The app features includes the following.
###  The Window Manager:
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

### Memory Game
1. Player can play multiple games at the same time.
1. The game has three difficulties.
1. The difficulties vary in size.
1. The game has a 60 seconds time limit.
1. Upon completing the game the player is presented with the number of atempts and the time it took to complete the game.

### Chat App
1. Several chat applications can run at the same time.
1. The username can be changed.
1. The username is retained.
1. Channel can be changed.
1. The application supports emojis.
1. The messages are cached when received.
1. Cached messages are loaded when listening to a channel.
1. The chat window is resizable.

### Camera App
1. Stream and webcam feed into a window.
1. Using the mouse wheel, scrolling (up/down) controls the brightness.
1. Using the mouse wheel and ctrl-key, scrolling (left/right) controls the contrast.
1. Camera window is resizable

### Paint App 
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

All of the application are classes the extends the class ```Application``` and has a template that includes the main HTML of the application body. Each application has a name, icon, options and id, the id is used to query the template of the application. The classes are registered in the ```Desktop``` object and constructed/initilized each time the application is opened.