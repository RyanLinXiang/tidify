let name = "create";
let regex = new RegExp ("^create", "i"); 
let exe = function (transcript) {
    let todo = transcript.split("create")[1];
    if (todo)
        add_item(todo);  
};
create_command(name, regex, exe);


name = "delete";
regex = new RegExp ("^delete item", "i"); 
exe = function (transcript) {
    let item = parseInt(transcript.split("delete item")[1]);
    if (item) {
        let div_id = $("#todos_items div[id]")[item-1].id;
        if (div_id) {
            div_id = div_id.split("_")[1];
            delete_item(div_id);
        }    
    }
};
create_command(name, regex, exe);


name = "check";
regex = new RegExp ("^check item", "i"); 
exe = function (transcript) {
    let item = parseInt(transcript.split("check item")[1]);
    if (item) {
        let div_id = $("#todos_items div[id]")[item-1].id;
        if (div_id) {
            div_id = div_id.split("_")[1];
            check_item(div_id);
            show_column_dones();
        }    
    }
};
create_command(name, regex, exe);


name = "show";
regex = new RegExp ("^show", "i"); 
exe = function (transcript) {
    show_column_dones();
};
create_command(name, regex, exe);


name = "hide";
regex = new RegExp ("^hide", "i"); 
exe = function (transcript) {
    hide_column_dones();
};
create_command(name, regex, exe);



name = "recover";
regex = new RegExp ("^recover item", "i"); 
exe = function (transcript) {
    let item = parseInt(transcript.split("recover item")[1]);
    if (item) {
        let div_id = $("#dones_items div[id]")[item-1].id;
        if (div_id) {
            div_id = div_id.split("_")[1];
            recover_item(div_id);
            hide_column_dones();
        }    
    }
};
create_command(name, regex, exe);

name = "deletealltodos";
regex = new RegExp ("^delete all to do", "i"); 
exe = function (transcript) {
    show_warning();
};
create_command(name, regex, exe);


name = "deleteallpast";
regex = new RegExp ("^delete all past", "i"); 
exe = function (transcript) {
    show_warning("dones");
    hide_column_dones();
};
create_command(name, regex, exe);


name = "uncheck all";
regex = new RegExp ("^uncheck all", "i"); 
exe = function (transcript) {
    recoverall();
    hide_column_dones();
};
create_command(name, regex, exe);


name = "check all";
regex = new RegExp ("^check all", "i"); 
exe = function (transcript) {
    markall();
    show_column_dones();
};
create_command(name, regex, exe);



