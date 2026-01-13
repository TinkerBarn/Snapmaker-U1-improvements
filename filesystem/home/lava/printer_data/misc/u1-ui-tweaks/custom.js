(function () {
  var LED_NAME = "cavity_led";
  var LED_LABEL = "Chamber light";
  var REMOTE_LABEL = "Remote Display";
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

  function openRemote() {
    var url = window.location.origin.replace(/\/$/, "") + "/screen/";
    window.open(url, "_blank", "noopener,noreferrer");
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

  function inject() {
    var card = findCamerasCard();
    if (!card) return;

    var content = card.querySelector("#card-content");
    if (!content) return;

    if (content.querySelector(".u1-led-row")) return;

    var grid = content.querySelector(".row.ma-2.justify-space-around");

    var ledRow = buildRow(LED_LABEL, buildLedButton());
    var remoteRow = buildRow(REMOTE_LABEL, buildRemoteButton());

    if (grid) {
      grid.insertAdjacentElement("afterend", remoteRow);
      grid.insertAdjacentElement("afterend", ledRow);
    } else {
      content.appendChild(ledRow);
      content.appendChild(remoteRow);
    }
  }

  window.addEventListener("load", function () {
    inject();
    setInterval(inject, 3000);
  });
})();
