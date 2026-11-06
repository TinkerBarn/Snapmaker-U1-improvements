const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const cp = require("node:child_process");
const root = path.resolve(__dirname, "..");
process.chdir(root);
const base = "filesystem/home/lava/printer_data/misc/u1-ui-tweaks/";
const variants = [
  ["chamber-light_remote-display", "custom.js", false],
  ["chamber-light_remote-display_firmware-config", "custom-devel.js", false],
  ["chamber-light_top-cover-light_remote-display_firmware-config", "custom-top-cover.js", false],
  ["top-cover-led_remote-display_firmware-config_dashboard-links", "custom-dashboard.js", true]
];
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "u1-dashboard-test-"));
const helper = fs.readFileSync(base + "dragonbreath-config.sh", "utf8").trim();
function loadUi(source, origin = "http://u1.local", liveConfig = fixture, spoolConfig = fixture, dragonConfig = null) {
  const code = source.replace('  window.addEventListener("load"', '  globalThis.testApi = { parse: parseDashboardLinks, refresh: refreshDashboardLinks, rows: updateDashboardRows, dragonRefresh: refreshDragonBreath, dragonRows: updateDragonBreathRow };\n  window.addEventListener("load"');
  let requests = 0, opened;
  const rows = new Map();
  const anchor = { insertAdjacentElement(where, row) { assert.equal(where, "afterend"); row.rowMap = rows; rows.set(row.key, row); } };
  function element() {
    return { children: [], listeners: {}, classList: { add(key) { this.owner.key = key; } },
      appendChild(item) { this.children.push(item); }, setAttribute() {},
      addEventListener(name, fn) { this.listeners[name] = fn; },
      remove() { this.rowMap.delete(this.key); },
      insertAdjacentElement: anchor.insertAdjacentElement };
  }
  function create() { const item = element(); item.classList.owner = item; return item; }
  const context = { URL, console, window: { location: { origin }, addEventListener() {}, open(...args) { opened = args; } },
    document: { querySelectorAll: () => [], createElement: create },
    fetch: async (url, options) => {
      assert.equal(options.cache, "no-store");
      if (url === "/server/files/config/extended/klipper/dragonbreath.cfg") {
        return { ok: dragonConfig !== null, text: async () => dragonConfig };
      }
      if (url === "/server/files/config/extended/ext_dash_links.cfg") {
        return { ok: true, text: async () => liveConfig };
      }
      assert.equal(url, "/server/files/config/extended/extended2.cfg");
      requests++;
      return { ok: spoolConfig !== null, text: async () => spoolConfig };
    }
  };
  vm.runInNewContext(code, context);
  const content = { querySelector(selector) {
    if (selector === ".u1-remote-btn") return { closest: () => anchor };
    return rows.get(selector.slice(1)) || null;
  }};
  return { api: context.testApi, content, rows, get requests() { return requests; }, get opened() { return opened; } };
}
const fixture = "[spoolman]\nhost: http://192.168.178.144:7912\n[RFID Reader Link]\nHost: http://reader.local/tags\n[Dashboard Link1]\nName:   My dashboard  \nHost: https://example.com/path?q=1#section\n# [Dashboard Link2]\nName: Hidden\nHost: http://hidden.local\n[Dashboard Link3]\nName: Third\nHost: http://third.local:8080\n";
const settle = async () => { for (let i = 0; i < 5; i++) await new Promise(setImmediate); };
(async () => {
  for (const [installer, reference, custom] of variants) {
    const script = fs.readFileSync("copy-paste/" + installer, "utf8");
    cp.execFileSync("sh", ["-n", "copy-paste/" + installer]);
    const js = fs.readFileSync(base + reference, "utf8").trim();
    assert(script.includes(js), installer + " JS differs from reference");
    assert(script.includes(helper), installer + " helper differs from reference");
    const jsFile = path.join(temp, reference); fs.writeFileSync(jsFile, js);
    cp.execFileSync(process.execPath, ["--check", jsFile]);
    const ui = loadUi(js);
    const links = ui.api.parse(fixture);
    assert.equal(links.length, custom ? 4 : 1);
    assert.equal(links[0].url, "http://u1.local/filament/");
    assert.equal(links[0].icon, "spool");
    if (custom) {
      assert.equal(links[1].name, "RFID Reader"); assert.equal(links[1].icon, "rfid");
      assert.equal(links[2].name, "My dashboard");
      assert.equal(links[2].url, "https://example.com/path?q=1#section");
      assert.equal(links[3].name, "Third");
    }
    assert.equal(ui.api.parse("[spoolman]\nhost: \n").length, 0);
    assert.equal(ui.api.parse("[spoolman]\n# host: http://foo.local\n").length, 0);
    assert.equal(ui.api.parse("# [spoolman]\nhost: http://foo.local\n").length, 0);
    assert.equal(ui.api.parse("[spoolman]\nhost: javascript:alert(1)\n").length, 0);
    assert.equal(ui.api.parse("[RFID Reader Link]\nHost: http://<Link>\n").length, 0);
    assert.equal(loadUi(js, "http://192.168.1.10:8080").api.parse(fixture)[0].url, "http://192.168.1.10:8080/filament/");
    await ui.api.refresh(); await settle();
    ui.api.rows(ui.content);
    assert.equal(ui.rows.size, custom ? 4 : 1);
    ui.api.rows(ui.content); assert.equal(ui.rows.size, custom ? 4 : 1);
    for (const row of ui.rows.values()) {
      row.children[1].children[0].listeners.click({ preventDefault() {}, stopPropagation() {} });
      assert.equal(ui.opened[1], "_blank"); assert.equal(ui.opened[2], "noopener,noreferrer");
    }
    for (let i = 0; i < 10; i++) ui.api.refresh();
    await settle(); assert.equal(ui.requests, 1);
    for (const config of [null, "", "# [spoolman]\nhost: http://spool.local\n", "[spoolman]\n# host: http://spool.local\n"]) {
      const disabled = loadUi(js, "http://u1.local", "", config);
      await disabled.api.refresh(); await settle();
      disabled.api.rows(disabled.content);
      assert.equal(disabled.rows.size, 0, "disabled or missing Spoolman must be hidden");
    }
    for (const [config, target] of [
      ["host: heater.local\n", "http://heater.local"],
      ["host: http://192.168.1.20:8080\n", "http://192.168.1.20:8080"],
      [null, null], ["# host: heater.local\n", null], ["host: \n", null]
    ]) {
      const dragon = loadUi(js, "http://u1.local", "", null, config);
      dragon.api.dragonRefresh(); await settle();
      dragon.api.dragonRows(dragon.content);
      assert.equal(dragon.rows.has("u1-dragonbreath-row"), target !== null);
      if (target) {
        dragon.rows.get("u1-dragonbreath-row").children[1].children[0].listeners.click({ preventDefault() {}, stopPropagation() {} });
        assert.equal(dragon.opened[0], target);
        const removed = loadUi(js);
        removed.api.dragonRefresh(); await settle();
        removed.api.dragonRows(dragon.content);
        assert.equal(dragon.rows.size, 0, "missing DragonBreath removes existing row");
      }
    }
    if (custom) {
      const disabled = fixture.replace("[Dashboard Link1]", "# [Dashboard Link1]");
      const reloaded = loadUi(js, "http://u1.local", disabled);
      await reloaded.api.refresh(); await settle();
      reloaded.api.rows(reloaded.content);
      assert(!reloaded.rows.has("u1-link-custom-1"), "stale startup snapshot must not restore disabled link");
      assert(reloaded.rows.has("u1-link-custom-0"), "RFID remains visible");
      const enabled = loadUi(js);
      await enabled.api.refresh(); await settle();
      enabled.api.rows(enabled.content);
      assert(enabled.rows.has("u1-link-custom-1"), "page reload restores enabled link without reboot");
      const renamed = loadUi(js, "http://u1.local", fixture.replace("My dashboard", "New name").replace("https://example.com/path?q=1#section", "http://new.local/"));
      await renamed.api.refresh(); await settle();
      renamed.api.rows(ui.content);
      const row = ui.rows.get("u1-link-custom-1");
      row.children[1].children[0].listeners.click({ preventDefault() {}, stopPropagation() {} });
      assert.equal(renamed.opened[0], "http://new.local/");
      const missing = loadUi(js, "http://u1.local", "");
      await missing.api.refresh(); await settle();
      missing.api.rows(ui.content);
      assert.equal(ui.rows.size, 1, "only Filament Manager remains without live custom config");
    }
  }
  const config = path.join(temp, "config"), ext = path.join(config, "extended"), fluidd = path.join(temp, "fluidd");
  fs.mkdirSync(path.join(ext, "klipper"), { recursive: true }); fs.mkdirSync(fluidd);
  const source = "[gcode_macro TEST]\ngcode: G28\n";
  fs.writeFileSync(path.join(ext, "ext_printer.cfg"), source);
  fs.writeFileSync(path.join(ext, "ext_dash_links.cfg"), fixture);
  fs.writeFileSync(path.join(ext, "extended2.cfg"), "[other]\nhost: http://wrong.local\n[spoolman]\nhost: http://spool.local:7912\npassword: private\n");
  fs.writeFileSync(path.join(ext, "klipper/dragonbreath.cfg"), "host: heater.local\n");
  cp.execFileSync("sh", [base + "dragonbreath-config.sh", config, fluidd]);
  const snapshot = fs.readFileSync(path.join(fluidd, "custom-dashboard-links.cfg"), "utf8");
  assert(snapshot.includes("[spoolman]\nhost: http://spool.local:7912"));
  assert(!snapshot.includes("wrong.local")); assert(!snapshot.includes("private")); assert(!snapshot.includes("hidden.local"));
  assert.equal(fs.readFileSync(path.join(ext, "ext_printer.cfg"), "utf8"), source);
  assert(fs.readFileSync(path.join(ext, "ext_dash_links.cfg"), "utf8").includes("[RFID Reader Link]"));
  const filtered = fs.readFileSync(path.join(ext, "ext_printer.cfg"), "utf8");
  assert(filtered.includes("[gcode_macro TEST]")); assert(!filtered.includes("[RFID Reader Link]"));
  assert(!filtered.includes("[Dashboard Link")); assert(!filtered.includes("Host:"));
  const installer = fs.readFileSync("copy-paste/" + variants[3][0], "utf8");
  const cacheStart = installer.indexOf('JS_VERSION=$(cksum');
  const cacheEnd = installer.indexOf("\nEOF", cacheStart);
  assert(cacheStart > 0 && cacheEnd > cacheStart);
  const cacheScript = installer.slice(cacheStart, cacheEnd).replace("sed -i ", "sed ");
  const indexFile = path.join(temp, "index.html");
  const jsFile = path.join(temp, "custom.js");
  fs.writeFileSync(jsFile, "var CUSTOM_LINKS = true;");
  for (const tag of ['<script src="./custom.js"></script>', '<script src="./custom.js?v=old"></script>']) {
    fs.writeFileSync(indexFile, tag);
    const updated = cp.execFileSync("sh", ["-c", 'CUSTOM_JS_DST="$1"; INDEX_HTML="$2";\n' + cacheScript, "--", jsFile, indexFile], { encoding: "utf8" });
    assert.match(updated, /src="\.\/custom\.js\?v=\d+"/);
    assert.equal((updated.match(/<script/g) || []).length, 1);
  }
  const includeStart = installer.indexOf("  # Prepare and validate all printer.cfg changes");
  const includeEnd = installer.indexOf('\n  echo "✅ Fluidd/Klipper config updated:', includeStart);
  assert(includeStart > 0 && includeEnd > includeStart);
  const includeScript = 'PRINTER_CFG="$1"\nCONFIG_DIR=$(dirname "$1")\n' + installer.slice(includeStart, includeEnd);
  const versionC = fs.readFileSync("copy-paste/" + variants[2][0], "utf8");
  assert(versionC.includes(installer.slice(includeStart, includeEnd)), "C and D share the same printer patch");
  const printerFile = path.join(config, "printer.cfg");
  for (const prefix of [
    "[include fluidd.cfg]\n[printer]\nkinematics: corexy\n",
    "[include extended/ext_rfidmacros.cfg]\n[printer]\nkinematics: corexy\n",
    "  [include   extended/ext_printer.cfg] # macros\n[include extended/ext_rfidmacros.cfg]\n",
    "# [include extended/ext_printer.cfg]\n[printer]\n"
  ]) {
    const original = prefix + "\n[led cavity_led]\nwhite_pin: PA1\ncycle_time: 0.1\ninitial_WHITE: 1\n[purifier]\npower_enable_pin: PE15\npower_det_pin: PA7\n";
    const backupsBefore = fs.readdirSync(config).filter(name => /^printer-\d{8}_\d{6}\.cfg$/.test(name));
    fs.writeFileSync(printerFile, original);
    cp.execFileSync("sh", ["-c", includeScript, "--", printerFile]);
    const installed = fs.readFileSync(printerFile, "utf8");
    assert.equal((installed.match(/^\s*\[include\s+extended\/ext_printer\.cfg\]/gm) || []).length, 1);
    assert.equal((installed.match(/^\s*\[include\s+extended\/ext_rfidmacros\.cfg\]/gm) || []).length, 1);
    assert(installed.includes("white_pin: PE15\ncycle_time: 0.003333\ninitial_WHITE: 0"));
    assert(installed.includes("# power_enable_pin: PE15"));
    assert(installed.includes("power_det_pin: PA7"));
    const backupsAfter = fs.readdirSync(config).filter(name => /^printer-\d{8}_\d{6}\.cfg$/.test(name));
    const added = backupsAfter.filter(name => !backupsBefore.includes(name));
    assert.equal(added.length, 1);
    assert.equal(fs.readFileSync(path.join(config, added[0]), "utf8"), original);
    assert(!installed.includes("[include extended/ext_dash_links.cfg]"));
    cp.execFileSync("sh", ["-c", includeScript, "--", printerFile]);
    assert.equal(fs.readFileSync(printerFile, "utf8"), installed);
    assert.equal(fs.readdirSync(config).filter(name => /^printer-\d{8}_\d{6}\.cfg$/.test(name)).length, backupsAfter.length);
  }
  const minimal = "[led cavity_led]\n[purifier]\n# power_enable_pin: PE15\nexhaust_pin: !PA8\n";
  fs.writeFileSync(printerFile, minimal);
  cp.execFileSync("sh", ["-c", includeScript, "--", printerFile]);
  const completed = fs.readFileSync(printerFile, "utf8");
  assert(completed.includes("[led cavity_led]\nwhite_pin: PE15\ncycle_time: 0.003333\ninitial_WHITE: 0\n\n[purifier]"));
  assert(completed.includes("# power_enable_pin: PE15\nexhaust_pin: !PA8"));
  assert.equal((completed.match(/\[led cavity_led\]/g) || []).length, 1);
  for (const options of [
    "white_pin: PE15\ncycle_time: 0.003333\n\n",
    "white_pin: PE15\ncycle_time: 0.003333\n\ninitial_WHITE: 0\n"
  ]) {
    fs.writeFileSync(printerFile, "[led cavity_led]\n" + options + "[fan_generic exhaust_fan]\npin: !PA8\n");
    cp.execFileSync("sh", ["-c", includeScript, "--", printerFile]);
    const formatted = fs.readFileSync(printerFile, "utf8");
    assert(formatted.includes("[led cavity_led]\nwhite_pin: PE15\ncycle_time: 0.003333\ninitial_WHITE: 0\n\n[fan_generic exhaust_fan]\npin: !PA8\n"));
    cp.execFileSync("sh", ["-c", includeScript, "--", printerFile]);
    assert.equal(fs.readFileSync(printerFile, "utf8"), formatted);
  }
  for (const original of ["[printer]\n", "[led cavity_led]\n[led cavity_led]\n"]) {
    fs.writeFileSync(printerFile, original);
    assert.throws(() => cp.execFileSync("sh", ["-c", includeScript, "--", printerFile]));
    assert.equal(fs.readFileSync(printerFile, "utf8"), original, "invalid LED block leaves original untouched");
  }
  const start = installer.indexOf('  if [ ! -f "$EXTENDED_DIR/ext_dash_links.cfg" ]');
  const end = installer.indexOf("  cat << 'EOF' > \"$EXTENDED_DIR/ext_rfidmacros.cfg\"", start);
  assert(start > 0 && end > start);
  const append = 'EXTENDED_DIR="$1"\n' + installer.slice(start, end);
  for (const heading of ["# [RFID Reader Link]", "[RFID Reader Link]", "  ## [RFID Reader Link]"]) {
    const value = "[gcode_macro TEST]\ngcode: G28\n" + heading + "\n# Host: http://saved.local\n";
    fs.writeFileSync(path.join(ext, "ext_dash_links.cfg"), value);
    cp.execFileSync("sh", ["-c", append, "--", ext]);
    assert.equal(fs.readFileSync(path.join(ext, "ext_dash_links.cfg"), "utf8"), value);
  }
  fs.unlinkSync(path.join(ext, "ext_dash_links.cfg"));
  cp.execFileSync("sh", ["-c", append, "--", ext]);
  const once = fs.readFileSync(path.join(ext, "ext_dash_links.cfg"), "utf8");
  assert(once.includes("# [RFID Reader Link]")); assert(once.includes("# [Dashboard Link3]"));
  cp.execFileSync("sh", ["-c", append, "--", ext]);
  assert.equal(fs.readFileSync(path.join(ext, "ext_dash_links.cfg"), "utf8"), once);
  fs.unlinkSync(path.join(ext, "extended2.cfg"));
  cp.execFileSync("sh", [base + "dragonbreath-config.sh", config, fluidd]);
  assert(!fs.readFileSync(path.join(fluidd, "custom-dashboard-links.cfg"), "utf8").includes("[spoolman]"));
  console.log("PASS: four installers, optional links, startup snapshots, fresh installation and repeat-run preservation");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => fs.rmSync(temp, { recursive: true, force: true }));
