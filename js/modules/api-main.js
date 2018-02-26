define(["jquery", "knockout", "toastr"], function ($, ko, toastr) {
    function User(json) {
        this.id = ko.observable(json.id);
        this.fullName = ko.observable(json.fullName);
        this.birthday = ko.observable(json.birthday);
        this.profession = ko.observable(json.profession);
        this.email = ko.observable(json.email);
        this.address = ko.observable(json.address);
        this.country = ko.observable(json.country);
        this.shortInfo = ko.observable(json.shortInfo);
        this.fullInfo = ko.observable(json.fullInfo);
        this.photo = ko.observable(json.photo);
    }
    return {
        showEmptyForm: function () {
            viewModel.selectedUser(new User({
                photo: "https://placehold.it/400x400"
            }));
        },
        showAllCountries: function () {
            $.getJSON("api/countries")
                .done(function (data) {
                    viewModel.countryData(data);
                });
        },
        showAllUsers: function (currentPage, totalUsersOnPage) {
            $.getJSON("api/users/" + currentPage + "/" + totalUsersOnPage + "/preview")
                .done(function (data) {
                    var dataArray = data.data;
                    viewModel.usersData(dataArray);
                    viewModel.totalPages(data.totalPages);
                });
        },
        showSelectedUser: function (user) {
            return $.getJSON("api/users/" + user.id)
                .done(function (user) {
                    viewModel.selectedUser(new User(user));
                });
        },
        removeSelectedUser: function (userID) {
            $.ajax({
                type: "delete",
                url: "api/users/" + userID
            }).done(function (data) {
                viewModel.selectedUser(null);
                viewModel.getAllUsers();
                toastr.success("Користувач " + data.fullName + " успішно видалений");
            });
        },
        editUser: function () {
            $.ajax({
                type: "put",
                url: "api/users",
                contentType: "application/json",
                data: ko.toJSON(viewModel.selectedUser())
            }).done(function (data) {
                for (var counter = 0; counter < viewModel.usersData().length; counter++) {
                    if (viewModel.usersData()[counter].id === data.id) {
                        var indexToRemove = viewModel.usersData.indexOf(viewModel.usersData()[counter]);
                        viewModel.usersData.splice(indexToRemove, 1, data);
                    }
                }
                viewModel.selectedUser(new User(data));
                toastr.success("Дані користувача успішно відредаговані");
            });
        },
        createUser: function () {
            $.ajax({
                type: "post",
                url: "api/users",
                contentType: "application/json",
                data: ko.toJSON(viewModel.selectedUser())
            }).done(function (data) {
                viewModel.getAllUsers();
                viewModel.selectedUser(new User({}));
                toastr.success("Користувач " + data.fullName + " успішно створений");
            });
        }
    }
});



