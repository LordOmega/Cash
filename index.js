if (localStorage.getItem('data') == undefined) {
    localStorage.setItem('data', JSON.stringify({
        budget: '0',
        categories: [],
        months: {}
    }));
}

var data = JSON.parse(localStorage.getItem('data'));
const element = document.getElementById('content');
const actions = document.getElementById('actions');
const listItem = document.getElementById('listItem');
const deleteAction = document.getElementById('deleteAction');
var _months_ = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
var navIndex = 0;
var lastMonth = '';
var lastCategory = '';

function createListItem(text, amount, onclick) {
    const clone = document.importNode(listItem.content, true);
    clone.querySelectorAll('tr')[0].setAttribute('onclick', onclick);
    const td = clone.querySelectorAll('td');
    td[0].textContent = text;
    td[1].textContent = parseFloat(amount).toFixed(2) + ' €';
    return clone;
}

function createAction(text, onclick, color) {
    const clone = document.importNode(deleteAction.content, true);
    clone.querySelectorAll('div')[0].textContent = text;
    clone.querySelectorAll('div')[0].setAttribute('onclick', onclick);
    if (color != undefined && color != null && color != '') {
        clone.querySelectorAll('div')[0].style.color = color;
    } else {
        clone.querySelectorAll('div')[0].style.color = 'rgb(255, 59, 48)';
    }
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

function exportData(_data, _type, _file) {
    const blob = new Blob([_data], {
        encoding: 'UTF-8',
        type: _type + ';charset=UTF-8'
    });
    const a = document.createElement('a');
    a.setAttribute('href', URL.createObjectURL(blob));
    a.setAttribute('download', _file);
    a.style.display = 'none';
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blob);
}

function exportJSON() {
    exportData(JSON.stringify(data), 'application/json', new Date().toISOString() + ' - cash.json');
}

function exportCSV() {
    var lines = [];
    var keys = Object.keys(data.months[lastMonth].categories);
    var width = keys.length;
    var height = Math.max(...Object.entries(data.months[lastMonth].categories).map(entry => entry[1].items.length));

    lines.push('Column:;' + keys.join(';'));

    for(var h = 0; h < height; h++) {
        var line = h + 1 + ';';
        for(var w = 0; w < width; w++) {
            var entries = Object.entries(data.months[lastMonth].categories[keys[w]]);
            if(h < entries[0][1].length) {
                line = line + Object.entries(entries[0][1][h])[0][0] + ' - ' + parseFloat(Object.entries(entries[0][1][h])[0][1]).toFixed(2) + ';';
            } else {
                line = line + ';';
            } 
        }
        lines.push(line);
    }

    lines.push('Sum:;' + Object.entries(data.months[lastMonth].categories).map(entry => parseFloat(entry[1].amount).toFixed(2)).join(';'));
    lines.push('');

    if(width >= 2) {
        lines.push(';Month:;' + lastMonth);
        lines.push(';Total:;' + parseFloat(data.months[lastMonth].amount).toFixed(2));
        lines.push('');
        lines.push(';Income:;' + parseFloat(data.months[lastMonth].budget).toFixed(2));
        lines.push(';Expenditure:;' + parseFloat(data.months[lastMonth].amount).toFixed(2));
        var diff = parseFloat(data.months[lastMonth].budget) - parseFloat(data.months[lastMonth].amount);
        lines.push(';Plus/Minus:;' + (diff > 0 ? ('+' + diff.toFixed(2)) : diff.toFixed(2)));
    }

    exportData(lines.join('\n'), 'text/csv', lastMonth + '.csv');
}

function navBack() {
    navIndex--;
    if (navIndex == 0) {
        removeElements();

        document.getElementById('navLeftSpace').style.display = 'block';
        document.getElementById('navBack').style.display = 'none';

        for (var key in data.months) {
            document.getElementById('content').appendChild(createListItem(key, calcMonth(data.months[key].budget, data.months[key].amount), 'showCategories("' + key + '");'));
        }

        actions.appendChild(createAction('Export', 'exportJSON();', 'rgb(74, 164, 248)'));

        document.getElementById('amount').textContent = 'Happy Pig';
    } else if (navIndex == 1) {
        navIndex--;
        showCategories(lastMonth);
    }
}

function calcMonth(budget, amount) {
    return Math.round((parseFloat(budget) - parseFloat(amount)) * 100) / 100;
}

function checkInput(input) {
    return input != '' && input != null && input != undefined;
}

function checkNumber(number) {
    return checkInput(number) ? (!Number.isNaN(parseFloat(number.replace(',', '.')))) : false;
}

function navAction() {
    var _date_ = new Date();
    if (navIndex == 2) {
        var name = prompt('name:', _date_.getDate() + '.' + (_date_.getMonth() + 1) + '. ').trim();
        if (checkInput(name)) {
            var price = prompt('price:', '').trim();
            if (checkNumber(price)) {
                var obj = {};
                obj[name] = price.replace(',', '.');

                var result = data.months[lastMonth].categories[lastCategory].items.filter(item => {
                    var keys = Object.keys(item);
                    if (keys.length > 0) {
                        return name.trim() == keys[0].trim();
                    }
                    return false;
                });

                if (result.length == 1) {
                    var key = Object.keys(result[0])[0];
                    data.months[lastMonth].categories[lastCategory].items.splice(data.months[lastMonth].categories[lastCategory].items.indexOf(result[0]), 1);

                    var obj2 = {};
                    obj2[key] = (parseFloat(result[0][key]) + parseFloat(price.replace(',', '.'))).toString();
                    data.months[lastMonth].categories[lastCategory].items.push(obj2);
                    var result = document.getElementById('content').querySelectorAll('tr');
                    Object.entries(result).filter(tr => tr[1].querySelector('td').textContent.trim() == key)[0][1].querySelectorAll('td')[1].textContent = (Math.round(parseFloat(obj2[key]) * 100) / 100).toFixed(2) + ' €';
                } else {
                    data.months[lastMonth].categories[lastCategory].items.push(obj);
                    document.getElementById('content').appendChild(createListItem(name, Math.round(parseFloat(price.replace(',', '.')) * 100) / 100));
                }

                data.months[lastMonth].categories[lastCategory].amount = Math.round((parseFloat(data.months[lastMonth].categories[lastCategory].amount) + parseFloat(price.replace(',', '.'))) * 100) / 100;
                data.months[lastMonth].amount = Math.round((parseFloat(data.months[lastMonth].amount) + parseFloat(price.replace(',', '.'))) * 100) / 100;
                localStorage.setItem('data', JSON.stringify(data));
                document.getElementById('amount').textContent = data.months[lastMonth].categories[lastCategory].amount + '€';
            }
        }
    } else if (navIndex == 1) {
        var category = prompt('category:', '').trim();
        if (checkInput(category)) {
            if (data.categories == undefined || data.categories == null) {
                data.categories = [];
            }
            if (confirm('Would you like to add the category to future months as well?')) {
                if (!data.categories.includes(category)) {
                    data.categories.push(category);
                }
            }
            if (data.months[lastMonth].categories == undefined || data.months[lastMonth].categories == null) {
                data.months[lastMonth].categories = {};
            }
            if (data.months[lastMonth].categories[category] == undefined || data.months[lastMonth].categories[category] == null) {
                data.months[lastMonth].categories[category] = {
                    items: [],
                    amount: '0'
                };
                document.getElementById('content').appendChild(createListItem(category, 0.0, 'showItems("' + lastMonth + '", "' + category + '");'));
            }
            localStorage.setItem('data', JSON.stringify(data));
        }
    } else if (navIndex == 0) {
        var month = prompt('month:', _months_[_date_.getMonth()] + ' ' + _date_.getFullYear()).trim();
        if (checkInput(month)) {
            var budget = prompt('budget:', (data.budget != undefined && data.budget != null && data.budget != '' ? data.budget : '')).trim();
            if (checkNumber(budget)) {
                if (data.months[month] == undefined || data.months[month] == null) {
                    data.budget = budget;

                    var categories = {};

                    if (data.categories != undefined && data.categories != null) {
                        data.categories.forEach(category => {
                            categories[category] = {
                                items: [],
                                amount: '0'
                            };
                        });
                    }

                    data.months[month] = {
                        categories: categories,
                        amount: '0',
                        budget: budget
                    };

                    document.getElementById('content').appendChild(createListItem(month, calcMonth(data.months[month].budget, data.months[month].amount), 'showCategories("' + month + '");'));
                }
                localStorage.setItem('data', JSON.stringify(data));
            }
        }
    }
}

function showCategories(month) {
    navIndex++;
    lastMonth = month;

    removeElements();

    for (var key in data.months[month].categories) {
        document.getElementById('content').appendChild(createListItem(key, (data.months[month].categories[key].amount == undefined ? 0 : data.months[month].categories[key].amount), 'showItems("' + month + '", "' + key + '");'));
    }

    actions.appendChild(createAction('Delete Month', 'deleteMonth("' + month + '")'));

    if (Object.keys(data.months[month].categories).length > 0) {
        actions.appendChild(createAction('Export', 'exportCSV();', 'rgb(74, 164, 248)'));
    }

    document.getElementById('navLeftSpace').style.display = 'none';
    document.getElementById('navBack').style.display = 'block';
    var _date = new Date();
    var _days = new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();
    document.getElementById('amount').textContent = data.months[month].amount + '€ - ca.' + ((parseFloat(data.months[month].budget) - parseFloat(data.months[month].amount)) / (_days - _date.getDate())).toFixed(2) + '€ pro Tag';
}

function deleteMonth(month) {
    var input = prompt('Please enter the month "' + month + '" in the field below and press "ok" to delete.', '');
    if (input.trim() == month.trim()) {
        delete data.months[month];
        localStorage.setItem('data', JSON.stringify(data));
        navBack();
    }
}

function deleteCategory(month, category) {
    var input = prompt('Please enter the category name "' + category + '" in the field below and press "ok" to delete.', '');
    if (input.trim() == category.trim()) {
        data.months[month].amount = Math.round((parseFloat(data.months[month].amount) - parseFloat(data.months[month].categories[category].amount)) * 100) / 100;
        delete data.months[month].categories[category];
        if (confirm('Would you like to remove the category for future months as well?')) {
            data.categories.splice(data.categories.indexOf(category), 1);
        }
        localStorage.setItem('data', JSON.stringify(data));
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

    list.map(el => {
        if (el[1].includes('.')) {
            var _el = el[1].split('.')[0];
            if (!isNaN(parseInt(_el))) {
                return [el[0], el[1], parseInt(_el)];
            }
        }
        return el;
    }).sort((a, b) => {
        if (a.length > 2 && b.length > 2) {
            return a[2] - b[2];
        } else if (a.length > 2 || b.length > 2) {
            if (a.length > 2) {
                return -1;
            } else if (b.length > 2) {
                return 1;
            } else {
                return 0;
            }
        } else {
            if (a[1].toLowerCase() < b[1].toLowerCase()) {
                return -1;
            }
            if (a[1].toLowerCase() > b[1].toLowerCase()) {
                return 1;
            }
            return 0;
        }
    }).forEach(keys => {
        document.getElementById('content').appendChild(createListItem(keys[1], (data.months[month].categories[category].items[keys[0]][keys[1]] == undefined ? 0 : data.months[month].categories[category].items[keys[0]][keys[1]])));
    });

    actions.appendChild(createAction('Delete Category', 'deleteCategory("' + month + '","' + category + '")'));
    document.getElementById('amount').textContent = data.months[month].categories[category].amount + '€';
}

for (var key in data.months) {
    document.getElementById('content').appendChild(createListItem(key, calcMonth(data.months[key].budget, data.months[key].amount), 'showCategories("' + key + '");'));
}

actions.appendChild(createAction('Export', 'exportJSON();', 'rgb(74, 164, 248)'));
//actions.appendChild(React.createElement('div',{style: "text-align: center; color: black; padding: 16px;"},'v1.3.0 - 22.8.2019'));