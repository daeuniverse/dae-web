export default defineWebSocketHandler({
  message(_, message) {
    console.log(message)
  }
})
