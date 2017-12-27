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
  setCurrentBookingDeal(state, payload){
  	state.currentBookingDeal = payload
  }
}