var vm = {
    openForm:ko.observable(false),
    itemsInPage:ko.observable(4),
    page:ko.observable(1),
    totalPages:ko.observable(),
    totalItems:ko.observable(),
    editable: null,
    currentUser: ko.observableArray([]),
    userList: ko.observableArray([]),
    loadUserList: function () {
        $.getJSON("api/users/"+vm.page()+"/"+vm.itemsInPage(), function (userList) {
            vm.userList(userList.data);
            vm.page(userList.page);
            vm.totalPages(userList.totalPages);
            vm.totalItems(userList.totalItems);
        } );
    },
    countryList: ko.observableArray([]),
    loadCountryList: function () {
        $.getJSON("api/countries", function (countryList) {
            vm.countryList(countryList);
        } );
    },
    paginationList:ko.pureComputed(function () {
        var masuv = [];
        for (i=1;i<=vm.totalPages();i++){
            masuv.push(i);
        }
        return masuv;
    }),
    goToNextPage:function () {
        if (vm.page()==vm.totalPages()){
            return;
        }
        else {
            vm.changePage(vm.page()+1)
        }
     },
    goToPerviousPage:function () {
        if (vm.page()==1){
            return;
        }
        else {
            vm.changePage(vm.page()-1)
        }
    },

    changePage:function (page) {
        vm.page(page);
        vm.loadUserList();
    },
    lastPage:function(){
      if((vm.itemsInPage() *(vm.page()-1))+1==vm.totalItems()){
          vm.changePage(vm.page()-1);
      }
      else {
          vm.loadUserList();
      }
    },
    load:function () {
            $("#uploadImageItem").click();
            $("#uploadImageItem").change(function() {
                vm.readURL(this);
            });

    },
    readURL:function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
            vm.currentUser().photo=e.target.result;
            };
        reader.readAsDataURL(input.files[0]);
        }
     },
    removeUser: function () {
        $.ajax({url:"api/users/"+vm.currentUser().id,
            type:"delete",
            success: vm.lastPage
        });
        vm.closeForm();
    },
    pressCreateBtn:function() {
        vm.currentUser().photo="img/400x400.gif";
        vm.openingForm();
    },
    openingForm: function () {
        vm.openForm(true);
    },
    closeForm: function () {
        vm.openForm(false);
        vm.editable= null;
        vm.currentUser([]);
    },
    sendForm:function () {
        if (vm.editable){
            $.ajax({url:"api/users/",
                type:"put",
                dataType: "json",
                data:  ko.toJSON(vm.currentUser),
                contentType:"application/json",
                success: vm.loadUserList
            });
            vm.editable= null;
        }
        else{
            $.ajax({url:"api/users",
                type:"post",
                dataType: "json",
                data: ko.toJSON(vm.currentUser),
                contentType:"application/json",
                success: vm.loadUserList
            });
        }
        vm.closeForm();
    },
    editUser: function (user) {
        vm.openingForm();
        vm.editable = user;
        vm.currentUser(user);
       },
    
    fillUser:function (user) {
        
    }

    };
vm.currentUser.subscribe(function (value) {
   console.log(value);
});
ko.applyBindings(vm);
vm.loadUserList();
vm.loadCountryList();
