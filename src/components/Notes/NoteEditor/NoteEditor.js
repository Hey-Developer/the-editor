// import packages
import React, { useCallback, useEffect, useState } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import clsx from "clsx";
import draftToHtml from "draftjs-to-html";
import htmlToDocx from "html-to-docx-buffer";
import { saveAs } from "file-saver";
import moment from "moment";
import Hotkeys from "react-hot-keys";
import { useDispatch, useSelector } from "react-redux";

// import Components:
import DraftEditor from "./DraftEditor";
import SettingModal from "../../layout/Modal/SettingModal";
import NotePreview from "./NotePreview";

// import Redux and ActionsCreators
import {
  addToFavAction,
  tempDeleteNoteAction,
  resetSelectedNoteAction,
  restoreNoteAction,
  updateNoteAction,
} from "../../../redux/Notes/actions";

// import styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useStyles } from "./styles";
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  useMediaQuery,
} from "@material-ui/core";

// import icons
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import SyncIcon from "@material-ui/icons/Sync";
import SettingsIcon from "@material-ui/icons/Settings";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import RestoreOutlinedIcon from "@material-ui/icons/RestoreOutlined";
import KeyboardBackspaceRoundedIcon from "@material-ui/icons/KeyboardBackspaceRounded";
import { getSelectedCategoryIndex } from "../../../redux/selectors/categoriesSelector";
import {
  getAllNotes,
  getSelectedNoteId,
} from "../../../redux/selectors/notesSelector";
import {
  getEditMode,
  getShowEditor,
} from "../../../redux/selectors/settingsSelector";
import {
  toggleEditorAction,
  togglePanelAction,
} from "../../../redux/Settings/actions";
import { toggleEditModeAction } from "../../../redux/Category/actions";

// Global Variables
let initialState = {
  htmlContentState: "",
  editorState: EditorState.createEmpty(),
};
let firstRender = true;

// Main Component Start..
const NoteEditor = () => {
  //@ States & Variables:
  const matches = useMediaQuery("(max-width:480px)");

  const classes = useStyles();
  const [noteState, setNoteState] = useState(initialState);
  const [settingModalIsOpen, setSettingModalIsOpen] = useState(false);
  let contentState;

  //@ Consuming Contexts:
  const selectedCategoryIndex = useSelector(getSelectedCategoryIndex);
  const allNotes = useSelector(getAllNotes);
  const selectedNoteId = useSelector(getSelectedNoteId);
  const editMode = useSelector(getEditMode);
  const showNoteEditor = useSelector(getShowEditor);
  const dispatch = useDispatch();

  const responsiveHandler = () => {
    if (matches) {
      dispatch(toggleEditorAction(false));
      dispatch(togglePanelAction(true));
    }
  };

  //@ Useful data from contexts:
  const selectedNote = allNotes.filter((note) => note.id === selectedNoteId);

  // Logic for checking note list is empty or have notes for the selected category...
  const formattedNotes = allNotes.filter(
    (note) => note.category_id === selectedCategoryIndex
  );
  const showEditor = formattedNotes.length > 0 && selectedNoteId !== null;

  //@ Live-Hooks:
  // Logic for setting selected note id to null if category id changes.
  useEffect(() => {
    console.log(firstRender);
    if (!firstRender) {
      if (selectedNoteId !== null) dispatch(resetSelectedNoteAction());
    }
    firstRender = false;
  }, [selectedCategoryIndex]);

  useEffect(() => {
    if (selectedNote.length > 0 && selectedNote[0].content) {
      setNoteState({
        editorState: EditorState.createWithContent(
          convertFromRaw(selectedNote[0].content)
        ),
        htmlContentState: draftToHtml(selectedNote[0].content),
      });
    } else {
      setNoteState(initialState);
    }
    dispatch(toggleEditModeAction(false));
  }, [selectedNoteId]);

  //@ Handlers:
  const saveNoteHandler = useCallback(() => {
    if (selectedNoteId === null) {
      alert("Please Select Note");
    }
    contentState = noteState.editorState.getCurrentContent();
    const newNote = {
      id: selectedNoteId,
      title: convertToRaw(contentState).blocks[0].text,
      content: convertToRaw(contentState),
      lastSaved: moment(),
    };
    dispatch(updateNoteAction(newNote));
  }, [noteState]);

  const toggleEditModeHandler = useCallback(() => {
    if (selectedNoteId === null) {
      alert("Please Select Note");
    }
    dispatch(toggleEditModeAction("TOGGLE"));
  }, [editMode, selectedNoteId]);

  const addToFavHandler = useCallback(() => {
    if (selectedNoteId === null) {
      alert("Please Select Note");
    }
    dispatch(addToFavAction(selectedNoteId));
  }, [selectedNoteId]);

  const deleteNoteHandler = useCallback(() => {
    if (selectedNoteId === null) {
      alert("Please Select Note");
    }
    dispatch(tempDeleteNoteAction(selectedNoteId));
  }, [selectedNoteId]);

  const restoreNoteHandler = useCallback(() => {
    console.log("Hii");
    if (selectedNoteId === null) {
      alert("Please Select Note");
    }
    dispatch(restoreNoteAction(selectedNoteId));
  }, [selectedNoteId]);

  const downloadNoteHandler = useCallback(async () => {
    contentState = noteState.editorState.getCurrentContent();
    const fileBuffer = await htmlToDocx(noteState.htmlContentState);
    saveAs(fileBuffer, `${selectedNote[0].title}.docx`);
  }, [noteState]);

  const openSettingModal = () => {
    setSettingModalIsOpen(true);
  };

  // useEffect(() => {
  //   if (autoSave) {
  //     timer = setTimeout(() => {
  //       saveNoteHandler();
  //     }, autoSaveDelay * 1000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [autoSave, autoSaveDelay]);

  return (
    <div
      className={clsx(classes.root, {
        [classes.hideEditor]: !showNoteEditor,
      })}>
      <SettingModal
        isOpen={settingModalIsOpen}
        setIsOpen={setSettingModalIsOpen}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className={classes.topBar}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          className={classes.backIconWrapper}
          onClick={responsiveHandler}>
          <KeyboardBackspaceRoundedIcon />
        </Box>
        {selectedNote.length > 0 ? (
          <Typography
            variant="overline"
            className={classes.lastSaved}
            align="right">
            {selectedNote[0]?.lastSaved
              ? moment(selectedNote[0].lastSaved).fromNow()
              : "unsaved"}
          </Typography>
        ) : null}
        <List className={classes.noteOptions}>
          <ListItem button disableGutters onClick={saveNoteHandler}>
            <ListItemIcon>
              <Hotkeys
                keyName="ctrl+alt+s"
                onKeyDown={saveNoteHandler}
                allowRepeat={true}>
                <SyncIcon />
              </Hotkeys>
            </ListItemIcon>
          </ListItem>
          <ListItem button disableGutters onClick={openSettingModal}>
            <ListItemIcon>
              <Hotkeys
                keyName="ctrl+alt+x"
                onKeyDown={openSettingModal}
                allowRepeat={true}>
                <SettingsIcon />
              </Hotkeys>
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>
      {showEditor ? (
        editMode ? (
          <DraftEditor
            selectedNoteId={selectedNoteId}
            saveNoteHandler={saveNoteHandler}
            noteState={noteState}
            setNoteState={setNoteState}
          />
        ) : (
          <NotePreview htmlContentState={noteState.htmlContentState} />
        )
      ) : (
        <div className={classes.createNoteMessage}>
          <Typography variant="h5" m={1} gutterBottom>
            {selectedNoteId === null && formattedNotes.length === 0
              ? "Create Note"
              : "Select Note To Edit or Preview"}
          </Typography>
          {selectedNoteId === null && formattedNotes.length === 0 ? (
            <div>
              <Chip size="small" label="Ctrl" /> +
              <Chip size="small" label="Alt" /> +
              <Chip size="small" label="N" />
            </div>
          ) : null}
        </div>
      )}

      <div className={classes.bottomBar}>
        <List
          className={clsx(classes.noteOptions, {
            [classes.hiddenEditor]: !showEditor,
          })}>
          <ListItem button disableGutters onClick={toggleEditModeHandler}>
            <ListItemIcon>
              <Hotkeys
                keyName="ctrl+alt+e"
                onKeyDown={toggleEditModeHandler}
                allowRepeat={true}>
                {!editMode ? <EditOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </Hotkeys>
            </ListItemIcon>
          </ListItem>
          <ListItem button disableGutters>
            <ListItemIcon onClick={addToFavHandler}>
              <Hotkeys
                keyName="ctrl+alt+b"
                onKeyDown={addToFavHandler}
                allowRepeat={true}>
                {selectedNote[0]?.fav ? (
                  <BookmarkOutlinedIcon />
                ) : (
                  <BookmarkBorderOutlinedIcon />
                )}
              </Hotkeys>
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            disableGutters
            className={clsx(
              selectedNote[0]?.category_id !== "3" && classes.trash
            )}
            onClick={
              selectedNote[0]?.category_id !== "3"
                ? deleteNoteHandler
                : restoreNoteHandler
            }>
            <ListItemIcon>
              {selectedNote[0]?.category_id === "3" ? (
                <Hotkeys
                  keyName="ctrl+alt+u"
                  onKeyDown={restoreNoteHandler}
                  allowRepeat={true}>
                  <RestoreOutlinedIcon />
                </Hotkeys>
              ) : (
                <Hotkeys
                  keyName="ctrl+del"
                  onKeyDown={deleteNoteHandler}
                  allowRepeat={true}>
                  <DeleteOutlineIcon />
                </Hotkeys>
              )}
            </ListItemIcon>
          </ListItem>
          <ListItem button disableGutters onClick={downloadNoteHandler}>
            <ListItemIcon>
              <Hotkeys
                keyName="ctrl+alt+d"
                onKeyDown={downloadNoteHandler}
                allowRepeat={true}>
                <SystemUpdateAltIcon />
              </Hotkeys>
            </ListItemIcon>
          </ListItem>
        </List>
        <Box
          display="flex"
          alignItems="center"
          className={classes.hideOnMobile}>
          {selectedNote.length > 0 ? (
            <Typography
              variant="overline"
              className={classes.lastSaved}
              align="right">
              {selectedNote[0]?.lastSaved
                ? moment(selectedNote[0].lastSaved).fromNow()
                : "unsaved"}
            </Typography>
          ) : null}
          <List className={classes.noteOptions}>
            <ListItem button disableGutters onClick={saveNoteHandler}>
              <ListItemIcon>
                <Hotkeys
                  keyName="ctrl+alt+s"
                  onKeyDown={saveNoteHandler}
                  allowRepeat={true}>
                  <SyncIcon />
                </Hotkeys>
              </ListItemIcon>
            </ListItem>
            <ListItem button disableGutters onClick={openSettingModal}>
              <ListItemIcon>
                <Hotkeys
                  keyName="ctrl+alt+x"
                  onKeyDown={openSettingModal}
                  allowRepeat={true}>
                  <SettingsIcon />
                </Hotkeys>
              </ListItemIcon>
            </ListItem>
          </List>
        </Box>
      </div>
    </div>
  );
};

export default React.memo(NoteEditor);
