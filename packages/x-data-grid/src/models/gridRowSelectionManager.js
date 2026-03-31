class IncludeManager {
    data;
    constructor(model) {
        this.data = model.ids;
    }
    has(id) {
        return this.data.has(id);
    }
    select(id) {
        this.data.add(id);
    }
    unselect(id) {
        this.data.delete(id);
    }
}
class ExcludeManager {
    data;
    constructor(model) {
        this.data = model.ids;
    }
    has(id) {
        return !this.data.has(id);
    }
    select(id) {
        this.data.delete(id);
    }
    unselect(id) {
        this.data.add(id);
    }
}
export const createRowSelectionManager = (model) => {
    if (model.type === 'include') {
        return new IncludeManager(model);
    }
    return new ExcludeManager(model);
};
