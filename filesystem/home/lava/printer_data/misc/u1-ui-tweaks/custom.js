(function () {
  var LED_NAME = "cavity_led";
  var LED_LABEL = "Chamber light";
  var REMOTE_LABEL = "Remote Display";
  var dragonBreathUrl = null;
  var dragonBreathRequested = false;

  function dragonBreathHost(text) {
    var lines = text.split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var match = lines[i].match(/^\s*host\s*:\s*([^#;]*)/i);
      if (!match) continue;
      var host = match[1].trim();
      if (!host || /\s|\\/.test(host)) return null;
      try {
        var url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(host) && host.indexOf("://") !== -1 ? host : "http://" + host);
        if (!/^https?:$/.test(url.protocol) || !url.hostname || url.username || url.password) return null;
        return "http://" + url.host;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  function refreshDragonBreath() {
    if (dragonBreathRequested) return;
    dragonBreathRequested = true;
    fetch("/custom-dragonbreath-host.txt", {
      credentials: "same-origin",
      cache: "no-store"
    }).then(function (response) {
      if (!response.ok) throw new Error("DragonBreath config unavailable");
      return response.text();
    }).then(function (text) {
      dragonBreathUrl = dragonBreathHost(text);
    }).catch(function () {
      dragonBreathUrl = null;
    }).finally(function () {
      inject();
    });
  }

  function updateDragonBreathRow(content) {
    var row = content.querySelector(".u1-dragonbreath-row");
    if (!dragonBreathUrl) {
      if (row) row.remove();
      return;
    }
    if (row) return;
    var remote = content.querySelector(".u1-remote-btn");
    if (!remote) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "u1-remote-btn";
    button.title = "Open DragonBreath";
    button.setAttribute("aria-label", "Open DragonBreath");
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2C10 5 4 6 7 9M12 2C15 5 9 6 12 9M17 2C20 5 14 6 17 9"/><rect x="4" y="12" width="16" height="8" rx="1"/><path d="M8 14V18M12 14V18M16 14V18M6 20V22M18 20V22"/></g></svg>';
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (dragonBreathUrl) window.open(dragonBreathUrl, "_blank", "noopener,noreferrer");
    });
    row = buildRow("DragonBreath", button);
    row.classList.add("u1-dragonbreath-row");
    remote.closest(".u1-led-row").insertAdjacentElement("afterend", row);
  }

  function sendGcode(script) {
    return fetch("/printer/gcode/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ script: script })
    }).then(function (response) {
      if (!response.ok) throw new Error("G-code request failed");
      return response;
    });
  }

  function fetchPrinterObjects(objects) {
    return fetch("/printer/objects/query?" + objects.map(function (o) {
      return o;
    }).join("&"), {
      method: "GET",
      credentials: "same-origin"
    }).then(function (r) {
      if (!r.ok) throw new Error("Status request failed");
      return r.json();
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
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "u1-led-btn";
    btn.innerHTML = lampSvg();
    btn.title = LED_LABEL;
    btn.setAttribute("aria-label", LED_LABEL);
    var busy = false;

    function readState() {
      return fetchPrinterObjects([encodeURIComponent("led " + LED_NAME)]).then(function (data) {
        var color = data.result.status["led " + LED_NAME].color_data[0];
        var isOn = Number(color[3]) > 0;
        btn.classList.toggle("is-on", isOn);
        btn.classList.toggle("is-off", !isOn);
        btn.setAttribute("aria-pressed", String(isOn));
        btn.title = LED_LABEL + (isOn ? ": On" : ": Off");
        return isOn;
      });
    }

    function unavailable(error) {
      btn.classList.remove("is-on", "is-off");
      btn.removeAttribute("aria-pressed");
      btn.title = LED_LABEL + ": Status unavailable";
      console.warn("[u1-ui-tweaks] LED request failed", error);
    }

    btn.refreshState = function () {
      if (!busy) return readState().catch(unavailable);
    };

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (busy) return;
      busy = true;
      btn.disabled = true;
      readState().then(function (isOn) {
        return sendGcode("SET_LED LED=" + LED_NAME + " WHITE=" + (isOn ? 0 : 1) + " SYNC=0");
      }).then(readState).catch(unavailable).finally(function () {
        busy = false;
        btn.disabled = false;
      });
    });

    btn.refreshState();
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
    refreshDragonBreath();
    var card = findCamerasCard();
    if (!card) return;

    var content = card.querySelector("#card-content");
    if (!content) return;

    if (content.querySelector(".u1-led-row")) {
      var existingLedBtn = content.querySelector(".u1-led-btn");
      if (existingLedBtn && typeof existingLedBtn.refreshState === "function") {
        existingLedBtn.refreshState();
      }
      updateDragonBreathRow(content);
      return;
    }

    var grid = content.querySelector(".row.ma-2.justify-space-around");

    var ledRow = buildRow(LED_LABEL, buildLedButton());
    var remoteRow = buildRow(REMOTE_LABEL, buildRemoteButton());

    if (grid) {
      // Reverse order because each "afterend" inserts directly after 'grid'
      grid.insertAdjacentElement("afterend", remoteRow);
      grid.insertAdjacentElement("afterend", ledRow);
    } else {
      content.appendChild(ledRow);
      content.appendChild(remoteRow);
    }
    updateDragonBreathRow(content);
  }

  window.addEventListener("load", function () {
    inject();
    setInterval(inject, 3000);
  });
})();
