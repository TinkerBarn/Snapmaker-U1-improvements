# Snapmaker U1 improvements (Fluidd) – persistent UI tweaks

> **Reboot-safe UI modification for Snapmaker U1 (Fluidd)**  
> Adds a **Chamber light toggle** and **Remote Display access** below the Cameras card  
> and hides unused toolheads (T4–T31).

---

## 🚀 Quick Install (Copy & Paste)

⚠️ **NOT included in stock Snapmaker U1 firmware**

This modification **requires the Paxx12 Snapmaker U1 Extended Firmware**,  
because SSH access, persistence and the Remote Screen feature are not available in stock firmware.

### Prerequisites
- Paxx12 Snapmaker U1 Extended Firmware  
  https://github.com/paxx12/SnapmakerU1-Extended-Firmware
- SSH access as `root`
- Remote Screen enabled  
  https://github.com/paxx12/SnapmakerU1-Extended-Firmware/blob/main/docs/remote_screen.md

### Step 1 – Enable persistence for `/etc` (run once)
```sh
touch /oem/.debug
```

📄 Documentation:  
https://github.com/paxx12/SnapmakerU1-Extended-Firmware/blob/v1.0.0-paxx12-10/docs/data_persistence.md

### Step 2 – Install UI tweak
- Open the file below
- Copy **everything**
- Paste it into your SSH session (root)

```
copy-paste/chamber-light-remote-display.txt
```

### Step 3 – Reload & test
- Reload Fluidd in Web browser (http://<Snapmaker U1 IP address>): **Ctrl + F5**
- Power off / on the Snapmaker U1

✅ After reboot, the changes should still be active.

---

## ⚠️⚠️ IMPORTANT – Firmware Upgrade Warning ⚠️⚠️

> **READ THIS BEFORE UPGRADING OR FLASHING FIRMWARE**

When `/oem/.debug` exists, **changes to `/etc` are persistent**.  
This includes files installed by this repository.

### BEFORE flashing or upgrading firmware:
```sh
rm /oem/.debug
```

Failing to do this **may cause firmware upgrades to fail or behave unexpectedly**.

After a successful firmware upgrade, you can re-enable persistence again:
```sh
touch /oem/.debug
```

📄 Official documentation:  
https://github.com/paxx12/SnapmakerU1-Extended-Firmware/blob/v1.0.0-paxx12-10/docs/data_persistence.md

---

## What this tweak does

- **Toolchanger UI**
  - Shows only **T0–T3**
  - Hides unused toolheads **T4–T31**

- **Cameras card**
  - Adds **Chamber light** ON/OFF button  
    (controls LED: `cavity_led`)
  - Adds **Remote Display** button  
    Opens: `http://<printer-ip>/screen/`

- **Persistent**
  - Survives reboots and power cycles
  - Uses an init.d boot hook

---

## Repository layout

This repository mirrors the **real Snapmaker U1 filesystem paths**.

```
filesystem/
├─ etc/init.d/S99u1-ui-tweaks
├─ oem/.debug
└─ home/lava/printer_data/misc/u1-ui-tweaks/
   ├─ custom.css
   ├─ custom.js
   └─ install.sh

copy-paste/
└─ chamber-light-remote-display.txt
```

### filesystem/
Contains the **source of truth** – exact files and paths written to the printer.

### copy-paste/
Contains a **one-block installer** for easy SSH installation.  
This is only a convenience wrapper around the files in `filesystem/`.

---

## How it works (boot behavior)

On every boot:

1. `/etc/init.d/S99u1-ui-tweaks` runs late in the startup process
2. It waits until Fluidd is available
3. Executes:
   ```
   /home/lava/printer_data/misc/u1-ui-tweaks/install.sh
   ```
4. `install.sh` copies UI files into `/home/lava/fluidd/` and patches `index.html`

This is required because **Fluidd is recreated on every reboot**.

---

## License
MIT
