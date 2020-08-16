/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    macAddress: "90:F8:91:AC:72:E9",
    macName: 'HC-05',
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        
    },


    resetPosition: function () {
        app.doRun(-1);

    },
    display: function (message) {
        alert(message);
    },
    openPort: function () {
        app.display("Subscribed to open port: " + app.params.macName + " " + app.params.macAddress);
        bluetoothSerial.subscribe('\n', function (data) {

            if (!isNaN(parseInt(data))) {
                $$("#stepDisplay").html(data);
            }
        });

    },

    /*
        unsubscribes from any Bluetooth serial listener and changes the button:
    */
    closePort: function () {

        app.methods.display("Disconnected from: " + app.params.macName + " " + app.params.macAddress);
        bluetoothSerial.unsubscribe(
            function (data) {
                app.methods.display(data);
            },
            app.methods.showError
        );
    },

    showError: function (error) {
        app.display("4X4 Project " + error);
    },
    bluetoothEnable: function () {
        bluetoothSerial.enable(
            function () {
                app.display("Bluetooth is enabled");
                app.isEnabled();
            },
            function () {
                app.display("The user did *not* enable Bluetooth");
            }
        );
    },
    listPorts: function (event) {
        bluetoothSerial.list(
            function (results) {
                app.manageConnection();
            },
            function (error) {
                alert("results error " + error);
                // btItems._data.items = error;
            }
        )
    },
    isEnabled: function (event) {
        app.display("isEnabled running......");
        bluetoothSerial.isEnabled(app.listPorts, app.notEnabled);
    },
    notEnabled: function () {
        app.display("Bluetooth is not enabled running......");
        app.bluetoothEnable();

    },
    manageConnection: function () {
        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function () {
            // if not connected, do this:
            // clear the screen and display an attempt to connect

            app.display("Attempting to connect. " + app.macName + " " + app.macAddress);
            // attempt to connect:
            bluetoothSerial.connect(
                app.macAddress,  // device to connect to
                app.openPort,   // start listening if you succeed
                app.showError   // show the error if you fail
            );
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function () {

            app.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort,     // stop listening to the port
                app.showError      // show the error if you fail
            );
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },

    
   
    
   
    // Device Ready Event
    doRun: function (inType) {
        bluetoothSerial.isEnabled(
            function () {
                bluetoothSerial.isConnected(
                    function () {
                         

                        bluetoothSerial.write(inType + "#\n");
                    },
                    function () {
                        app.display("Device not connected yet please wait");
                        app.isEnabled();
                    }
                );
            },
            function () {
                app.isEnabled();

            });
    },
    

   
    onBatteryStatus: function (status) {
        alert(status.level);
        
    },
    onBackKeyDown: function () {
        alert("EXIT");
        navigator.app.exitApp();
    }

};
