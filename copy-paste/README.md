# Copy & Paste installer (Snapmaker U1)

⚠️ **NOT included in stock Snapmaker U1 firmware**

This installer requires the **Paxx12 Snapmaker U1 Extended Firmware**.

---

## What this does

The copy & paste script:

- Creates a persistent folder under  
  `/home/lava/printer_data/misc/u1-ui-tweaks`
- Installs:
  - `custom.css`
  - `custom.js`
  - `install.sh`
- Installs a boot-time script:
  - `/etc/init.d/S99u1-ui-tweaks`
- Patches Fluidd automatically after each reboot

All files created by this installer are documented under:

```
filesystem/
```

---

## Prerequisites

- Paxx12 Snapmaker U1 Extended Firmware  
  https://github.com/paxx12/SnapmakerU1-Extended-Firmware
- SSH access as `root`

### Enable persistence for `/etc` (required)

Run **once** before installing:

```sh
touch /oem/.debug
```

Documentation:
https://github.com/paxx12/SnapmakerU1-Extended-Firmware/blob/v1.0.0-paxx12-10/docs/data_persistence.md

---

## Installation steps

1. SSH into the Snapmaker U1 as `root`
2. Open the file below:
   ```
   chamber-light-remote-display.txt
   ```
3. Copy **the complete content**
4. Paste it into the SSH session and press Enter
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
