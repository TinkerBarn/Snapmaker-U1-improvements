# Change printer.cfg and add ext_printer.cfg for supporting Top-Cover light (Snapmaker U1)

⚠️ **NOT included in stock Snapmaker U1 firmware**

The Top Cover light need the following changes in Fluidd printer.cfg
- comment out one PIN line in purifier settings
- add include for ext_printer.cfg at beginning of the file

Create a new file in folder **extended** below the folder where **printer.cfg** is located
- file name is ext_printer.cfg

**See all details in the files**

---
