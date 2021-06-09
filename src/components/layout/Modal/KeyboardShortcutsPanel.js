// import packages
import React from "react";
import { useDispatch } from "react-redux";

// import redux
import { toggleSettingsTabAction } from "../../../redux/Settings/actions";

// import styles
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  typography: {
    fontSize: "0.9rem",
    ["@media (max-width:826px)"]: {
      // eslint-disable-line no-useless-computed-key
      marginBottom: "0.5rem",
    },
  },

  list: {
    "& .MuiListSubheader-sticky": {
      position: "static",
    },
  },
  menuIconWrapper: {
    padding: "0.1rem",
    marginRight: "0.5rem",
    borderRadius: "5px",
    transition: "0.3s ease",
    display: "none",

    ["@media (max-width:878px)"]: {
      // eslint-disable-line no-useless-computed-key
      display: "flex",
    },

    "&:hover": {
      backgroundColor: theme.customTheme.syntax,
      color: theme.customTheme.ui,
    },
  },

  box: {
    ["@media (max-width:826px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      alignItems: "start",
      justifyContent: "flex-start",
    },
  },
}));

const KeyboardShortcutsPanel = () => {
  //@ States & Variables:
  const classes = useStyles();
  const dispatch = useDispatch();

  const toggleSettingsTabHandler = () => {
    dispatch(toggleSettingsTabAction("TOGGLE"));
  };

  return (
    <List
      className={classes.list}
      subheader={
        <ListSubheader>
          <Box display="flex" alignItems="center">
            <Box
              className={classes.menuIconWrapper}
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={toggleSettingsTabHandler}>
              <MenuIcon />
            </Box>
            Shortcuts
          </Box>
        </ListSubheader>
      }>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Create New Note
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="ALT" />
                &nbsp; + &nbsp;
                <Chip size="small" label="N" />
              </div>
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Add to fav
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="ALT" />
                &nbsp; + &nbsp;
                <Chip size="small" label="C" />
              </div>
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Toggle Edit Mode
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="ALT" />
                &nbsp; + &nbsp;
                <Chip size="small" label="E" />
              </div>
            </Box>
          }
        />
      </ListItem>{" "}
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Add To Fav
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="ALT" />
                &nbsp; + &nbsp;
                <Chip size="small" label="B" />
              </div>
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Download Note
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="ALT" />
                &nbsp; + &nbsp;
                <Chip size="small" label="D" />
              </div>
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Delete Note
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="DEL" />
              </div>
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Save Note
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="ALT" />
                &nbsp; + &nbsp;
                <Chip size="small" label="S" />
              </div>
            </Box>
          }
        />
      </ListItem>{" "}
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.box}>
              <Typography className={classes.typography} variant="body1">
                Open Settings
              </Typography>
              <div>
                <Chip size="small" label="CTRL" />
                &nbsp; + &nbsp;
                <Chip size="small" label="ALT" />
                &nbsp; + &nbsp;
                <Chip size="small" label="X" />
              </div>
            </Box>
          }
        />
      </ListItem>
    </List>
  );
};

export default React.memo(KeyboardShortcutsPanel);
