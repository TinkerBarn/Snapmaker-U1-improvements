# Release notes

## 2026-10-02 - DragonBreath and unified Top Cover LED control

### DragonBreath

- All three Copy & Paste installers include an optional DragonBreath link below Remote Display.
- A heater icon with curved heat lines opens the configured device's HTTP web interface in a new tab.
- DragonBreath must be enabled in Paxx12 Firmware Config at `http://<printer-address>/firmware-config/`, with an IP address or DNS name under `host:` in `extended/klipper/dragonbreath.cfg`.
- If the configuration file is missing or its host is empty or invalid, the DragonBreath row stays hidden.
- The host is captured during installation and printer startup. There is no periodic configuration-file check in the browser.
- After changing the host, restart the printer or run the selected installer again.

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
- The unified Top Cover LED control and DragonBreath UI were tested by the maintainer on a printer. The updated startup snapshot behavior is covered by local automated tests; repeat the installation/startup test on the target printer.

## 2026-06-13 - Beginner installation guide

- Copy & Paste installers enable persistence by creating `/oem/.debug`.
- The Top Cover installer creates Extended configuration files and updates `printer.cfg`.
- Purifier handling supports both `enable_pin: PE15` and `power_enable_pin: PE15`.
- Beginner instructions explain the installation steps, hardware requirements and firmware-update preparation.
- Installation output explains the reboot command.
- Risk notices were added to the main README and Copy & Paste instructions.
