# copy-paste/

⚠️ **Not included in stock Snapmaker U1 firmware.**

These scripts require **Paxx12 Snapmaker U1 Extended Firmware** (SSH access)  
and **data persistence** enabled via:

```sh
touch /oem/.debug
```

## What you paste

- `chamber-light-remote-display.txt`  
  One block that creates the persistent files under `/home/lava/printer_data/...` and installs
  `/etc/init.d/S99u1-ui-tweaks`.
