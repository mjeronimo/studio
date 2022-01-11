# Features/Changes
* Add layout button to NodeList
* Remove RosNode upon clicking 'X'
* Merge nodes and edges into elements (state) so that rendering happens in one pass upon setElements
* Move the layout direction to the Settings panel
* Perform an initial off-screen rendering so that nodes have sizes when laying out
    * Hopefully, dynamic size changes don't layout in an awkward way (like nodes flipping sides)
* Limit length of title string (use "...")
    * Show full name in tooltip (if ends in "...")
* Split out connection points, per topic
    * Select connection point
    * Show connection point QoS

# Bugs
* The pop-up panels are larger than appearance (prohibiting clicks and hovers)
* Fix the "two nodes at the same level" issue

# Done
* Fix the "Filter nodes" counter (right justify; see RosNode header for 'flex' layout)
* Change highlight color for 'X' in RosNode
* Change border style for RosNodes upon select
* Change border style for RosTopics upon select
* Selecting checkbox in node list does not layout again
