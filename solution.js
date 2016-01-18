{
    init: function(elevators, floors) {
        // set up each elevator behavior
        var num = 0;
        _.each(elevators, function(elevator) {
           elevator.elevatorNum = num++;
           elevator.on("idle", function(){
               elevator.goToFloor(Math.floor(floors.length/2));
           });
           elevator.on("floor_button_pressed", function(floorNum){
               // queue up floor
               elevator.goToFloor(floorNum);
               // resort queue based on direction to keep elevators moving optimally
               if(elevator.destinationDirection() == "up") {
                   elevator.destinationQueue = elevator.destinationQueue.sort(function(a,b){return a-b;});
               }
               if(elevator.destinationDirection() == "down") {
                   elevator.destinationQueue = elevator.destinationQueue.sort(function(a,b){return b-a;});
               }
               elevator.checkDestinationQueue();
           });
        });
        // apply behavior to each floor
        _.each(floors,function(floor){
            floor.on("up_button_pressed down_button_pressed", function(){
                console.log("floor " + floor.floorNum() + " had a button pressed")
                // find an elevator to send to that floor
                _.find(elevators, function(elevator){
                    // prefer an idle elevator to send to the floor
                    if (elevator.destinationQueue.length === 0) {
                        console.log("found idle elevator");
                        elevator.goToFloor(floor.floorNum());
                        console.log(elevator.destinationQueue);
                        return true;
                    }
                    console.log("couldn't find an idle elevator");
                    // otherwise find an elevator headed that way
                    if ((elevator.destinationDirection() == "up" && elevator.currentFloor() < floor.floorNum()) || 
                        (elevator.destinationDirection() == "down" && elevator.currentFloor() > floor.floorNum())
                       ) {
                        console.log("found an elevator headed towards that floor")
                        elevator.goToFloor(floor.floorNum());
                        console.log(elevator.destinationQueue);
                        return true;
                    }
                    
                });
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
