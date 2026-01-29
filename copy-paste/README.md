# Copy & Paste installer (Snapmaker U1)

⚠️ **NOT included in stock Snapmaker U1 firmware**

This installer requires the **Paxx12 Snapmaker U1 Extended Firmware**.

---

## Available installer variants

There are **two different Copy & Paste installers** available.  
Choose the one that matches your firmware and requirements.

---

## Variant A – Chamber Light + Remote Screen (stable)

✅ **Recommended for most users**

Adds two buttons to the Fluidd *Cameras* card:

- **Chamber light** (toggle)
- **Remote Screen** (opens `/screen/` in a new tab)

### Requirements

- Paxx12 Snapmaker U1 Extended Firmware (stable releases supported)
- SSH access as `root`

### Installer file

```
chamber-light_remote-display
```

---

## Variant B – Chamber Light + Remote Screen + Firmware Config

🧪 **Advanced / Developer version**

Adds **three buttons** to the Fluidd *Cameras* card:

- **Chamber light**
- **Remote Screen**
- **Firmware Config** (gear icon → `/firmware-config/`)

⚠️ This button links to the internal firmware configuration UI and therefore **requires a newer firmware build**.

### Requirements

- **Paxx12 Snapmaker U1 Extended Firmware – devel build v1.1.0 or newer**
- SSH access as `root`

❌ This variant will **NOT work** on older firmware versions.

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
