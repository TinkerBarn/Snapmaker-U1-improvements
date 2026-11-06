# RFID Reader and custom links (Version D)

Version D adds optional web links below the camera streams. It includes the Top Cover LED controls from Version C and requires the same Top Cover LED hardware.

## Install first

Use [top-cover-led_remote-display_firmware-config_dashboard-links](top-cover-led_remote-display_firmware-config_dashboard-links), following the normal [Copy & Paste instructions](README.md).

Install Version D before removing comment marks from the link examples.

The installer automatically adds missing macro includes to `printer.cfg`:

```ini
[include extended/ext_printer.cfg]
[include extended/ext_rfidmacros.cfg]
```

Existing active includes are retained. `ext_dash_links.cfg` is read by the UI helper and must not be included in `printer.cfg`.

Version D also configures the existing Top Cover LED block and disables the Purifier's PE15 enable assignment automatically, like Version C. Before any actual change to `printer.cfg`, its original contents are saved in the same folder as `printer-YYYYMMDD_HHMMSS.cfg`. An unchanged configuration is not rewritten or backed up again.

If no RFID Reader Link heading exists, the installer adds these disabled examples to `extended/ext_dash_links.cfg`:

```ini
# [RFID Reader Link]
# Host: http://<Link>

# [Dashboard Link1]
# Name: <Name of Link>
# Host: http://<Link>

# [Dashboard Link2]
# Name: <Name of Link>
# Host: http://<Link>

# [Dashboard Link3]
# Name: <Name of Link>
# Host: http://<Link>
```

If `[RFID Reader Link]` already exists, with or without a leading `#`, the installer preserves the file and adds no example blocks.

## Configure an external RFID reader

In Fluidd, open `extended/ext_dash_links.cfg`. Remove the leading `#` from the RFID heading and its Host line, and enter the URL of your reader:

```ini
[RFID Reader Link]
Host: http://rfid-reader.local
```

The RFID/NFC icon opens that external reader's website in a new tab. It is a shortcut to the reader, not a built-in RFID scanning function.

## Configure up to three custom links

1. Open Fluidd's configuration files and edit `extended/ext_dash_links.cfg`.
2. Find an unused `Dashboard Link1`, `Dashboard Link2` or `Dashboard Link3` example. Remove the leading `#` from its heading, Name and Host lines.
3. Replace Name with your button label and Host with the complete website address.
4. Save the file and reload Fluidd. To remove a link later, comment out all three lines again and reload.

Use only the three supported custom sections; a fourth dashboard section is not supported.

For each link you want to show, activate its heading, Name and Host lines. Enter the label you want to see and a complete HTTP or HTTPS URL:

```ini
[Dashboard Link1]
Name: My dashboard
Host: https://dashboard.example.com/printer

[Dashboard Link2]
Name: Spool inventory
Host: http://192.168.178.144:7912
```

You may also configure `[Dashboard Link3]`. Each entry uses a web icon and opens its configured URL in a new tab. Leading and trailing spaces around Name are removed.

Commented headings and empty or invalid URLs remain hidden. Custom dashboard links also need a nonempty Name. Leave unused entries commented.

## Apply your changes

Save the file and reload Fluidd. No Klipper restart, printer reboot or installer rerun is needed for RFID and custom link changes.

RFID and custom link settings are read directly from `extended/ext_dash_links.cfg` whenever Fluidd loads. Comment out a section to hide its link. Name and address changes also take effect after reloading. DragonBreath and Filament Manager are also checked from their current configuration files on each page load. There is no periodic check while Fluidd is open.

Version D stores only link settings in `extended/ext_dash_links.cfg`. Macros remain in `extended/ext_printer.cfg`, which is included by `printer.cfg`. Do not include `ext_dash_links.cfg` in Klipper. On first installation, missing files and macro includes are created. Repeat runs preserve configured links and existing macro files and add only missing includes.
