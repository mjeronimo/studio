# System Viewer Task List

## Features/Changes
* Move the layout direction to the Settings panel (save and restore a configuration)
* Show full name in tooltip if ROSNode name is truncated ("...")
* Split out connection points, per topic
    * Select connection point
    * Show connection point QoS
* Remove RosNode upon clicking 'X'

## Bugs
* The pop-up panels are larger than appearance (prohibiting clicks and hovers)
* Fix the "two nodes at the same level" issue

## Done
* Fix the "Filter nodes" counter (right justify; see RosNode header for 'flex' layout)
* Change highlight color for 'X' in RosNode
* Change border style for RosNodes upon select
* Change border style for RosTopics upon select
* Selecting checkbox in node list does not layout again
* Limit length of ROSNode name string (use "...")
* Manual layout: Add layout button to NodeList
* Change the 'interactive' default (and remove the lock/unlock button)

## Postponed/Not Needed
* Merge nodes and edges into elements (state) so that rendering happens in one pass upon setElements
* Perform an initial off-screen rendering so that nodes have sizes when laying out
    * Hopefully, dynamic size changes don't layout in an awkward way (like nodes flipping sides)
