Rails App with JavaScript Frontend Spec

Project Specs:
[x]Must have a Rails Backend and new requirements implemented through JavaScript.
[x]Makes use of ES6 features as much as possible (e.g Arrow functions, Let & Const, Constructor Functions)
[x]Must translate the JSON responses into Javascript Model Objects using either ES6 class or constructor syntax. 
[x]Must render at least one index page (index resource - 'list of things') via JavaScript and an Active Model Serialization JSON Backend.
Examples:
-Rendering all workout routines belonging to a client on that client's show page.
-Rendering all training guides belonging to a trainer on that trainer's show page.
-Rendering an index of workout routines after clicking a link in the navigation
-Rendering an index of exercise movements after clicking a link in the navigation

[x]Must render at least one show page (show resource - 'one specific thing') via JavaScript and an Active Model Serialization JSON Backend.
Example:
-I allow a user to peruse exercise movements by clicking 'Next' and 'Previous' buttons on the movement's show page.
-In config/routes.rb, I first defined the 2 custom routes: 
get '/movements/:id/next' => 'movements#next' and get '/movements/:id/previous' => 'movements#previous'
-When the user clicks the button to view the next exercise, I call .fetch(\`/movements/${id}/next\`)
-This route maps to #next action in MovementsController.
-Due to before_action :set_movement, private method #set_movement is called before movements#next.
-In #set_movement I use the :id route variable from the URL to find the current @movement instance I'm viewing
-In movements#next, I call #next instance method on the @movement instance I'm currently viewing
-The instance method #next, defined in Movement model, will return the first instance in the collection of movements whose ids are greater than the current @movement instance's id, and if none exists, will return the first movement stored in the DB
-movements#next will render a JSON representation of the next movement
-In JS function Movement.showNextOrPreviousListener, .fetch() returns a promise, and I resolve this promise by tacking on .then() and passing in a callback arrow function, in which I get back my response. 
-I want to return the response as json, hence: .then(response => response.json())
-However, another promise is returned from this, which I must resolve by tacking on another .then(Movement.show)
-Here, I pass in Movement.show, which stores a function whose parameter, movementObject, is the JSON object representation of the next movement to view.
-I created a Handlebars template to show the next/previous movement
-This Handlebars template is found inside script#show-movement-template
-In Movement.compileShowMovementTemplate, I get the HTML string template inside script#show-movement-template
-I compile this string HTML template source code, along with the variables found between the Handlebars delimiters, as part of a function that I can invoke with a context object.
-In Movement.show, I first generate a new movement object: let newMovement = new Movement(movementObject)
-I call .formatShow() prototype method on the newMovement object.
-When called, .formatShow() prototype method invokes Movement.showMovementTemplateFunction(), passing in the newMovement object,
(i.e. this), as its argument.
-The names of variables between Handlebars delimiters in #show-movement-template have the same names as the keys in the newMovement object.
-When formatShow() invokes Movement.showMovementTemplateFunction(this), I inject the values corresponding to keys in newMovement object, to replace the variables of the same name in the template.
-The HTML template with values injected from the newMovement object becomes the inner HTML inside 'div.container'
-Therefore, the next movement has been fetched via AJAX (the FETCH API) and is rendered through JS and the JSON backend.

[x]Your Rails application must reveal at least one `has-many` relationship through JSON that is then rendered to the page.
Example:
-Each exercise movement has_many training guides, so I render guides belonging to the movement on that movement's show page.
-If a movement has guides that belong to it, there is a link to View Training Guides (a.movement-guides) on the movement show page
-In Guide.indexHandler, when the link is clicked, I send an AJAX GET request via $.get(\`/movements/${id}/guides\`)
-This endpoint maps to #index action in GuidesController.
-In guides#index, I render a JSON representation of all guides belonging to the specific movement = an array of guide objects
-In Guide.index, the function accepts the guidesArray of guide objects as its parameter.
-I iterate over the array of guide objects using .forEach(), and for each one:
  -I create a new guide object: let newGuide = new Guide(guideObject)
  -I call prototype method .formatShow() on this guideObject
  -I append the resulting HTML for that guide inside div#training-guides

[x]Must use your Rails application to render a form for creating a resource that is submitted dynamically through JavaScript.
Example:
-A user (client) submits the form to create a new workout routine.
-The form data is serialized and submitted via an AJAX POST request: $.post('/routines'). 
-This endpoint maps to #create action in RoutinesController. 
-If a valid routine is created and saved to the DB, routines#create renders a JSON object representation of this newly created routine.
-In Routine.create function, I create a newRoutine object from the JSON object representation: 
let newRoutine = new Routine(routineObject)
-I call prototype method .formatAndPresentPreview() on this newRoutine object, which will use the newRoutine object as the context passed to a Handlebars template function.
-newRoutine.formatAndPresentPreview() invokes the function Routine.routineTemplateFunction(this), where this is the newRoutine object on which I'm calling the prototype method formatAndPresentPreview()
-I created a Handlebars template inside script#routine-template
-The variables between the Handlebars delimiters in this template get compiled along with the template string HTML as part of a function that can be invoked with a context object. 
-Because the variables between the Handlebars delimiters have the same names as the keys in newRoutine object, I can use the values corresponding to these keys in newRoutine object to replace the variables.
-The resulting HTML for the newly created routine becomes the inner HTML of div#preview-routine (the new routine is appended to the DOM)

[x]At least one of the JS Model Objects must have a method on the prototype.
Example:
-In trainings.js file, .formatLi() prototype method is calling on a training object to format the list item to display this fitness training type.

Project Repo Specs:

Read Me file contains:
[x]Application Description
[x]Installation guide (e.g. fork and clone repo, migrate db, bundle install, etc)
[x]Contributors guide (e.g. file an issue, file an issue with a pull request, etc)
[x]Licensing statement at the bottom (e.g. This project has been licensed under the MIT open source license.)

Repo General
[x]You have a large number of small Git commits
[x]Your commit messages are meaningful
[x]You made the changes in a commit that relate to the commit message
[x]You don't include changes in a commit that aren't related to the commit message
