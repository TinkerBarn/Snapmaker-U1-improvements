# On-printer UI tweak files

This folder documents files that are created on the printer by the Copy & Paste installer.

Most users do not need to open or edit these files.

---

## What these files are for

The installer stores the Fluidd UI tweaks in this printer folder:

```text
/home/lava/printer_data/misc/u1-ui-tweaks/
```

The files in this folder are used to add the buttons and small layout changes to Fluidd.

- `custom.js` is the Version A UI.
- `custom-devel.js` is the Version B UI.
- `custom-top-cover.js` is the Version C UI.
- `custom-dashboard.js` is the Version D UI with RFID Reader and custom links.
- Each installer writes its selected version to `custom.js` on the printer.
- All optional links are read from their current configuration files through Moonraker when Fluidd loads. Saving a configuration change and reloading Fluidd is sufficient; no Klipper restart or reboot is needed.
- `dragonbreath-config.sh` still produces legacy startup snapshots, but the UI no longer uses these snapshots.

---

## For normal installation

Use the installer files in:

```text
copy-paste/
```

Do not manually copy files from this folder unless you are intentionally doing an advanced manual installation.
