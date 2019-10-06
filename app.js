// modul odpowiedzialny za logike dzialania
var dataController = (function() {
    
    var Activity = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Food = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
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

    }

})();

// modul odpowiedzialny za pobieranie danych od uzytkownika i ich wysweitlanie
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputCalories: '.add-calories-value',
        inputCarbohydrates: '.add-carbohydrates-value',
        inputProteins: '.add-proteins-value',
        inputFats: '.add-fats-value',
        inputBtn: '.add-button',
    }
    return {
        getinput: function() {
            return{
                type : document.querySelector(DOMstrings.inputType).value, //jedzenie lub aktywnosc fizyczna
                description : document.querySelector(DOMstrings.inputDescription).value, 
                calories : document.querySelector(DOMstrings.inputCalories).value, 
                carbohydrates : document.querySelector(DOMstrings.inputCarbohydrates).value, 
                proteins : document.querySelector(DOMstrings.inputProteins).value,
                fats : document.querySelector(DOMstrings.inputFats).value,
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();

// glowny modul, bedacy lacznikiem miedzy dwoma pozostalymi modulami
var controller = (function(dataCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13) {
                event.preventDefault(); //zapobiega wywołaniu przez enter kliknięcia
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function(){
        // 1. zabierz dane z wypelnionych pól
        var input = UICtrl.getinput();

        // 2. dodaj element do dataControllera
        // 3. dodaj element do UI
        // 4. przelicz zapotrzebowanie kaloryczne
        // 5. wyswietl zapotzrebowania
    };

    return {
        init: function() {
            console.log("start");
            setupEventListeners();
        }
    }

})(dataController, UIController);

controller.init();