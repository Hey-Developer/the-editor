// import packages
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// import components
import Panels from "./components/layout/Panels";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import NoteEditor from "./components/Notes/NoteEditor/NoteEditor";

// import Redux
import { useDispatch } from "react-redux";

// import styles
import { makeStyles, useMediaQuery } from "@material-ui/core";
import {
  toggleEditorAction,
  togglePanelAction,
} from "./redux/Settings/actions";

// styles
const useStyles = makeStyles({
  root: {
    display: "flex",
  },
});

let firstRender = true;

// Main Component Start..
const App = () => {
  //@ States & Variables:
  const classes = useStyles();
  const [defaultCategoryValue, setDefaultCategoryValue] = useState(1);
  const [userCategoryValue, setUserCategoryValue] = useState();

  //@ Redux States Values:
  const dispatch = useDispatch();

  const matches = useMediaQuery("(max-width:480px)");
  const match2 = useMediaQuery("(min-width:480px)");

  useEffect(() => {
    if (matches) {
      firstRender = false;
      dispatch(toggleEditorAction(false));
    } else if (!firstRender) {
      dispatch(toggleEditorAction(true));
    }
  }, [matches]);

  useEffect(() => {
    if (match2) {
      dispatch(togglePanelAction(true));
    }
  }, [match2]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.root}>
        <Sidebar
          defaultCategoryValue={defaultCategoryValue}
          userCategoryValue={userCategoryValue}
          setDefaultCategoryValue={setDefaultCategoryValue}
          setUserCategoryValue={setUserCategoryValue}
        />
        <Panels
          defaultCategoryValue={defaultCategoryValue}
          userCategoryValue={userCategoryValue}
        />
        <NoteEditor />
      </div>
    </DndProvider>
  );
};

export default React.memo(App);
