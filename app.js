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

    var calculateTotal = function (type) {
        var totalCalories = 0;
        var totalCarbs = 0;
        var totalFats = 0;
        var totalProteins = 0;
        data.allItems[type].forEach(function (cur) {
            totalCalories += cur.calories;
            if (type === "food") {
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
        bmiResult: -1,
        bmr: 0,
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

        calculateBmi: function (weight, height) {
            var bmi, bmiResult;
            // obliczanie bmi
            bmi = weight / Math.pow(height, 2);
            if (bmi > 0 && bmi < 18.5) bmiResult = 0; //"niedowaga";
            else if (bmi >= 18.5 && bmi <= 24.9) bmiResult = 1; //"waga prawidłowa";
            else if (bmi > 24.9 && bmi <= 29.9) bmiResult = 2; //"nadwaga";
            else if (bmi > 29.9) bmiResult = 3; //"otyłość";
            else bmiResult = -1;
            // dodanie wyniku do struktury
            data.bmiResult = bmiResult;
            return bmiResult;
        },

        calculateBmr: function (weight, height, sex, age, achievment) {
            // obliczanie bmr (podstawowego zapotrzebowania kalorycznego) metodą Mifflin-St Jeor. 
            // dla mężczyzn [9,99 x masa ciała (kg)] + [6,25 x wzrost (cm)] - [4,92 x wiek (lata)] + 5
            // dla kobiet [9,99 x masa ciała (kg)] + [6,25 x wzrost (cm)] - [4,92 x wiek(lata)] - 161
            var demand, bmr, pointer;
            var activityRate = 1.4; //wartość dla normalnego funkcjonowania
            if (sex === "man") pointer = 5;
            else if (sex === "woman") pointer = -161
            bmr = 9.99 * weight + 625 * height - 4.92 * age + pointer; //tyle kalorii spala przez dobę organizm w czasie spoczynku

            demand = bmr * activityRate;

            if (achievment === "gain-weight") demand += 400;
            else if (achievment === "keep-weight") demand;
            else if (achievment === "reduce-weight") demand -= 400;
            demand = parseInt(demand);
            data.bmr = demand;
            return demand;
        },

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

        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateData: function () {
            // obliczyć nabyte i spalone kalorie
            calculateTotal('food');
            calculateTotal('activity')
            // obliczyć składniki odżywcze

            // obliczyć bilans: food - activity
            data.balance = data.bmr - data.totals.food + data.totals.activity;
        },

        getData: function () {
            return {
                bmiResult: data.bmiResult,
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
        inputWeight: '.bmi-weight-input',
        inputHeight: '.bmi-height-input',
        bmiBtn: '.bmi-submit-button',
        outputBmi: '.bmi-result',
        inputSex: '.sex-selection',
        inputAge: '.age-input',
        inputAchievment: '.achievment-selection',
        bmrBtn: '.bmr-submit-button',
        outputBmr: '.basal-metabolic-rate-title',
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
        getBmiInput: function () {
            return {
                weight: parseFloat(document.querySelector(DOMstrings.inputWeight).value),
                height: parseFloat(document.querySelector(DOMstrings.inputHeight).value),
            }
        },

        getBmrInput: function () {
            return {
                sex: document.querySelector(DOMstrings.inputSex).value,
                age: parseInt(document.querySelector(DOMstrings.inputAge).value),
                achievment: document.querySelector(DOMstrings.inputAchievment).value,
            }
        },

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

        displayBmi: function (result) {
            if (result === 0) {
                document.querySelector(DOMstrings.outputBmi).textContent = "Niedowaga";
            } else if (result === 1) {
                document.querySelector(DOMstrings.outputBmi).textContent = "Waga prawidłowa";
            } else if (result === 2) {
                document.querySelector(DOMstrings.outputBmi).textContent = "Nadwaga";
            } else if (result === 3) {
                document.querySelector(DOMstrings.outputBmi).textContent = "Otyłość";
            } else {
                document.querySelector(DOMstrings.outputBmi).textContent = "Wprowadź dane aby dowiedzieć się czy Twoja waga jest prawidłowa";
            }
        },

        displayBmr: function (demand) {
            document.querySelector(DOMstrings.caloriesBalance).textContent = demand;
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

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearBmiFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputWeight + ', ' + DOMstrings.inputHeight);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        clearBmrFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputWeight + ', ' + DOMstrings.inputHeight + ', ' + DOMstrings.inputSex + ', ' + DOMstrings.inputAge + ', ' + DOMstrings.inputAchievment);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
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

        displayData: function (obj) {
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

        document.querySelector(DOM.bmiBtn).addEventListener('click', ctrlCalculateBmi);

        document.querySelector(DOM.bmrBtn).addEventListener('click', ctrlCalculateBmr);

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                event.preventDefault(); //zapobiega wywołaniu przez enter kliknięcia
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.displayContainer).addEventListener('click', ctrlDeleteItem);
    };

    var ctrlCalculateBmi = function () {
        var bmiInput, bmiResult;
        // 1. pobrać dane z sekcji bmi
        bmiInput = UICtrl.getBmiInput();
        // 2. obliczyć bmi
        bmiResult = dataCtrl.calculateBmi(bmiInput.weight, bmiInput.height);
        // 3. wyswietlić rezultat
        UICtrl.displayBmi(bmiResult);
        // UICtrl.clearBmiFields();
    };

    var ctrlCalculateBmr = function () {
        var bmrInput, bmrResult, bmrResult;
        bmiInput = UICtrl.getBmiInput();
        bmrInput = UICtrl.getBmrInput();
        console.log(bmrInput.sex, bmrInput.achievment)
        bmrResult = dataCtrl.calculateBmr(bmiInput.weight, bmiInput.height, bmrInput.sex, bmrInput.age, bmrInput.achievment);
        UICtrl.displayBmr(bmrResult);
        // UICtrl.clearBmrFields();
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
        } else if (input.type === "food" && input.description !== "" && !isNaN(input.calories) && input.calories > 0 && !isNaN(input.carbohydrates) && input.carbohydrates > 0 && !isNaN(input.fats) && input.fats > 0 && !isNaN(input.proteins) && input.proteins > 0) {
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

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1.usunąć element ze struktury danych
            dataCtrl.deleteItem(type, ID);
            // 2. usunąć z UI
            UICtrl.deleteListItem(itemID);
            // 3. zaktualizować bilans i wyświetlić go
            updateData();
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