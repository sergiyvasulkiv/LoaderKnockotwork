requirejs.config({
    baseUrl: "js",
    paths: {
        "jquery": "/node_modules/jquery/dist/jquery",
        "bootstrap": "/node_modules/bootstrap/dist/js/bootstrap",
        "knockout": "/node_modules/knockout/build/output/knockout-latest",
        "toastr": "/node_modules/toastr/toastr",
        "tinymce": "/node_modules/tinymce/tinymce",
        "moment": "/node_modules/moment/moment",
        "datapicker": "/node_modules/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min"
    },
    shim: {
        "knockout": {
            exports: "knockout"
        },
        "jquery": {
            exports: "jQuery"
        },
        "bootstrap": {
            exports: "jQuery",
            deps: ["jquery"]
        },
        "toastr": {
            deps: ["jquery"],
            exports: "toastr"
        },
        "tinymce": {
            exports: "tinymce"
        },
        "moment": {
            exports: "moment"
        },
        "datapicker": {
            deps: ["moment", "jquery", "bootstrap"]
        }
    }
});