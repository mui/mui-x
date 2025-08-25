"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var scheduler_1 = require("test/utils/scheduler");
var standalone_view_1 = require("@mui/x-scheduler/material/standalone-view");
var ViewSwitcher_1 = require("./ViewSwitcher");
describe('<ViewSwitcher />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    var standaloneDefaults = {
        events: [],
        resources: [],
    };
    it('should render the two first views + Others for the default set of views', function () {
        var container = render(<standalone_view_1.StandaloneView {...standaloneDefaults}>
        <ViewSwitcher_1.ViewSwitcher />
      </standalone_view_1.StandaloneView>).container;
        var buttons = container.querySelectorAll('.ViewSwitcherMainItem');
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).to.have.text('Week');
        expect(buttons[1]).to.have.text('Day');
        expect(buttons[2]).to.have.text('Other ');
    });
    it('should render the two first views + Others for a custom set of views (with more than 3 views)', function () {
        var container = render(<standalone_view_1.StandaloneView {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']}>
        <ViewSwitcher_1.ViewSwitcher />
      </standalone_view_1.StandaloneView>).container;
        var buttons = container.querySelectorAll('.ViewSwitcherMainItem');
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).to.have.text('Agenda');
        expect(buttons[1]).to.have.text('Week');
        expect(buttons[2]).to.have.text('Other ');
    });
    it('should render the two first views + the selected view for a custom set of views (with more than 3 views)', function () {
        var container = render(<standalone_view_1.StandaloneView {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']} view="month">
        <ViewSwitcher_1.ViewSwitcher />
      </standalone_view_1.StandaloneView>).container;
        var buttons = container.querySelectorAll('.ViewSwitcherMainItem');
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).to.have.text('Agenda');
        expect(buttons[1]).to.have.text('Week');
        expect(buttons[2]).to.have.text('Month ');
    });
    it('should render the three first views for a custom set of views (with exactly 3 views)', function () {
        var container = render(<standalone_view_1.StandaloneView {...standaloneDefaults} views={['agenda', 'week', 'day']}>
        <ViewSwitcher_1.ViewSwitcher />
      </standalone_view_1.StandaloneView>).container;
        var buttons = container.querySelectorAll('.ViewSwitcherMainItem');
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).to.have.text('Agenda');
        expect(buttons[1]).to.have.text('Week');
        expect(buttons[2]).to.have.text('Day');
    });
    it('should render the two first views for a custom set of views (with exactly 2 views)', function () {
        var container = render(<standalone_view_1.StandaloneView {...standaloneDefaults} views={['agenda', 'week']}>
        <ViewSwitcher_1.ViewSwitcher />
      </standalone_view_1.StandaloneView>).container;
        var buttons = container.querySelectorAll('.ViewSwitcherMainItem');
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).to.have.text('Agenda');
        expect(buttons[1]).to.have.text('Week');
    });
});
