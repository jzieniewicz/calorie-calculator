// modul odpowiedzialny za logike dzialania
var dataController = (function () {

    var Activity = function (id, description, calories) {
        this.id = id;
        this.description = description;
        this.calories = calories;
    };

    var Food = function (id, description, calories, carbohydrates, fats, proteins) {
        this.id = id;
        this.description = description;
        this.calories = calories;
        this.carbohydrates = carbohydrates;
        this.fats = fats;
        this.proteins = proteins;
    };

    var calculateTotal = function(type) {
        var totalCalories = 0;
        var totalCarbs = 0;
        var totalFats = 0;
        var totalProteins = 0;
        data.allItems[type].forEach(function(cur) {
            totalCalories += cur.calories;
            if (type === "food"){
                totalCarbs = cur.carbohydrates;
                totalFats = cur.fats;
                totalProteins = cur.proteins;
            }
            cur.carbohydrates = 0;
            cur.fats = 0;
            cur.proteins = 0;
        });
        data.totals[type] = totalCalories;
        data.carbohydrates += totalCarbs;
        data.fats += totalFats;
        data.proteins += totalProteins;
    };

    var data = {
        allItems: {
            food: [],
            activity: [],
        },
        totals: {
            food: 0,
            activity: 0,
        },
        carbohydrates: 0,
        fats: 0,
        proteins: 0,
        balance: 0,
    };

    return {
        addItem: function (type, des, cal, car, fat, pro) {
            var newItem, ID;

            // tworzenie nowego ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            // nowy element zależny od typu
            if (type === 'activity') {
                newItem = new Activity(ID, des, cal);
            } else if (type === 'food') {
                newItem = new Food(ID, des, cal, car, fat, pro);
            }

            // dodanie elementu do struktury
            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateData: function(){
            // obliczyć nabyte i spalone kalorie
            calculateTotal('food');
            calculateTotal('activity')
            // obliczyć składniki odżywcze

            // obliczyć bilans: food - activity
            data.balance = data.totals.food - data.totals.activity;
        },

        getData: function(){
            return {
                balance: data.balance,
                totalFood: data.totals.food,
                totalActivity: data.totals.activity,
                totalCarbs: data.carbohydrates,
                totalFats: data.fats,
                totalProteins: data.proteins
            };
        },

        testing: function () {
            console.log(data);
        }
    };

})();

// modul odpowiedzialny za pobieranie danych od uzytkownika i ich wysweitlanie
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputCalories: '.add-calories-value',
        inputCarbohydrates: '.add-carbohydrates-value',
        inputProteins: '.add-proteins-value',
        inputFats: '.add-fats-value',
        inputBtn: '.add-button',
        foodContainer: '.food-list',
        activityContainer: '.activity-list',
        caloriesBalance: '.calories-balance',
        absorbedCalories: '.absorbed-calories-value',
        burnedCalories: '.burned-calories-value',
        outputCarbs: '.carbohydrates-value',
        outputFats: '.fats-value',
        outputProteins: '.proteins-value',
        displayContainer: '.display-list-container'
    };

    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                calories: parseFloat(document.querySelector(DOMstrings.inputCalories).value),
                carbohydrates: parseFloat(document.querySelector(DOMstrings.inputCarbohydrates).value),
                fats: parseFloat(document.querySelector(DOMstrings.inputFats).value),
                proteins: parseFloat(document.querySelector(DOMstrings.inputProteins).value),
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // html string z placeholderem

            if (type === 'food') {
                element = DOMstrings.foodContainer;
                html = '<div class="item clearfix" id="food-%id%"> <div class="item-description">%description%</div> <div class="toRight"> <div class="item-calories">%calories%</div> <div class="item-delete"> <button class="item-delete-btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>'
            }
            else if (type === 'activity') {
                element = DOMstrings.activityContainer;
                html = '<div class="item clearfix" id="activity-%id%"> <div class="item-description">%description%</div> <div class="toRight"> <div class="item-calories">%calories%</div> <div class="item-delete"> <button class="item-delete-btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>'
            }

            // zastąpić placeholdera danymi użytkownika
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%calories%', obj.calories);

            // włożyć stworzony html do DOMu
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputCalories + ', ' + DOMstrings.inputCarbohydrates + ', ' + DOMstrings.inputFats + ', ' + DOMstrings.inputProteins);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayData: function(obj){
            document.querySelector(DOMstrings.caloriesBalance).textContent = obj.balance;
            document.querySelector(DOMstrings.absorbedCalories).textContent = obj.totalFood;
            document.querySelector(DOMstrings.burnedCalories).textContent = obj.totalActivity;
            document.querySelector(DOMstrings.outputCarbs).textContent = obj.totalCarbs;
            document.querySelector(DOMstrings.outputFats).textContent = obj.totalFats;
            document.querySelector(DOMstrings.outputProteins).textContent = obj.totalProteins;
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();

// glowny modul, bedacy lacznikiem miedzy dwoma pozostalymi modulami
var controller = (function (dataCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                event.preventDefault(); //zapobiega wywołaniu przez enter kliknięcia
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.displayContainer).addEventListener('click', ctrlDeleteItem);
    };

    var updateData = function () {
        // 1. przelicz bilans kaloryczne
        dataCtrl.calculateData();
        // 2. zwróc bilans
        var balance = dataController.getData();
        // 3. wyswietl bilans
        UICtrl.displayData(balance);
    };

    var ctrlAddItem = function () {

        var input, newItem;

        // 1. zabierz dane z wypelnionych pól
        input = UICtrl.getinput();

        if (input.type === "activity" && input.description !== "" && !isNaN(input.calories) && input.calories > 0) {
            // 2. dodaj element do dataControllera
            newItem = dataCtrl.addItem(input.type, input.description, input.calories, input.carbohydrates, input.fats, input.proteins);

            // 3. dodaj element do UI
            UICtrl.addListItem(newItem, input.type);

            // wyczyść pole
            UICtrl.clearFields();

            // przelicz i zaktualizuj dane
            updateData();
        } else if (input.type === "food" && input.description !== "" && !isNaN(input.calories) && input.calories > 0 && !isNaN(input.carbohydrates) && input.carbohydrates > 0 && !isNaN(input.fats) && input.fats > 0 && !isNaN(input.proteins) && input.proteins > 0){
            // 2. dodaj element do dataControllera
            newItem = dataCtrl.addItem(input.type, input.description, input.calories, input.carbohydrates, input.fats, input.proteins);

            // 3. dodaj element do UI
            UICtrl.addListItem(newItem, input.type);

            // wyczyść pole
            UICtrl.clearFields();

            // przelicz i zaktualizuj dane
            updateData();
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            // 1.usunąć element ze struktury danych
            // 2. usunąć z UI
            // 3. zaktualizować bilans i wyświetlić go
        }
    };

    return {
        init: function () {
            console.log("start");
            UICtrl.displayData({
                balance: 0,
                totalFood: 0,
                totalActivity: 0,
                totalCarbs: 0,
                totalFats: 0,
                totalProteins: 0
            });
            setupEventListeners();
        }
    }

})(dataController, UIController);

controller.init();