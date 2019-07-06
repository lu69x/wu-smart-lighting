var map = L.map('map', { zoomControl: false }).setView([8.64159, 99.89747], 15);
/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=”https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { minZoom: 1, maxZoom: 21, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);
var node = []
var nodeControl = []
var n = []
var r = []

function createMap() {
    try {
        n = []
        r = []
        preparePinFn()
    } catch (error) {

    }
}

async function preparePinFn() {
    try {
        $.ajax({
            url: "/getnode/all",
            type: "get",
            dataType: 'json',
            contentType: "application/json",
            success: function (res1) {
                n = res1
            }
        })
        $.ajax({
            url: "/getrouting/all",
            type: "get",
            dataType: 'json',
            contentType: "application/json",
            success: function (res2) {
                r = res2
                pinFn()
            }
        })
    } catch (error) {
        console.log(error)
    }
}

async function pinFn() {
    var n_lenght = Object.keys(n).length
    var r_lenght = Object.keys(r).length
    try {
        for (i = 0; i < n_lenght; i++) {
            let flag = true
            let j = 0
            while (j < r_lenght) {
                if (n[i].rid == r[j].rid) {
                    if (r[j].sw == 'F') {
                        var nodeIcon = L.icon({ iconUrl: '/html/img/marker-off.png', iconAnchor: [16, 32], popupAnchor: [0, -32] });
                        node[n[i].nid] = L.marker([n[i].lat, n[i].lng], { icon: nodeIcon }).addTo(map).bindPopup("Node: " + n[i].nid);
                        //node[i].remove();
                    } else if (r[j].sw == 'T') {
                        var nodeIcon = L.icon({ iconUrl: '/html/img/marker-on.png', iconAnchor: [16, 32], popupAnchor: [0, -32] });
                        node[n[i].nid] = L.marker([n[i].lat, n[i].lng], { icon: nodeIcon }).addTo(map).bindPopup("Node: " + n[i].nid);
                        //node[i].remove();
                    }
                    flag = false
                    break
                }
                j++
            }
            if (flag) {
                var nodeIcon = L.icon({ iconUrl: '/html/img/marker-problem.png', iconAnchor: [16, 32], popupAnchor: [0, -32] });
                node[n[i].nid] = L.marker([n[i].lat, n[i].lng], { icon: nodeIcon }).addTo(map).bindPopup("Node: " + n[i].nid + " | No route");
                //node[i].remove();
            }
        }
    } catch (error) {
        console.log(error)
    }
}

createMap()
window.setInterval(createMap, 10000)