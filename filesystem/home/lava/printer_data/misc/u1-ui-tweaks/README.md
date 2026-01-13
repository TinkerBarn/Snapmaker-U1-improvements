# u1-ui-tweaks (on-printer folder)

This folder is created on the printer at:

`/home/lava/printer_data/misc/u1-ui-tweaks/`

It persists across reboots (printer_data is persistent even without `/oem/.debug`).

## Files

- `custom.css`  
  Hides toolheads T4…T31 and styles the buttons.

- `custom.js`  
  Injects two rows under the Cameras card:
  - Chamber light toggle (sends `SET_LED LED=cavity_led WHITE=0/1`)
  - Remote Display button (opens `/screen/` based on the current Fluidd host)

- `install.sh`  
  Copies `custom.css` + `custom.js` into `/home/lava/fluidd/` and patches `index.html`
  so Fluidd loads them. This is needed because the Fluidd directory is recreated on reboot.
