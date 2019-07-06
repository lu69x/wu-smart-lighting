//---------------------- map_input ----------------------
var nodePin_map_input;
var map_input = L.map('map_input', { zoomControl: false })
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=”https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map_input);

window.setTimeout(function () {
    map_input.invalidateSize();
}, 1000);
//L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{minZoom:1, maxZoom: 21,subdomains:['mt0','mt1','mt2','mt3']}).addTo(map);
map_input.setView([8.64159, 99.89747], 14)

$('.leaflet-container').css('cursor', 'crosshair');
map_input.addEventListener('click', function (ev) {
    if (nodePin_map_input != null) {
        nodePin_map_input.remove()
    }
    map_input.invalidateSize();
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
    $('#lat_input').val(lat)
    $('#lng_input').val(lng)
    var nodeIcon = L.icon({ iconUrl: '/html/img/pin.png', iconAnchor: [16, 32], popupAnchor: [0, -32] })
    nodePin_map_input = L.marker([lat, lng], { icon: nodeIcon }).addTo(map_input)
    //node[i].remove();
});

//---------------------- map_upd ----------------------
var nodePin_map_upd;
var map_upd = L.map('map_upd', { zoomControl: false })
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=”https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map_upd);

window.setTimeout(function () {
    map_upd.invalidateSize();
}, 1000);
//L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{minZoom:1, maxZoom: 21,subdomains:['mt0','mt1','mt2','mt3']}).addTo(map);

/*  
////---------------------- Set view at fetchRecord() ---------------------- 
map_upd.setView([8.64159, 99.89747], 14).invalidateSize()
nodePin_map_upd = L.marker([lat, lng], { icon: nodeIcon }).addTo(map_upd)
*/

$('.leaflet-container').css('cursor', 'crosshair');
map_upd.addEventListener('click', function (ev) {
    if (nodePin_map_upd != null) {
        nodePin_map_upd.remove()
    }
    map_upd.invalidateSize();
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
    $('#lat_upd').val(lat)
    $('#lng_upd').val(lng)
    var nodeIcon = L.icon({ iconUrl: '/html/img/pin.png', iconAnchor: [16, 32], popupAnchor: [0, -32] })
    nodePin_map_upd = L.marker([lat, lng], { icon: nodeIcon }).addTo(map_upd)
    //node[i].remove();
});


//---------------------- Function ----------------------

function clearInput() {
    if (nodePin_map_input != null) {
        nodePin_map_input.remove()
    }
    $('#nid_input').val('')
    $('#rid_input').val('')
    $('#lat_input').val('')
    $('#lng_input').val('')
    $('#place_input').val('')
}

function getRecord() {
    var recData = '<table class="table table-bordered table-striped">' +
        '<tr>' +
        '<th>หมายเลขตู้ควบคุม</th>' +
        '<th>เส้นทางเชื่อมต่อ</th>' +
        '<th>ละติจูด</th>' +
        '<th>ลองจิจูด</th>' +
        '<th>สถานที่</th>' +
        '<th> </th>' +
        '</tr>'

    $.ajax({
        url: "/getnode/all",
        type: "get",
        dataType: 'json',
        contentType: "application/json",
        success: function (res) {
            if (Object.keys(res).length == 0) {
                alert("no data!!")
            } else {
                for (i = 0; i < Object.keys(res).length; i++) {
                    recData = recData + '<tr>' +
                        '<td>' + res[i].nid + '</td>' +
                        '<td>' + res[i].rid + '</td>' +
                        '<td>' + res[i].lat + '</td>' +
                        '<td>' + res[i].lng + '</td>' +
                        '<td>' + res[i].p_name + '</td>' +
                        '<td style="border: none">' +
                        '<button onclick=' + '"fetchRecord(' + res[i].nid + ')" class="btn btn-warning" data-toggle="modal" data-target="#updModal"><span><img src="/html/img/edit.png" alt="">  </span>Edit</button>' +
                        '<span>  </span>' +
                        '<button onclick=' + '"deleteRecord(' + res[i].nid + ')" class="btn btn-danger"><span><img src="/html/img/delete.png" alt="">  </span>Delete</button>' +
                        '</td>'
                }
                $('#record_content').html(recData)
            }
        }
    })
}

function addRecord() {
    var nid = $('#nid_input').val()
    var rid = $('#rid_input').val()
    var lat = $('#lat_input').val()
    var lng = $('#lng_input').val()
    var p_name = $('#place_input').val()
    $.ajax({
        url: "/postnode/add",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            nid: nid,
            rid: rid,
            lat: lat,
            lng: lng,
            p_name: p_name
        }),
        success: function (d) {
            console.log(d)
            getRecord()
        },
        error: function (e) {
            alert("Add error!!")

        }
    })
}

function deleteRecord(nid) {
    var nnid = String("00000" + nid).slice(-4);
    console.log(nnid);
    var conf = confirm("Are you sure?")
    if (conf == true) {
        $.ajax({
            url: "/delnode/" + nnid,
            type: "get",
            dataType: 'json',
            contentType: "application/json",
            success: function (d) {
                console.log(d)
                getRecord()
            },
            error: function (e) {
                console.log(e);
            }
        })
    }
    getRecord()
}

function fetchRecord(nid) {
    var nnid = String("00000" + nid).slice(-4);
    $.ajax({
        url: "/getnode/" + nnid,
        type: "get",
        dataType: 'json',
        contentType: "application/json",
        success: function (res) {
            document.getElementById('nid_upd').innerHTML = res[0].nid
            $('#rid_upd').val(res[0].rid)
            $('#lat_upd').val(res[0].lat)
            $('#lng_upd').val(res[0].lng)
            $('#place_upd').val(res[0].p_name)

            if (nodePin_map_upd != null) {
                nodePin_map_upd.remove()
            }
            var nodeIcon = L.icon({ iconUrl: '/html/img/pin.png', iconAnchor: [16, 32], popupAnchor: [0, -32] })
            map_upd.setView([res[0].lat, res[0].lng], 16).invalidateSize()
            nodePin_map_upd = L.marker([res[0].lat, res[0].lng], { icon: nodeIcon }).addTo(map_upd)
        }
    })
}

function editRecord(nid) {
    var nid = document.getElementById('nid_upd').innerHTML
    var rid = $('#rid_upd').val()
    var lat = $('#lat_upd').val()
    var lng = $('#lng_upd').val()
    var p_name = $('#place_upd').val()

    $.ajax(getRecord(), {
        url: "/postnode/update",
        type: "post",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify({
            nid: nid,
            rid: rid,
            lat: lat,
            lng: lng,
            p_name: p_name
        }),
        success: function (res) {
            console.log("update ok");
        },
        error: function (err) {
            console.log(err);
        }
    })
}

getRecord()