define(["knockout", "toastr"], function (ko, toastr) {
    return {
        showSelectedArticleForEdit: function (authorID, articleID) {
            return $.getJSON("api/users/" + authorID + "/articles/" + articleID)
        },
        removeArticle: function (authorID, articleID) {
            $.ajax({
                type: "delete",
                url: "api/users/" + authorID + "/articles/" + articleID
            }).done(function () {
                toastr.success("Стаття усіпішно видалена");
                adminViewModel.getAllArticlesOfAuthor(authorID);
            })
        },
        editArticle: function (authorID) {
            $.ajax({
                type: "put",
                url: "api/users/" + authorID + "/articles",
                contentType: "application/json",
                data: ko.toJSON(adminViewModel.selectedArticle())
            }).done(function () {
                adminViewModel.emptyForm(null);
                adminViewModel.goUp();
                adminViewModel.getAllArticlesOfAuthor(authorID);
                toastr.success("Стаття успішно відредагована");
            });
        },
        createArticle: function (authorID) {
            $.ajax({
                type: "post",
                url: "api/users/" + authorID + "/articles",
                contentType: "application/json",
                data: ko.toJSON(adminViewModel.selectedArticle())
            }).done(function () {
                adminViewModel.emptyForm(null);
                adminViewModel.goUp();
                adminViewModel.getAllArticlesOfAuthor(authorID);
                toastr.success("Стаття успішно створена");
            });
        },
        getAllArticlesOfAuthor: function (authorID) {
            $.getJSON("api/users/" + authorID + "/articles/" + adminViewModel.currentPage() + "/3")
                .done(function (data) {
                    var userData = data.data;
                    adminViewModel.authorArticles(userData);
                    adminViewModel.authorName(adminViewModel.authorArticles()[0].authorFullName);
                    adminViewModel.totalPages(data.totalPages);
                    // for (var i = 0; i < adminViewModel.authorArticles().length; i++) {
                    //     if (adminViewModel.authorArticles()[i].title === "hidden") {
                    //         console.log(adminViewModel.authorArticles()[i]);
                    //     }
                    // }
                    // toastr.success("Вітаємо " + adminViewModel.authorName());
                });
        }
    }
});



