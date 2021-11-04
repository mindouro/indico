// This file is part of Indico.
// Copyright (C) 2002 - 2021 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import {LOCK_UI, MOVE_ITEM, MOVE_SECTION, UNLOCK_UI} from './actions';

export default {
  uiLocked: (state = false, action) => {
    switch (action.type) {
      case LOCK_UI:
        return true;
      case UNLOCK_UI:
        return false;
      default:
        return state;
    }
  },
  sections: (state = [], action) => {
    switch (action.type) {
      case MOVE_SECTION: {
        const dragItem = state[action.sourceIndex];
        const newItems = [...state];
        newItems.splice(action.sourceIndex, 1);
        newItems.splice(action.targetIndex, 0, dragItem);
        return newItems;
      }
      case MOVE_ITEM: {
        const sectionIndex = state.findIndex(x => x.id === action.sectionId);
        const section = state[sectionIndex];
        const dragItem = section.items[action.sourceIndex];
        const newItems = [...section.items];
        newItems.splice(action.sourceIndex, 1);
        newItems.splice(action.targetIndex, 0, dragItem);
        const newSections = [...state];
        newSections[sectionIndex] = {
          ...section,
          items: newItems,
        };
        return newSections;
      }
      default:
        return state;
    }
  },
};