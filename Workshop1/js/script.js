
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






function loadBookGrid() {
    $(document).ready(function () {
        var bookData = JSON.parse(localStorage.getItem('bookData'));
        console.log(bookData);
        $("#book_grid").kendoGrid({
            dataSource: { data: bookData },
            height: 550,
            groupable: true,
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
                        console.log("Details for: ");
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
                            return "<i class='fas fa-truck' title=" + kendo.format(dataItem.BookDeliveredDate,'yyyy-MM-dd')+ "></i>";
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
    });
}
$(function () {
    loadBookData();
    loadBookGrid();
});