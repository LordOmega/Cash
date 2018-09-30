if(localStorage.getItem("data") == undefined) {
    localStorage.setItem("data", JSON.stringify({
        months: {}
    }));
}

var data = JSON.parse(localStorage.getItem("data"));
const element = document.getElementById('content');

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
    document.getElementById('container').removeChild(document.getElementById('container').lastChild)
    if(navIndex == 0) {
        while (element.firstChild) {
            element.firstChild.remove();
        }

        document.getElementById('navLeftSpace').style.display = "block";
        document.getElementById('navBack').style.display = "none";

        for (var key in data.months) {
            document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showCategories('" + key + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},key),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"}, calcMonth(data.months[key].budget, data.months[key].amount) + '€')));
        }

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

function navAction() {
    if(navIndex == 2) {
        var name = prompt("name:", "");
        var price = prompt("price:", "");
        if(name != "" && price != "") {
            var obj = {};
            obj[name] = price.replace(",",".");

            data.months[lastMonth].categories[lastCategory].items.push(obj);
            data.months[lastMonth].categories[lastCategory].amount = Math.round((parseFloat(data.months[lastMonth].categories[lastCategory].amount) + parseFloat(price.replace(",","."))) * 100) / 100;
            data.months[lastMonth].amount = Math.round((parseFloat(data.months[lastMonth].amount) + parseFloat(price.replace(",","."))) * 100) / 100;
            document.getElementById('content').appendChild(React.createElement('tr',{},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},name),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},Math.round(parseFloat(price.replace(",",".")) * 100) / 100 +  '€')));
            localStorage.setItem("data", JSON.stringify(data));
            document.getElementById('amount').textContent = data.months[lastMonth].categories[lastCategory].amount + "€";
        }         
    } else if(navIndex == 0) {
        var month = prompt("month:", "");
        var budget = prompt("budget:", "");
        if(month != "" && budget != "") {
            data.months[month] = {
                categories: {
                    "Essen": {items: [],amount: "0"},
                    "Abo": {items: [],amount: "0"},
                    "Hyg.": {items: [],amount: "0"},
                    "Auto": {items: [],amount: "0"},
                    "Elektronik & Verträge": {items: [],amount: "0"},
                    "Fix": {items: [],amount: "0"},
                    "Freizeit": {items: [],amount: "0"},
                    "Garten": {items: [],amount: "0"},
                    "Sonstiges": {items: [],amount: "0"},
                    "Kleidung": {items: [],amount: "0"},
                    "Urlaub": {items: [],amount: "0"}
                },
                amount: "0",
                budget: budget
            };

            document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showCategories('" + month + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},month),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"}, calcMonth(data.months[month].budget, data.months[month].amount) + '€')));
            localStorage.setItem("data", JSON.stringify(data));
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

    document.getElementById('container').appendChild(React.createElement('div',{onclick: 'deleteMonth("' + month + '")', style: "text-align: center; color: rgb(255, 59, 48); padding: 16px;"},'Delete Month'));

    document.getElementById('navLeftSpace').style.display = "none";
    document.getElementById('navBack').style.display = "block";
    document.getElementById('amount').textContent = data.months[month].amount + "€";
}

function deleteMonth(month) {
    delete data.months[month];
    localStorage.setItem("data", JSON.stringify(data));
    navBack();
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
    document.getElementById('amount').textContent = data.months[month].categories[category].amount + "€";
}

for (var key in data.months) {
    document.getElementById('content').appendChild(React.createElement('tr',{onclick: "showCategories('" + key + "');"},React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"},key),React.createElement('td',{style: "border-bottom: 1px solid rgb(247, 247, 248);"}, calcMonth(data.months[key].budget, data.months[key].amount) + '€')));
}