sap.ui.define([], function () {
    "use strict";

    function getState(layout, selectedId) {
        const sections = layout.getSections().filter(section => section.getVisible() &&
            section.getSubSections().some(subsection => subsection.getVisible()));
        const selected = selectedId || layout.getSelectedSection();
        const index = sections.findIndex(section => section.getId() === selected ||
            section.getSubSections().some(subsection => subsection.getId() === selected));
        return { sections: sections, index: index < 0 ? 0 : index };
    }

    function update(layout, model, selectedId) {
        const state = getState(layout, selectedId);
        model.setProperty("/hasPrevious", state.index > 0);
        model.setProperty("/hasNext", state.index < state.sections.length - 1);
    }

    function move(api, direction) {
        const model = api.getModel("sectionNavigation");
        const target = model.getProperty(direction < 0 ? "/previousId" : "/nextId");
        if (target) {
            api.navigateToSubSection(target);
        }
    }

    return {
        getState: getState,
        update: update,
        previous: function () { move(this, -1); },
        next: function () { move(this, 1); }
    };
});
