
// Initialize variables:

let column_dones = $("#column_dones");
let column_tab = $("#column_tab");
let main = $("#main");
let clicked = false;

let todos_items = $("#todos_items");
let dones_items = $("#dones_items");
let newtodo = $("#newtodo");

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let dones = JSON.parse(localStorage.getItem('dones')) || [];

let outsidepanel_todos = $("#outsidepanel_todos");
let outsidepanel_dones = $("#outsidepanel_dones");

let warning = $("#warning");
let warning_content = $("#warning div.modal-content");

let archivetab = $("#archivetab");

archivetab.on("click", function () {

    if (!clicked)
        show_column_dones();
    else 
        hide_column_dones();
});

// Build up items if already in local storage: 

if (todos.length) {
    todos.forEach(e => todos_items.append(create_todos_item(e.date_create, e.todo)));
    update_enumeration();
    update_toolbars();
}


if (dones.length) {
    dones.forEach(e => dones_items.append(create_dones_item(e.date_create, e.todo, date_convert(e.date_done))));
    update_enumeration();
    update_toolbars();
}


// Event listeners:

// Event listener on "Add" button and todo list container with delegation

$("#addtodo").on("click", () => {
    if (newtodo.val()) {
        add_item(newtodo.val());
    }
});

todos_items.on("click", e => {
    if (e.target.type == "checkbox") {
        let ident = e.target.id.split("_")[1];
        check_item(ident);
    }
    else if (e.target.tagName === "A") {
        let ident = e.target.id.split("_")[1];
        delete_item(ident);
    }
});

// Event listener on todos done (archived) list with delegation:

dones_items.on("click", e => {
    if (e.target.tagName === "A") { 

        let ident = e.target.id.split("_")[1];

        if (e.target.id.includes("rec")) {
            recover_item(ident);
        }
        else 
            delete_item(ident, "dones");
    }
});




// Event listener on close button of the warnings:

$("#closewarning").on("click",()=>warning.removeClass("is-active"));

// Event listener on nav bar:
let navbar_clicked = false;

$("#navbar").on("click",()=>{
    if (!navbar_clicked) {
        $("#navbar-menu").addClass("is-active");
        $("#navbar").addClass("is-active");
        navbar_clicked = true;
    }    
    else {    
        $("#navbar-menu").removeClass("is-active");
        $("#navbar").removeClass("is-active");
        navbar_clicked = false;
    }    
});


// Functions to manipulate items:

function add_item(todo) {
    let ident = Date.now();
    todos.push({ todo: todo, date_create: ident, date_done: 0 });
    todos_items.append(create_todos_item(ident, todo));
    newtodo.val("");
    update_enumeration();    
    update_toolbars();
    update_local_storage();    
}


// Check items and move them to the done (archived) list:

function check_item(ident) {
    let last = dones.push(todos.filter( e=>e.date_create == ident )[0]);    
    last--;
    let currentdate = Date.now();
    dones[last].date_done = currentdate;
    $(`#div_${ident}`).remove();
    delete_item(ident);
    dones_items.append(create_dones_item(ident, dones[last].todo, date_convert(currentdate)));  

    update_enumeration();
    update_toolbars();
    update_local_storage();    
}

// Delete items:

function delete_item(ident, mode) {
    let idx;
    
    if (mode != "dones") {
        todos.forEach((e, i) => {
            if (e.date_create == ident)
                idx = i;
        });

        todos.splice(idx, 1);   
        $(`#div_${ident}`).remove();
    }
    else {
        dones.forEach((e, i) => {
            if (e.date_create == ident)
                idx = i;
        });

        dones.splice(idx, 1);
        $(`#div-done_${ident}`).remove();
    }

    update_enumeration();
    update_toolbars();
    update_local_storage();    
}

// Recover items:

function recover_item(ident) {

    let last = todos.push( dones.filter( e => e.date_create == ident )[0] );
    last--;
    todos[last].date_done = 0;
    todos_items.append( create_todos_item(ident, todos[last].todo) );
    $(`#div-done_${ident}`).remove();
    delete_item(ident, "dones");

    update_enumeration();
    update_toolbars();
    update_local_storage();    
}


// Functions to update HTML:

function create_todos_item(ident, todo) {
    return `<div class="control panel-block has-icons-right" id="div_${ident}">
                <span class="icon is-right" style="pointer-events:initial">
                    <a href="javascript:void(0);" id="a_${ident}" class="delete">-</a>
                </span>
                <label class="checkbox"><input type="checkbox" id="check_${ident}"><span class="enum"></span> ${todo}</label>
            </div>`;
}


function create_dones_item(ident, done, date_done) {
    return `<div class="control panel-block has-icons-right" id="div-done_${ident}">
            <span class="icon is-right" style="pointer-events:initial">
               <a href="javascript:void(0);" id="a-done_${ident}" class="delete">-</a> 
            </span>
            <a href="javascript:void(0);" id="a-done-rec_${ident}" class="has-text-grey-light">&#8634;</a>
            &nbsp;<span class="enum"></span>&nbsp;${done}&nbsp;
            <span class="tag is-infotag">${date_done}</span>
        </div>`;            
}


// Toolbar functions:

function create_todos_toolbar() {
    return `<div class="has-icons-left is-size-7 has-text-centered" id="todos_toolbar">
                <span class="tag icon is-left" style="pointer-events:initial">
                    <i class="fas fa-check-double"></i>
                </span>    
                <a href="javascript:void(0);" id="markall">Mark all done</a>                                         
                <span class="tag icon is-left" style="pointer-events:initial">
                    <i class="far fa-trash-alt"></i>
                </span>    
                <a href="javascript:void(0);" id="deletealltodos_warning">Delete all</a>                      
            </div>`;
}


function create_dones_toolbar() {
    return `<div class="has-icons-left is-size-7 has-text-centered" id="dones_toolbar">
                <span class="tag icon is-left" style="pointer-events:initial">
                    <i class="fas fa-angle-double-left"></i>
                </span>    
                <a href="javascript:void(0);" id="recoverall">Recover all</a>                                    
                <span class="tag icon is-left" style="pointer-events:initial">
                    <i class="far fa-trash-alt"></i>
                </span>    
                <a href="javascript:void(0);" id="deletealldones_warning">Delete all</a>                      
            </div>`;
}        

function update_toolbars() {
    if ($("#todos_toolbar").length<1) {    
        if (todos.length > 1) {
            outsidepanel_todos.append(create_todos_toolbar());  

            // Event listeners on todos toolbar links:

            $("#markall").on("click", e => {
                markall();
            });  
                        
            $("#deletealltodos_warning").on("click", e => {
                show_warning();
            });                
        }        
    }
    else {
        if (todos.length < 2)
            $("#todos_toolbar").remove();         
    } 
    
    if ($("#dones_toolbar").length<1) {    
        if (dones.length > 1) {
            outsidepanel_dones.append(create_dones_toolbar());    

            // Event listeners on todos done (archived) toolbar links:

            $("#recoverall").on("click", e => {
                recoverall();
            });    
            
            $("#deletealldones_warning").on("click", e => {
                show_warning("dones");
            });  
        }                 
    }
    else {
        if (dones.length < 2)
            $("#dones_toolbar").remove();         
    }   
}


function markall() {
    todos.forEach( e=>{
        dones.push(e);
        dones_items.append( create_dones_item(e.date_create, e.todo, date_convert(e.date_done)) );        
     } );
    todos=[];
    $("#todos_items div").remove();

    update_enumeration();
    update_toolbars();
    update_local_storage();    
}

function deletealltodos() {
    todos=[];
    $("#todos_items div").remove();

    update_enumeration();
    update_toolbars();
    update_local_storage();    
}

function recoverall() {
    dones.forEach( e=>{
        todos.push(e);
        todos_items.append( create_todos_item(e.date_create, e.todo, 0) );        
     } );   
    dones=[];
    $("#dones_items div").remove();

    update_enumeration();
    update_toolbars();
    update_local_storage();    
}

function deletealldones() {
    dones=[];
    $("#dones_items div").remove();

    update_enumeration();
    update_toolbars();
    update_local_storage();    
}


// Warnings before final deletes: 

function show_warning(mode) {
    warning.addClass("is-active");

    warning_content.empty();

    let content = `<div class="notification is-danger">`;                  

    if (mode!="dones") 
        content += `<p>Are you sure to delete all your todos?</p>
                    <label class="checkbox" disabled checked>
                        <input type="checkbox" disabled checked>
                        <a href="javascript:void(0);" id="deletealltodos" class="has-text-white">`;
    else
        content += `<p>Are you sure to delete all your archived todos?</p>
                    <label class="checkbox" disabled checked>
                        <input type="checkbox" disabled checked>    
                        <a href="javascript:void(0);" id="deletealldones" class="has-text-white">`;

    content += `Yes, I am sure!</a></label></div>`;

    warning_content.append(content);

    if (mode!="dones") 
        $("#deletealltodos").on("click", e => {
            deletealltodos();
            warning.removeClass("is-active")
        });  
    else 
        $("#deletealldones").on("click", e => {
            deletealldones();
            warning.removeClass("is-active")
        });  
}



// Helper functions:


function date_convert(date) {
    date = new Date(date);
    date = date.toISOString().split("-");
    day = date[2].split("T")[0];
    return `${day}.${date[1]}.${date[0]}`;
}


function update_local_storage() {
    if (todos.length == 0)
        localStorage.removeItem('todos');
    else
        localStorage.setItem('todos', JSON.stringify(todos));
    
    if (dones.length == 0)
        localStorage.removeItem('dones');
    else    
        localStorage.setItem('dones', JSON.stringify(dones));
}


function update_enumeration() {
    $("#todos_items div span.enum").each( function(i) {$(this).text(`${i+1}.`)});
    $("#dones_items div span.enum").each( function(i) {$(this).text(`${i+1}.`)})
}

function show_column_dones() {
    archivetab.addClass("has-text-danger");
    archivetab.text("Hide");
    column_tab.addClass("is-1");
    main.removeClass("is-11");
    main.addClass("is-7");
    column_dones.addClass("is-4");
    column_dones.removeClass("is-hidden-desktop");
    clicked = true;
}

function hide_column_dones() {
    archivetab.removeClass("has-text-danger");
    archivetab.text("Past");
    column_tab.removeClass("is-1");
    main.removeClass("is-7");
    main.addClass("is-11");
    column_dones.removeClass("is-4");
    column_dones.addClass("is-hidden-desktop");
    clicked = false;    
}
