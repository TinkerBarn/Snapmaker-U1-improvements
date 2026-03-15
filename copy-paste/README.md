# Copy & Paste installer (Snapmaker U1)

⚠️ **NOT included in stock Snapmaker U1 firmware**

This installer requires the **Paxx12 Snapmaker U1 Extended Firmware**.

---

## Copy & Paste installer for Chamber Light + Top Cover Light + Remote Screen + Firmware Config 

Choose the file with the buttons you'll add. See Variante A, B or C in the main Readme

Adds up to **four buttons** to the Fluidd *Cameras* card:

- **Chamber light** (bulb icon → LED ON/OFF)
- **Top Cover light** (bulb icon → LED ON/OFF)
- **Remote Screen** (screen icon → `/screen/`)
- **Firmware Config** (gear icon → `/firmware-config/`)

### Requirements

- **Paxx12 Snapmaker U1 Extended Firmware v1.1.0 or newer**
- SSH access as `root`

❌ This variant will **NOT work** on older firmware versions.

- **Top cover light needs changes in printer.cfg and additional gcode macros**
- See description in Fluidd Readme

### Installer file

```
chamber-light_remote-display_firmware-config
```

---

## What the installer does

The Copy & Paste script:

- Creates a persistent folder under  
  `/home/lava/printer_data/misc/u1-ui-tweaks`
- Installs:
  - `custom.css`
  - `custom.js`
  - `install.sh`
- Installs a boot-time script:
  - `/etc/init.d/S99u1-ui-tweaks`
- Automatically patches Fluidd after **every reboot**

All files created by this installer are documented under:

```
filesystem/
```

---

## Prerequisites

- Paxx12 Snapmaker U1 Extended Firmware  
  https://github.com/paxx12/SnapmakerU1-Extended-Firmware
- SSH access as `root`

---

## Enable persistence for `/etc` (required)

Run **once** before installing:

```sh
touch /oem/.debug
```

Documentation:  
https://github.com/paxx12/SnapmakerU1-Extended-Firmware/blob/v1.0.0-paxx12-10/docs/data_persistence.md

---

## Installation steps

1. SSH into the Snapmaker U1 as `root`
2. Open **one** of the installer files listed above
3. Copy **the complete content**
4. Paste it into the SSH session and press **Enter**
5. Reload Fluidd: **Ctrl + F5**
6. Power off / on the printer

✅ After reboot, the changes should still be active.

---

## ⚠️ Firmware upgrade warning

When `/oem/.debug` exists, changes to `/etc` are persistent.

### BEFORE upgrading or flashing firmware:

```sh
rm /oem/.debug
```

After a successful upgrade, you may enable persistence again:

```sh
touch /oem/.debug
```

Documentation:  
https://github.com/paxx12/SnapmakerU1-Extended-Firmware/blob/v1.0.0-paxx12-10/docs/data_persistence.md
