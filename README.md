# A3 SPA: Personal Web Desktop
### Description
PWA is a in-browser window manager build with vanilla javascript. The application is a single page application that enable the user to open multiple applications on the same time using a virtual desktop enviorment.

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
