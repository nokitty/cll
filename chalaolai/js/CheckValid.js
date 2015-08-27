/// <reference path="tools.ts" />
$(document).on("blur", ".check-valid", function () {
    var t = $(this);
    var checktype = t.attr("data-check-type");
    CheckValid[checktype](t);
});
var CheckValid = (function () {
    function CheckValid() {
    }
    CheckValid.telnum = function (formGroup) {
        var reg = /^(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9])\d{8}$/;
        return this.Check(formGroup, reg);
    };
    CheckValid.cardnum = function (formGroup) {
        var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        return this.Check(formGroup, reg);
    };
    CheckValid.notempty = function (formGroup) {
        var reg = /\S+/;
        return this.Check(formGroup, reg);
    };
    CheckValid.notnull = function (formGroup) {
        var reg = /.+/;
        return this.Check(formGroup, reg);
    };
    CheckValid.isnumber = function (formGroup) {
        var reg = /^[0-9]+(\.[0-9]{1,2}){0,1}$/;
        return this.Check(formGroup, reg);
    };
    CheckValid.isinteger = function (formGroup) {
        var reg = /^[0-9]+$/;
        return this.Check(formGroup, reg);
    };
    CheckValid.Check = function (formGroup, reg) {
        var input = formGroup.find("input");
        var val = input.val();
        if (reg.test(val) == false) {
            formGroup.find(".error-text").show();
            formGroup.addClass("has-error");
            return true;
        }
        else {
            formGroup.find(".error-text").hide();
            formGroup.removeClass("has-error");
            return false;
        }
    };
    return CheckValid;
})();
