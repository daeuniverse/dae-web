export default defineEventHandler(async (event) => {
  const body = await readFormData(event)

  console.log(body.get('hello'))

  return body
})
