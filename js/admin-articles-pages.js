requirejs(["jquery", "knockout", "./modules/api-admin-article-page", "tinymce", "toastr"], function ($, ko, api, tinymce, toastr) {

    var authorID = document.location.search.substr(3);

    // postHiddenArticle();

    adminViewModel = {

        emptyForm: ko.observable(null),
        selectedArticle: ko.observable(null),
        authorName: ko.observable(""),
        authorArticles: ko.observableArray([]),
        totalPages: ko.observableArray([]),
        currentPage: ko.observable(1),

        totalNumbersOfPages: ko.pureComputed(function () {
            var totalNumbersOfPages = [];
            for (var counter = 1; counter <= adminViewModel.totalPages(); counter++) {
                totalNumbersOfPages.push(counter);
            }
            return totalNumbersOfPages;
        }),

        pressBtnToCreate: function () {
            adminViewModel.goUp();
            adminViewModel.emptyForm(true);
            adminViewModel.selectedArticle(new Article({
                thumbnail: "https://placehold.it/800x400"
            }));
            tinymce.init({
                selector: '#fullArticleText',
                setup: function (editor) {
                    editor.on('change', function (e) {
                        editor.save();
                        // adminViewModel.selectedArticle().content =
                    });
                }
            });
        },

        chosenArticle: function (article) {
            adminViewModel.selectedArticle(article);
        },

        pressBtnToEdit: function () {
            adminViewModel.goUp();
            adminViewModel.emptyForm(true);
            // tinymce.init({
            //     selector: '#fullArticleText'
            // });
            api.showSelectedArticleForEdit(authorID, adminViewModel.selectedArticle().id)
                .done(function (data) {
                    adminViewModel.selectedArticle(new Article(data));
                });
        },

        closeForm: function () {
            adminViewModel.emptyForm(null);
            adminViewModel.goUp();
        },

        removeArticle: function () {
            api.removeArticle(authorID, adminViewModel.selectedArticle().id);
        },

        saveArticle: function () {
            var $form = $("#form");
            var $formInputs = $form[0].getElementsByTagName("input");
            var $formTextArea = $form[0].getElementsByTagName("textarea");

            for (var counter = 0; counter < $formInputs.length; counter++) {
                adminViewModel.checkValid($formInputs[counter]);
                if (!$formInputs[counter].checkValidity()) {
                    return
                }
            }

            for (var i = 0; i < $formTextArea.length; i++) {
                adminViewModel.checkValid($formTextArea[i]);
                if (!$formTextArea[i].checkValidity()) {
                    return
                }
            }

            if (adminViewModel.selectedArticle().id()) {
                api.editArticle(authorID);
            } else {
                api.createArticle(authorID);
            }
        },

        goToPreviousPage: function () {
            if (adminViewModel.currentPage() === 1) {
                return;
            }
            adminViewModel.clickToPage(adminViewModel.currentPage() - 1);
            adminViewModel.selectedArticle(null);
        },

        clickToPage: function (page) {
            adminViewModel.currentPage(page);
            adminViewModel.getAllArticlesOfAuthor(authorID);
            adminViewModel.selectedArticle(null);
        },

        goToNextPage: function () {
            if (adminViewModel.currentPage() === adminViewModel.totalPages()) {
                return;
            }
            adminViewModel.clickToPage(adminViewModel.currentPage() + 1);
            adminViewModel.selectedArticle(null);
        },

        getAllArticlesOfAuthor: function (authorID) {
            api.getAllArticlesOfAuthor(authorID);
        },

        openFileWindow: function () {
            $("#openFileWindow").click();
        },

        uploadPoster: function (ctx, event) {
            var files = event.target.files;
            if (!files.length) {
                return;
            }
            var ourImage = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(ourImage);
            fileReader.onloadend = function () {
                var dataURI = fileReader.result;
                adminViewModel.selectedArticle().thumbnail(dataURI);
            };
        },

        checkValid: function (element) {
            if (element.willValidate && element.validity.valueMissing) {
                toastr.error("Заповніть поле");
            }
        },

        goUp: function () {
            $('html, body').animate({scrollTop: 0}, 0);
        }
    };

    adminViewModel.getAllArticlesOfAuthor(authorID);
    ko.applyBindings(adminViewModel);

    function Article(json) {
        this.id = ko.observable(json.id);
        this.authorID = ko.observable(json.authorID);
        this.title = ko.observable(json.title);
        this.shortContent = ko.observable(json.shortContent);
        this.content = ko.observable(json.content);
        this.thumbnail = ko.observable(json.thumbnail);
    }
});

// function postHiddenArticle() {
//     $.ajax({
//         type: "post",
//         url: "api/users/" + authorID + "/articles",
//         contentType: "application/json",
//         data: ko.toJSON(new Article({
//             title: "hidden",
//             shortContent: "hidden",
//             content: "hidden"
//         }))
//     })
// }







