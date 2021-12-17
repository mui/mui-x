import {DayProps} from "./DayProps";

export const areDayPropsEqual = (
    prevProps: DayProps<any>,
    nextProps: DayProps<any>,
) => {
    return (
        prevProps.autoFocus === nextProps.autoFocus &&
        prevProps.isAnimating === nextProps.isAnimating &&
        prevProps.today === nextProps.today &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.selected === nextProps.selected &&
        prevProps.disableMargin === nextProps.disableMargin &&
        prevProps.showDaysOutsideCurrentMonth === nextProps.showDaysOutsideCurrentMonth &&
        prevProps.disableHighlightToday === nextProps.disableHighlightToday &&
        prevProps.className === nextProps.className &&
        prevProps.outsideCurrentMonth === nextProps.outsideCurrentMonth &&
        prevProps.onDayFocus === nextProps.onDayFocus &&
        prevProps.onDaySelect === nextProps.onDaySelect
    );
};