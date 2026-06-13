# Release notes

## Local draft

This draft collects implementation-level changes that should not clutter the beginner installation instructions.

- The Copy & Paste installers now enable `/etc` persistence automatically by creating `/oem/.debug`.
- The Top Cover LED installer now creates the required `extended/` configuration files automatically.
- The Top Cover LED installer patches `printer.cfg` automatically when the expected config file is found.
- The purifier PE15 handling supports both older `enable_pin: PE15` and newer `power_enable_pin: PE15` naming.
- The installer output now tells users explicitly to type `reboot`, press Enter, and confirm the reboot if asked.
- README files were rewritten to focus on beginner-friendly installation and version choice.
