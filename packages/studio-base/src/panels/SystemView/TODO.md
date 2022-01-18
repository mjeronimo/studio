# System Viewer Task List

## Features/Changes/Ideas
* Add "default layout direction" to the settings panel
* Add the edge style to the settings panel
* Implement "Include hidden topics"
* Split out connection points, per topic
    * Select connection point
    * Show connection point QoS
    http://www.menucool.com/tooltip/css-tooltip
* Perform an initial off-screen rendering so that nodes have sizes when laying out
    * Hopefully, dynamic size changes don't layout in an awkward way (like nodes flipping sides)
* Show full name in tooltip if ROSNode name is truncated ("...")

## Bugs
* The pop-up panels are larger than appearance (prohibiting clicks and hovers)
* Fix the "two nodes at the same level" issue
* When the NodeList is expanded and the user removes a node by using the node's 'X', the NodeList isn't updated
* With multiple SystemView panels, the X doesn't work correctly on the first one (it affects nodes in the second).

## Done
* Fix the "Filter nodes" counter (right justify; see RosNode header for 'flex' layout)
* Change highlight color for 'X' in RosNode
* Change border style for RosNodes upon select
* Change border style for RosTopics upon select
* Selecting checkbox in node list does not layout again
* Limit length of ROSNode name string (use "...")
* Manual layout: Add layout button to NodeList
* Change the 'interactive' default (and remove the lock/unlock button)
* Remove RosNode upon clicking 'X'
* Move the layout direction to the Settings panel (save and restore a configuration)
* Merge nodes and edges into elements (state) so that rendering happens in one pass upon setElements