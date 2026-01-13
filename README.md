# Snapmaker U1 improvements (Fluidd) – persistent UI tweaks

This repo contains a **reboot-safe** tweak for **Snapmaker U1 + Fluidd**:

- **Toolchanger UI:** show only **T0–T3** (hide T4…T31)
- **Cameras card:** add a **Chamber light** ON/OFF button (LED: `cavity_led`)
- **Cameras card:** add a **Remote Display** button that opens `http://<printer-ip>/screen/`

## ⚠️ Prerequisites (not stock firmware)

This requires **Paxx12 Snapmaker U1 Extended Firmware** (SSH access + remote screen feature).

Enable persistence for `/etc` by creating:

```sh
touch /oem/.debug
```

This is required because the init script is installed into `/etc/init.d`.

Remote Screen must be enabled in the extended firmware configuration (see Paxx12 docs).

## Install (Copy & Paste)

1. SSH into the printer as **root** (per Paxx12 docs).
2. Make sure persistence is enabled (run once):
   ```sh
   touch /oem/.debug
   ```
3. Copy & paste the full script from:
   - `copy-paste/chamber-light-remote-display.txt`
4. Reload Fluidd: **Ctrl + F5**
5. Reboot test: power off/on the printer.

✅ After reboot, the changes should still be active.

## Repo layout

This repo mirrors the Snapmaker U1 file system under `filesystem/`:

- `filesystem/etc/init.d/S99u1-ui-tweaks` → boot hook (runs late, applies the tweak)
- `filesystem/home/lava/printer_data/misc/u1-ui-tweaks/` → persistent tweak files
- `filesystem/oem/.debug` → placeholder (real creation is done via `touch /oem/.debug`)

For details, see `filesystem/README.md`.
