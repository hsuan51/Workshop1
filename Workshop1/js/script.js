
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

function showDeliveredDate(BookId,DeliveredDate) {
    //console.log(typeof DeliveredDate);
    $('#DeliveredIcon' + BookId).kendoTooltip({
        content: DeliveredDate
    });
}

function loadBookGrid() {
    $(document).ready(function () {
        var bookData = JSON.parse(localStorage.getItem('bookData'));
        console.log(bookData);
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
                        kendo.confirm("確定刪除「" + dataItem.BookName + "」嗎?")
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
                template: function (dataItem) {
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
$(function () {
    loadBookData();
    loadBookGrid();
});