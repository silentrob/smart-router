# Smart Router #

A Merb like router for the Joyent Smart Plaform.


## Syntax ##

    match('/index.html').to({ controller: 'Home', action: 'index' });
    match('/:controller/:action/:id').to();
    
    // Simple Resource Support
    
    resources('task'); 
    /*
     Generates 
        /tasks/index        GET
        /tasks/:id/show     GET
        /tasks/new          GET | POST
        /tasks/update       PUT
        /tasks/:id/edit     GET | PUT
        /tasks/:id/delete   GET | DELETE        
    */
    
##  Smart Controller ##

      HomeController = {
        index : function (data) {  
          return "This is a Controller";
        },
    
        home : function (data) {    
          return "This is the Home action"; 
        }    
      }
   
   
Controllers are just object literals that return a string. The name must start with a capital and end in 'Controller'.

Params are passed into the conroller via 'params'. So data.params.id, data.params.controller, etc.

## Preview Release ##
There are bugs, you have been warned :) Please fork, comment, and help me make this better.


## The MIT License ##

Copyright (c) 2009 Rob Ellis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.    