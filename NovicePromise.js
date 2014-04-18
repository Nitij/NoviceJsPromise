(function (w, undefined) {

    var RESOLVED_KEYWORD = 'resolved',  //constant for resolved state
        REJECTED_KEYWORD = 'rejected';  //constant for rejected state

    //function to find out if the passed parameter is function or not
    function isFunc(f) {
        return typeof f == 'function';
    }

    var deferred = function () {
        //this function will be called whenever our promise is resolved
        this.resolvedFunc = function (data) {
            //increase tick to get to the next callback
            this.callTick++;
            //construct our key name
            var resolvedKey = RESOLVED_KEYWORD + this.callTick;

            //if our callback is defined then call it and pass the parameters
            if (this.resolved[resolvedKey])
                this.resolved[resolvedKey](data);
        };

        //this function will be called whenever our promise is rejected
        this.rejectedFunc = function (e) {
            //increase tick to get to the next callback
            this.callTick++;
            //construct our key name
            var rejectedKey = REJECTED_KEYWORD + this.callTick;

            //if our callback is defined then call it and pass the parameters
            if (this.rejected[rejectedKey])
                this.rejected[rejectedKey](e);
        };

        //internal function to push callbacks to our promise chain
        this.pushToPromiseChain = function (onResolved, onRejected) {
            //first increase the tick count
            this.tick++;

            //construct the key names based on the resolved or rejected 
            //callback function
            var resolvedKey = RESOLVED_KEYWORD + this.tick,
                rejectedKey = REJECTED_KEYWORD + this.tick;

            //if a valid resolved callback is passed then set push to the object
            //else set to undefined
            if (isFunc(onResolved)) this.resolved[resolvedKey] = onResolved
            else this.resolved[resolvedKey] = undefined;

            //if a valid rejected callback is passed then set push to the object
            //else set to undefined
            if (isFunc(onRejected)) this.rejected[rejectedKey] = onRejected
            else this.rejected[rejectedKey] = undefined;
        };

        //this will contains functions mappings for resolved callbacks;
        this.resolved = {};

        //this will contains functions mappings for rejected callbacks;
        this.rejected = {};

        //this is used to increment the callback counter while adding new resolved
        //or rejected callbacks
        this.tick = -1;

        //this is used to construct the key names while calling our resolved
        //or rejected callbacks
        this.callTick = -1;

    };
    deferred.prototype = {
        //this will execute the function passed as a parameter.
        //The passed function must have implemented success and failure callbacks
        //to this deferred object
        'when': function (func) {
            if (isFunc(func)) {
                //call the passed function parameter
                func();

                //return our deferred object so that it can be chained together
                return this;
            }
            else {
                throw PARAM_NOT_FUNCTION_ERROR;
            }
        },

        //this is used to chain callbacks
        'then': function (onResolved, onRejected) {
            //call this common function as 'then' and 'done' are mostly the same
            this.pushToPromiseChain(onResolved, onRejected);

            //return our deferred object so that it can be chained together
            return this;
        },

        //this will not chain the callbacks and is used to determine the end of an 
        //async operation
        'done': function (onResolved, onRejected) {
            //call this common function as 'then' and 'done' are mostly the same
            this.pushToPromiseChain(onResolved, onRejected);
        }
    }

    //attach our object to the window.
    w['Deferred'] = deferred;

})(window);