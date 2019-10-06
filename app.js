// modul odpowiedzialny za logike dzialania
var dataController = (function () {

    var Activity = function (id, description, calories) {
        this.id = id;
        this.description = description;
        this.calories = calories;
    };

    var Food = function (id, description, calories) {
        this.id = id;
        this.description = description;
        this.calories = calories;
    };

    var data = {
        allItems: {
            food: [],
            activity: [],
        },
        totals: {
            food: 0,
            activity: 0,
        }
    }

    return {
        addItem: function (type, des, val) {
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
                newItem = new Activity(ID, des, val);
            } else if (type === 'food') {
                newItem = new Food(ID, des, val);
            }

            // dodanie elementu do struktury
            data.allItems[type].push(newItem);
            return newItem;
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
    }
    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                calories: document.querySelector(DOMstrings.inputCalories).value,
                carbohydrates: document.querySelector(DOMstrings.inputCarbohydrates).value,
                proteins: document.querySelector(DOMstrings.inputProteins).value,
                fats: document.querySelector(DOMstrings.inputFats).value,
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // html string z placeholderem

            if(type === 'food') {
                element = DOMstrings.foodContainer;
                html = '<div class="item clearfix" id="food-%id%"> <div class="item-description">%description%</div> <div class="right clearfix"> <div class="item-calories">%calories%</div> <div class="item-delete"> <button class="item-delete-btn"> <i class="icon-ios-close-outline"></i> </button > </div > </div > </div > '
            }
            else if (type === 'activity'){
                element = DOMstrings.activityContainer;
                html = '<div class="item clearfix" id="activity-%id%"> <div class="item-description">%description%</div> <div class="right clearfix"> <div class="item-calories">%calories%</div> <div class="item-delete"> <button class="item-delete-btn"> <i class="icon-ios-close-outline"></i> </button> </div> </div> </div>'
            }
            
            // zastąpić placeholdera danymi użytkownika
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%calories%', obj.calories);

            // włożyć stworzony html do DOMu
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

getDOMstrings: function() {
    return DOMstrings;
}
    }

}) ();

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
    };

    var ctrlAddItem = function () {

        var input, newItem;

        // 1. zabierz dane z wypelnionych pól
        input = UICtrl.getinput();

        // 2. dodaj element do dataControllera
        newItem = dataCtrl.addItem(input.type, input.description, input.calories);

        // 3. dodaj element do UI
        UICtrl.addListItem(newItem, input.type);
        // 4. przelicz zapotrzebowanie kaloryczne
        // 5. wyswietl zapotzrebowania
    };

    return {
        init: function () {
            console.log("start");
            setupEventListeners();
        }
    }

})(dataController, UIController);

controller.init();