# Release notes

## 2026-11-06 - Dynamic dashboard links and automatic Top Cover setup

### Highlights

- Personal dashboard shortcuts: Version D adds an external RFID Reader link and up to three named custom links. See the [short setup guide](copy-paste/dashboard-links.md).
- Dynamic visibility for DragonBreath, Filament Manager, RFID Reader and custom links: save the relevant configuration file and reload Fluidd. No reboot or Klipper restart is needed for the link changes.
- Versions C and D automatically configure the existing LED block with `white_pin: PE15`, `cycle_time: 0.003333` and `initial_WHITE: 0`, comment out the Purifier PE15 enable assignment and add missing macro includes. No second LED block is added.
- Before every actual `printer.cfg` change, the original is saved in the same folder as `printer-YYYYMMDD_HHMMSS.cfg`, for example `printer-20261103_144208.cfg`. Failed backups prevent modification. Repeat runs leave an unchanged configuration untouched.

### Details

- All four installers show Filament Manager when an active `[spoolman]` section in `extended/extended2.cfg` has a valid HTTP or HTTPS host.
- The Filament Manager spool icon opens `/filament/` on the current printer's origin.
- New Version D extends Version C with an RFID/NFC shortcut for an external reader and up to three named web links.
- Version D reads active RFID Reader Link and Dashboard Link1-3 sections from `extended/ext_dash_links.cfg`.
- Commented examples are appended only when no commented or active RFID Reader Link heading exists. Existing source files and configured URLs are preserved on repeat installation.
- Version D creates separate files for link metadata (`ext_dash_links.cfg`) and macros (`ext_printer.cfg`). First installation and repeat runs add missing entries without duplicating existing includes or replacing configured links.
- All optional links are checked from their current configuration files on each Fluidd page load, without periodic polling. DragonBreath reads `extended/klipper/dragonbreath.cfg`, Filament Manager reads `[spoolman]` in `extended/extended2.cfg`, and RFID/custom links read `extended/ext_dash_links.cfg`. Save the file and reload Fluidd to enable, disable or update entries; no reboot or Klipper restart is required. Stale startup snapshots are no longer used.

## 2026-10-02 - DragonBreath and unified Top Cover LED control

### DragonBreath

- All three Copy & Paste installers include an optional DragonBreath link below Remote Display.
- A heater icon with curved heat lines opens the configured device's HTTP web interface in a new tab.
- DragonBreath must be enabled in Paxx12 Firmware Config at `http://<printer-address>/firmware-config/`, with an IP address or DNS name under `host:` in `extended/klipper/dragonbreath.cfg`.
- If the configuration file is missing or its host is empty or invalid, the DragonBreath row stays hidden.
- The host is read directly through Moonraker on each page load. There is no periodic configuration-file check in the browser.
- After changing the host, save the file and reload Fluidd.

### Top Cover LED

- Version C replaces the two light rows with one Top Cover LED control.
- The installer routes `cavity_led` from PA10 to PE15 and installs LED-based Top Cover macros. It no longer defines a second PE15 output pin.
- The printer display and `SET_LED LED=cavity_led WHITE=0/1` control the Top Cover LED; the original chamber light is no longer controlled through this LED object.
- Lamp icons query the printer state every three seconds and before toggling. Display or console changes are reflected without relying on browser-local click history.
- Version A and B retain the Chamber Light control and use the same status queries.

### Installation and update

- Existing Version C users who already mapped `cavity_led` to PE15 can use `copy-paste/update-top-cover-ui` to update the UI without changing printer configuration.
- The UI updater backs up the previous JavaScript and adds the DragonBreath startup hook.
- Safari reload instructions now use Option + Cmd + R.
- README files describe the three variants, DragonBreath requirements and the new Version C behavior.

### Validation

- Automated checks cover LED status changes, toggling, failed requests, DragonBreath host snapshots, conditional visibility and link targets.
- The unified Top Cover LED control and DragonBreath UI were tested by the maintainer on a printer. Live configuration reads and conditional visibility are covered by local automated tests; the updated page-load behavior still needs testing on the target printer.

## 2026-06-13 - Beginner installation guide

- Copy & Paste installers enable persistence by creating `/oem/.debug`.
- The Top Cover installer creates Extended configuration files and updates `printer.cfg`.
- Versions C and D automatically update the existing `[led cavity_led]` block to `white_pin: PE15`, `cycle_time: 0.003333` and `initial_WHITE: 0`, adding missing options without adding a second LED block. Purifier handling comments out active `enable_pin: PE15` and `power_enable_pin: PE15` only in `[purifier]`.
- Before every actual change to `printer.cfg`, the installer saves its original contents beside it as `printer-YYYYMMDD_HHMMSS.cfg`. Backup failure prevents modification. Unchanged configurations are not rewritten or backed up again. A missing or duplicate `[led cavity_led]` block stops the patch without changing `printer.cfg`.
- Beginner instructions explain the installation steps, hardware requirements and firmware-update preparation.
- Installation output explains the reboot command.
- Risk notices were added to the main README and Copy & Paste instructions.
