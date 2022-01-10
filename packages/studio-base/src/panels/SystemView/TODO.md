# Tasks

* Merge Audrow's changes
* Merge nodes and edges into elements (state) so that rendering happens in one pass upon setElements
* Perform an initial off-screen rendering so that nodes have sizes when laying out
    * Hopefully, dynamic size changes don't layout in an ackward way (like nodes flipping sides)
* Limit length of title string (use "...")
* Fix the "Filter nodes" counter (right justify; see RosNode header for 'flex' layout)
* Change border style for RosNodes upon select
* Change border style for RosTopics upon select
* Change highlight color for 'X' in RosNode
* Remove RosNode upon clicking 'X'
* Split out connection points, per topic