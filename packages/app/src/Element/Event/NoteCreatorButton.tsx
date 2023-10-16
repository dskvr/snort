import "./NoteCreatorButton.css";
import { useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { isFormElement } from "SnortUtils";
import useKeyboardShortcut from "Hooks/useKeyboardShortcut";
import useLogin from "Hooks/useLogin";
import Icon from "Icons/Icon";
import { useNoteCreator } from "State/NoteCreator";
import { NoteCreator } from "./NoteCreator";
import classNames from "classnames";

export const NoteCreatorButton = ({ className }: { className?: string }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { readonly } = useLogin(s => ({ readonly: s.readonly }));
  const { show, replyTo, update } = useNoteCreator(v => ({ show: v.show, replyTo: v.replyTo, update: v.update }));

  useKeyboardShortcut("n", event => {
    // if event happened in a form element, do nothing, otherwise focus on search input
    if (event.target && !isFormElement(event.target as HTMLElement)) {
      event.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  });

  const shouldHideNoteCreator = useMemo(() => {
    const isReplyNoteCreatorShowing = replyTo && show;
    const hideOn = ["/settings", "/messages", "/new", "/login", "/donate", "/e", "/subscribe"];
    return readonly || isReplyNoteCreatorShowing || hideOn.some(a => location.pathname.startsWith(a));
  }, [location, readonly]);

  if (shouldHideNoteCreator) return null;
  return (
    <>
      <button
        ref={buttonRef}
        className={classNames("primary circle", className)}
        onClick={() =>
          update(v => {
            v.replyTo = undefined;
            v.show = true;
          })
        }>
        <Icon name="plus" size={16} />
      </button>
      <NoteCreator key="global-note-creator" />
    </>
  );
};