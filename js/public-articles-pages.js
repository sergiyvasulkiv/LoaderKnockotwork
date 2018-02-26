requirejs(["bootstrap", "knockout", "./modules/api-public-article-page"], function ($, ko, api) {

    var $authorizationForm = $("#authorizationForm");
    $authorizationForm.submit(function (e) {
        e.preventDefault();
        var $userNameInput = $("#userNameInput");
        var $userPassInput = $("#userPasswordInput");
        if ($userNameInput.val() === "admin" && $userPassInput.val() === "admin") {
            $("#linkToAdminPage")[0].click();
        }
        api.authorization($userNameInput, $userPassInput);
    });

    viewModel = {
        countryData: ko.observableArray([]),
        currentPage: ko.observable(1),
        totalPages: ko.observable(0),
        articlesData: ko.observableArray([]),
        selectedArticle: ko.observable(null),
        registrationForm: ko.observable(null),

        numbersOfPages: ko.pureComputed(function () {
            var arrayOfPages = [];
            for (var counter = 1; counter <= viewModel.totalPages(); counter++) {
                arrayOfPages.push(counter);
            }
            return arrayOfPages;
        }),

        goToPreviousPage: function () {
            if (viewModel.currentPage() === 1) {
                return
            }
            viewModel.clickToPage(viewModel.currentPage() - 1);
        },

        clickToPage: function (currentNumber) {
            viewModel.currentPage(currentNumber);
            viewModel.getAllArticles();
        },

        goToNextPage: function () {
            if (viewModel.currentPage() === viewModel.totalPages()) {
                return
            }
            viewModel.clickToPage(viewModel.currentPage() + 1);
        },

        chooseArticle: function (selectedArticle) {
            $('html, body').animate({scrollTop: 0}, 0);
            api.showSelectedArticle(selectedArticle);
        },

        clickToRegistration: function () {
            viewModel.registrationForm(new UserDataForRegistration({}))
        },

        pressBtnAnnouncements: function () {
            viewModel.selectedArticle(null);
        },

        getAllArticles: function () {
            api.getAllArticles(viewModel.currentPage())      ;
        },

        getAllCountries: function () {
            api.getAllCountries();
        },

        sendRegistrationData: function () {
            api.sendRegistrationData(viewModel.registrationForm());
        },

        goUp: function () {
            $('html, body').animate({scrollTop: 0}, 500);
        }
    };

    viewModel.getAllArticles();
    viewModel.getAllCountries();
    ko.applyBindings(viewModel);

    function UserDataForRegistration(json) {
        this.fullName = ko.observable(json.fullName);
        this.profession = ko.observable(json.profession);
        this.email = ko.observable(json.email);
        this.country = ko.observable(json.country);
    }
});
