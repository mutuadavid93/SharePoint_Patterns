// Define our Object and NameSpace it.
// this goes into dataservice.js
var altn8NS = altn8NS || {};
altn8NS.SPObject = function (listName) {
    this.listName = listName || "Categories";
    this.URLBASE = null;
    this.rtPromise = {};
};

// All functions inherit this method
altn8NS.SPObject.prototype.TARGETURL = function () {
    this.URLBASE = "/_api/Web/Lists/GetByTitle('"+this.listName+"')";
    var url = _spPageContextInfo.webAbsoluteUrl || "";
    var siteUrl = url + this.URLBASE;
    return siteUrl;
};

altn8NS.SPObject.prototype.FAILHANDLER = function(jqXHR,textStatus,errorThrown){
    var resp = JSON.parse(jqXHR.responseText);
    var message = resp ? resp.error.message.value : textStatus;
    alert("Error: "+ message);
};

// Get List Metadata to do Addition and Updating Job.
altn8NS.SPObject.prototype.listMetadata = function() {
    var listMetadata = { "type": "SP.Data."+this.listName+"ListItem" };
    return listMetadata;
};

// Decorator
altn8NS.SPObject.prototype.reqHeaders = function (index) {
    var reqHeader = [
        { "accept": "application/json;odata=verbose" },
        {
            "accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $('#__REQUESTDIGEST').val(),
            "X-Http-Method": "PATCH",
            "IF-MATCH": "*"
        },
        {
            "accept": "application/json;odata=verbose",
            "content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        {
            "ACCEPT": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE"
        }
    ];
    return reqHeader[index];
};

// Get a Single ListItem
altn8NS.SPObject.prototype.getListItem = function (Id) {
    var getItemDfd =  $.ajax({
            url: this.TARGETURL() + '/Items?$select=*&$filter= ID eq '+Id,
            type: "GET",
            headers: this.reqHeaders(0)
        });
    this.rtPromise = getItemDfd.promise();
    
    return this.rtPromise;
};


// Get all ListItems
altn8NS.SPObject.prototype.getListItems = function () {
    var getItemsDfd = $.ajax({
        url: this.TARGETURL() + '/Items',
        type: "GET",
        headers: this.reqHeaders(0)
    });
    this.rtPromise = getItemsDfd.promise();
    
    return this.rtPromise;
};

// Update a ListItem
altn8NS.SPObject.prototype.updateListItem = function (Id, listData) {
    var editItemDfd = $.ajax({
            url: this.TARGETURL() + "/Items('"+Id+"')",
            type: "POST",
            data: JSON.stringify(listData),
            headers: this.reqHeaders(1)
        });
    this.rtPromise = editItemDfd.promise();    
        
    return this.rtPromise;
};


// Add/Insert listItems into a List.
altn8NS.SPObject.prototype.addListItem = function (listData) {
    var addItemDfd = $.ajax({
        url: this.TARGETURL() + "/Items",
        type: "POST",
        data: JSON.stringify(listData),
        headers: this.reqHeaders(2)
    });
    this.rtPromise = addItemDfd.promise();
    
    return this.rtPromise;
};


// Delete a List Item
altn8NS.SPObject.prototype.delListItem = function (Id) {
    var delItemDfd = $.ajax({
        url: TARGET_URL() + "/items(" + Id +")",
        type: "POST",
        headers: this.reqHeaders(3)
    });
    this.rtPromise = delItemDfd.promise();
    
    return this.rtPromise;
};

/*********************************************************
 * 
 *  Instantiate altn8NS.SPObject
 *  And Consume it to your Like in a Separate File.
 *  e.g categories.js
 *  
 *********************************************************/


var mySpObj = new altn8NS.SPObject();

// Assume List ItemID = 1 from Categories List By Default.
mySpObj.getListItem(1)
    .done(function(data) {
        $.each(data.d.results, function(index, item) {
            console.log(item.Title);
        }); // loop
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
       mySpObj.FAILHANDLER(jqXHR, textStatus, errorThrown);
    });