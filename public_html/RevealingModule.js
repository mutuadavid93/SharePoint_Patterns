/*

 SharePoint CRUD Operations using jQuery Ajax Promises and 
 Revealing Module Pattern.

 The module will reside on a File; dataservice.js then 
 Create another File from where you will consume the 
 Promises returned.
 
  "Search Tag" : "SharePoint REST API CRUD Opearations"
*/

// Declare my Module & NameSpace it. File; dataservice.js
var altn8NS = altn8NS || {};

altn8NS.Repositories = function () {
    var listName = "Categories"; // You only need to Change listName here for now.
    URLBASE = "/_api/Web/Lists/GetByTitle('"+listName+"')",

    // Holds all our Requests' Headers.
    reqHeaders = {
        getReq: { "accept": "application/json;odata=verbose" },
        addReq: {
            "accept": "application/json;odata=verbose",
            "content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        updateReq: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $('#__REQUESTDIGEST').val(),
            "X-Http-Method": "PATCH",
            "IF-MATCH": "*"
        },
        delReq : {
            "ACCEPT": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE"
        }
    },

    listMetadata = function() {
        var listMetadata = { "type": "SP.Data."+listName+"ListItem" };
        return listMetadata;
    },

    failHandler = function(jqXHR, textStatus, errorThrown) {
        var resp = JSON.parse(jqXHR.responseText);
        var message = resp ? resp.error.message.value : textStatus;
        alert("Error: "+ message);
    },

    TARGET_URL = function () {
        var url = _spPageContextInfo.webAbsoluteUrl || "";
        var siteUrl = url + URLBASE;
        return siteUrl;
    },

    addListItem = function(data) {
        var addItemDfd = $.ajax({
            url: TARGET_URL() + "/Items",
            type: "POST",
            data: JSON.stringify(data),
            headers: reqHeaders.addReq
        });
        return addItemDfd.promise();
    },

    updateListItem = function(Id, listData) {
        var editItemDfd = $.ajax({
            url: TARGET_URL() + "/Items('"+Id+"')",
            type: "POST",
            data: JSON.stringify(listData),
            headers: reqHeaders.updateReq
        });
        return editItemDfd.promise();
    },

    delListItem = function(Id) {
        var delItemDfd = $.ajax({
            url: TARGET_URL() + "/items(" + Id +")",
            type: "POST",
            headers: reqHeaders.delReq
        });
        return delItemDfd.promise();
    },

    getListItems = function() {
        var getItemsDfd = $.ajax({
            url: TARGET_URL() + '/Items',
            type: "GET",
            headers: reqHeaders.getReq,
            cache: false
        });
        return getItemsDfd.promise();
    },

    getListItem = function(Id) {
        var getItemDfd =  $.ajax({
            url: TARGET_URL() + '/Items?$select=*&$filter= ID eq '+Id,
            type: "GET",
            headers: reqHeaders.getReq
        });
        return getItemDfd.promise(); // always return a promise
    };

    // Public members
    return {
        getListItems : getListItems,
        addListItem : addListItem,
        getListItem : getListItem,
        updateListItem : updateListItem,
        delListItem : delListItem,
        getListMetadata : listMetadata,
        failHandler: failHandler
    };

}(); // Singleton Object.




// Consume the Functions e.g. categoryPage.js
// Example; Retrieving a Single Category's Title. Assume Item ID = 1
altn8NS.Repositories.getListItem(1)
    .done(function(data) {
        $.each(data.d.results, function(index, item) {
            console.log(item.Title);
        }); // loop
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        altn8NS.Repositories.failHandler(jqXHR, textStatus, errorThrown);
    });