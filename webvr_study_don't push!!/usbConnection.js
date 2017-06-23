var usb = require('usb')

var inEndpoint;

function onLoad() {
    var vr_device = usb.findByIds(4100, 25460);
    vr_device.open();

    vr_device.interfaces[0].claim();
    var endpoints = vr_device.interfaces[0].endpoints;
    inEndpoint = endpoints[0];

    inEndpoint.transferType = 2;
    inEndpoint.startPoll(3, 64);

    setInterval(receiveData, 100);
}

function receiveData() {
    inEndpoint.transfer(64, function(error, data){
        if (!error) {
            console.log(data);
        } else {
            console.log(error);
        }
    });
}

onLoad();