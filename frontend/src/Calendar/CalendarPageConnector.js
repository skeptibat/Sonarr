import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setCalendarDaysCount, setCalendarIncludeUnmonitored } from 'Store/Actions/calendarActions';
import createSeriesCountSelector from 'Store/Selectors/createSeriesCountSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import CalendarPage from './CalendarPage';

function createMapStateToProps() {
  return createSelector(
    (state) => state.calendar,
    createSeriesCountSelector(),
    createUISettingsSelector(),
    (calendar, seriesCount, uiSettings) => {
      return {
        unmonitored: calendar.unmonitored,
        showUpcoming: calendar.showUpcoming,
        colorImpairedMode: uiSettings.enableColorImpairedMode,
        hasSeries: !!seriesCount
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onDaysCountChange(dayCount) {
      dispatch(setCalendarDaysCount({ dayCount }));
    },

    onUnmonitoredChange(unmonitored) {
      dispatch(setCalendarIncludeUnmonitored({ unmonitored }));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(CalendarPage);
