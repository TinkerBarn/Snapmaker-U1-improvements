# filesystem/

This folder mirrors the **real Snapmaker U1 filesystem paths** used by this tweak.

## Paths

- `/etc/init.d/S99u1-ui-tweaks`  
  Boot-time hook that waits for Fluidd and then executes:
  `/home/lava/printer_data/misc/u1-ui-tweaks/install.sh`

- `/home/lava/printer_data/misc/u1-ui-tweaks/`  
  Persistent folder (survives reboots), containing:
  - `custom.css`
  - `custom.js`
  - `install.sh`

- `/oem/.debug`  
  When this file exists, the firmware will persist changes to `/etc`.  
  The file in this repo is only a placeholder to show the path.
