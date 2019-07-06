jQuery(function ($) {
    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if ($(this).parent().hasClass("active")) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    })

    $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled")
    })
    $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled")
    })
})

//RTC
window.setInterval(indexDT, 1000);
function indexDT() {
    var d = new Date()
    document.getElementById("indexDT").innerHTML = d.toString()
}

//Menu
function dashboardFn() {
    console.log('1')
    $('#resFrame').attr('src', '/html/dashboard.html')
}
function devManagementFn(mode) {
    if (mode == 'controller') {
        console.log('2.1')
        $('#resFrame').attr('src', '/html/nodeManagement.html')
    } else if (mode == 'sensor') {
        console.log('2.2')
        $('#resFrame').attr('src', '/html/sensorManagement.html')
    }

}
function controlFn() {
    $('#resFrame').attr('src', '/html/control.html')
}
function mapWithStatusFn(mode) {
    if (mode == 'lite') {
        console.log('3.1')
        $('#resFrame').attr('src', '/html/L_map_status.html')
    } else if (mode == 'satellite') {
        console.log('3.2')
        $('#resFrame').attr('src', '/html/S_map_status.html')
    }
}
function scheduleFn() {
    console.log('4')
    $('#resFrame').attr('src', '/html/schedule.html')
}
function logFn() {
    console.log('5')
    $('#resFrame').attr('src', '/html/log.html')
}
function documentFn() {
    console.log('6')
    $('#resFrame').attr('src', 'https://drive.google.com/embeddedfolderview?id=1XlwfhNbz-obcvQWwXp18hA8LDQBqEeCM#grid')
}



//Frist do it
indexDT()