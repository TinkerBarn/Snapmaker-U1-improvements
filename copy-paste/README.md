# Copy & Paste installer for Snapmaker U1

This folder is for the beginner-friendly installation.

You choose one installer file, copy all of its text, paste it into an SSH window connected to the printer, and press Enter.

---

## Use at your own risk

The installer scripts modify files on your printer.

They are provided as-is for users who want to customize their own Snapmaker U1. Running them is your own decision and your own responsibility.

I cannot take responsibility for failed installations, lost settings, printer downtime, firmware update issues, warranty problems, hardware damage, wiring mistakes, or any other direct or indirect consequences.

Before you paste a script into SSH, make sure you selected the correct version and understand what hardware is required. This is especially important for the Top Cover LED version, because it depends on additional LED hardware and wiring.

---

## Before you start

These installers require **Paxx12 Snapmaker U1 Extended Firmware**.

Install the latest Paxx12 release first:

https://github.com/paxx12-snapmaker-u1/SnapmakerU1-Extended-Firmware/releases/latest

Paxx12 installation guide:

https://snapmakeru1-extended-firmware.pages.dev/install

After installing Paxx12, enable SSH:

https://snapmakeru1-extended-firmware.pages.dev/ssh_access

---

## What is SSH?

SSH lets your computer open a command window on the printer.

You need an SSH-capable tool:

- Windows: use a terminal or an SSH tool.
- macOS: use Terminal or another SSH tool.

You only need SSH to paste the installer once.

---

## Choose one version

All four versions include Filament Manager when Spoolman is configured, and DragonBreath when its host is configured.

### Version A: basic controls

File to copy:

```text
chamber-light_remote-display
```

Adds:

- Chamber Light button
- Remote Screen button
- Cleaner toolchanger view

Choose this if you are unsure.

### Version B: with Firmware Config

File to copy:

```text
chamber-light_remote-display_firmware-config
```

Adds everything from Version A plus:

- Firmware Config button

Choose this if you want a direct button for the Paxx12 Firmware Config page.

### Version C: with Top Cover LED

File to copy:

```text
chamber-light_top-cover-light_remote-display_firmware-config
```

Includes Remote Screen, Firmware Config and the cleaner toolchanger view. The light control is labeled:

- Top Cover LED button

This replaces the Chamber Light button and follows the printer's reported light state.

Choose this only if you have the required Top Cover LED hardware.

Versions C and D configure `printer.cfg` automatically: the existing `[led cavity_led]` uses `white_pin: PE15`, `cycle_time: 0.003333` and `initial_WHITE: 0`. The Purifier's PE15 enable line is commented out. Do not add another LED block or make these changes manually.

Before changing `printer.cfg`, the installer saves a copy in the same folder, for example `printer-20261103_144208.cfg`. Repeat runs leave an already-correct file untouched. If the existing LED block is missing or duplicated, the installer stops without changing `printer.cfg`.

Important:

- A Top Cover should be installed.
- You need an LED strip.
- The LED strip needs a cable connection to the rear upper connector on the printer.

If you do not have this hardware, use Version A or B.

If you have already changed `cavity_led` to PE15 and only want to update the buttons, copy the complete contents of [update-top-cover-ui](update-top-cover-ui) into an SSH session as root. Reload Fluidd afterwards (Windows: Ctrl + F5; Safari on macOS: Option + Cmd + R).

---

## Version D: RFID Reader and custom links

Use [top-cover-led_remote-display_firmware-config_dashboard-links](top-cover-led_remote-display_firmware-config_dashboard-links) for the Top Cover LED controls from Version C plus optional RFID Reader and three custom links.

Install this version before activating link sections in `extended/ext_dash_links.cfg`. Then follow [RFID and custom link setup](dashboard-links.md). A commented or active `[RFID Reader Link]` heading prevents the installer from adding or changing the example blocks.

## Optional Filament Manager button

The Filament Manager entry appears in every version only when `extended/extended2.cfg` contains:

```ini
[spoolman]
host: http://192.168.178.144:7912
```

Use your own Spoolman URL. An empty or commented host does not enable the entry.

The spool icon opens the printer's own `/filament/` page using the same DNS name or IP address as Fluidd.

## Optional DragonBreath button

All four versions include a DragonBreath heater icon below Remote Display, provided DragonBreath is configured.

1. Open `http://<printer-address>/firmware-config/` in your browser.
2. Enable DragonBreath in Paxx12 Firmware Config.
3. Make sure `extended/klipper/dragonbreath.cfg` contains the DragonBreath IP address or DNS name under `host:`.
4. Restart the printer or run your selected Copy & Paste installer again.

For example, the host entry can be:

```ini
host: 192.168.1.50
```

Clicking the heater icon opens `http://192.168.1.50` in a new tab. Without a configured host, the entire DragonBreath row stays hidden. This button opens the heater's controls; it does not switch the heater on or off directly.

---

## Installation steps

1. Install Paxx12 Extended Firmware.
2. Enable SSH in Paxx12 Firmware Config.
3. Open an SSH connection from your computer to the printer as `root`, using the Paxx12 SSH instructions linked above.
4. Open one of the installer files listed above.
5. Copy the complete content of that file.
6. Paste it into the SSH window.
7. Press Enter.
8. Wait until the installer says it is finished.
9. Reload Fluidd in your browser (Windows: Ctrl + F5; Safari on macOS: Option + Cmd + R).
10. Reboot the printer.

To reboot from the SSH window, type:

```sh
reboot
```

Then press Enter. If the printer asks for confirmation, confirm the reboot.

After the reboot, open Fluidd again and check that the new buttons are still visible.

All optional links are checked directly from their configuration files whenever Fluidd loads: DragonBreath from `extended/klipper/dragonbreath.cfg`, Filament Manager from the `[spoolman]` section in `extended/extended2.cfg`, and RFID/custom links in Version D from `extended/ext_dash_links.cfg`. Save your changes and reload Fluidd to update or hide the entries; no reboot, Klipper restart or installer rerun is required. There is no periodic background check.

Before a future firmware update, it is recommended to remove the `.debug` file and reboot the printer:

```sh
rm /oem/.debug
reboot
```

After a successful firmware update, run the Copy & Paste installation once again.

---

## Firmware update warning

Before installing or flashing a new printer firmware version, remove the `.debug` file and reboot the printer:

```sh
rm /oem/.debug
reboot
```

After a successful firmware update, run the Copy & Paste installation once again.

Also read the Paxx12 notes about data persistence:

https://snapmakeru1-extended-firmware.pages.dev/data_persistence

If you are unsure, check the Paxx12 documentation before updating firmware.
