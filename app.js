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

    document.querySelector('.add-button').addEventListener('click', function(){
        console.log('aaa')
    });

})(dataController, UIController);