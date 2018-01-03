class jsonSchemaForm {
    constructor(tblObj) {
        // step 0 - initialize some data
        this.name = tblObj.name;
        this.id = tblObj.id; // id of the DOM element where the form will be displayed
        this.fields = tblObj.fields;
        this.errorDivId = tblObj.errorDivId; // id of div where errors will be displayed
        this.typeArray = ["text", "number", "email", "date", "url", "color", "file", "password"]; // valid type of input elements
        // step 1 - validate the JOSN schema
        var requiredFields = ["name", "id", "errorDivId", "fields"]; // required fields in the schema

        var hasError = false; // flag, set when error exists
        var validationErrors = []; // list of validation errors detected

        requiredFields.forEach(function (element) {
            if (!tblObj[element]) {
                hasError = true;
                validationErrors.push("Missing " + element);
            }
        });

        if (hasError) {
            // error found, display error message
            this.displayMessage(
                "Initilization Error(s) [" + validationErrors.join(",") + " ]",
                "danger"
            );
        } else {
            // no  error found
            // Step 2  - initialize the form template
            this.initTemplate(tblObj);
            // Step 3 - Display the form
            this.displayForm(this.formtemplate);
            if (tblObj.data) {
                // if the schema include data, add data to the form
                this.addData(tblObj.data);
            }

        }
    }
    displayMessage(message, type) {
        // display message in errorDivId
        var toAdd, toRemove;
        if (type == "success") {
            toAdd = "alert alert-success";
            toRemove = "alert alert-danger alert-info alert-warning";
        } else if (type == "danger") {
            toAdd = "alert alert-danger";
            toRemove = "alert alert-success alert-info alert-warning";
        } else if (type == "info") {
            toAdd = "alert alert-info";
            toRemove = "alert alert-danger alert-success alert-warning";
        } else if (type == "warning") {
            toAdd = "alert alert-warning";
            toRemove = "alert alert-danger alert-success alert-info";
        }
        var closebtn = "  <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span </button>";
        var selector = "#" + this.errorDivID;
        $(selector)
            .html(message + " " + closebtn)
            .removeClass(toRemove)
            .addClass(toAdd + " alert-dismissible");
    }
    initTemplate(tblObj) {
        // initialize the form and data template
        var trow = " "; // will be used to create the blank form template
        var tdata = " "; // will be used to create form with data
        var dtemp = []; // will be used to store data template 
        var typeArray = this.typeArray;
        tblObj.fields.forEach(function (item) {
            trow += "<div class='form-group'>";
            // type of input
            var type = item.type;
            // inserts 'required=true' whether required or not
            var isreq = item.required ? " required='true' " : " required='false' ";
            // inserts 'max = ' used when type = number
            var numMax = item.max ? "max = " + item.max : " ";
            // inserts 'min = ' used when type = number
            var numMin = item.min ? "min = " + item.min : " ";
            // class in input
            var cssClass = item.inputClass ? "class = '" + item.inputClass + "'" : " ";
            // inserts 'value ='
            var defVal = item.default ? "value = " + item.default : " ";
            // inserts 'maxlength ='
            var size = item.maxLength ? " maxlength = " + item.maxLength : " ";
            // inserts 'pattern = '
            var pattern = item.pattern ? " pattern = " + item.pattern : " ";
            // inserts 'readonly = true'
            var readonly = item.readOnly ? " readonly = true" : " ";
            // define class of help
            var helpClass = item.helpClass ? " class = " + item.helpClass : " ";

            // first adding <label>
            trow += " <label for='" + item.name + "'>" + item.label + "</label>"

            // now adding the actual input
            if (typeArray.indexOf(type) != -1) {
                trow += "<input type = '" + type + "' name='" + item.name + "' id = '" + item.name + "' " + isreq + " " + numMax + " " + readonly + " " + numMin + " " + defVal + " " + cssClass + " " + size + " " + pattern + " >";
            } else if (type == "checkbox") {
                //https://stackoverflow.com/a/7335730  why hidden field is used ?
                trow += " &nbsp;<input type='hidden' name = '" + item.name + "' value='false'>" + "<input type ='checkbox' name='" + item.name + "' id='" + item.name + "' value='" + item.value + "' " + " >" + item.text;
            } else if (type == "select") {
                trow += "&nbsp;<select " + cssClass + " name= '" + item.name + "' id= '" + item.name + "'" + ">";
                item.option.forEach(function (element) {
                    trow += "<option value='" + element.value + "'>" + element.name + "</option>";
                });
                trow += "</select>";
            }
            // finally adding <small class=help> and closing the outer div
            trow += "<small class='" + helpClass + "'>" + item.help + "</small></div>";

            // to create template for  adding data in the form
            tdata += "<div class='form-group'>";
            tdata += " <label for='" + item.name + "'>" + item.label + "</label>"
            if (typeArray.indexOf(type) != -1) {
                tdata += "<input type = '" + type + "' name='" + item.name + "' id = '" + item.name + "' " + isreq + " " + numMax + " " + readonly + " " + numMin + "  value = '@010101010@' " + cssClass + " " + size + " " + pattern + " >";
            } else if (type == "checkbox") {
                tdata += "<input type='hidden' name = '" + item.name + "' value='false'>" + " &nbsp;<input type ='checkbox' name='" + item.name + "' value= '" + item.value + "' @010101010@ " + " >" + item.text;
            } else if (type == "select") {
                tdata += "<select " + cssClass + " name=" + item.name + ">";
                item.option.forEach(function (element) {
                    tdata += "<option value='" + element.value + "'  >" + element.name + "</option>";
                });
                tdata += "</select>";
            }
            tdata += "<small class='" + helpClass + "'>" + item.help + "</small>";
            tdata += "</div>";
            // dtemp will be used to add data in the form 
            dtemp.push({
                name: item.name,
                type: type,
                template: tdata
            });
            tdata = "";
        });
        trow += " ";
        this.datatemplate = dtemp;

        this.formtemplate = trow; // blank row template
    }
    displayForm(dta) {
        // to display form
        var id = this.id + " ";
        $("#" + id).html(dta);
    }
    resetForm() {
        // resets the form , displays blank form
        var id = this.id + " ";
        $("#" + id).html(this.formtemplate);
    }
    createDataHTML(idata) {
        // creating template to add data in the form either using data field in the schema or data provided at runtime using a function defined below
        var tdata = " ";
        var typeArray = this.typeArray;
        for (var dta in this.datatemplate) {
            //  search for a template in this.datatemplate
            // if found , append in datastring
            var template = this.datatemplate[dta];
            var value = idata[template.name];
            // console.log(value)
            // console.log(value + " = val, key =  " + dta);
            if (value != null) {
                var res = " ";
                var type = template.type;
                var templ = template.template;
                if (typeArray.indexOf(type) != -1) {
                    res = templ.replace("@010101010@", value);
                    //console.log("Here - "+res);
                } else if (type == "checkbox") {
                    if (value == true || value == "true") {
                        //  console.log("checked");
                        res = templ.replace("@010101010@", "checked");
                    } else {
                        res = templ.replace("@010101010@", " ");
                    }
                } else if (type == "select") {
                    var indexofval = templ.search(value + "'") + value.length + 1;
                    res = templ.slice(0, indexofval) + " selected " + templ.slice(indexofval);
                }
                tdata += res;

            } else {
                //console.log("yes blank");
                var res = " ";
                var type = template.type;
                var templ = template.template;
                if (typeArray.indexOf(type) != -1) {
                    res = templ.replace("@010101010@", " ");
                    //console.log("Here - "+res);
                } else if (type == "checkbox") {
                    res = templ.replace("@010101010@", " ");
                } else if (type == "select") {
                    res = templ;
                }
                tdata += res;
            }
        }
        return tdata;
    }
    addData(idata) {
        // add data to a form, data is provided as the parameter
        // first generate data template using the data provided
        var dhtml = this.createDataHTML(idata);
        // insert data in the table
        this.displayForm(dhtml);
    }
    getdata(type, seperator) {
        // to get data from the form , can return data in various format
        var arr = [];
        var jobj = {};
        var sel = "#" + this.id;
        var fdata = $(sel).find("input, textarea, select , password, hidden").serializeArray();
        var obj = {};
        for (let i = 0; i < fdata.length; i++) {
            let fname = fdata[i].name;
            let fvalue = fdata[i].value;
            obj[fname] = fvalue;
        }
        //console.log(obj);
        arr.push(obj);
        if (type == "json") {
            jobj[this.name] = obj;
        } else if (type == "string") {
            var valstr = " ",
                i = 0;
            $.each(obj, function (key, value) {
                if (i == 0) {
                    valstr += "" + value;
                } else {
                    valstr += seperator + value;
                }
                i++;
            });
            jobj[this.name] = valstr;
        } else if (type == "serialized") {
            jobj[this.name] = fdata;
        }
        else {
            arr[0] = "Invalid type specified. Valid type =json,string";
        }
        console.log("data = " + JSON.stringify(jobj));
        return jobj;
    }
    searchInTemplate(field, value) {
        for (var i = 0; i < this.datatemplate.length; i++) {
            if (this.datatemplate[i][field] === value) {
                console.log(this.datatemplate[i]);
                return this.datatemplate[i];
            }
        }
        return null;
    }
}