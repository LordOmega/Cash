if (localStorage.getItem("data") == undefined) {
    localStorage.setItem("data", JSON.stringify({
        months: {}
    }));
}

var data = JSON.parse(localStorage.getItem("data"));
const element = document.getElementById('content');
const actions = document.getElementById('actions');
const listItem = document.getElementById('listItem');
const deleteAction = document.getElementById('deleteAction');
var _months_ = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
var navIndex = 0;
var lastMonth = "";
var lastCategory = "";

function createListItem(text, amount, onclick) {
    const clone = document.importNode(listItem.content, true);
    clone.querySelectorAll('tr')[0].setAttribute('onclick', onclick);
    const td = clone.querySelectorAll('td');
    td[0].textContent = text;
    td[1].textContent = parseFloat(amount).toFixed(2) + ' €';
    return clone;
}

function createDeleteAction(text, onclick) {
    const clone = document.importNode(deleteAction.content, true);
    clone.querySelectorAll('div')[0].textContent = text;
    clone.querySelectorAll('div')[0].setAttribute('onclick', onclick);
    return clone;
}

function removeElements() {
    while (actions.firstChild) {
        actions.firstChild.remove();
    }

    while (element.firstChild) {
        element.firstChild.remove();
    }
}

function navBack() {
    navIndex--;
    if (navIndex == 0) {
        removeElements();

        document.getElementById('navLeftSpace').style.display = "block";
        document.getElementById('navBack').style.display = "none";

        for (var key in data.months) {
            document.getElementById('content').appendChild(createListItem(key, calcMonth(data.months[key].budget, data.months[key].amount), "showCategories('" + key + "');"));
        }
        document.getElementById('amount').textContent = "Happy Pig"
    } else if (navIndex == 1) {
        navIndex--;
        showCategories(lastMonth);
    }
}

function calcMonth(budget, amount) {
    return Math.round((parseFloat(budget) - parseFloat(amount)) * 100) / 100
}

function checkInput(input) {
    return input != "" && input != null && input != undefined;
}

function navAction() {
    var _date_ = new Date();
    if (navIndex == 2) {
        var name = prompt("name:", _date_.getDate() + "." + (_date_.getMonth() + 1) + ". ");
        if (checkInput(name)) {
            var price = prompt("price:", "");
            if (checkInput(price)) {
                var obj = {};
                obj[name] = price.replace(",", ".");

                data.months[lastMonth].categories[lastCategory].items.push(obj);
                data.months[lastMonth].categories[lastCategory].amount = Math.round((parseFloat(data.months[lastMonth].categories[lastCategory].amount) + parseFloat(price.replace(",", "."))) * 100) / 100;
                data.months[lastMonth].amount = Math.round((parseFloat(data.months[lastMonth].amount) + parseFloat(price.replace(",", "."))) * 100) / 100;
                document.getElementById('content').appendChild(createListItem(name, Math.round(parseFloat(price.replace(",", ".")) * 100) / 100));
                localStorage.setItem("data", JSON.stringify(data));
                document.getElementById('amount').textContent = data.months[lastMonth].categories[lastCategory].amount + "€";
            }
        }
    } else if (navIndex == 1) {
        var category = prompt("category:", "");
        if (checkInput(category)) {
            data.months[lastMonth].categories[category] = {
                items: [],
                amount: "0"
            };
            document.getElementById('content').appendChild(createListItem(category, 0.0, "showItems('" + lastMonth + "', '" + category + "');"));
            localStorage.setItem("data", JSON.stringify(data));
        }
    } else if (navIndex == 0) {
        var month = prompt("month:", _months_[_date_.getMonth()] + " " + _date_.getFullYear());
        if (checkInput(month)) {
            var budget = prompt("budget:", "");
            if (checkInput(budget)) {
                data.months[month] = {
                    categories: {
                        "Lebensmittel / Haushalt": {
                            items: [],
                            amount: "0"
                        },
                        "Apotheke / Kosmetik": {
                            items: [],
                            amount: "0"
                        },
                        "Kinder": {
                            items: [],
                            amount: "0"
                        },
                        "Kleidung": {
                            items: [],
                            amount: "0"
                        },
                        "Garten / Reparaturen": {
                            items: [],
                            amount: "0"
                        },
                        "Freizeit / Lotto": {
                            items: [],
                            amount: "0"
                        },
                        "Auto / Tanken": {
                            items: [],
                            amount: "0"
                        },
                        "Sonstiges": {
                            items: [],
                            amount: "0"
                        },
                        "Fixkosten": {
                            items: [],
                            amount: "0"
                        }
                    },
                    amount: "0",
                    budget: budget
                };

                document.getElementById('content').appendChild(createListItem(month, calcMonth(data.months[month].budget, data.months[month].amount), "showCategories('" + month + "');"));
                localStorage.setItem("data", JSON.stringify(data));
            }
        }
    }
}

function showCategories(month) {
    navIndex++;
    lastMonth = month;

    removeElements();

    for (var key in data.months[month].categories) {
        document.getElementById('content').appendChild(createListItem(key, (data.months[month].categories[key].amount == undefined ? 0 : data.months[month].categories[key].amount), "showItems('" + month + "', '" + key + "');"));
    }

    actions.appendChild(createDeleteAction('Delete Month', 'deleteMonth("' + month + '")'));

    document.getElementById('navLeftSpace').style.display = "none";
    document.getElementById('navBack').style.display = "block";
    var _date = new Date();
    var _days = new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();
    document.getElementById('amount').textContent = data.months[month].amount + "€ - ca." + ((parseFloat(data.months[month].budget) - parseFloat(data.months[month].amount)) / (_days - _date.getDate())).toFixed(2) + "€ pro Tag";
}

function deleteMonth(month) {
    if (confirm("Are you sure you want to delete this month?")) {
        delete data.months[month];
        localStorage.setItem("data", JSON.stringify(data));
        navBack();
    }
}

function deleteCategory(month, category) {
    if (confirm("Are you sure you want to delete this category?")) {
        data.months[month].amount = Math.round((parseFloat(data.months[month].amount) - parseFloat(data.months[month].categories[category].amount)) * 100) / 100;
        delete data.months[month].categories[category];
        localStorage.setItem("data", JSON.stringify(data));
        navBack();
    }
}

function showItems(month, category) {
    navIndex++;
    lastCategory = category;

    removeElements();

    var list = [];

    for (var key in data.months[month].categories[category].items) {
        for (var key2 in data.months[month].categories[category].items[key]) {
            list.push([key, key2]);
        }
    }

    list.sort((a, b) => {
        if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
        if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
        return 0;
    }).forEach(keys => {
        document.getElementById('content').appendChild(createListItem(keys[1], (data.months[month].categories[category].items[keys[0]][keys[1]] == undefined ? 0 : data.months[month].categories[category].items[keys[0]][keys[1]])));
    });

    actions.appendChild(createDeleteAction('Delete Category', 'deleteCategory("' + month + '","' + category + '")'));
    document.getElementById('amount').textContent = data.months[month].categories[category].amount + "€";
}

for (var key in data.months) {
    document.getElementById('content').appendChild(createListItem(key, calcMonth(data.months[key].budget, data.months[key].amount), "showCategories('" + key + "');"));
}
//actions.appendChild(React.createElement('div',{style: "text-align: center; color: black; padding: 16px;"},'v1.2.5 - 19.8.2019'));