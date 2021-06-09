import React, { useCallback, useRef } from "react";
import draftToHtml from "draftjs-to-html";
import htmlToDocx from "html-to-docx-buffer";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";

// import redux selectors and actions
import { importBackupAction } from "../../../redux/Notes/actions";
import { getAllNotes } from "../../../redux/selectors/notesSelector";
import { toggleSettingsTabAction } from "../../../redux/Settings/actions";

// import styles
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";

// import icons
import GetAppIcon from "@material-ui/icons/GetApp";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  button: {
    fontSize: "0.9rem",

    "&:hover": {
      color: theme.customTheme.ui,
      backgroundColor: theme.customTheme.syntax,
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

      "& .typo": {
        marginBottom: "0.5rem",
      },
    },
  },
}));

const DataManagementPanel = () => {
  //@ States & Variables:
  const classes = useStyles();
  const fileInputRef = useRef(null);

  //@ Consuming Contexts:
  const allNotes = useSelector(getAllNotes);
  const dispatch = useDispatch();

  //@ Handlers:
  const toggleSettingsTabHandler = () => {
    dispatch(toggleSettingsTabAction("TOGGLE"));
  };

  const downloadAllNotesAsZip = useCallback(() => {
    allNotes.forEach((note) => {
      if (note.content !== "") {
        htmlToDocx(draftToHtml(note.content))
          .then((fb) => {
            saveAs(fb, `${note.title}.docx`);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
  }, [allNotes]);

  const allNotesExportAsJson = useCallback(() => {
    const output = JSON.stringify(allNotes, null, 4);
    const blob = new Blob([output]);
    saveAs(blob, "The.EditorNotesBackup.json");
  }, [allNotes]);

  const fileUploadHandler = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
      dispatch(importBackupAction(JSON.parse(reader.result)));
    };

    reader.onerror = function () {
      alert(reader.error);
    };
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
            Data Management
          </Box>
        </ListSubheader>
      }>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              className={classes.box}
              display="flex"
              alignItems="center"
              justifyContent="space-between">
              <Typography className="typo" variant="body1">
                Download all notes as docx files at once
                <br />
                <Typography variant="caption">
                  note: empty notes will not be downloaded
                </Typography>
              </Typography>
              <Button
                disableElevation
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<GetAppIcon />}
                onClick={downloadAllNotesAsZip}>
                Download All
              </Button>
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              className={classes.box}
              display="flex"
              alignItems="center"
              justifyContent="space-between">
              <Typography className="typo" variant="body1">
                Export All Note as JSON
              </Typography>
              <Button
                disableElevation
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudDownloadIcon />}
                onClick={allNotesExportAsJson}>
                Export All
              </Button>
            </Box>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              className={classes.box}
              display="flex"
              alignItems="center"
              justifyContent="space-between">
              <Typography className="typo" variant="body1">
                Import All Note as JSON
              </Typography>
              <input
                type="file"
                multiple={false}
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                disableElevation
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                onClick={fileUploadHandler}>
                Import All
              </Button>
            </Box>
          }
        />
      </ListItem>
    </List>
  );
};

export default React.memo(DataManagementPanel);
