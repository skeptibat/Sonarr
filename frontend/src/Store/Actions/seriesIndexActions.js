import moment from 'moment';
import { createAction } from 'redux-actions';
import { filterTypes, sortDirections } from 'Helpers/Props';
import createSetTableOptionReducer from './Creators/Reducers/createSetTableOptionReducer';
import createSetClientSideCollectionSortReducer from './Creators/Reducers/createSetClientSideCollectionSortReducer';
import createSetClientSideCollectionFilterReducer from './Creators/Reducers/createSetClientSideCollectionFilterReducer';
import createHandleActions from './Creators/createHandleActions';

//
// Variables

export const section = 'seriesIndex';

//
// State

export const defaultState = {
  sortKey: 'sortTitle',
  sortDirection: sortDirections.ASCENDING,
  secondarySortKey: 'sortTitle',
  secondarySortDirection: sortDirections.ASCENDING,
  filterKey: null,
  filterValue: null,
  filterType: filterTypes.EQUAL,
  view: 'posters',

  posterOptions: {
    detailedProgressBar: false,
    size: 'large',
    showTitle: false,
    showQualityProfile: true
  },

  overviewOptions: {
    detailedProgressBar: false,
    size: 'medium',
    showNetwork: true,
    showQualityProfile: true,
    showPreviousAiring: false,
    showAdded: false,
    showSeasonCount: true,
    showPath: false,
    showSizeOnDisk: false
  },

  columns: [
    {
      name: 'status',
      columnLabel: 'Status',
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'sortTitle',
      label: 'Series Title',
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'network',
      label: 'Network',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'qualityProfileId',
      label: 'Quality Profile',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'languageProfileId',
      label: 'Language Profile',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'nextAiring',
      label: 'Next Airing',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'previousAiring',
      label: 'Previous Airing',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'added',
      label: 'Added',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'seasonCount',
      label: 'Seasons',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'episodeProgress',
      label: 'Episodes',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'episodeCount',
      label: 'Episode Count',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'latestSeason',
      label: 'Latest Season',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'path',
      label: 'Path',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'sizeOnDisk',
      label: 'Size on Disk',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'tags',
      label: 'Tags',
      isSortable: false,
      isVisible: false
    },
    {
      name: 'useSceneNumbering',
      label: 'Scene Numbering',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'actions',
      columnLabel: 'Actions',
      isVisible: true,
      isModifiable: false
    }
  ],

  sortPredicates: {
    network: function(item) {
      const network = item.network;

      return network ? network.toLowerCase() : '';
    },

    nextAiring: function(item, direction) {
      const nextAiring = item.nextAiring;

      if (nextAiring) {
        return moment(nextAiring).unix();
      }

      if (direction === sortDirections.DESCENDING) {
        return 0;
      }

      return Number.MAX_VALUE;
    },

    episodeProgress: function(item) {
      const {
        episodeCount = 0,
        episodeFileCount
      } = item;

      const progress = episodeCount ? episodeFileCount / episodeCount * 100 : 100;

      return progress + episodeCount / 1000000;
    }
  },

  filterPredicates: {
    missing: function(item) {
      return item.episodeCount - item.episodeFileCount > 0;
    }
  }
};

export const persistState = [
  'seriesIndex.sortKey',
  'seriesIndex.sortDirection',
  'seriesIndex.filterKey',
  'seriesIndex.filterValue',
  'seriesIndex.filterType',
  'seriesIndex.view',
  'seriesIndex.columns',
  'seriesIndex.posterOptions',
  'seriesIndex.overviewOptions'
];

//
// Actions Types

export const SET_SERIES_SORT = 'seriesIndex/setSeriesSort';
export const SET_SERIES_FILTER = 'seriesIndex/setSeriesFilter';
export const SET_SERIES_VIEW = 'seriesIndex/setSeriesView';
export const SET_SERIES_TABLE_OPTION = 'seriesIndex/setSeriesTableOption';
export const SET_SERIES_POSTER_OPTION = 'seriesIndex/setSeriesPosterOption';
export const SET_SERIES_OVERVIEW_OPTION = 'seriesIndex/setSeriesOverviewOption';

//
// Action Creators

export const setSeriesSort = createAction(SET_SERIES_SORT);
export const setSeriesFilter = createAction(SET_SERIES_FILTER);
export const setSeriesView = createAction(SET_SERIES_VIEW);
export const setSeriesTableOption = createAction(SET_SERIES_TABLE_OPTION);
export const setSeriesPosterOption = createAction(SET_SERIES_POSTER_OPTION);
export const setSeriesOverviewOption = createAction(SET_SERIES_OVERVIEW_OPTION);

//
// Reducers

export const reducers = createHandleActions({

  [SET_SERIES_SORT]: createSetClientSideCollectionSortReducer(section),
  [SET_SERIES_FILTER]: createSetClientSideCollectionFilterReducer(section),

  [SET_SERIES_VIEW]: function(state, { payload }) {
    return Object.assign({}, state, { view: payload.view });
  },

  [SET_SERIES_TABLE_OPTION]: createSetTableOptionReducer(section),

  [SET_SERIES_POSTER_OPTION]: function(state, { payload }) {
    const posterOptions = state.posterOptions;

    return {
      ...state,
      posterOptions: {
        ...posterOptions,
        ...payload
      }
    };
  },

  [SET_SERIES_OVERVIEW_OPTION]: function(state, { payload }) {
    const overviewOptions = state.overviewOptions;

    return {
      ...state,
      overviewOptions: {
        ...overviewOptions,
        ...payload
      }
    };
  }

}, defaultState, section);
