# TODO

1. ~~Reorder the keyframe fields before being sent so they match the Arduino expectations (high
priority)~~
1. Proper keyframe validation

   1. ~~All fields filled (not undefined, which is probably the current issue)~~
   1. ~~Sorted by time~~
   1. ~~Without *direct* time collisions~~
   1. Within acceptable parameters

1. Bug / Behavior Fix

   1. ~~Add keyframe view only checks for unique times for new keyfames - when
      editing the current keyframe list or a favorite keyframe list a clash
      is never checked for.~~

      See $scope.addKeyFrame in that AddKeyframeCtrl (controllers.js)

1. GUI Updates and Cleanup

   - Cleanup

     1. ~~Remove Toggle BT from left pane that does nothing (or edit to do something)~~
       
        Now notifies user to check BT settings if no devices are found

     1. ~~Add dropdown views for individual keyframe info~~ 

     1. ~~Add dropdown views for individual device info~~

     1. Convert KeyframeList and ~~KeyframeAdd~~ controllers to use 
        keyframe constructor from keyframeservice. 

     1. Possibly convert localStorage use to sqlite if problems occur.

     1. ~~Fix ionicPopup css to handle 3 horizontal buttons (for keyframe editing).~~

   - Updates
     1. Add ~~editing~~ / ~~deleting~~ of existing keyframes
        
	Should favorites be directly editable?

     1. ~~Add preloaded keyframes~~

     1. ~~Allow users to save keyframes to favorites~~

     1. Add a track view for adding keyframes (v 2)

1. Add logging (low priority)

   1. Internal app logging
   1. Logging from Arduino (requires changes to Arduino)

1. API Handling

   1. ~~Add Create User and Login View~~

      This can be found in the side menu now and runs against our [backend API](http://www.github.com/jhstanton/DSLR-App-API)
   
   1. Add Ability to Store and Download Keyframes Remotely

      Mostly done! This is possible now (both storing and retrieving). However, this could be smarter. Keyframe sets
      should be stored locally with their backend key if possible so that duplicates are not shown when retrieving keyframes.