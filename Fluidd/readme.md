# Manual Fluidd configuration reference

Most users should not use this folder directly.

If you use the Copy & Paste installer, the needed changes are done automatically.

This folder is only a manual reference for advanced users who want to inspect or edit the Fluidd/Klipper configuration themselves.

---

## Top Cover LED

The Top Cover LED button only makes sense when the matching hardware exists:

- A Top Cover should be installed.
- An LED strip must be installed in or on the Top Cover.
- The LED strip needs a cable connection to the rear upper connector on the printer.

For beginners, use Version C from the `copy-paste/` folder instead of editing these files manually.

---

## Files

- `printer.cfg` shows the required include lines and the current purifier example.
- `extended/ext_printer.cfg` contains the Top Cover LED control.
- `extended/ext_rfidmacros.cfg` contains optional RFID-related macros.

These files are examples and references. The Copy & Paste installer creates the needed files on the printer automatically.

Version C uses `led cavity_led` on PE15 for the Top Cover LED. The display light switch controls the same LED. Do not also configure `output_pin TOP_COVER_24V` on PE15.

For DragonBreath, enable the heater in Paxx12 Firmware Config and configure its `host:` in `extended/klipper/dragonbreath.cfg`. The UI reads that address whenever Fluidd loads. Filament Manager and RFID/custom links also update on page reload, without restarting Klipper or the printer.

Versions C and D automatically adjust the existing LED block and the Purifier PE15 assignment in `printer.cfg` and add missing macro includes. Before changing that file, the installer creates a backup beside it named `printer-YYYYMMDD_HHMMSS.cfg`.

Version D stores only RFID/custom-link settings in `extended/ext_dash_links.cfg`. Macros remain in `ext_printer.cfg`, which is included by Klipper. Never include the dashboard link file in Klipper. See [custom link setup](../copy-paste/dashboard-links.md).
