if(localStorage.getItem("data") == undefined) {
    localStorage.setItem("data", JSON.stringify({
        months: {}
    }));
}

var data = JSON.parse(localStorage.getItem("data"));
const element = document.getElementById('content');
var _months_ = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

var React = {
    createElement: function (tag, attrs, children) {
        var e = document.createElement(tag);

        for (var name in attrs) {
            if (name && attrs.hasOwnProperty(name)) {
                var v = attrs[name];
                if (v === true) {
                    e.setAttribute(name, name);
                } else if (v !== false && v != null) {
                    e.setAttribute(name, v.toString());
                }
            }
        }

        for (var i = 2; i < arguments.length; i++) {
            var child = arguments[i];
            if(child != null) {
                e.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
            }             
        }

        return e;
    }
}

var navIndex = 0;
var lastMonth = "";
var lastCategory = "";

function navBack() {
    navIndex--;  
    if(navIndex == 0) {
        if(document.getElementById('actions').childElementCount > 0) document.getElementById('actions').removeChild(document.getElementById('actions').lastChild); 
        while (element.firstChild) {
            element.firstChild.remove();
        }

        document.getElementById('navLeftSpace').style.display = "block";
        document.getElementById('navBack').style.display = "none";

        for (var key in data.months) {
            document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showCategories('" + key + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},key),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"}, calcMonth(data.months[key].budget, data.months[key].amount) + '€')));
        }

        //document.getElementById('actions').appendChild(React.createElement('div',{style: "text-align: center; color: black; padding: 16px;"},'v1.2.3 - 4.1.2019'));
        document.getElementById('amount').textContent = "Happy Pig"
    }  else if(navIndex == 1) {
        navIndex--;
        showCategories(lastMonth);
    }          
}

function calcMonth(_budget, _amount) {
    var budget = parseFloat(_budget);
    var amount = parseFloat(_amount);

    return Math.round((budget - amount) * 100) / 100
}

function checkInput(input) {
    return input != "" && input != null && input != undefined;
}

function navAction() {
    var _date_ = new Date();
    if(navIndex == 2) {
        var name = prompt("name:", _date_.getDate() + "." + (_date_.getMonth() + 1) + ". ");
        if(checkInput(name)) {
            var price = prompt("price:", "");
            if(checkInput(price)) {
                var obj = {};
                obj[name] = price.replace(",",".");

                data.months[lastMonth].categories[lastCategory].items.push(obj);
                data.months[lastMonth].categories[lastCategory].amount = Math.round((parseFloat(data.months[lastMonth].categories[lastCategory].amount) + parseFloat(price.replace(",","."))) * 100) / 100;
                data.months[lastMonth].amount = Math.round((parseFloat(data.months[lastMonth].amount) + parseFloat(price.replace(",","."))) * 100) / 100;
                document.getElementById('content').appendChild(React.createElement('tr',{},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},name),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},Math.round(parseFloat(price.replace(",",".")) * 100) / 100 +  '€')));
                localStorage.setItem("data", JSON.stringify(data));
                document.getElementById('amount').textContent = data.months[lastMonth].categories[lastCategory].amount + "€";
            }    
        }      
    } else if(navIndex == 1) {
        var category = prompt("category:", "");
        if(checkInput(category)) {
            data.months[lastMonth].categories[category] = {items: [],amount: "0"};
            document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showItems('" + lastMonth + "', '" + category + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},category),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},'0€')));
            localStorage.setItem("data", JSON.stringify(data));
        } 
    } else if(navIndex == 0) {
        var month = prompt("month:", _months_[_date_.getMonth()] + " " + _date_.getFullYear());
        if(checkInput(month)) {
            var budget = prompt("budget:", "");
            if(checkInput(budget)) {
                data.months[month] = {
                    categories: {
                        "Lebensmittel / Haushalt": {items: [],amount: "0"},
                        "Apotheke / Kosmetik": {items: [],amount: "0"},
                        "Kinder": {items: [],amount: "0"},
                        "Kleidung": {items: [],amount: "0"},
                        "Garten / Reparaturen": {items: [],amount: "0"},
                        "Freizeit / Lotto": {items: [],amount: "0"},
                        "Auto / Tanken": {items: [],amount: "0"},
                        "Sonstiges": {items: [],amount: "0"},
                        "Fixkosten": {items: [],amount: "0"}           
                    },
                    amount: "0",
                    budget: budget
                };
    
                document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showCategories('" + month + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},month),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"}, calcMonth(data.months[month].budget, data.months[month].amount) + '€')));
                localStorage.setItem("data", JSON.stringify(data));
            }
        }
    }    
}

function showCategories(month) {
    navIndex++;
    lastMonth = month;

    while (element.firstChild) {
        element.firstChild.remove();
    }       

    for (var key in data.months[month].categories) {
        document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showItems('" + month + "', '" + key + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},key),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},(data.months[month].categories[key].amount == undefined ? 0 : data.months[month].categories[key].amount) +  '€')));
    }

    if(document.getElementById('actions').childElementCount > 0) document.getElementById('actions').removeChild(document.getElementById('actions').lastChild); 
    document.getElementById('actions').appendChild(React.createElement('div',{onclick: 'deleteMonth("' + month + '")', style: "text-align: center; color: rgb(255, 59, 48); padding: 16px;"},'Delete Month'));

    document.getElementById('navLeftSpace').style.display = "none";
    document.getElementById('navBack').style.display = "block";
    var _date = new Date();
    var _days = new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();
    document.getElementById('amount').textContent = data.months[month].amount + "€ - ca." + ((parseFloat(data.months[month].budget) - parseFloat(data.months[month].amount)) / (_days - _date.getDate())).toFixed(2) + "€ pro Tag";
}

function deleteMonth(month) {
    if(confirm("Are you sure you want to delete this month?")) {
        delete data.months[month];
        localStorage.setItem("data", JSON.stringify(data));
        navBack();
    }  
}

function deleteCategory(month, category) {
    if(confirm("Are you sure you want to delete this category?")) {
        data.months[month].amount = Math.round((parseFloat(data.months[month].amount) - parseFloat(data.months[month].categories[category].amount)) * 100) / 100;           
        delete data.months[month].categories[category];
        localStorage.setItem("data", JSON.stringify(data));
        navBack();
    }   
}

function showItems(month, category) {
    navIndex++;
    lastCategory = category;

    while (element.firstChild) {
        element.firstChild.remove();
    }

    for (var key in data.months[month].categories[category].items) {
        for(var key2 in data.months[month].categories[category].items[key]) {
            document.getElementById('content').appendChild(React.createElement('tr',{},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},key2),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},(data.months[month].categories[category].items[key][key2] == undefined ? 0 : data.months[month].categories[category].items[key][key2]) +  '€')));
        }
    }

    if(document.getElementById('actions').childElementCount > 0) document.getElementById('actions').removeChild(document.getElementById('actions').lastChild); 
    document.getElementById('actions').appendChild(React.createElement('div',{onclick: 'deleteCategory("' + month + '","' + category + '")', style: "text-align: center; color: rgb(255, 59, 48); padding: 16px;"},'Delete Category'));
    document.getElementById('amount').textContent = data.months[month].categories[category].amount + "€";
}

for (var key in data.months) {
    document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showCategories('" + key + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},key),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"}, calcMonth(data.months[key].budget, data.months[key].amount) + '€')));
}
//document.getElementById('actions').appendChild(React.createElement('div',{style: "text-align: center; color: black; padding: 16px;"},'v1.2.4 - 8.6.2019'));