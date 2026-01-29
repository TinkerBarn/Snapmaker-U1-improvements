/* IMPORTANT: Rename this file to custom.js and copy this file to /home/lava/printer_data/misc/u1-ui-tweaks */

(function () {
  var LED_NAME = "cavity_led";
  var LED_LABEL = "Chamber light";
  var REMOTE_LABEL = "Remote Display";
  var FIRMWARE_LABEL = "Firmware Config";
  var STATE_KEY = "u1_cavity_led_state";

  function sendGcode(script) {
    return fetch("/printer/gcode/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ script: script })
    });
  }

  // Language-neutral Cameras card detection via SVG path
  var CAMERA_ICON_PATH =
    "M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z";

  function findCamerasCard() {
    var headers = document.querySelectorAll(".collapsable-card-title");
    for (var i = 0; i < headers.length; i++) {
      var h = headers[i];
      if (h.querySelector('svg path[d="' + CAMERA_ICON_PATH + '"]')) {
        return h.closest(".collapsable-card");
      }
    }
    return null;
  }

  function lampSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9,21C8.45,21 8,20.55 8,20V19H16V20C16,20.55 15.55,21 15,21H9M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17H8V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2Z"/></svg>';
  }

  function monitorSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M21,16H3V4H21M21,2H3A2,2 0 0,0 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4A2,2 0 0,0 21,2Z"/></svg>';
  }

  function gearSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19.14,12.94C19.19,12.64 19.22,12.32 19.22,12C19.22,11.68 19.19,11.36 19.14,11.06L21.19,9.47C21.37,9.33 21.42,9.07 21.31,8.86L19.31,5.4C19.2,5.19 18.95,5.1 18.74,5.18L16.33,6.17C15.83,5.79 15.28,5.47 14.68,5.32L14.31,2.75C14.28,2.53 14.09,2.37 13.86,2.37H10.14C9.91,2.37 9.72,2.53 9.69,2.75L9.32,5.32C8.72,5.47 8.17,5.79 7.67,6.17L5.26,5.18C5.05,5.1 4.8,5.19 4.69,5.4L2.69,8.86C2.58,9.07 2.63,9.33 2.81,9.47L4.86,11.06C4.81,11.36 4.78,11.68 4.78,12C4.78,12.32 4.81,12.64 4.86,12.94L2.81,14.53C2.63,14.67 2.58,14.93 2.69,15.14L4.69,18.6C4.8,18.81 5.05,18.9 5.26,18.82L7.67,17.83C8.17,18.21 8.72,18.53 9.32,18.68L9.69,21.25C9.72,21.47 9.91,21.63 10.14,21.63H13.86C14.09,21.63 14.28,21.47 14.31,21.25L14.68,18.68C15.28,18.53 15.83,18.21 16.33,17.83L18.74,18.82C18.95,18.9 19.2,18.81 19.31,18.6L21.31,15.14C21.42,14.93 21.37,14.67 21.19,14.53L19.14,12.94M12,15.5A3.5,3.5 0 1,1 15.5,12A3.5,3.5 0 0,1 12,15.5Z"/></svg>';
  }

  function openRemote() {
    var url = window.location.origin.replace(/\/$/, "") + "/screen/";
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openFirmwareConfig() {
    var url = window.location.origin.replace(/\/$/, "") + "/firmware-config/";
    window.location.href = url;
  }

  function buildRow(label, button) {
    var row = document.createElement("div");
    row.className = "row ma-2 align-center u1-led-row";

    var left = document.createElement("div");
    left.className = "text-body-1 col col-5 align-self-center";
    left.textContent = label;

    var right = document.createElement("div");
    right.className = "ml-auto text-right col";

    right.appendChild(button);
    row.appendChild(left);
    row.appendChild(right);
    return row;
  }

  function buildLedButton() {
    var btn = document.createElement("div");
    btn.className = "u1-led-btn";
    btn.innerHTML = lampSvg();

    var isOn = localStorage.getItem(STATE_KEY) === "1";

    function update() {
      btn.classList.toggle("is-on", isOn);
      btn.classList.toggle("is-off", !isOn);
    }

    update();

    btn.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      isOn = !isOn;
      localStorage.setItem(STATE_KEY, isOn ? "1" : "0");
      update();
      sendGcode("SET_LED LED=" + LED_NAME + " WHITE=" + (isOn ? 1 : 0));
    }, true);

    return btn;
  }

  function buildRemoteButton() {
    var btn = document.createElement("div");
    btn.className = "u1-remote-btn";
    btn.innerHTML = monitorSvg();
    btn.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openRemote();
    }, true);
    return btn;
  }

  function buildFirmwareButton() {
    var btn = document.createElement("div");
    btn.className = "u1-firmware-btn";
    btn.innerHTML = gearSvg();
    btn.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openFirmwareConfig();
    }, true);
    return btn;
  }

  function inject() {
    var card = findCamerasCard();
    if (!card) return;

    var content = card.querySelector("#card-content");
    if (!content) return;

    if (content.querySelector(".u1-led-row")) return;

    var grid = content.querySelector(".row.ma-2.justify-space-around");
    var ledRow = buildRow(LED_LABEL, buildLedButton());
    var remoteRow = buildRow(REMOTE_LABEL, buildRemoteButton());
    var firmwareRow = buildRow(FIRMWARE_LABEL, buildFirmwareButton());

    if (grid) {
      // insert in reverse order because each insertAdjacentElement("afterend", ...)
      // inserts directly after 'grid'
      grid.insertAdjacentElement("afterend", firmwareRow);
      grid.insertAdjacentElement("afterend", remoteRow);
      grid.insertAdjacentElement("afterend", ledRow);
    } else {
      content.appendChild(ledRow);
      content.appendChild(remoteRow);
      content.appendChild(firmwareRow);
    }
}

  window.addEventListener("load", function () {
    inject();
    setInterval(inject, 3000);
  });
})();
