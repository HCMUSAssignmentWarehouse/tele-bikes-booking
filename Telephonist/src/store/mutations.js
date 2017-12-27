export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setSearchList(state, payload){
  	state.searchlist = payload
  },
  setDetailBookingDeal(state, payload){
    state.detailBookingDeal = payload
  },
  setIsGetingDetail(state, payload){
    state.isGetingDetail = payload
  }
}
