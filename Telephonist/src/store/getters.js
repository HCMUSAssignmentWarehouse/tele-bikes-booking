export const getters = {
  appTitle (state) {
    return state.appTitle
  },
  getUser (state) {
    return state.user
  },
  getError (state) {
    return state.error
  },
  getLoading (state) {
    return state.loading
  },
  getSearchList(state){
    return state.searchlist
  },
  getDetailBookingDeal(state){
    return state.detailBookingDeal
  },
  getIsGetingDetail(state){
    return state.isGetingDetail
  }
}
