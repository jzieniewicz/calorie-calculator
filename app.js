// modul odpowiedzialny za logike dzialania
var dataController = (function() {
    
    return {

    }

})();

// modul odpowiedzialny za pobieranie danych od uzytkownika i ich wysweitlanie
var UIController = (function() {
    

})();

// glowny modul, bedacy lacznikiem miedzy dwoma pozostalymi modulami
var controller = (function(dataCtrl, UICtrl) {

    var ctrlAddItem = function(){
        // 1. zabierz dane z wypelnionych pól
        // 2. dodaj element do dataControllera
        // 3. dodaj element do UI
        // 4. przelicz zapotrzebowanie kaloryczne
        // 5. wyswietl zapotzrebowania
        console.log('dziala');
    }
    document.querySelector('.add-button').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13) {
            event.preventDefault(); //zapobiega wywołaniu przez enter kliknięcia
            ctrlAddItem();
        }
    });

})(dataController, UIController);