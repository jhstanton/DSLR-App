angular.module('dslr.controllers', ['dslr.services', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, BluetoothService, $ionicPopup, Debug) {
    var textarea = document.getElementById("logRegion");

    $scope.debug    = false; 
    $scope.debugLog = Debug.getDebugLog();

/*    if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()){
	$scope.bluetoothEnabled = BluetoothService.enabled();
    }*/
    $scope.clearDebugLog = function(){
	Debug.clearLog();
	$scope.debugLog = Debug.getDebugLog();
	textarea.style.height = 0;
    };
    $scope.toggleBT = function(){
	alert('HERE!');
	$scope.bluetoothEnabled = BluetoothService.enabled();
	alert($scope.bluetoothEnabled);
	alert('LAST');
    };
    $scope.toggleDebug = function() {
	Debug.toggleDebug();	
	$scope.debug = Debug.getDebug();
    };
    
    var updateLog = function() {
	if(Debug.getDebug()){
	    BluetoothService.getDebugLines().forEach(function(line){
		Debug.appendLog(line);
	    });
	    $scope.debugLog = Debug.getDebugLog();
	} else { // this should be pulled eventually
	    $scope.debugLog += 'Not debugging right now.\n';
	}
	textarea.style.height = textarea.scrollHeight + "px";
    };

    ionic.on('click', updateLog, document);
    ionic.on('swipeleft', updateLog, document);
})

.controller('KeyframeListCtrl', function($scope, $q, $stateParams, $ionicPopup, 
					 $state, KeyframeService, Debug, 
					 BluetoothService, $ionicLoading){
    $scope.keyframes = []; //KeyframeService.getKeyframes();

    $scope.paired         = false;
    $scope.loadingDevices = false;

    $scope.totalDuration = 0;
    $scope.bluetoothInitialized = false;
    $scope.devices = [];
    
    $scope.ready = function(){
	return $scope.keyframes.length >= 2 && $scope.bluetoothInitialized; // && $scope.paired && BluetoothService.enabled 
    };

    $scope.send = function(){ 
	if(Debug.getDebug()){
	    $ionicPopup.alert({
		title    : 'Frames Sent!',
		template : 'Buffer: ' + KeyframeService.buildKeyframeBuffer($scope.keyframes)
	    });
	}
    };
    $scope.pairCarriage = function(){
	$scope.loadingDevices = true;
	BluetoothService.discover().then(function(devices){
	    $scope.loadingDevices = false;
	    $scope.devices = devices;
	});
    };
  
  $scope.addKeyframe = function() {
      $state.go('app.single_keyframe');      
  };

  $scope.$watch(function(){
      return BluetoothService.getInitialized()
  }, function(newInit, _){
      $scope.bluetoothInitialized = newInit;
  });

  $scope.$watch(function(){
      return $scope.loadingDevices;
  }, function(newLoadingDevices, oldLoadingDevices){
      if(newLoadingDevices){ // loading device list right now
	  $ionicLoading.show({
	      templateUrl: "templates/loading.html"
	  });
      } else {
	  $ionicLoading.hide(); // done loading

	  // do stuff with bluetooth devices here!	  
      }
  });

  $scope.$watch(function(){
      return KeyframeService.getKeyframes();
  }, function(newframes, _){
      $scope.keyframes = newframes;
  }); // these 2 watches might be easily combined

  // watch the length of the keyframes - first function is the watching function, second is the comparator
  $scope.$watch(function(){
      return $scope.keyframes.length;
  }, function(newLength, _) {
      if(newLength >= 2){ // minimum of 2 frames are required to transmit
	  $scope.totalDuration = $scope.keyframes[newLength - 1].time - $scope.keyframes[0].time;
      } else { 
	  $scope.totalDuration = 0;
      }
  });

})

.controller('AddKeyframeCtrl', function($scope, $stateParams, $state, $ionicPopup, KeyframeService){
    $scope.newFrame = {};
    $scope.addKeyframe = function(){
	var parsedKeyframe = {};
	for(key in $scope.newFrame){
	    parsedKeyframe[key] = Number.parseInt($scope.newFrame[key]);
	}
	
	if(!Number.isNaN(parsedKeyframe.time) &&
	   !Number.isNaN(parsedKeyframe.position) &&
	   !Number.isNaN(parsedKeyframe.panAngle) &&
	   !Number.isNaN(parsedKeyframe.tiltAngle)){

	    if(KeyframeService.uniqueTime(parsedKeyframe)){		
		KeyframeService.appendKeyframe(parsedKeyframe);
		$scope.newFrame = {};
		$state.go('app.keyframes');
	    } else {
		$ionicPopup.alert({
		    title : 'Malformed Keyframe!',
		    template : 'This frame time clashes with another'
		});
	    }
	}else {
	    $ionicPopup.alert({
		title: "Malformed Keyframe",
		template:  "All fields must be numeric"
	    });
	}     
    }; 
});
