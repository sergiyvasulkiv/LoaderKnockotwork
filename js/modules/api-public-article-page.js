define(["toastr", "knockout"], function (toastr, ko) {
    return {
        getAllArticles: function (pages) {
            $.getJSON("api/articles/" + pages + "/8")
                .done(function (data) {
                    viewModel.articlesData(data);
                    viewModel.totalPages(data.totalPages);
                });
        },
        getAllCountries: function () {
            $.getJSON("api/countries")
                .done(function (data) {
                    viewModel.countryData(data);
                });
        },
        sendRegistrationData: function (form) {
            $.ajax({
                type: "post",
                url: "api/users",
                contentType: "application/json",
                data: ko.toJSON(form)
            }).done(function () {
                    $("#regBtnCancel").click();
                    toastr.success("Ви успішно зареєструвалися :)");
                }
            )
        },
        showSelectedArticle: function (selectedArticle) {
            $.getJSON("api/users/" + selectedArticle.authorID + "/articles/" + selectedArticle.id)
                .done(function (article) {
                    viewModel.selectedArticle(article);
                });
        },
        authorization: function ($userNameInput, $userPassInput) {
            $.getJSON("api/articles/1/100")
                .done(function (data) {
                    var dataOfUsers = data.data;
                    for (var key in dataOfUsers) {
                        if ($userNameInput.val() === dataOfUsers[key].authorFullName && parseInt($userPassInput.val()) === 100) {
                            var authorID = dataOfUsers[key].authorID;
                            var $pageOfUser = $("#pageOfUser");
                            $pageOfUser.attr("href", "http://localhost:8081/admin-articles-pages.html?id" + authorID);
                            $pageOfUser[0].click();
                        }
                    }
                    $userNameInput.val("");
                    $userPassInput.val("");
                    return toastr.error("Невірний користувач або пароль! Спробуйте ще раз.");
                });
        }
    }
});



