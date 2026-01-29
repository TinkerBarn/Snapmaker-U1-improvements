# u1-ui-tweaks (on-printer folder)

This folder is created on the printer at:

```
/home/lava/printer_data/misc/u1-ui-tweaks/
```

It persists across reboots (`printer_data` is persistent even without `/oem/.debug`).

---

## Available versions

There are **two supported versions** of the UI tweaks.  
Choose the one that matches your installed firmware.

---

## Version A – Chamber Light + Remote Screen (stable)

✅ **Default / stable version**

### Minimum firmware requirement

- **Paxx12 Snapmaker U1 Extended Firmware v1.0.0 or newer**

### Files

- `custom.js`
- `custom.css`

### Features

Injects **two rows** under the *Cameras* card in Fluidd:

- **Chamber light toggle**  
  Sends  
  ```
  SET_LED LED=cavity_led WHITE=0/1
  ```
- **Remote Screen button**  
  Opens `/screen/` based on the current Fluidd host

---

## Version B – Chamber Light + Remote Screen + Firmware Config

🧪 **Developer / devel build version**

Adds an additional **Firmware Config** button (gear icon).

### Minimum firmware requirement

- **Paxx12 Snapmaker U1 Extended Firmware – devel build v1.1.0 or newer**

⚠️ This version will **NOT work** on older firmware builds.

### Files

Downloaded filenames:

- `custom-devel.js`
- `custom-devel.css`

❗ **Important:**  
After downloading, these files **must be renamed** to:

```
custom.js
custom.css
```

before copying them to the printer.

### Additional feature

- **Firmware Config button**  
  Opens  
  ```
  /firmware-config/
  ```
  on the current Fluidd host

---

## install.sh (common for both versions)

- `install.sh`  
  Copies `custom.css` and `custom.js` into `/home/lava/fluidd/`  
  and patches `index.html` so Fluidd loads them.

This step is required because the Fluidd directory is **recreated on every reboot**.
