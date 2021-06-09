// import packages
import React from "react";

// import components
import TabPanel from "../TabPanel";
import AboutPanel from "./AboutPanel";
import DataManagementPanel from "./DataManagementPanel";
import KeyboardShortcutsPanel from "./KeyboardShortcutsPanel";
import PreferencesPanel from "./PreferencesPanel";

// import styles
import { useStyles } from "./styles";

const SettingPanels = ({ value }) => {
  //@ States & Variables:
  const classes = useStyles();

  return (
    <div className={classes.settingsPanel}>
      <TabPanel value={value} index={0}>
        <PreferencesPanel />
      </TabPanel>{" "}
      <TabPanel value={value} index={1}>
        <KeyboardShortcutsPanel />
      </TabPanel>{" "}
      <TabPanel value={value} index={2}>
        <DataManagementPanel />
      </TabPanel>{" "}
      <TabPanel value={value} index={3}>
        <AboutPanel />
      </TabPanel>
    </div>
  );
};

export default React.memo(SettingPanels);
