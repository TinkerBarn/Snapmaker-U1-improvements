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

### Version A: simple and safe

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

Adds everything from Version B plus:

- Top Cover LED button

Choose this only if you have the required Top Cover LED hardware.

Important:

- A Top Cover should be installed.
- You need an LED strip.
- The LED strip needs a cable connection to the rear upper connector on the printer.

If you do not have this hardware, use Version A or B.

---

## Installation steps

1. Install Paxx12 Extended Firmware.
2. Enable SSH in Paxx12 Firmware Config.
3. Open an SSH connection from your computer to the printer.
4. Open one of the installer files listed above.
5. Copy the complete content of that file.
6. Paste it into the SSH window.
7. Press Enter.
8. Wait until the installer says it is finished.
9. Reload Fluidd in your browser with Ctrl + F5.
10. Reboot the printer.

To reboot from the SSH window, type:

```sh
reboot
```

Then press Enter. If the printer asks for confirmation, confirm the reboot.

After the reboot, open Fluidd again and check that the new buttons are still visible.

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
