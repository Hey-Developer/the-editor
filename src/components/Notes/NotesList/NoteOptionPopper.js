// import packages:
import React from "react";
import draftToHtml from "draftjs-to-html";
import htmlToDocx from "html-to-docx-buffer";
import { useDispatch, useSelector } from "react-redux";
import { saveAs } from "file-saver";

// import Icons
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import RestoreOutlinedIcon from "@material-ui/icons/RestoreOutlined";

// import Styles
import {
  Box,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  TextField,
} from "@material-ui/core";
import { useStyles } from "./styles";

//import contexts
import {
  addToFavAction,
  deleteNoteAction,
  restoreNoteAction,
  tempDeleteNoteAction,
  moveToCategoryAction,
} from "../../../redux/Notes/actions";
import { getUserCategories } from "../../../redux/selectors/categoriesSelector";
import { getSelectedNoteForOption } from "../../../redux/selectors/notesSelector";

// Main Component Start..
const NoteOptionPopper = ({ anchorEl, setAnchorEl, id, open }) => {
  // @ Variables or State
  const classes = useStyles();

  //@ Consume Context:
  const userCategories = useSelector(getUserCategories);
  const selectedNote = useSelector(getSelectedNoteForOption);
  const dispatch = useDispatch();

  const noUserCategories = userCategories.length === 0;

  // @ handlers:
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setAnchorEl(null);
    }
  }

  const handleSelectCategoryChange = (e) => {
    dispatch(moveToCategoryAction(selectedNote.id, e.target.value));
    setAnchorEl(null);
  };

  const addToFavHandler = () => {
    dispatch(addToFavAction(selectedNote.id));
    setAnchorEl(null);
  };

  const deleteNoteHandler = () => {
    dispatch(tempDeleteNoteAction(selectedNote.id));
    setAnchorEl(null);
  };

  const restoreNoteHandler = () => {
    dispatch(restoreNoteAction(selectedNote.id));
    setAnchorEl(null);
  };

  const deleteNotePermanentHandler = () => {
    dispatch(deleteNoteAction(selectedNote.id));
    setAnchorEl(null);
  };

  const downloadNoteHandler = async () => {
    setAnchorEl(null);
    const fileBuffer = await htmlToDocx(draftToHtml(selectedNote.content));
    saveAs(fileBuffer, `${selectedNote.title}.docx`);
  };

  // Return Component:
  return (
    <Popover
      elevation={2}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      className={classes.popover}>
      <Paper className={classes.paper} elevation={0}>
        <MenuList
          autoFocusItem={open}
          id="menu-list-grow"
          onKeyDown={handleListKeyDown}>
          {selectedNote.category_id === "3"
            ? [
                <MenuItem
                  className={classes.menuItem}
                  id="trash"
                  onClick={deleteNotePermanentHandler}>
                  <DeleteOutlineIcon />
                  Delete Permanently
                </MenuItem>,
                <MenuItem
                  className={classes.menuItem}
                  onClick={restoreNoteHandler}>
                  <RestoreOutlinedIcon />
                  Restore
                </MenuItem>,
              ]
            : [
                <MenuItem
                  className={classes.menuItem}
                  onClick={addToFavHandler}>
                  {selectedNote.fav
                    ? [<BookmarkOutlinedIcon />, "Remove Favorite"]
                    : [<BookmarkBorderOutlinedIcon />, "Add to Favorite"]}
                </MenuItem>,
                <MenuItem
                  className={classes.menuItem}
                  id="trash"
                  onClick={deleteNoteHandler}>
                  <DeleteOutlineIcon />
                  Trash
                </MenuItem>,
              ]}

          <MenuItem className={classes.menuItem} onClick={downloadNoteHandler}>
            <SystemUpdateAltIcon />
            Download
          </MenuItem>
          {selectedNote.category_id === "3" ? null : (
            <Box className={classes.selectTextFieldWrapper}>
              <TextField
                className={classes.selectTextField}
                size="small"
                select
                label="Move to category"
                disabled={noUserCategories ? true : false}
                helperText={noUserCategories ? "No user categories" : ""}
                onChange={handleSelectCategoryChange}
                variant="outlined">
                {userCategories.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </MenuList>
      </Paper>
    </Popover>
  );
};

export default React.memo(NoteOptionPopper);
