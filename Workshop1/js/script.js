
kendo.culture("zh-TW");
var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

// 使用tooltip顯示送達日期
function showDeliveredDate(BookId, DeliveredDate) {
    //console.log(typeof DeliveredDate);
    $('#DeliveredIcon' + BookId).kendoTooltip({
        content: DeliveredDate
    });
}

function loadBookGrid() {
    $(document).ready(function () {
        var bookData = JSON.parse(localStorage.getItem('bookData'));
        //console.log(bookData);
        $("#book_grid").kendoGrid({
            toolbar: "<input type='search' class='k-textbox' id='searchBox' placeholder='我想要找..'>",
            dataSource: { data: bookData },
            height: 550,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                pageSize: 20,
                buttonCount: 5
            },
            columns: [{
                command: {
                    name: "details",
                    text: "刪除",
                    click: function (e) {
                        // prevent page scroll position change
                        e.preventDefault();
                        // e.target is the DOM element representing the button
                        var tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        var dataItem = this.dataItem(tr);
                        kendo.confirm("確定刪除「" + dataItem.BookName + "」嗎?") //彈跳確認刪除視窗
                            .done(function () {
                                var GridData = $("#book_grid").data("kendoGrid").dataSource;
                                //console.log(GridData);
                                GridData.remove(dataItem);
                                localStorage.clear();
                                localStorage.setItem('bookData', JSON.stringify(GridData._data));
                            });
                    }
                },
                width: 70
            }, {
                field: "BookId",
                title: "書籍編號",
                headerAttributes: {
                    style: "word-break:break-all; word-wrap:break-all"
                },
                width: 50
            }, {
                field: "BookName",
                title: "書籍名稱",
                width: 150
            }, {
                field: "BookCategory",
                title: "書籍種類",
                headerAttributes: {
                    style: "word-break:break-all"
                },
                values: bookCategoryList,
                width: 70
            }, {
                field: "BookAuthor",
                title: "作者",
                width: 100
            }, {
                field: "BookBoughtDate",
                title: "購買日期",
                format: "{0:yyyy-MM-dd}",
                attributes: {
                    style: "text-align: right"
                },
                width: 50
            }, {
                field: "BookDeliveredDate",
                title: "送達狀態",
                template: function (dataItem) {//設定送達狀態icon
                    if (typeof dataItem.BookDeliveredDate != "undefined") {
                        //console.log(dataItem);
                        var BookId = dataItem.BookId;
                        return "<i class='fas fa-truck' id='DeliveredIcon" + BookId + "' onmouseover=showDeliveredDate(" + dataItem.BookId + ",'" + dataItem.BookDeliveredDate + "') ></i >";
                    }
                    else {
                        return "";
                    }
                },
                width: 50
            }, {
                field: "BookPrice",
                title: "金額",
                format: "{0:n0}",
                attributes: {
                    style: "text-align: right"
                },
                width: 50
            }, {
                field: "BookAmount",
                title: "數量",
                format: "{0:n0}",
                attributes: {
                    style: "text-align: right"
                },
                width: 50
            }, {
                field: "BookTotal",
                title: "總計",
                format: "{0:n0}元",
                attributes: {
                    style: "text-align: right"
                },
                width: 70
            }
            ]
        });
        //設定查詢規則
        $('#searchBox').keyup(function () {
            var search = $('#searchBox').val();
            //console.log(search);
            var GridData = $("#book_grid").data("kendoGrid").dataSource;
            GridData.filter({
                logic: "or",
                filters: [
                    { field: "BookName", operator: "contains", value: search },
                    { field: "BookAuthor", operator: "contains", value: search }
                ]
            });
        });
    });
}

//新增書籍視窗
function add_book_view() {
    // 按下新增書籍跳出視窗
    $(document).ready(function () {
        $("#book_form").kendoWindow({
            width: "600px",
            height: "600px",
            title: "新增書籍",
            visible: false,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            close: onClose
        }).data("kendoWindow").center();
        //設置購買欲送達日期格式
        $("#bought_datepicker").kendoDatePicker({
            culture: "zh-TW",
            value: new Date(),
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy/MM/dd", "yyyyMMdd", "yyyy-MM-dd"]
        });
        $("#delivered_datepicker").kendoDatePicker({
            culture: "zh-TW",
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy/MM/dd", "yyyyMMdd", "yyyy-MM-dd"]
        });
        //選擇書的下拉式選單及更改圖片
        $("#book_category").kendoDropDownList({
            dataSource: bookCategoryList,
            dataTextField: 'text',
            dataValueField: 'value',
            change: function () {
                for (var x = 0; x < bookCategoryList.length; x++) {
                    if ($("#book_category").val() == bookCategoryList[x]["value"]) {
                        var imsrc = bookCategoryList[x]["src"];
                        $(".book-image").attr("src", imsrc);
                    }
                }
            }
        });
        //總計隨金額數量變動
        $("#book_price,#book_amount").kendoNumericTextBox({
            min: 0,
            decimals: 0,
            format: "{0:n0}",
            change: function () {
                var bookPrice = $("#book_price").val();
                var bookAmount = $("#book_amount").val();
                if (bookPrice != "" && bookAmount != "") {
                    var total = parseInt(bookPrice) * parseInt(bookAmount);
                    console.log(typeof total);
                    document.getElementById("book_total").innerHTML = moneyFormat(total.toString());
                } else {
                    document.getElementById("book_total").innerHTML = 0;
                }
            }
        });
        //新增書籍至localstorage
        $("#save_book").click(function () {
            bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
            bookid = bookDataFromLocalStorage[bookDataFromLocalStorage.length - 1]['BookId'] + 1;
            BookCategory = document.getElementById("book_category").value;
            BookName = document.getElementById("book_name").value;
            BookAuthor = document.getElementById("book_author").value;
            BookBoughtDate = document.getElementById("bought_datepicker").value;
            BookDeliveredDate = document.getElementById("delivered_datepicker").value;
            BookPrice = document.getElementById("book_price").value;
            BookAmount = document.getElementById("book_amount").value;
            BookTotal = BookPrice * BookAmount;
            if (BookDeliveredDate.indexOf('-') == -1) {
                bookDataFromLocalStorage.push({
                    "BookId": bookid,
                    "BookCategory": BookCategory,
                    "BookName": BookName,
                    "BookAuthor": BookAuthor,
                    "BookBoughtDate": BookBoughtDate,
                    "BookPublisher": "公司",
                    "BookPrice": BookPrice,
                    "BookAmount": BookAmount,
                    "BookTotal": BookTotal
                });
            }
            else {
                bookDataFromLocalStorage.push({
                    "BookId": bookid,
                    "BookCategory": BookCategory,
                    "BookName": BookName,
                    "BookAuthor": BookAuthor,
                    "BookBoughtDate": BookBoughtDate,
                    "BookDeliveredDate": BookDeliveredDate,
                    "BookPublisher": "公司",
                    "BookPrice": BookPrice,
                    "BookAmount": BookAmount,
                    "BookTotal": BookTotal
                });
            }
            localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
            location.reload();
            alert("新增成功");
        });
        $("#add_book").click(function () {
            $("#book_form").data("kendoWindow").open();
            $("#add_book").fadeOut();
        });
    });
    
    function onClose() {
        $("#add_book").fadeIn();
    }
    
}
function moneyFormat(str) {
    if (str.length <= 3) {
        return str;
    }
    else {
        return moneyFormat(str.substr(0, str.length - 3)) + "," + (str.substr(str.length - 3));
    }
}
$(function () {
    loadBookData();
    loadBookGrid();
    add_book_view();
});