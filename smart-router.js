system.use("com.joyent.Sammy");


function resources( name , options) {
    
    // var db = new DebugConsole();
    // system.console.log(db.processMessage(this.name));
    
    
    name = name.toLowerCase();
    objName = name.substr(0,1).toUpperCase() + name.substr(1);

    indexUrl    = new RegExp(name+"$|"+name+"\/index");     // -- /task or /task/index
    showUrl     = new RegExp(name+"\/([0-9]+)\/show");      // -- /task/:id/show
    newUrl      = new RegExp(name+"\/new");                 // -- /task/new
    editGetUrl  = new RegExp(name+"\/([0-9]+)\/edit");      // -- /task/:id/edit
    delGetUrl   = new RegExp(name+"\/([0-9]+)\/delete");    // -- /task/:id/delete        
    editUrl     = new RegExp(name+"\/([0-9]+)$");           // -- /task/:id

    var c = eval(objName + "Controller");

    Stack.add(new Sammy.Handler(c['index'],     Sammy.generate_test([Sammy.Test.Method.GET,indexUrl])));
    Stack.add(new Sammy.Handler(c['show'],      Sammy.generate_test([Sammy.Test.Method.GET,showUrl])));
    Stack.add(new Sammy.Handler(c['new'],       Sammy.generate_test([Sammy.Test.Method.GET,newUrl])));
    Stack.add(new Sammy.Handler(c['create'],    Sammy.generate_test([Sammy.Test.Method.POST,indexUrl])));    
 
    Stack.add(new Sammy.Handler(c['update'],    Sammy.generate_test([Sammy.Test.Method.PUT,editUrl])));
    Stack.add(new Sammy.Handler(c['destroy'],   Sammy.generate_test([Sammy.Test.Method.DELETE,editUrl])));
 
    Stack.add(new Sammy.Handler(c['show'],      Sammy.generate_test([Sammy.Test.Method.GET,editUrl])));   
    Stack.add(new Sammy.Handler(c['edit'],      Sammy.generate_test([Sammy.Test.Method.GET,editGetUrl])));
    Stack.add(new Sammy.Handler(c['delete'],    Sammy.generate_test([Sammy.Test.Method.GET,delGetUrl])));    
    
    return this;
    
}

function match(aTest) {
    

    this.segments = [];
//    var db = new DebugConsole();
        
    // How many segments does this path have?
    aSegments = aTest.split('/');
    aSegments.shift();
    
    var re = /^:([a-z0-9]+)$/;
    for (var i=0; i < aSegments.length; i++) {
        if (re.exec(aSegments[i]) != null) {
            var m = re.exec(aSegments[i])[1];
            this.segments.push(m);
        }
    }
    
    var s = ''; 
    // if we have any segments, we need to modify the test
    if (this.segments.length != 0) {
        for(var i=0; i < this.segments.length; i++) {
            s += "\/([a-z0-9]+)";
        }
      base = aTest.substring(0,(aTest.indexOf(":") - 1))
      this.aTest = new RegExp(base + s + "$");
        
    } else {
        this.aTest = aTest;
    }
    

    return this;       
}

function to(option) {    

    var db = new DebugConsole();
    var that = this;
    this.data = {};
    this.data['segment_item'] = [];    
    


    // Convert segments to data with the same name if they dont exist in the option list
    for (var x = 0; x < this.segments.length; x++) {
        if (option) {
            //system.console.log("=== Looking for Segment === " + this.segments[x] );
            if (option[this.segments[x]]) {
                //system.console.log("=== Option Exists for Segment === " + option[this.segments[x]] );
                this.data[this.segments[x]] = option[this.segments[x]];
                this.data['segment_item'].push(this.segments[x]);                
            } else {
                //system.console.log("=== No Option, PUSH it === ");
                this.data['segment_item'].push(this.segments[x]);
            }
        } else {
            //system.console.log("=== No Option, PUSH it === ");
            this.data['segment_item'].push(this.segments[x]);            
        }
            
    }

    if (size(option) != 0) {
        for(var i in option ) {            
            this.data[i] = option[i];
        }
    }
    
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET,that.aTest]), this.data ));
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.POST,that.aTest]), this.data ));
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.PUT,that.aTest]), this.data));
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.DELETE, that.aTest]), this.data));


   return this;    
}


Router = {}
Router.Handler = function( shouldRun, p ) {
    this.name = "unnamed";
    this.test = shouldRun;

    this.run  = function() {

        args = [];
        var dict = {};
        dict['params'] = {};

        // Asign the arguments to the keys
        for(var a = 0; a < arguments.length; a++ ) {
            dict['params'][p['segment_item'][a]] = arguments[a];
        }
        
        dict['params']['controller'] = (p.controller || dict['params'].controller);
        dict['params']['action'] = (p.action || dict['params'].action );

        args.push(dict);

        aFunction = getConctoller(dict['params'].controller , dict['params'].action );
    
        var result = aFunction.apply(this,args);
        if ( result ) {
            var response = Stack.response;
            response.body = result;
            return response;
        } else {
            return null;
        }
    };
};



var getConctoller = function(c,a) {
    var name = c.toLowerCase();
    var objName = name.substr(0,1).toUpperCase() + name.substr(1);
    var c = eval(objName + "Controller");
    return c[a];
}


size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;   
}
