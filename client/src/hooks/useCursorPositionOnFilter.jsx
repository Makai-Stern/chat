import React from "react";


export function filterOut(text, cursor, regex=/\s/g) {
    const beforeCursor = text.slice(0, cursor);
    const afterCursor = text.slice(cursor, text.length);
  
    const filterdBeforeCursor = beforeCursor.replace(regex, '').toLowerCase();
    const filterAfterCursor = afterCursor.replace(regex, '').toLowerCase();
  
    const newText = filterdBeforeCursor + filterAfterCursor;
    const newCursor = filterdBeforeCursor.length;
  
    return [newText, newCursor];
}

export function useRunAfterUpdate() {
    const afterPaintRef = React.useRef(null);
    React.useLayoutEffect(() => {
      if (afterPaintRef.current) {
        afterPaintRef.current();
        afterPaintRef.current = null;
      }
    });
    const runAfterUpdate = fn => (afterPaintRef.current = fn);
    return runAfterUpdate;
  }